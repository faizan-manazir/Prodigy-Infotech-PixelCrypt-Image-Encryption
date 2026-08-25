from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
from models.schemas import HealthResponse
from services.image_processor import process_image, get_image_info, ALLOWED_METHODS

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp"}
MIN_KEY_LENGTH = 8
MAX_KEY_LENGTH = 128


def validate_request(image: UploadFile, image_bytes: bytes, key: str | None = None, method: str | None = None):
    if image.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=415, detail="Unsupported file type. Use PNG, JPG, JPEG, WEBP, or BMP.")
    if not image_bytes:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Image exceeds the 10 MB upload limit.")
    if key is not None and not (MIN_KEY_LENGTH <= len(key) <= MAX_KEY_LENGTH):
        raise HTTPException(status_code=400, detail=f"Encryption key must be between {MIN_KEY_LENGTH} and {MAX_KEY_LENGTH} characters.")
    if method is not None and method not in ALLOWED_METHODS:
        raise HTTPException(status_code=400, detail="Unsupported encryption method.")


def image_response(processed_bytes: bytes, metadata: dict) -> Response:
    return Response(
        content=processed_bytes,
        media_type="image/png",
        headers={
            "X-Image-Width": str(metadata["width"]),
            "X-Image-Height": str(metadata["height"]),
            "X-Image-Pixels": str(metadata["pixels"]),
            "X-PixelCrypt-Verified": "true",
        },
    )


@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(status="online", service="PixelCrypt API")


@router.post("/encrypt")
async def encrypt_image(
    image: UploadFile = File(...),
    key: str = Form(...),
    method: str = Form(...),
):
    image_bytes = await image.read()
    validate_request(image, image_bytes, key, method)
    try:
        processed_bytes, metadata = process_image(image_bytes, key, method, reverse=False)
        return image_response(processed_bytes, metadata)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/decrypt")
async def decrypt_image(
    image: UploadFile = File(...),
    key: str = Form(...),
    method: str = Form(...),
):
    image_bytes = await image.read()
    validate_request(image, image_bytes, key, method)
    try:
        processed_bytes, metadata = process_image(image_bytes, key, method, reverse=True)
        return image_response(processed_bytes, metadata)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/image/info")
async def image_info(image: UploadFile = File(...)):
    image_bytes = await image.read()
    validate_request(image, image_bytes)
    try:
        return get_image_info(image_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
