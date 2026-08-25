import hashlib
import hmac


def derive_seed(key: str) -> int:
    """Derive a deterministic 64-bit seed from a non-empty key."""
    if not key:
        raise ValueError("Encryption key cannot be empty.")
    digest = hashlib.sha256(key.encode("utf-8")).digest()
    return int.from_bytes(digest[:8], byteorder="big", signed=False)


def key_verifier(key: str, method: str, pixel_checksum: str) -> str:
    """
    Create a keyed integrity verifier for an encrypted image.

    This is an educational integrity check used to detect a wrong key or method.
    It is not intended to replace an authenticated encryption construction.
    """
    if not key:
        raise ValueError("Encryption key cannot be empty.")
    material = f"PixelCrypt|v1|{method}|{pixel_checksum}".encode("utf-8")
    key_material = hashlib.sha256(key.encode("utf-8")).digest()
    return hmac.new(key_material, material, hashlib.sha256).hexdigest()


def pixel_checksum(image_array) -> str:
    return hashlib.sha256(image_array.tobytes()).hexdigest()
