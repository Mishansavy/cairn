import json
import os
import time
import urllib.request

GRAPHQL_URL = "https://api.github.com/graphql"


def run_query(query: str, variables: dict, retries: int = 3) -> dict:
    token = os.environ["GITHUB_TOKEN"]
    body = json.dumps({"query": query, "variables": variables}).encode()
    request = urllib.request.Request(
        GRAPHQL_URL,
        data=body,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                payload = json.load(response)
            if "errors" in payload and "data" not in payload:
                raise RuntimeError(payload["errors"])
            return payload["data"]
        except (urllib.error.URLError, TimeoutError):
            if attempt == retries - 1:
                raise
            time.sleep(2 ** attempt)
