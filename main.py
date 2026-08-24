#!/usr/bin/env python3
"""
Image Pixel Encryptor GUI with per-encryption salt + HMAC stored in PNG metadata.

- On encrypt: generate random salt, derive PRNG seed + HMAC key via PBKDF2,
  permute + XOR pixels, compute HMAC over ciphertext bytes, and save salt+hmac
  in PNG tEXt chunks (base64).
- On decrypt: read salt+hmac from PNG metadata (if present), derive keys,
  verify HMAC before attempting decryption. If metadata missing, fall back
  to legacy (fixed-salt) behavior with a user prompt.

This remains a demo/educational tool. For production, use well-vetted AEAD primitives.
"""
import sys
import os
import hashlib
import random
import base64
import hmac as hm
from typing import Optional, Tuple, Dict

from PIL import Image, ImageQt, PngImagePlugin
import numpy as np

from PySide6 import QtCore, QtGui, QtWidgets

# --------------------------
# Crypto / PRNG utilities
# --------------------------

# Legacy fixed salt (kept for compatibility if a file lacks metadata).
LEGACY_PBKDF2_SALT = b"image-encryptor-fixed-salt-v1"
PBKDF2_ITERS = 200_000
PBKDF2_DKLEN = 64  # derive both seed material and HMAC key

SALT_LEN = 16  # per-encryption random salt (bytes)


def derive_seed_and_hmac_key(password: str, salt: bytes) -> Tuple[int, bytes]:
    """
    Derive deterministic integer seed and HMAC key bytes from password+salt.
    Returns (seed_int, hmac_key_bytes).
    We derive PBKDF2_DKLEN bytes and split:
      - seed_bytes = first 32 bytes -> int
      - hmac_key = next 32 bytes
    """
    if password is None:
        password = ""
    pw = password.encode("utf-8")
    dk = hashlib.pbkdf2_hmac("sha256", pw, salt, PBKDF2_ITERS, dklen=PBKDF2_DKLEN)
    seed_bytes = dk[:32]
    hmac_key = dk[32:]
    seed = int.from_bytes(seed_bytes, "big")
    return seed, hmac_key


def generate_permutation_and_mask(n_pixels: int, channels: int, seed: int):
    """
    Generate a permutation of pixel indices and a byte mask (n_pixels x channels)
    using random.Random(seed).
    """
    rng = random.Random(seed)
    indices = list(range(n_pixels))
    rng.shuffle(indices)  # in-place shuffle

    total_bytes = n_pixels * channels
    mask_bytes = bytearray(total_bytes)
    for i in range(total_bytes):
        mask_bytes[i] = rng.getrandbits(8)

    mask = np.frombuffer(mask_bytes, dtype=np.uint8).reshape(n_pixels, channels)
    return indices, mask


# --------------------------
# Pixel operations (with metadata)
# --------------------------


def encrypt_image_pil_with_meta(img: Image.Image, password: str, ops: Dict) -> Tuple[Image.Image, Dict]:
    """
    Encrypt image using pixel permutation and XOR mask.
    Returns (encrypted PIL.Image, metadata dict). Metadata contains base64 salt and hmac.
    ops: dictionary with options (swap:bool, xor:bool)
    """
    img = img.convert("RGBA")
    arr = np.array(img, dtype=np.uint8)  # shape (h, w, 4)
    h, w, channels = arr.shape
    pixels = arr.reshape(-1, channels)
    n = pixels.shape[0]

    # Generate random salt for this encryption
    salt = os.urandom(SALT_LEN)
    seed, hmac_key = derive_seed_and_hmac_key(password, salt)

    # Permutation and mask (even if one operation disabled we still generate mask/indices for simplicity)
    indices, mask = generate_permutation_and_mask(n, channels, seed)

    swap = ops.get("swap", True)
    xor = ops.get("xor", True)

    if swap:
        permuted = pixels[indices]
    else:
        permuted = pixels.copy()

    if xor:
        enc_pixels = np.bitwise_xor(permuted, mask)
    else:
        enc_pixels = permuted.copy()

    # Compute HMAC over ciphertext bytes + simple header (width,height,channels) to bind image structure
    header = f"{w}x{h}x{channels}".encode("ascii")
    ciphertext = enc_pixels.tobytes()
    mac = hm.new(hmac_key, header + ciphertext, hashlib.sha256).digest()

    # Build metadata (base64-encoded)
    meta = {
        "enc_salt": base64.b64encode(salt).decode("ascii"),
        "enc_hmac": base64.b64encode(mac).decode("ascii"),
        "enc_ops": ("swap" if swap else "") + ("+xor" if xor else ""),
    }

    enc_arr = enc_pixels.reshape(h, w, channels)
    enc_img = Image.fromarray(enc_arr, mode="RGBA")
    return enc_img, meta


