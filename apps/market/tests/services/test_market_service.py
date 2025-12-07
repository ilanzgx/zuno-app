import pytest
from src.services.market_service import MarketService
import pandas as pd

@pytest.fixture
def market_service():
    return MarketService()

class TestFormatTicker:
    def test_format_ticker_without_sa(self, market_service):
        assert market_service._format_ticker("PETR4") == "PETR4.SA"

    def test_format_ticker_with_sa(self, market_service):
        assert market_service._format_ticker("PETR4.SA") == "PETR4.SA"

class TestGetB3QuoteData:
    def test_get_b3_quote_data_without_date_success(self, market_service, mocker):
        """
        Testa get_b3_quote_data sem data específica, retornando dados definido no mock
        """
        # Arrange
        mock_ticker_instance = mocker.MagicMock()
        mock_ticker_instance.info = {
            "ticker": "PETR4",
            "regularMarketPrice": 28.50,
            "dividendYield": 0.0521,
            "trailingPE": 8.75,
            "forwardPE": 7.23,
            "bookValue": 15.30,
            "priceToBook": 1.86,
            "recommendationKey": "buy"
        }

        mock_ticker_class = mocker.patch("yfinance.Ticker", return_value=mock_ticker_instance)

        # Act
        result = market_service.get_b3_quote_data("PETR4")

        # Assert
        assert result is not None
        assert result["ticker"] == "PETR4"
        assert result["regularMarketPrice"] == 28.50
        assert result["dividendYield"] == 0.0521
        assert result["trailingPE"] == 8.75
        assert result["forwardPE"] == 7.23
        assert result["bookValue"] == 15.30
        assert result["priceToBook"] == 1.86
        assert result["recommendationKey"] == "buy"
        mock_ticker_class.assert_called_once_with("PETR4.SA")

    def test_get_b3_quote_data_with_date_success(self, market_service, mocker):
        """
        Testa get_b3_quote_data com data específica, retornando dados históricos
        """
        # Arrange
        mock_hist_data = pd.DataFrame({
            'Open': [34.54],
            'High': [34.63],
            'Low': [34.43],
            'Close': [34.50],
            'Volume': [1193500]
        }, index=[pd.Timestamp('2024-10-29')])

        mock_ticker_instance = mocker.MagicMock()
        mock_ticker_instance.history.return_value = mock_hist_data

        mock_ticker_class = mocker.patch("yfinance.Ticker", return_value=mock_ticker_instance)

        # Act
        result = market_service.get_b3_quote_data("TAEE11", "29/10/2024")

        # Assert
        assert result is not None
        assert result["ticker"] == "TAEE11"
        assert result["date"] == "2024-10-29"
        assert result["open"] == 34.54
        assert result["high"] == 34.63
        assert result["low"] == 34.43
        assert result["close"] == 34.50
        assert result["volume"] == 1193500
        mock_ticker_class.assert_called_once_with("TAEE11.SA")
        assert mock_ticker_instance.history.called

    def test_get_b3_quote_data_no_data_available(self, market_service, mocker):
        """
        Testa get_b3_quote_data quando não há dados disponíveis
        """
        # Arrange
        mock_ticker_instance = mocker.MagicMock()
        mock_ticker_instance.info = {}

        mocker.patch("yfinance.Ticker", return_value=mock_ticker_instance)

        # Act
        result = market_service.get_b3_quote_data("FAKE_TICKER")

        # Assert
        assert result is None

class TestGetB3DividendsData:
    def test_get_b3_dividends_data_success(self, market_service, mocker):
        """
        Testa get_b3_dividends_data com sucesso
        """
        # Arrange
        mock_ticker_instance = mocker.MagicMock()
        mock_ticker_instance.dividends = pd.Series({
            '2024-10-29': 0.5,
            '2024-10-28': 0.4,
            '2024-10-27': 0.3
        })

        mocker.patch("yfinance.Ticker", return_value=mock_ticker_instance)

        # Act
        result = market_service.get_b3_dividends_data("TAEE11")

        # Assert
        assert result is not None
        assert result["ticker"] == "TAEE11"
        assert result["dividends"] == {
            '2024-10-29': 0.5,
            '2024-10-28': 0.4,
            '2024-10-27': 0.3
        }

    def test_get_b3_dividends_data_no_data_available(self, market_service, mocker):
        """
        Testa get_b3_dividends_data quando não há dados disponíveis
        """
        # Arrange
        mock_ticker_instance = mocker.MagicMock()
        mock_ticker_instance.dividends = pd.Series({})

        mocker.patch("yfinance.Ticker", return_value=mock_ticker_instance)

        # Act
        result = market_service.get_b3_dividends_data("FAKE_TICKER")

        # Assert
        assert result is not None
        assert result["ticker"] == "FAKE_TICKER"
        assert result["dividends"] == {}

    def test_get_b3_dividends_data_with_date_success(self, market_service, mocker):
        """
        Testa get_b3_dividends_data com data específica, retornando dados históricos
        """
        # Arrange
        mock_ticker_instance = mocker.MagicMock()
        mock_ticker_instance.dividends = pd.Series({
            '2024-10-29': 0.5,
            '2025-05-28': 0.4,
            '2025-11-27': 0.3
        })

        mocker.patch("yfinance.Ticker", return_value=mock_ticker_instance)

        # Act
        result = market_service.get_b3_dividends_data("TAEE11", "29/10/2024")

        # Assert (data de dividendos deve ser igual ou depois a data recebida se não da erro)
        assert result is not None
        assert result["ticker"] == "TAEE11"
        assert result["dividends"] == {
            '2024-10-29': 0.5,
            '2025-05-28': 0.4,
            '2025-11-27': 0.3
        }

    def test_get_b3_dividends_data_with_date_error(self, market_service, mocker):
        """
        Testa quando uma data inválida é fornecida
        Verifica se o ValueError é lançado
        """
        # Arrange
        mock_ticker_instance = mocker.MagicMock()
        mock_ticker_instance.dividends = pd.Series({
            '2024-10-29': 0.5,
            '2025-05-28': 0.4,
            '2025-11-27': 0.3
        })

        mocker.patch("yfinance.Ticker", return_value=mock_ticker_instance)

        # Act & Assert
        with pytest.raises(ValueError):
            market_service.get_b3_dividends_data("TAEE11", "2024-10-29")

