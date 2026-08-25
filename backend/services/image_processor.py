import io
import json
import hmac
from PIL import Image, ImageOps, UnidentifiedImageError
from PIL.PngImagePlugin import PngInfo
import numpy as np

from algorithms.xor_cipher import apply_xor
from algorithms.pixel_swap import apply_pixel_swap
from algorithms.channel_shift import apply_channel_shift
from algorithms.hybrid import apply_hybrid
from algorithms.utils import key_verifier, pixel_checksum

ALLOWED_METHODS = {"xor", "swap", "channel", "hybrid"}
MAX_PIXELS = 25_000_000
METADATA_KEY = "pixelcrypt"
METADATA_MAGIC = "PixelCrypt"
METADATA_VERSION = 1


def load_image(image_bytes: bytes) -> Image.Image:
    if not image_bytes:
        raise ValueError("The uploaded file is empty.")

    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
        img = Image.open(io.BytesIO(image_bytes))
        img = ImageOps.exif_transpose(img)
        if img.width * img.height > MAX_PIXELS:
            raise ValueError("Image dimensions are too large. Maximum is 25,000,000 pixels.")
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
        return img
    except UnidentifiedImageError as exc:
        raise ValueError("Unsupported or corrupted image file.") from exc
    except Exception as exc:
        if isinstance(exc, ValueError):
            raise
        raise ValueError("Unable to read the uploaded image.") from exc


def _apply_method(img_array: np.ndarray, key: str, method: str, reverse: bool) -> np.ndarray:
    if method not in ALLOWED_METHODS:
        raise ValueError(f"Unknown encryption method: {method}")

    if method == "xor":
        return apply_xor(img_array, key)
    if method == "swap":
        return apply_pixel_swap(img_array, key, reverse)
    if method == "channel":
        return apply_channel_shift(img_array, key, reverse)
    return apply_hybrid(img_array, key, reverse)


def process_image(image_bytes: bytes, key: str, method: str, reverse: bool = False) -> tuple[bytes, dict]:
    """
    Encrypt or decrypt an image.

    Encrypted PNG output contains PixelCrypt metadata with a keyed verifier and
    checksum so decryption can reject an incorrect key or method.
    """
    if not isinstance(key, str) or not key:
        raise ValueError("Encryption key cannot be empty.")

    img = load_image(image_bytes)
    metadata = {
        "width": img.width,
        "height": img.height,
        "pixels": img.width * img.height,
        "format": img.format or "PNG",
        "mode": img.mode,
    }
    img_array = np.array(img, dtype=np.uint8)

    if reverse:
        embedded = img.info.get(METADATA_KEY)
        if not embedded:
            raise ValueError("This image is not a PixelCrypt encrypted PNG or its verification metadata is missing.")

        try:
            envelope = json.loads(embedded)
        except (TypeError, json.JSONDecodeError) as exc:
            raise ValueError("The PixelCrypt verification metadata is invalid.") from exc

        if envelope.get("magic") != METADATA_MAGIC or envelope.get("version") != METADATA_VERSION:
            raise ValueError("Unsupported PixelCrypt encrypted image format.")
        if envelope.get("method") != method:
            raise ValueError("The selected method does not match the method used for encryption.")

        expected_verifier = key_verifier(key, method, envelope.get("checksum", ""))
        if not envelope.get("verifier") or not hmac.compare_digest(expected_verifier, envelope["verifier"]):
            raise ValueError("Incorrect encryption key.")

        result_array = _apply_method(img_array, key, method, reverse=True)
        recovered_checksum = pixel_checksum(result_array)
        if not hmac.compare_digest(recovered_checksum, envelope.get("checksum", "")):
            raise ValueError("Decryption integrity verification failed. The key or image data may be incorrect.")

        result_img = Image.fromarray(result_array, mode=img.mode)
        out_io = io.BytesIO()
        result_img.save(out_io, format="PNG", optimize=True)
        return out_io.getvalue(), metadata

    original_checksum = pixel_checksum(img_array)
    result_array = _apply_method(img_array, key, method, reverse=False)
    result_img = Image.fromarray(result_array, mode=img.mode)

    envelope = {
        "magic": METADATA_MAGIC,
        "version": METADATA_VERSION,
        "method": method,
        "checksum": original_checksum,
        "verifier": key_verifier(key, method, original_checksum),
    }
    pnginfo = PngInfo()
    pnginfo.add_text(METADATA_KEY, json.dumps(envelope, separators=(",", ":")))

    out_io = io.BytesIO()
    result_img.save(out_io, format="PNG", pnginfo=pnginfo, optimize=True)
    return out_io.getvalue(), metadata


def get_image_info(image_bytes: bytes) -> dict:
    img = load_image(image_bytes)
    return {
        "width": img.width,
        "height": img.height,
        "pixels": img.width * img.height,
        "format": img.format or "PNG",
        "mode": img.mode,
    }
