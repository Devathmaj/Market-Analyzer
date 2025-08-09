from fastapi import FastAPI, HTTPException
from src.models import AnalysisResult, StockQuote, Article
from src.clients.external_api import fetch_stock_quote, fetch_news_articles

app = FastAPI(
    title="Market Intelligence API Gateway",
    description="Aggregates stock and news data from external sources for internal services.",
    version="1.0.0"
)

@app.get("/analyze/{ticker}", response_model=AnalysisResult)
async def analyze_ticker(ticker: str):
    """
    Provides a comprehensive analysis for a given stock ticker, including the
    latest stock quote and relevant news articles. This is the primary endpoint
    for internal services.
    """
    try:
        quote_data = await fetch_stock_quote(ticker)
        news_data = await fetch_news_articles(ticker)

        stock_quote = StockQuote.model_validate(quote_data)
        articles = [Article.model_validate(article) for article in news_data]

        return AnalysisResult(
            ticker=ticker,
            quote=stock_quote,
            articles=articles
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@app.get("/")
async def read_root():
    """A simple root endpoint to confirm the service is running."""
    return {"message": "API Gateway is running."}