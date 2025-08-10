import requests
from config import secrets, files
for sym in files.company_list:

FINNHUB_BASE = "https://finnhub.io/api/v1"

def fetch_static_profile(symbol):
    r = requests.get(f"{FINNHUB_BASE}/stock/profile2",
                     params={"symbol": symbol, "token": secrets.STOCK_API_KEY})
    data = r.json()
    return {
        "symbol": symbol,
        "country": data.get("country"),
        "currency": data.get("currency"),
        "exchange": data.get("exchange"),
        "industry": data.get("finnhubIndustry"),
        "ipo": data.get("ipo"),
        "name": data.get("name")
    }

def fetch_dynamic_quote(symbol):
    quote = requests.get(f"{FINNHUB_BASE}/quote",
                          params={"symbol": symbol, "token": secrets.STOCK_API_KEY}).json()
    profile = requests.get(f"{FINNHUB_BASE}/stock/profile2",
                            params={"symbol": symbol, "token": secrets.STOCK_API_KEY}).json()
    return {
        "symbol": symbol,
        "current_price": quote.get("c"),
        "high_price": quote.get("h"),
        "low_price": quote.get("l"),
        "open_price": quote.get("o"),
        "prev_close_price": quote.get("pc"),
        "market_cap": profile.get("marketCapitalization")
    }

def store_static(data):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO stocks_static (symbol, country, currency, exchange, industry, ipo, name)
        VALUES (%(symbol)s, %(country)s, %(currency)s, %(exchange)s, %(industry)s, %(ipo)s, %(name)s)
        ON CONFLICT (symbol) DO UPDATE
        SET country=EXCLUDED.country,
            currency=EXCLUDED.currency,
            exchange=EXCLUDED.exchange,
            industry=EXCLUDED.industry,
            ipo=EXCLUDED.ipo,
            name=EXCLUDED.name
    """, data)
    conn.commit()
    cur.close()
    conn.close()

def store_dynamic(data):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO stocks_dynamic (symbol, current_price, high_price, low_price, open_price, prev_close_price, market_cap)
        VALUES (%(symbol)s, %(current_price)s, %(high_price)s, %(low_price)s, %(open_price)s, %(prev_close_price)s, %(market_cap)s)
    """, data)
    conn.commit()
    cur.close()
    conn.close()

def main():
    for sym in secrets.company_list:
        store_static(fetch_static_profile(sym))
        store_dynamic(fetch_dynamic_quote(sym))

if __name__ == "__main__":
    main()
