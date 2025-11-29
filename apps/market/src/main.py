from fastapi import FastAPI
from src.api.v1 import b3_quote, b3_dividends, crypto_quote

app = FastAPI(title="Market API", version="0.1.0")

app.include_router(b3_quote.router, tags=["B3 Quotes"])
app.include_router(b3_dividends.router, tags=["B3 Dividends"])
app.include_router(crypto_quote.router, tags=["Crypto Quotes"])