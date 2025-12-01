from fastapi import APIRouter, HTTPException, Depends, Query
from src.services.market_service import MarketService
from typing import Optional

router = APIRouter()

def get_service():
    return MarketService()

@router.get("/b3/dividends/{ticker}")
async def get_b3_dividends(
    ticker: str,
    from_date: Optional[str] = Query(None, description="Filter dividends from this date (format: dd/mm/yyyy)"),
    service: MarketService = Depends(get_service)
):
    try:
        data = service.get_b3_dividends_data(ticker, from_date)
        if not data:
            raise HTTPException(status_code=404, detail="Ticker not found or not available data")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))