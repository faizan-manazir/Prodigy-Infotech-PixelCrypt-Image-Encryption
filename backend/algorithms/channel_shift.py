import numpy as np
from .utils import derive_seed

def apply_channel_shift(image_array: np.ndarray, key: str, reverse: bool = False) -> np.ndarray:
    """
    Transforms the RGB channels deterministically based on the key.
    Alpha channel (if present) is untouched.
    """
    if not key:
        return image_array
        
    shape = image_array.shape
    channels = shape[2] if len(shape) == 3 else 1
    
    if channels < 3:
        # Grayscale, can't really do RGB channel shift, just return
        return image_array
        
    seed = derive_seed(key)
    np.random.seed(seed)
    
    # Determine the permutation of the first 3 channels (RGB)
    # e.g. [0, 1, 2] -> [2, 0, 1]
    channel_perm = np.random.permutation(3)
    
    result = np.copy(image_array)
    
    if reverse:
        inv_channel_perm = np.argsort(channel_perm)
        result[..., :3] = image_array[..., inv_channel_perm]
    else:
        result[..., :3] = image_array[..., channel_perm]
        
    return result