class TestGetB3NewsForTickers:
    def test_get_b3_news_for_tickers_success(self, market_service, mocker):
        """
        Testa get_b3_news_for_tickers (2 tickers) com sucesso
        """
        # Arrange
        mock_ticker_instance = mocker.MagicMock()
        mock_ticker_instance.news = [
            {
                'title': 'News about TAEE11',
                'link': 'https://example.com/news1',
                'providerPublishTime': 1733500000  # mais recente
            },
            {
                'title': 'Another news about TAEE11',
                'link': 'https://example.com/news2',
                'providerPublishTime': 1733400000  # mais antigo
            }
        ]

        mocker.patch("yfinance.Ticker", return_value=mock_ticker_instance)

        # Act
        result = market_service.get_b3_news_for_tickers(["TAEE11", "PETR4"])

        # Assert
        assert result is not None
        assert "news" in result
        # 2 tickers x 2 notícias cada = 4 notícias no total
        assert len(result["news"]) == 4

        for news_item in result["news"]:
            assert "relatedTicker" in news_item
            assert news_item["relatedTicker"] in ["TAEE11", "PETR4"]

        timestamps = [item.get('providerPublishTime', 0) for item in result["news"]]
        assert timestamps == sorted(timestamps, reverse=True)

    def test_get_b3_news_for_tickers_no_data_available(self, market_service, mocker):
        """
        Testa get_b3_news_for_tickers quando não há dados disponíveis
        """
        # Arrange
        mock_ticker_instance = mocker.MagicMock()
        mock_ticker_instance.news = []

        mocker.patch("yfinance.Ticker", return_value=mock_ticker_instance)

        # Act
        result = market_service.get_b3_news_for_tickers(["TAEE11", "PETR4"])

        # Assert
        assert result is not None
        assert "news" in result
        assert len(result["news"]) == 0

    def test_get_b3_news_for_tickers_with_invalid_ticker(self, market_service, mocker):
        """
        Testa get_b3_news_for_tickers com um ticker inválido
        """
        # Arrange
        mock_ticker_instance = mocker.MagicMock()
        mock_ticker_instance.news = []

        mocker.patch("yfinance.Ticker", return_value=mock_ticker_instance)

        # Act
        result = market_service.get_b3_news_for_tickers(["INVALID_TICKER"])

        # Assert
        assert result is not None
        assert "news" in result
        assert len(result["news"]) == 0

class TestGetB3StockHistory:
    def test_get_b3_stock_history_success(self, market_service, mocker):
        """
        Testa get_b3_stock_history com sucesso
        """
        # Arrange
        mock_hist_data = pd.DataFrame({
            'Close': [101.0, 102.0, 103.0, 104.0, 105.0, 106.0]
        }, index=pd.to_datetime([
            '2025-01-01', '2025-02-01', '2025-03-01',
            '2025-04-01', '2025-05-01', '2025-06-01'
        ]))
        mock_hist_data.index.name = 'Date'

        mock_ticker_instance = mocker.MagicMock()
        mock_ticker_instance.history.return_value = mock_hist_data

        mocker.patch("yfinance.Ticker", return_value=mock_ticker_instance)

        # Act
        result = market_service.get_b3_stock_history("TAEE11")

        # Assert
        assert result is not None
        assert result["ticker"] == "TAEE11"
        assert "history" in result
        assert len(result["history"]) == 6

        for item in result["history"]:
            assert "date" in item
            assert "close" in item

        assert result["history"][0]["date"] == "2025-01"
        assert result["history"][0]["close"] == 101.0
        assert result["history"][5]["date"] == "2025-06"
        assert result["history"][5]["close"] == 106.0

    def test_get_b3_stock_history_no_data_available(self, market_service, mocker):
        """
        Testa get_b3_stock_history quando não há dados disponíveis
        """
        # Arrange
        mock_ticker_instance = mocker.MagicMock()
        mock_ticker_instance.history.return_value = pd.DataFrame()

        mocker.patch("yfinance.Ticker", return_value=mock_ticker_instance)

        # Act
        result = market_service.get_b3_stock_history("FAKE_TICKER")

        # Assert
        assert result is not None
        assert result["ticker"] == "FAKE_TICKER"
        assert result["history"] == []