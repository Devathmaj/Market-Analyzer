from fastapi import FastAPI, HTTPException
from src.models import AnalysisResult, StockQuote, Article
from src.clients.external_api import fetch_stock_quote, fetch_news_articles
import asyncpg
import os

app = FastAPI(
    title="Market Intelligence API Gateway",
    description="Aggregates stock and news data from external sources for internal services.",
    version="1.0.0"
)

DB_CONN = None

@app.on_event("startup")
async def startup_event():
    global DB_CONN
    DB_CONN = await asyncpg.connect(
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        database=os.getenv("POSTGRES_DB"),
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=os.getenv("POSTGRES_PORT", "5432"),
    )
    await create_tables()

async def create_tables():
    """Create stock and news tables if they don't exist."""
    await DB_CONN.execute("""
    CREATE TABLE IF NOT EXISTS stock_quotes (
        id SERIAL PRIMARY KEY,
        ticker TEXT NOT NULL,
        price NUMERIC(18,4),
        open NUMERIC(18,4),
        high NUMERIC(18,4),
        low NUMERIC(18,4),
        volume BIGINT,
        timestamp TIMESTAMPTZ NOT NULL,
        CONSTRAINT unique_ticker_time UNIQUE (ticker, timestamp)
    );
    """)
    await DB_CONN.execute("""
    CREATE TABLE IF NOT EXISTS news_articles (
        id SERIAL PRIMARY KEY,
        ticker TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        url TEXT UNIQUE,
        published_at TIMESTAMPTZ
    );
    """)

@app.get("/analyze/{ticker}", response_model=AnalysisResult)
async def analyze_ticker(ticker: str):
    try:
        quote_data = await fetch_stock_quote(ticker)
        news_data = await fetch_news_articles(ticker)

        # Validate API data with Pydantic models
        stock_quote = StockQuote.model_validate(quote_data)
        articles = [Article.model_validate(article) for article in news_data]

        # Store stock data in DB
        await DB_CONN.execute("""
            INSERT INTO stock_quotes (ticker, price, open, high, low, volume, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            ON CONFLICT (ticker, timestamp) DO NOTHING;
        """, ticker, stock_quote.price, stock_quote.open, stock_quote.high, stock_quote.low, stock_quote.volume)

        # Store news articles in DB
        for art in articles:
            await DB_CONN.execute("""
                INSERT INTO news_articles (ticker, title, description, url, published_at)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (url) DO NOTHING;
            """, ticker, art.title, art.description, art.url, art.published_at)

        return AnalysisResult(
            ticker=ticker,
            quote=stock_quote,
            articles=articles
        )

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
