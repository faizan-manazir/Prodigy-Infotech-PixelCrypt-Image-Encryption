from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
from models.schemas import HealthResponse
from services.image_processor import process_image, get_image_info
import io

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(status="online", service="PixelCrypt API")

@router.post("/encrypt")
async def encrypt_image(
    image: UploadFile = File(...),
    key: str = Form(...),
    method: str = Form(...)
):
    try:
        image_bytes = await image.read()
        processed_bytes, metadata = process_image(image_bytes, key, method, reverse=False)
        
        # Return the processed image directly, we'll send metadata via headers or the frontend can ignore it.
        # Returning an image file stream is better for file downloading.
        return Response(content=processed_bytes, media_type="image/png", headers={
            "X-Image-Width": str(metadata["width"]),
            "X-Image-Height": str(metadata["height"]),
            "X-Image-Pixels": str(metadata["pixels"])
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/decrypt")
async def decrypt_image(
    image: UploadFile = File(...),
    key: str = Form(...),
    method: str = Form(...)
):
    try:
        image_bytes = await image.read()
        processed_bytes, metadata = process_image(image_bytes, key, method, reverse=True)
        
        return Response(content=processed_bytes, media_type="image/png", headers={
            "X-Image-Width": str(metadata["width"]),
            "X-Image-Height": str(metadata["height"]),
            "X-Image-Pixels": str(metadata["pixels"])
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/image/info")
async def image_info(image: UploadFile = File(...)):
    try:
        image_bytes = await image.read()
        metadata = get_image_info(image_bytes)
        return metadata
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
