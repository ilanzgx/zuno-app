from src.services.market_service import MarketService
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

router = APIRouter()

def get_service():
    return MarketService()

@router.get("/b3/history")
async def get_b3_stock_history_multiple(
    tickers: str,
    period: Optional[str] = Query("1y", description="Period of history"),
    interval: Optional[str] = Query("1mo", description="Interval of history"),
    service: MarketService = Depends(get_service)
):
    try:
        ticker_list = [t.strip() for t in tickers.split(',')]
        data = service.get_b3_stock_history_for_tickers(ticker_list, period, interval)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/b3/history/{ticker}")
async def get_b3_stock_history(
    ticker: str,
    period: Optional[str] = Query("1y", description="Period of history"),
    interval: Optional[str] = Query("1mo", description="Interval of history"),
    service: MarketService = Depends(get_service)
):
    try:
        data = service.get_b3_stock_history(ticker, period, interval)
        if not data:
            raise HTTPException(status_code=404, detail="Ticker not found or not available data")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))