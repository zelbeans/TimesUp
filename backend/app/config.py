from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./timesup.db"
    cors_origins: str = "http://localhost:5173"
    google_credentials_file: str = "credentials.json"
    google_token_file: str = "token.json"
    google_sync_days: int = 90

    model_config = SettingsConfigDict(env_file=".env")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
