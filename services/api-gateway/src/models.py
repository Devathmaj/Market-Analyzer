from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional

class ArticleSource(BaseModel):
    """Represents the source of a news article."""
    name: str

class Article(BaseModel):
    """Defines the data contract for a single news article."""
    title: str
    author: Optional[str]
    source: ArticleSource
    url: HttpUrl

class StockQuote(BaseModel):
    """Defines the data contract for a stock quote from the external API."""
    current_price: float = Field(alias='c')
    high_price_of_the_day: float = Field(alias='h')
    low_price_of_the_day: float = Field(alias='l')
    open_price_of_the_day: float = Field(alias='o')
    previous_close_price: float = Field(alias='pc')

class AnalysisResult(BaseModel):
    """Defines the top-level response structure for the analysis endpoint."""
    ticker: str
    quote: StockQuote
    articles: List[Article]