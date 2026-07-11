from fastapi import APIRouter, HTTPException, status

from app.config import get_settings
from app.schemas.auth import LoginRequest, TokenResponse
from app.security import create_access_token, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    settings = get_settings()

    if not settings.admin_username or not settings.admin_password_hash:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin login isn't configured yet. Run `python -m scripts.create_admin`.",
        )

    is_valid_username = payload.username == settings.admin_username
    is_valid_password = is_valid_username and verify_password(
        payload.password, settings.admin_password_hash
    )

    if not is_valid_username or not is_valid_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )

    token = create_access_token(subject=payload.username)
    return TokenResponse(access_token=token)