def decrypt_image_pil_with_meta(img: Image.Image, password: str, meta: Optional[Dict]) -> Image.Image:
    """
    Decrypt an image encrypted with encrypt_image_pil_with_meta using the same password.
    If meta is None, this attempts legacy behavior (uses LEGACY_PBKDF2_SALT) after user confirmation.
    """
    img = img.convert("RGBA")
    arr = np.array(img, dtype=np.uint8)
    h, w, channels = arr.shape
    pixels = arr.reshape(-1, channels)
    n = pixels.shape[0]

    if meta is None:
        # Legacy: use fixed salt - caller should have asked user permission already.
        salt = LEGACY_PBKDF2_SALT
    else:
        try:
            salt = base64.b64decode(meta["enc_salt"])
        except Exception:
            raise ValueError("Invalid metadata: salt missing or corrupted")

    seed, hmac_key = derive_seed_and_hmac_key(password, salt)
    indices, mask = generate_permutation_and_mask(n, channels, seed)

    # Validate HMAC if provided
    if meta is not None and "enc_hmac" in meta:
        header = f"{w}x{h}x{channels}".encode("ascii")
        ciphertext = pixels.tobytes()
        expected_mac = base64.b64decode(meta["enc_hmac"])
        computed_mac = hm.new(hmac_key, header + ciphertext, hashlib.sha256).digest()
        if not hm.compare_digest(expected_mac, computed_mac):
            raise ValueError("HMAC verification failed: wrong password or file tampered.")

    swap = True
    xor = True
    if meta is not None and "enc_ops" in meta:
        enc_ops = meta["enc_ops"]
        swap = "swap" in enc_ops
        xor = "xor" in enc_ops

    # XOR first (XOR is its own inverse)
    if xor:
        permuted = np.bitwise_xor(pixels, mask)
    else:
        permuted = pixels.copy()

    if swap:
        # Build inverse permutation: inv[indices[i]] = i
        inv = np.empty(n, dtype=np.int64)
        inv[indices] = np.arange(n, dtype=np.int64)
        orig_pixels = permuted[inv]
    else:
        orig_pixels = permuted

    orig_arr = orig_pixels.reshape(h, w, channels)
    orig_img = Image.fromarray(orig_arr, mode="RGBA")
    return orig_img


# --------------------------
# GUI
# --------------------------


