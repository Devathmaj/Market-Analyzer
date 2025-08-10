# Used to create the web application and handle HTTP requests.
from fastapi import FastAPI, HTTPException

# Used to make asynchronous HTTP requests to the api-gateway.
import httpx

# Used to access environment variables.
import os

# Initialize the FastAPI application.
app = FastAPI()

# Retrieve the internal URL for the API Gateway from environment variables,
# with a default value for local testing.
API_GATEWAY_URL = os.environ.get("API_GATEWAY_URL", "http://api-gateway:8000")

@app.get("/api/news/{keyword}")
async def get_news(keyword: str):
    """
    Proxies requests for news and stock analysis to the main api-gateway service.
    This endpoint is called by the frontend application.
    """
    async with httpx.AsyncClient() as client:
        try:
            # Construct the full URL to the api-gateway's analyze endpoint.
            url = f"{API_GATEWAY_URL}/analyze/{keyword}"
            response = await client.get(url)
            
            # Raise an exception for non-2xx responses.
            response.raise_for_status()
            
            # Return the JSON data from the api-gateway.
            return response.json()
            
        except httpx.HTTPStatusError as e:
            # Forward HTTP errors from the gateway to the client.
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Error from API Gateway: {e.response.text}"
            )
        except httpx.RequestError as e:
            # Handle network errors when trying to contact the gateway.
            raise HTTPException(
                status_code=503,
                detail=f"Network error while contacting API Gateway: {e}"
            )

async def proxy_to_gateway(client: httpx.AsyncClient, method: str, path: str, **kwargs):
    """Generic proxy function to forward requests to the API gateway."""
    try:
        url = f"{API_GATEWAY_URL}{path}"
        response = await client.request(method, url, **kwargs)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Error from API Gateway: {e.response.text}"
        )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Network error while contacting API Gateway: {e}"
        )

@app.get("/api/stocks/{ticker}")
async def get_stock_quote(ticker: str):
    """Proxies request for a single stock quote to the API gateway."""
    async with httpx.AsyncClient() as client:
        return await proxy_to_gateway(client, "GET", f"/analyze/{ticker}")

@app.get("/api/stocks/{ticker}/history")
async def get_stock_history(ticker: str, resolution: str = "D", from_ts: int = 1672531200, to_ts: int = 1675209600):
    """Proxies request for stock history to the API gateway."""
    async with httpx.AsyncClient() as client:
        path = f"/stocks/{ticker}/history"
        params = {"resolution": resolution, "from_ts": from_ts, "to_ts": to_ts}
        return await proxy_to_gateway(client, "GET", path, params=params)

@app.get("/api/signals/{ticker}")
async def get_trading_signals(ticker: str):
    """Proxies request for trading signals to the API gateway."""
    async with httpx.AsyncClient() as client:
        return await proxy_to_gateway(client, "GET", f"/signals/{ticker}")

@app.get("/api/analytics")
async def get_analytics():
    """Proxies request for analytics to the API gateway."""
    async with httpx.AsyncClient() as client:
        return await proxy_to_gateway(client, "GET", "/analytics")

@app.put("/api/user/settings")
async def update_user_settings(settings: dict):
    """Proxies request to update user settings to the API gateway."""
    async with httpx.AsyncClient() as client:
        return await proxy_to_gateway(client, "PUT", "/user/settings", json=settings)

# This line has been removed. It was attempting to serve static files,
# which is the responsibility of the 'web-ui' (Vite) service in your
# development setup, and was the source of the crash.
# app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.get("/")
def root():
    """
    A simple root endpoint to confirm that the web-ui-server is running.
    """
    return {"message": "Web UI Server is running and waiting for API requests."}