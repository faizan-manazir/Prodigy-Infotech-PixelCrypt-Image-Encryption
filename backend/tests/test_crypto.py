import io
from PIL import Image
import numpy as np
from algorithms.xor_cipher import apply_xor
from algorithms.pixel_swap import apply_pixel_swap
from algorithms.channel_shift import apply_channel_shift
from algorithms.hybrid import apply_hybrid

def test_xor_reversible():
    key = "test_key_123"
    # Create a small random image 10x10 RGB
    original = np.random.randint(0, 256, (10, 10, 3), dtype=np.uint8)
    
    encrypted = apply_xor(original, key)
    decrypted = apply_xor(encrypted, key)
    
    assert not np.array_equal(original, encrypted)
    assert np.array_equal(original, decrypted)

def test_pixel_swap_reversible():
    key = "test_key_123"
    original = np.random.randint(0, 256, (10, 10, 3), dtype=np.uint8)
    
    encrypted = apply_pixel_swap(original, key, reverse=False)
    decrypted = apply_pixel_swap(encrypted, key, reverse=True)
    
    assert not np.array_equal(original, encrypted)
    assert np.array_equal(original, decrypted)

def test_channel_shift_reversible():
    key = "test_key_123"
    original = np.random.randint(0, 256, (10, 10, 3), dtype=np.uint8)
    
    encrypted = apply_channel_shift(original, key, reverse=False)
    decrypted = apply_channel_shift(encrypted, key, reverse=True)
    
    assert np.array_equal(original, decrypted)

def test_hybrid_reversible():
    key = "my_strong_key_2026"
    original = np.random.randint(0, 256, (50, 50, 3), dtype=np.uint8)
    
    encrypted = apply_hybrid(original, key, reverse=False)
    decrypted = apply_hybrid(encrypted, key, reverse=True)
    
    assert not np.array_equal(original, encrypted)
    assert np.array_equal(original, decrypted)
