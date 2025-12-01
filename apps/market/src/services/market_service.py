import yfinance as yf
import pandas as pd

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

    def get_b3_dividends_data(self, ticker: str, from_date: str = None) -> dict:
        symbol = self._format_ticker(ticker)
        ticker_obj = yf.Ticker(symbol)

        dividends = ticker_obj.dividends.to_dict()

        if from_date:
            try:
                from datetime import datetime
                filter_date = datetime.strptime(from_date, "%d/%m/%Y")

                dividends = {
                    k: v for k, v in dividends.items()
                    if pd.Timestamp(k).to_pydatetime().replace(tzinfo=None) >= filter_date
                }

            except ValueError as e:
                print(f"Error {from_date}: {e}")

        dividends_formatted = {str(k): v for k, v in dividends.items()}

        return {
            "ticker": ticker,
            "dividends": dividends_formatted
        }

    def get_crypto_quote_data(self, ticker: str) -> dict:
        symbol = ticker.upper()
        coin_data = yf.download(tickers=symbol, period="1mo", auto_adjust=True, progress=False)

        if coin_data.empty:
            return None

        usd_brl_data = self.get_usd_to_brl()
        usd_price = usd_brl_data['regularMarketPrice'] if usd_brl_data else 1.0

        latest_data = coin_data.iloc[-1]

        return {
            "ticker": symbol,
            "open": float(latest_data['Open'].iloc[0]) * usd_price,
            "high": float(latest_data['High'].iloc[0]) * usd_price,
            "low": float(latest_data['Low'].iloc[0]) * usd_price,
            "close": float(latest_data['Close'].iloc[0]) * usd_price,
            "volume": float(latest_data['Volume'].iloc[0]) * usd_price,
            "date": str(latest_data.name.date()),
            "currency": "BRL"
        }

    def get_usd_to_brl(self) -> dict:
        usd_brl = yf.Ticker("BRL=X")

        info = usd_brl.info

        if not info or info.get('regularMarketPrice') is None:
            return None

        return {
            "ticker": "BRL=X",
            "regularMarketPrice": info.get("regularMarketPrice")
        }

