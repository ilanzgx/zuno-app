import pytest

# Testes de Integração - GET /b3/history/{ticker}
class TestGetB3HistoryEndpoint:
    @pytest.mark.asyncio
    async def test_get_b3_history_success(self, async_client):
        """
        Testa GET /b3/history/{ticker} com sucesso
        """
        # Act
        response = await async_client.get("/b3/history/PETR4")

        # Assert
        assert response.status_code == 200

        data = response.json()
        assert data["ticker"] == "PETR4"
        assert data["history"] == [
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

    @pytest.mark.asyncio
    async def test_get_b3_history_with_period_success(self, async_client):
        """
        Testa GET /b3/history/{ticker}?period=6mo com sucesso
        """
        # Act
        response = await async_client.get("/b3/history/PETR4?period=6mo&interval=1mo")

        # Assert
        assert response.status_code == 200

        data = response.json()
        assert data["ticker"] == "PETR4"
        assert data["history"] == [
            {"date": "2025-01", "close": 30},
            {"date": "2025-02", "close": 40},
            {"date": "2025-03", "close": 50},
            {"date": "2025-04", "close": 60},
            {"date": "2025-05", "close": 70},
            {"date": "2025-06", "close": 80},
        ]

    @pytest.mark.asyncio
    async def test_get_b3_history_not_found(self, async_client):
        """
        Testa GET /b3/history/{ticker} quando o ticker não é encontrado
        """
        # Act
        response = await async_client.get("/b3/history/ERROR")

        # Assert
        assert response.status_code == 500
        assert response.json()["detail"] == "404: Ticker not found or not available data"

    @pytest.mark.asyncio
    async def test_get_b3_history_internal_error(self, async_client):
        """
        Testa GET /b3/history/{ticker} quando ocorre um erro interno
        """
        # Act
        response = await async_client.get("/b3/history/EXCEPTION")

        # Assert
        assert response.status_code == 500
        assert "Simulated API error" in response.json()["detail"]