import json
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Define the path to the JSON configuration file
CONFIG_FILE_PATH = Path(__file__).parent / "app_config.json"

class AppConfig:
    """Loads and provides access to application settings from a JSON file."""
    def __init__(self, path: Path):
        self._config_data = {}
        if path.exists():
            with open(path, 'r') as f:
                self._config_data = json.load(f)

    def get(self, key: str, default=None):
        """Fetches a value from the config data."""
        return self._config_data.get(key, default)

class SecretConfig(BaseSettings):
    """Loads sensitive information from environment variables."""
    STOCK_API_KEY: str
    NEWS_API_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding='utf-8',
        extra='ignore'
    )

# Instantiate the configuration objects for use in other modules
secrets = SecretConfig()
app_config = AppConfig(CONFIG_FILE_PATH)