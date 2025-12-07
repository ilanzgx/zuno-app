import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app

from src.api.v1.b3_quote import get_service as get_service_quote
from src.api.v1.b3_dividends import get_service as get_service_dividends
from src.api.v1.b3_history import get_service as get_service_history
from src.api.v1.b3_news import get_service as get_service_news

# Stub do MarketService
class StubMarketService:
    """
    Stub do MarketService para testes de integração.
    Retorna dados fixos sem acessar a API do yfinance.
    """
    def get_b3_quote_data(self, ticker: str, date: str = None):
        if ticker == "ERROR":
            return None

        if ticker == "EXCEPTION":
            raise Exception("Simulated API error")

        if date:
            return {
                "ticker": ticker,
                "date": "2024-10-29",
                "open": 34.54,
                "high": 34.63,
                "low": 34.43,
                "close": 34.50,
                "volume": 1193500
            }

        return {
            "ticker": ticker,
            "regularMarketPrice": 28.50,
            "dividendYield": 0.0521,
            "trailingPE": 8.75,
            "forwardPE": 7.23,
            "bookValue": 15.30,
            "priceToBook": 1.86,
            "recommendationKey": "buy"
        }

    def get_b3_dividends_data(self, ticker: str, from_date: str = None):
        if ticker == "ERROR":
            return None

        if ticker == "EXCEPTION":
            raise Exception("Simulated API error")

        if from_date:
            return {
                "ticker": ticker,
                "from_date": "2024-10-29",
                "dividends": [
                    {"date": "2024-10-29", "amount": 0.50},
                    {"date": "2024-11-28", "amount": 0.40},
                    {"date": "2024-12-28", "amount": 0.30}
                ]
            }

        return {
            "ticker": ticker,
            "dividends": [
                {"date": "2022-10-29", "amount": 0.50},
                {"date": "2023-10-29", "amount": 0.50},
                {"date": "2024-10-29", "amount": 0.50},
                {"date": "2024-10-28", "amount": 0.40},
                {"date": "2025-10-29", "amount": 0.50},
            ]
        }

    def get_b3_stock_history(self, ticker: str, period: str = "1y", interval: str = "1mo"):
        if ticker == "ERROR":
            return None

        if ticker == "EXCEPTION":
            raise Exception("Simulated API error")

        if period == "6mo":
            return {
                "ticker": ticker,
                "history": [
                    {"date": "2025-01", "close": 30},
                    {"date": "2025-02", "close": 40},
                    {"date": "2025-03", "close": 50},
                    {"date": "2025-04", "close": 60},
                    {"date": "2025-05", "close": 70},
                    {"date": "2025-06", "close": 80},
                ]
            }

        return {
            "ticker": ticker,
            "history": [
                {"date": "2025-01", "close": 30},
                {"date": "2025-02", "close": 40},
                {"date": "2025-03", "close": 50},
                {"date": "2025-04", "close": 60},
                {"date": "2025-05", "close": 70},
                {"date": "2025-06", "close": 80},
                {"date": "2025-07", "close": 90},
                {"date": "2025-08", "close": 100},
                {"date": "2025-09", "close": 110},
                {"date": "2025-10", "close": 120},
                {"date": "2025-11", "close": 130},
                {"date": "2025-12", "close": 140},
            ]
        }

    def get_b3_news_for_tickers(self, tickers: list[str]):
        if "ERROR" in tickers:
            return None

        if "EXCEPTION" in tickers:
            raise Exception("Simulated API error")

        news = []
        for ticker in tickers:
            if ticker == "PETR4":
                news.append({
                    "id": "a1",
                    "content": {
                        "id": "b1",
                        "title": "Petrobras title",
                        "summary": "Petrobras summary"
                    },
                    "relatedTicker": "PETR4"
                })
            elif ticker == "VALE3":
                news.append({
                    "id": "a2",
                    "content": {
                        "id": "b2",
                        "title": "Vale title",
                        "summary": "Vale summary"
                    },
                    "relatedTicker": "VALE3"
                })
            else:
                news.append({
                    "id": f"news_{ticker}",
                    "content": {
                        "id": f"content_{ticker}",
                        "title": f"{ticker} news title",
                        "summary": f"{ticker} news summary"
                    },
                    "relatedTicker": ticker
                })

        return {"news": news}

    def get_b3_news_data(self, ticker: str):
        if ticker == "ERROR":
            return None

        if ticker == "EXCEPTION":
            raise Exception("Simulated API error")

        return {
            "ticker": ticker,
            "news": [
                {
                    "id": "a1",
                    "content": {
                        "id": "b1",
                        "title": "Petrobras title1",
                        "summary": "Petrobras summary1"
                    },
                    "relatedTicker": ticker
                },
                {
                    "id": "a2",
                    "content": {
                        "id": "b2",
                        "title": "Petrobras title2",
                        "summary": "Petrobras summary2"
                    },
                    "relatedTicker": ticker
                }
            ]
        }


# Fixtures
@pytest.fixture
def override_service():
    """
    Sobrescreve a dependência get_service de TODOS os endpoints.
    """
    stub = StubMarketService()

    app.dependency_overrides[get_service_quote] = lambda: stub
    app.dependency_overrides[get_service_dividends] = lambda: stub
    app.dependency_overrides[get_service_history] = lambda: stub
    app.dependency_overrides[get_service_news] = lambda: stub

    yield
    app.dependency_overrides.clear()

@pytest.fixture
async def async_client(override_service):
    """
    Cliente HTTP assíncrono para testar endpoints async.
    O ASGITransport permite testar a aplicação ASGI sem iniciar um servidor.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client