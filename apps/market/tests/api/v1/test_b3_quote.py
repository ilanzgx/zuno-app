import pytest

# Testes de Integração - GET /b3/quote/{ticker}
class TestGetB3QuoteEndpoint:
    @pytest.mark.asyncio
    async def test_get_b3_quote_success(self, async_client):
        """
        Testa GET /b3/quote/{ticker} com sucesso
        """
        # Act
        response = await async_client.get("/b3/quote/PETR4")

        # Assert
        assert response.status_code == 200

        data = response.json()
        assert data["ticker"] == "PETR4"
        assert data["regularMarketPrice"] == 28.50
        assert data["dividendYield"] == 0.0521
        assert data["trailingPE"] == 8.75
        assert data["forwardPE"] == 7.23
        assert data["bookValue"] == 15.30
        assert data["priceToBook"] == 1.86
        assert data["recommendationKey"] == "buy"

    @pytest.mark.asyncio
    async def test_get_b3_quote_with_date_success(self, async_client):
        """
        Testa GET /b3/quote/{ticker}?date=29/10/2024 com sucesso
        """
        # Act
        response = await async_client.get("/b3/quote/TAEE11?date=29/10/2024")

        # Assert
        assert response.status_code == 200

        data = response.json()
        assert data["ticker"] == "TAEE11"
        assert data["date"] == "2024-10-29"
        assert data["open"] == 34.54
        assert data["high"] == 34.63
        assert data["low"] == 34.43
        assert data["close"] == 34.50
        assert data["volume"] == 1193500

    @pytest.mark.asyncio
    async def test_get_b3_quote_not_found(self, async_client):
        """
        Testa GET /b3/quote/{ticker} quando o ticker não é encontrado
        """
        # Act
        response = await async_client.get("/b3/quote/ERROR")

        # Assert
        assert response.status_code == 500
        assert response.json()["detail"] == "404: Ticker not found or not available data"

    @pytest.mark.asyncio
    async def test_get_b3_quote_internal_error(self, async_client):
        """
        Testa GET /b3/quote/{ticker} quando ocorre um erro interno
        """
        # Act
        response = await async_client.get("/b3/quote/EXCEPTION")

        # Assert
        assert response.status_code == 500
        assert "Simulated API error" in response.json()["detail"]