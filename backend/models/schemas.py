from pydantic import BaseModel
from typing import Dict, Any

class HealthResponse(BaseModel):
    status: str
    service: str

class EncryptionResponse(BaseModel):
    success: bool
    operation: str
    method: str
    filename: str
    metadata: Dict[str, Any]
