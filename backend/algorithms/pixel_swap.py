import numpy as np
from .utils import derive_seed


def apply_pixel_swap(image_array: np.ndarray, key: str, reverse: bool = False) -> np.ndarray:
    """Deterministically permute complete pixels while preserving channels."""
    if image_array.ndim != 3:
        raise ValueError("Pixel permutation expects an RGB or RGBA image.")

    height, width, channels = image_array.shape
    num_pixels = height * width
    flat_pixels = image_array.reshape((num_pixels, channels))

    rng = np.random.default_rng(derive_seed(key))
    permutation = rng.permutation(num_pixels)

    if reverse:
        inverse_permutation = np.argsort(permutation)
        result = flat_pixels[inverse_permutation]
    else:
        result = flat_pixels[permutation]

    return result.reshape(image_array.shape)
