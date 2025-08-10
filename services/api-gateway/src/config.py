import json
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).parent.parent  # /project/services/api-gateway
CONFIG_FILE_PATH = Path(__file__).parent / "app_config.json"

class AppConfig:
    """Loads and provides access to application settings from a JSON file."""
    def __init__(self, path: Path):
        self._config_data = {}
        if path.exists():
            with open(path, 'r') as f:
                self._config_data = json.load(f)

    def get(self, key: str, default=None):
        return self._config_data.get(key, default)


class SecretConfig(BaseSettings):
    """Sensitive settings from environment variables."""
    STOCK_API_KEY: str
    NEWS_API_KEY: str

    # DB credentials from .env
    DB_HOST: str
    DB_PORT: int = 5432
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding='utf-8',
        extra='ignore'
    )


class FileConfig:
    """Loads values from text files."""
    COMPANY_FILE_PATH = BASE_DIR / "company_names.txt"
    NEWS_FILE_PATH = BASE_DIR / "news_category.txt"

    @property
    def company_list(self):
        if self.COMPANY_FILE_PATH.exists():
            with open(self.COMPANY_FILE_PATH, "r") as f:
                return [line.strip() for line in f if line.strip()]
        return []

    @property
    def news_categories(self):
        if self.NEWS_FILE_PATH.exists():
            with open(self.NEWS_FILE_PATH, "r") as f:
                return [line.strip() for line in f if line.strip()]
        return []


# Instantiate config objects
secrets = SecretConfig()
app_config = AppConfig(CONFIG_FILE_PATH)
files = FileConfig()
