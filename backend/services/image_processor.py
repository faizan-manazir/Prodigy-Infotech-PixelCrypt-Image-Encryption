import io
from PIL import Image
import numpy as np
from algorithms.xor_cipher import apply_xor
from algorithms.pixel_swap import apply_pixel_swap
from algorithms.channel_shift import apply_channel_shift
from algorithms.hybrid import apply_hybrid

def process_image(image_bytes: bytes, key: str, method: str, reverse: bool = False) -> tuple[bytes, dict]:
    """
    Processes the image bytes using the specified method and key.
    Returns a tuple of (processed_image_bytes, metadata_dict).
    """
    # Load image using Pillow
    img = Image.open(io.BytesIO(image_bytes))
    
    # Ensure image is in RGB or RGBA mode (avoid palette issues)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.mode else "RGB")
        
    metadata = {
        "width": img.width,
        "height": img.height,
        "pixels": img.width * img.height,
        "format": img.format or "PNG",
        "mode": img.mode
    }
    
    # Convert to NumPy array
    img_array = np.array(img)
    
    # Apply selected method
    if method == "xor":
        result_array = apply_xor(img_array, key)
    elif method == "swap":
        result_array = apply_pixel_swap(img_array, key, reverse)
    elif method == "channel":
        result_array = apply_channel_shift(img_array, key, reverse)
    elif method == "hybrid":
        result_array = apply_hybrid(img_array, key, reverse)
    else:
        raise ValueError(f"Unknown encryption method: {method}")
        
    # Convert back to image
    result_img = Image.fromarray(result_array.astype('uint8'), mode=img.mode)
    
    # Save to bytes (lossless PNG to ensure reversibility)
    out_io = io.BytesIO()
    result_img.save(out_io, format="PNG")
    out_bytes = out_io.getvalue()
    
    return out_bytes, metadata

def get_image_info(image_bytes: bytes) -> dict:
    img = Image.open(io.BytesIO(image_bytes))
    return {
        "width": img.width,
        "height": img.height,
        "pixels": img.width * img.height,
        "format": img.format,
        "mode": img.mode
    }
