import numpy as np
from .xor_cipher import apply_xor
from .pixel_swap import apply_pixel_swap
from .channel_shift import apply_channel_shift

def apply_hybrid(image_array: np.ndarray, key: str, reverse: bool = False) -> np.ndarray:
    """
    Hybrid mode: combines Pixel Permutation, Channel Transformation, and XOR.
    Encryption: Permutation -> Channel Shift -> XOR
    Decryption: XOR -> Channel Shift (Reverse) -> Permutation (Reverse)
    """
    if not key:
        return image_array
        
    result = image_array
    
    if reverse:
        # Decryption
        result = apply_xor(result, key)
        result = apply_channel_shift(result, key, reverse=True)
        result = apply_pixel_swap(result, key, reverse=True)
    else:
        # Encryption
        result = apply_pixel_swap(result, key, reverse=False)
        result = apply_channel_shift(result, key, reverse=False)
        result = apply_xor(result, key)
        
    return result
