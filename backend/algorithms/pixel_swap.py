import numpy as np
from .utils import derive_seed

def apply_pixel_swap(image_array: np.ndarray, key: str, reverse: bool = False) -> np.ndarray:
    """
    Permutes the pixels in the image deterministically based on the key.
    If reverse=True, reverses the permutation (decryption).
    """
    if not key:
        return image_array
        
    shape = image_array.shape
    has_alpha = shape[2] == 4 if len(shape) == 3 else False
    
    # Flatten the spatial dimensions (height * width)
    # We keep the color channels intact so we swap entire RGB(A) pixels
    num_pixels = shape[0] * shape[1]
    
    # Reshape to (num_pixels, channels)
    flat_pixels = image_array.reshape((num_pixels, shape[2]))
    
    seed = derive_seed(key)
    np.random.seed(seed)
    
    # Generate permutation array
    permutation = np.random.permutation(num_pixels)
    
    result = np.zeros_like(flat_pixels)
    
    if reverse:
        # Inverse permutation
        inverse_permutation = np.argsort(permutation)
        result = flat_pixels[inverse_permutation]
    else:
        # Forward permutation
        result = flat_pixels[permutation]
        
    return result.reshape(shape)
