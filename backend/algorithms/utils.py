import hashlib
import numpy as np

def derive_seed(key: str) -> int:
    """Derives a deterministic 32-bit integer seed from a string key."""
    if not key:
        return 0
    hash_obj = hashlib.sha256(key.encode('utf-8'))
    return int.from_bytes(hash_obj.digest()[:4], byteorder='big')
