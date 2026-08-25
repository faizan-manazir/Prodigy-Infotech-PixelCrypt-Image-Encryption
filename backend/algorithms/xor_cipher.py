import numpy as np
from .utils import derive_seed

def apply_xor(image_array: np.ndarray, key: str) -> np.ndarray:
    """
    Encrypts or decrypts an image array using XOR operation.
    The same function handles both encryption and decryption.
    """
    if not key:
        return image_array
        
    seed = derive_seed(key)
    np.random.seed(seed)
    
    # Generate a random key stream of the same shape as the image array
    # The key stream needs to be deterministic based on the seed
    # To save memory, we can generate a random tile and repeat it, or just generate a full array
    
    # We will generate a full key stream. If the image is huge, this might take RAM.
    # For a 1920x1080x3 image, it's about 6MB, which is fine.
    key_stream = np.random.randint(0, 256, size=image_array.shape, dtype=np.uint8)
    
    # Perform XOR
    result = np.bitwise_xor(image_array, key_stream)
    return result
