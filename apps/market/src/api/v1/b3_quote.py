from src.services.market_service import MarketService
from fastapi import APIRouter, HTTPException, Depends

router = APIRouter()

def get_service():
    return MarketService()

@router.get("/b3/quote/{ticker}")
async def get_b3_quote(ticker: str, service: MarketService = Depends(get_service)):
    try:
        data = service.get_b3_quote_data(ticker)
        if not data:
            raise HTTPException(status_code=404, detail="Ticker not found or not available data")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))