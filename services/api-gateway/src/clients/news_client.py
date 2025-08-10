import requests
from config import secrets, files
for cat in files.news_categories:


def fetch_news(category):
    r = requests.get("https://newsapi.org/v2/top-headlines",
                     params={"category": category, "apiKey": secrets.NEWS_API_KEY, "language": "en"})
    return r.json().get("articles", [])

def store_news(articles, category):
    conn = get_db_connection()
    cur = conn.cursor()
    for art in articles:
        cur.execute("""
            INSERT INTO news_articles (source, author, title, description, url, published_at, category)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            art.get("source", {}).get("name"),
            art.get("author"),
            art.get("title"),
            art.get("description"),
            art.get("url"),
            art.get("publishedAt"),
            category
        ))
    conn.commit()
    cur.close()
    conn.close()

def main():
    for cat in secrets.news_categories:
        store_news(fetch_news(cat), cat)

if __name__ == "__main__":
    main()
