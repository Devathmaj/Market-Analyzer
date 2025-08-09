import httpx
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse

app = FastAPI(
    title="Market Intelligence Web UI",
    description="A dashboard to display market analysis.",
    version="1.0.0"
)

# The URL for the api-gateway. Docker Compose provides DNS resolution
# using the service name 'api-gateway'. The port is 8000.
API_GATEWAY_URL = "http://api-gateway:8000"

@app.get("/", response_class=HTMLResponse)
async def get_analysis_dashboard():
    """
    Fetches analysis for a default ticker from the API Gateway and displays it.
    This is the main dashboard page.
    """
    # For this simple example, we'll hardcode a ticker.
    # In a real app, this would come from user input.
    ticker = "AAPL"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{API_GATEWAY_URL}/analyze/{ticker}")
            response.raise_for_status()
            data = response.json()
            
            # Create a simple HTML representation of the JSON data
            quote = data.get('quote', {})
            articles = data.get('articles', [])
            
            articles_html = "".join(
                f"<li><a href='{article.get('url')}'>{article.get('title')}</a> by {article.get('source', {}).get('name')}</li>"
                for article in articles
            )

            html_content = f"""
            <html>
                <head>
                    <title>Market Analysis for {data.get('ticker')}</title>
                    <style>
                        body {{ font-family: sans-serif; line-height: 1.6; padding: 2em; }}
                        h1, h2 {{ color: #333; }}
                        ul {{ list-style-type: none; padding: 0; }}
                        li {{ margin-bottom: 1em; border-bottom: 1px solid #eee; padding-bottom: 1em;}}
                        a {{ text-decoration: none; color: #0066cc; }}
                        a:hover {{ text-decoration: underline; }}
                        .quote {{ background-color: #f4f4f4; padding: 1em; border-radius: 5px; }}
                    </style>
                </head>
                <body>
                    <h1>Analysis for {data.get('ticker')}</h1>
                    <div class="quote">
                        <h2>Latest Stock Quote</h2>
                        <p><strong>Current Price:</strong> {quote.get('current_price')}</p>
                        <p><strong>Day High:</strong> {quote.get('high_price_of_the_day')}</p>
                        <p><strong>Day Low:</strong> {quote.get('low_price_of_the_day')}</p>
                        <p><strong>Previous Close:</strong> {quote.get('previous_close_price')}</p>
                    </div>
                    <h2>Recent News</h2>
                    <ul>
                        {articles_html}
                    </ul>
                </body>
            </html>
            """
            return HTMLResponse(content=html_content)

        except httpx.HTTPStatusError as e:
            error_detail = e.response.json().get("detail", e.response.text)
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Error from API Gateway: {error_detail}"
            )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=503,
                detail=f"Could not connect to the API Gateway: {e}"
            )

@app.get("/health")
async def health_check():
    """A simple health check endpoint."""
    return {"status": "ok"}
