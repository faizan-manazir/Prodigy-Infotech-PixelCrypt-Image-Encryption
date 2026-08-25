import numpy as np
from .utils import derive_seed


def apply_xor(image_array: np.ndarray, key: str) -> np.ndarray:
    """Apply a deterministic XOR keystream. The operation is self-inverse."""
    rng = np.random.default_rng(derive_seed(key))
    key_stream = rng.integers(0, 256, size=image_array.shape, dtype=np.uint8)
    return np.bitwise_xor(image_array, key_stream)
