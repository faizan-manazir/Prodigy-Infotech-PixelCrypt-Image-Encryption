import numpy as np
import pytest
from algorithms.utils import key_verifier, pixel_checksum


def test_verifier_changes_with_key():
    checksum = "abc123"
    assert key_verifier("password-one", "hybrid", checksum) != key_verifier("password-two", "hybrid", checksum)


def test_verifier_changes_with_method():
    checksum = "abc123"
    assert key_verifier("password-one", "hybrid", checksum) != key_verifier("password-one", "xor", checksum)


def test_pixel_checksum_is_deterministic():
    image = np.zeros((4, 4, 3), dtype=np.uint8)
    assert pixel_checksum(image) == pixel_checksum(image.copy())


def test_empty_key_rejected():
    with pytest.raises(ValueError):
        key_verifier("", "hybrid", "abc")
