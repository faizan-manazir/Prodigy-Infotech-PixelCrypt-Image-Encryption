import numpy as np
from .utils import derive_seed


def apply_channel_shift(image_array: np.ndarray, key: str, reverse: bool = False) -> np.ndarray:
    """Deterministically permute RGB channels; alpha remains unchanged."""
    if image_array.ndim != 3 or image_array.shape[2] < 3:
        return image_array.copy()

    rng = np.random.default_rng(derive_seed(key))
    channel_perm = rng.permutation(3)

    result = image_array.copy()
    if reverse:
        inverse_permutation = np.argsort(channel_perm)
        result[..., :3] = image_array[..., inverse_permutation]
    else:
        result[..., :3] = image_array[..., channel_perm]

    return result
