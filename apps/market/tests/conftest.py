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


# Fixtures
@pytest.fixture
def override_service():
    """
    Sobrescreve a dependência get_service de TODOS os endpoints.
    """
    stub = StubMarketService()

    app.dependency_overrides[get_service_quote] = lambda: stub
    app.dependency_overrides[get_service_dividends] = lambda: stub

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