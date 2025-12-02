import yfinance as yf
import pandas as pd

class MarketService:
    def _format_ticker(self, ticker: str) -> str:
        return ticker if ticker.endswith(".SA") else f"{ticker}.SA"

    def get_b3_quote_data(self, ticker: str, date: str = None) -> dict:
        symbol = self._format_ticker(ticker)
        ticker_obj = yf.Ticker(symbol)

        # Se uma data específica for fornecida, obtenha dados históricos para aquela data
        if date:
            try:
                from datetime import datetime, timedelta
                target_date = datetime.strptime(date, "%d/%m/%Y")

                start_date = target_date - timedelta(days=5)
                end_date = target_date + timedelta(days=1)

                hist_data = ticker_obj.history(start=start_date, end=end_date)

                if hist_data.empty:
                    print(f"No historical data found for {ticker} on {date}")
                    return None

                closest_date = None
                for idx in hist_data.index:
                    hist_date = idx.to_pydatetime().replace(tzinfo=None)
                    if hist_date.date() == target_date.date():
                        closest_date = idx
                        break

                if closest_date is None:
                    for idx in reversed(hist_data.index):
                        hist_date = idx.to_pydatetime().replace(tzinfo=None)
                        if hist_date.date() <= target_date.date():
                            closest_date = idx
                            break

                if closest_date is None:
                    print(f"No data available for {ticker} on or before {date}")
                    return None

                row = hist_data.loc[closest_date]

                return {
                    "ticker": ticker,
                    "date": str(closest_date.date()),
                    "open": float(row['Open']),
                    "high": float(row['High']),
                    "low": float(row['Low']),
                    "close": float(row['Close']),
                    "volume": int(row['Volume'])
                }
            except ValueError as e:
                print(f"Error parsing date {date}: {e}")
                return None
            except Exception as e:
                print(f"Error fetching historical data: {e}")
                return None

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

    def get_b3_news_data(self, ticker: str) -> dict:
        symbol = self._format_ticker(ticker)
        ticker_obj = yf.Ticker(symbol)
        news = ticker_obj.news

        return {
            "ticker": ticker,
            "news": news
        }


