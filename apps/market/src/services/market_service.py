import yfinance as yf

class MarketService:
    def _format_ticker(self, ticker: str) -> str:
        return ticker if ticker.endswith(".SA") else f"{ticker}.SA"

    def get_b3_quote_data(self, ticker: str) -> dict:
        symbol = self._format_ticker(ticker)
        ticker_obj = yf.Ticker(symbol)

        info = ticker_obj.info

        if not info or info.get('regularMarketPrice') is None:
            return None

        return {
            "ticker": ticker,
            "dividendYield": info.get("dividendYield"),
            "trailingPE": info.get("trailingPE"),
            "forwardPE": info.get("forwardPE"),
            "bookValue": info.get("bookValue"),
            "priceToBook": info.get("priceToBook"),
            "recommendationKey": info.get("recommendationKey")
        }

    def get_b3_dividends_data(self, ticker: str) -> dict:
        symbol = self._format_ticker(ticker)
        ticker_obj = yf.Ticker(symbol)

        dividends = ticker_obj.dividends.to_dict()

        dividends_formatted = {str(k): v for k, v in dividends.items()}

        return {
            "ticker": ticker,
            "dividends": dividends_formatted
        }