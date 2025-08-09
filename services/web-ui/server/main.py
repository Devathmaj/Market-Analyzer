import httpx
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI(
    title="Market Intelligence Web UI",
    description="A dashboard to display market analysis.",
    version="1.0.0"
)

# The URL for the api-gateway. Docker Compose provides DNS resolution
# using the service name 'api-gateway'. The port is 8000.
API_GATEWAY_URL = "http://api-gateway:8000"

# Mount the static files directory
app.mount("/assets", StaticFiles(directory="/app/static/assets"), name="assets")

@app.get("/api/{full_path:path}")
async def proxy_to_api_gateway(full_path: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{API_GATEWAY_URL}/{full_path}")
            response.raise_for_status()
            return response.json()
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

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    return FileResponse("/app/static/index.html")

@app.get("/health")
async def health_check():
    """A simple health check endpoint."""
    return {"status": "ok"}