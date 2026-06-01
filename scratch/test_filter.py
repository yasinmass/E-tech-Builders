import requests

def test_filter():
    url = "http://localhost:8000/api/filter/"
    # Need to login first or use a token if available
    # For now, let's just see if it's a 500
    try:
        r = requests.get(url)
        print(f"Status: {r.status_code}")
        print(f"Content: {r.text[:500]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_filter()
