from functools import lru_cache

from fastapi import FastAPI
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict
from starlette.middleware.cors import CORSMiddleware


class Settings(BaseSettings):
    # CORS config
    frontend_url: str
    api_url: str | None = None

    # Database config

    # external apis
    yt_api_key: str


    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()


def setup_cors_middleware(app: FastAPI, settings: Settings) -> None:
    origins = [settings.frontend_url]
    if settings.api_url is not None:
        origins.append(settings.api_url)

    print(f"CORS Origins: {origins}")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "HEAD", "OPTIONS", "PUT", "DELETE", "PATCH"],
        allow_headers=[
            "Access-Control-Allow-Headers",
            "Content-Type",
            "Authorization",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
            "Origin",
        ],
        expose_headers=[
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
        ],
    )