import pytest

class TestGetB3NewsEndpoint:
    @pytest.mark.asyncio
    async def test_get_b3_news_multiple_tickers_success(self, async_client):
        """
        Testa GET /b3/news com sucesso para múltiplos tickers
        """
        # Act
        response = await async_client.get("/b3/news?tickers=PETR4,VALE3")

        # Assert
        assert response.status_code == 200

        data = response.json()
        assert data["news"] == [
            {
                "id": "a1",
                "content": {
                    "id": "b1",
                    "title": "Petrobras title",
                    "summary": "Petrobras summary"
                },
                "relatedTicker": "PETR4"
            },
            {
                "id": "a2",
                "content": {
                    "id": "b2",
                    "title": "Vale title",
                    "summary": "Vale summary"
                },
                "relatedTicker": "VALE3"
            },
        ]

    @pytest.mark.asyncio
    async def test_get_b3_news_single_ticker_success(self, async_client):
        """
        Testa GET /b3/news/{ticker} com sucesso para um único ticker
        """
        # Act
        response = await async_client.get("/b3/news/PETR4")

        # Assert
        assert response.status_code == 200

        data = response.json()
        assert data["ticker"] == "PETR4"
        assert data["news"] == [
            {
                "id": "a1",
                "content": {
                    "id": "b1",
                    "title": "Petrobras title1",
                    "summary": "Petrobras summary1"
                },
                "relatedTicker": "PETR4"
            },
            {
                "id": "a2",
                "content": {
                    "id": "b2",
                    "title": "Petrobras title2",
                    "summary": "Petrobras summary2"
                },
                "relatedTicker": "PETR4"
            },
        ]

    @pytest.mark.asyncio
    async def test_get_b3_news_single_ticker_error(self, async_client):
        """
        Testa GET /b3/news/{ticker} com erro para um único ticker
        """
        # Act
        response = await async_client.get("/b3/news/ERROR")

        # Assert
        assert response.status_code == 500

    @pytest.mark.asyncio
    async def test_get_b3_news_single_ticker_exception(self, async_client):
        """
        Testa GET /b3/news/{ticker} com exceção para um único ticker
        """
        # Act
        response = await async_client.get("/b3/news/EXCEPTION")

        # Assert
        assert response.status_code == 500


