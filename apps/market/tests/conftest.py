import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app
from src.api.v1.b3_quote import get_service

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


# Fixtures
@pytest.fixture
def override_service():
    """
    Sobrescreve a dependência get_service para usar o StubMarketService.
    Isso faz com que o endpoint use dados mockados em vez de chamar o yfinance.
    """
    app.dependency_overrides[get_service] = lambda: StubMarketService()
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