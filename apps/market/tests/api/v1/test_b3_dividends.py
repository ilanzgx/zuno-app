import pytest

# Testes de Integração - GET /b3/dividends/{ticker}
class TestGetB3DividendsEndpoint:
    @pytest.mark.asyncio
    async def test_get_b3_dividends_success(self, async_client):
        """
        Testa GET /b3/dividends/{ticker} com sucesso
        """
        # Act
        response = await async_client.get("/b3/dividends/TAEE11")

        # Assert
        assert response.status_code == 200

        data = response.json()
        assert data["ticker"] == "TAEE11"
        assert data["dividends"] == [
            {"date": "2022-10-29", "amount": 0.50},
            {"date": "2023-10-29", "amount": 0.50},
            {"date": "2024-10-29", "amount": 0.50},
            {"date": "2024-10-28", "amount": 0.40},
            {"date": "2025-10-29", "amount": 0.50},
        ]

    @pytest.mark.asyncio
    async def test_get_b3_dividends_with_date_success(self, async_client):
        """
        Testa GET /b3/dividends/{ticker}?from_date=29/10/2024 com sucesso
        """
        # Act
        response = await async_client.get("/b3/dividends/TAEE11?from_date=29/10/2024")

        # Assert
        assert response.status_code == 200

        data = response.json()
        assert data["ticker"] == "TAEE11"
        assert data["from_date"] == "2024-10-29"
        assert data["dividends"] == [
             {"date": "2024-10-29", "amount": 0.50},
             {"date": "2024-11-28", "amount": 0.40},
             {"date": "2024-12-28", "amount": 0.30}
        ]

    @pytest.mark.asyncio
    async def test_get_b3_dividends_not_found(self, async_client):
        """
        Testa GET /b3/dividends/{ticker} quando o ticker não é encontrado
        """
        # Act
        response = await async_client.get("/b3/dividends/ERROR")

        # Assert
        assert response.status_code == 500
        assert response.json()["detail"] == "404: Ticker not found or not available data"

    @pytest.mark.asyncio
    async def test_get_b3_dividends_internal_error(self, async_client):
        """
        Testa GET /b3/dividends/{ticker} quando ocorre um erro interno
        """
        # Act
        response = await async_client.get("/b3/dividends/EXCEPTION")

        # Assert
        assert response.status_code == 500
        assert "Simulated API error" in response.json()["detail"]
