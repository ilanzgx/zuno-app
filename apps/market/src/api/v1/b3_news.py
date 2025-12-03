from src.services.market_service import MarketService
from fastapi import APIRouter, HTTPException, Depends

router = APIRouter()

def get_service():
    return MarketService()

@router.get("/b3/news")
async def get_b3_news_multiple(tickers: str, service: MarketService = Depends(get_service)):
    try:
        ticker_list = [t.strip() for t in tickers.split(',')]
        data = service.get_b3_news_for_tickers(ticker_list)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/b3/news/{ticker}")
async def get_b3_news(ticker: str, service: MarketService = Depends(get_service)):
    try:
        data = service.get_b3_news_data(ticker)
        if not data:
            raise HTTPException(status_code=404, detail="Ticker not found or not available data")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))