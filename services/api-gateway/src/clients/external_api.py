import httpx
from fastapi import HTTPException
from src.config import secrets, app_config

FINNHUB_BASE_URL = "https://finnhub.io/api/v1"
NEWS_API_BASE_URL = "https://newsapi.org/v2"

async def fetch_stock_quote(ticker: str):
    """Fetches a stock quote from the Finnhub API."""
    url = f"{FINNHUB_BASE_URL}/quote"
    params = {"symbol": ticker, "token": secrets.STOCK_API_KEY}
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Error from Finnhub API: {e.response.text}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Network error while contacting Finnhub API: {e}")

async def fetch_news_articles(keyword: str):
    """Fetches news articles from the NewsAPI."""
    url = f"{NEWS_API_BASE_URL}/everything"
    sources_str = ",".join(app_config.get("preferred_news_sources", []))
    params = {
        "q": keyword,
        "apiKey": secrets.NEWS_API_KEY,
        "pageSize": app_config.get("news_page_size", 5),
        "sortBy": app_config.get("news_sort_by", "popularity"),
        "sources": sources_str
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json().get("articles", [])
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Error from NewsAPI: {e.response.text}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Network error while contacting NewsAPI: {e}")