class ImageEncryptorWindow(QtWidgets.QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Image Pixel Encryptor (salt + HMAC)")
        self.resize(1000, 700)

        # State
        self.original_image: Optional[Image.Image] = None  # PIL.Image (opened file)
        self.original_meta: Optional[Dict] = None  # metadata read from opened PNG (if any)
        self.processed_image: Optional[Image.Image] = None  # PIL.Image (encrypted/decrypted preview)
        self.processed_meta: Optional[Dict] = None  # metadata to save with processed_image

        # Widgets
        central = QtWidgets.QWidget()
        self.setCentralWidget(central)
        layout = QtWidgets.QVBoxLayout(central)

        # Toolbar controls
        toolbar = QtWidgets.QHBoxLayout()
        layout.addLayout(toolbar)

        self.open_btn = QtWidgets.QPushButton("Open Image")
        self.open_btn.clicked.connect(self.open_image)
        toolbar.addWidget(self.open_btn)

        self.save_btn = QtWidgets.QPushButton("Save Image As...")
        self.save_btn.clicked.connect(self.save_image)
        self.save_btn.setEnabled(False)
        toolbar.addWidget(self.save_btn)

        toolbar.addWidget(QtWidgets.QLabel("Password:"))
        self.password_input = QtWidgets.QLineEdit()
        self.password_input.setEchoMode(QtWidgets.QLineEdit.Password)
        toolbar.addWidget(self.password_input)

        self.show_password_cb = QtWidgets.QCheckBox("Show")
        self.show_password_cb.stateChanged.connect(self.toggle_show_password)
        toolbar.addWidget(self.show_password_cb)

        toolbar.addSpacing(10)
        self.encrypt_btn = QtWidgets.QPushButton("Encrypt")
        self.encrypt_btn.clicked.connect(self.encrypt_current)
        self.encrypt_btn.setEnabled(False)
        toolbar.addWidget(self.encrypt_btn)

        self.decrypt_btn = QtWidgets.QPushButton("Decrypt")
        self.decrypt_btn.clicked.connect(self.decrypt_current)
        self.decrypt_btn.setEnabled(False)
        toolbar.addWidget(self.decrypt_btn)

        # Options
        options_group = QtWidgets.QGroupBox("Options")
        options_layout = QtWidgets.QHBoxLayout(options_group)
        self.opt_swap = QtWidgets.QCheckBox("Pixel permutation (swap)")
        self.opt_swap.setChecked(True)
        options_layout.addWidget(self.opt_swap)
        self.opt_xor = QtWidgets.QCheckBox("XOR mask")
        self.opt_xor.setChecked(True)
        options_layout.addWidget(self.opt_xor)
        options_layout.addStretch()
        toolbar.addWidget(options_group)

        # Image display area: original on left, processed on right
        images_layout = QtWidgets.QHBoxLayout()
        layout.addLayout(images_layout)

        self.orig_label = QtWidgets.QLabel("Original\n(no image)")
        self.orig_label.setAlignment(QtCore.Qt.AlignCenter)
        self.orig_label.setStyleSheet("border: 1px solid gray;")
        images_layout.addWidget(self.orig_label, 1)

        self.proc_label = QtWidgets.QLabel("Processed\n(no image)")
        self.proc_label.setAlignment(QtCore.Qt.AlignCenter)
        self.proc_label.setStyleSheet("border: 1px solid gray;")
        images_layout.addWidget(self.proc_label, 1)

        # Status
        self.status = QtWidgets.QLabel("Ready")
        layout.addWidget(self.status)

        # Progress bar
        self.progress = QtWidgets.QProgressBar()
        self.progress.setRange(0, 100)
        self.progress.setValue(0)
        self.progress.setVisible(False)
        layout.addWidget(self.progress)

    def toggle_show_password(self, state):
        if state == QtCore.Qt.Checked:
            self.password_input.setEchoMode(QtWidgets.QLineEdit.Normal)
        else:
            self.password_input.setEchoMode(QtWidgets.QLineEdit.Password)

    def open_image(self):
        path, _ = QtWidgets.QFileDialog.getOpenFileName(self, "Open image", "", "Images (*.png *.bmp *.gif *.jpg *.jpeg *.tiff)")
        if not path:
            return
        try:
            img = Image.open(path)
        except Exception as e:
            QtWidgets.QMessageBox.critical(self, "Error", f"Failed to open image: {e}")
            return

        # Read PNG metadata if present
        meta = {}
        if img.format == "PNG":
            # Pillow stores text chunks in info
            info = img.info or {}
            # Recognize keys we set
            if "enc_salt" in info and "enc_hmac" in info:
                meta["enc_salt"] = info.get("enc_salt")
                meta["enc_hmac"] = info.get("enc_hmac")
                meta["enc_ops"] = info.get("enc_ops", "")
        else:
            meta = None

        self.original_image = img.copy()
        self.original_meta = meta
        self.processed_image = None
        self.processed_meta = None
        self.update_image_previews()
        self.status.setText(f"Opened: {os.path.basename(path)} ({img.size[0]}x{img.size[1]})")
        self.encrypt_btn.setEnabled(True)
        self.decrypt_btn.setEnabled(True)
        self.save_btn.setEnabled(False)

    def update_image_previews(self):
        if self.original_image is None:
            self.orig_label.setText("Original\n(no image)")
            self.proc_label.setText("Processed\n(no image)")
            return
        self.orig_label.setPixmap(self.pil_to_qpixmap(self.original_image, preview=True))

        if self.processed_image:
            self.proc_label.setPixmap(self.pil_to_qpixmap(self.processed_image, preview=True))
        else:
            self.proc_label.setText("Processed\n(no image)")

    def pil_to_qpixmap(self, pil_img: Image.Image, preview=False) -> QtGui.QPixmap:
        # Convert to QPixmap (ImageQt)
        qimg = ImageQt.ImageQt(pil_img.convert("RGBA"))
        pix = QtGui.QPixmap.fromImage(qimg)
        if preview:
            # Fit into label
            maxw = self.orig_label.width() or 400
            maxh = self.orig_label.height() or 400
            pix = pix.scaled(maxw, maxh, QtCore.Qt.KeepAspectRatio, QtCore.Qt.SmoothTransformation)
        return pix

    def set_busy(self, busy: bool, message: str = "Working..."):
        self.setCursor(QtCore.Qt.WaitCursor if busy else QtCore.Qt.ArrowCursor)
        self.progress.setVisible(busy)
        if busy:
            self.progress.setValue(0)
        self.status.setText(message)
        QtWidgets.QApplication.processEvents()

    def encrypt_current(self):
        if self.original_image is None:
            return
        pwd = self.password_input.text()
        if pwd == "":
            r = QtWidgets.QMessageBox.question(self, "No password", "No password entered — continue with empty password?")
            if r != QtWidgets.QMessageBox.Yes:
                return

        self.set_busy(True, "Encrypting...")
        QtWidgets.QApplication.processEvents()

        try:
            swap = self.opt_swap.isChecked()
            xor = self.opt_xor.isChecked()

            if not (swap or xor):
                QtWidgets.QMessageBox.information(self, "No operation selected", "Select at least one operation (swap or XOR).")
                return

            img = self.original_image.copy()
            ops = {"swap": swap, "xor": xor}
            out_img, meta = encrypt_image_pil_with_meta(img, pwd, ops)

            self.processed_image = out_img
            self.processed_meta = meta
            self.update_image_previews()
            self.save_btn.setEnabled(True)
            self.status.setText("Encryption done (preview). Metadata will be saved into PNG when you Save.")
        except Exception as e:
            QtWidgets.QMessageBox.critical(self, "Error", f"Encryption failed: {e}")
            self.status.setText("Encryption failed")
        finally:
            self.set_busy(False)

    def decrypt_current(self):
        if self.original_image is None:
            return
        pwd = self.password_input.text()
        if pwd == "":
            r = QtWidgets.QMessageBox.question(self, "No password", "No password entered — continue with empty password?")
            if r != QtWidgets.QMessageBox.Yes:
                return

        # If original_meta is None (no metadata), ask user how to proceed (legacy)
        if self.original_meta is None:
            r = QtWidgets.QMessageBox.question(
                self,
                "No encryption metadata",
                "This image does not contain encryption metadata (salt/HMAC). "
                "Attempt legacy decryption using a fixed salt? (This is less secure and may fail.)"
            )
            if r != QtWidgets.QMessageBox.Yes:
                return
            # We'll pass meta=None to trigger legacy behavior
            meta = None
        else:
            meta = self.original_meta

        self.set_busy(True, "Decrypting...")
        QtWidgets.QApplication.processEvents()
        try:
            img = self.original_image.copy()
            out = decrypt_image_pil_with_meta(img, pwd, meta)
            self.processed_image = out
            self.processed_meta = None  # decrypted images should not automatically be saved with encryption metadata
            self.update_image_previews()
            self.save_btn.setEnabled(True)
            self.status.setText("Decryption done (preview).")
        except ValueError as ve:
            QtWidgets.QMessageBox.critical(self, "Verification failed", str(ve))
            self.status.setText("Decryption failed (verification)")
        except Exception as e:
            QtWidgets.QMessageBox.critical(self, "Error", f"Decryption failed: {e}")
            self.status.setText("Decryption failed")
        finally:
            self.set_busy(False)

    def save_image(self):
        if self.processed_image is None:
            return
        path, _ = QtWidgets.QFileDialog.getSaveFileName(self, "Save image", "", "PNG Image (*.png);;PNG recommended (*.png);;All files (*)")
        if not path:
            return
        try:
            # Prefer PNG to avoid lossy compression
            if not path.lower().endswith(".png"):
                path = path + ".png"

            if self.processed_meta:
                pnginfo = PngImagePlugin.PngInfo()
                # Store our metadata keys in text chunks (base64)
                pnginfo.add_text("enc_salt", self.processed_meta.get("enc_salt", ""))
                pnginfo.add_text("enc_hmac", self.processed_meta.get("enc_hmac", ""))
                pnginfo.add_text("enc_ops", self.processed_meta.get("enc_ops", ""))
                # Save with metadata
                self.processed_image.save(path, format="PNG", pnginfo=pnginfo)
            else:
                # Save normally (decrypted image or plain image)
                self.processed_image.save(path, format="PNG")
            self.status.setText(f"Saved: {path}")
        except Exception as e:
            QtWidgets.QMessageBox.critical(self, "Error", f"Failed to save image: {e}")
            self.status.setText("Save failed")


# --------------------------
# App entry
# --------------------------


def main():
    app = QtWidgets.QApplication(sys.argv)
    win = ImageEncryptorWindow()
    win.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
