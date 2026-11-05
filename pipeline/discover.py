from github_client import run_query

SEARCH_QUERY = """
query($searchString: String!, $pageSize: Int!, $cursor: String) {
  search(query: $searchString, type: REPOSITORY, first: $pageSize, after: $cursor) {
    pageInfo { hasNextPage endCursor }
    nodes {
      ... on Repository {
        nameWithOwner
        url
        description
        stargazerCount
        forkCount
        diskUsage
        pushedAt
        createdAt
        isArchived
        primaryLanguage { name }
        licenseInfo { spdxId }
        languages { totalCount }
        repositoryTopics(first: 10) { nodes { topic { name } } }
        openIssues: issues(states: OPEN) { totalCount }
        goodFirstIssues: issues(states: OPEN, labels: ["good first issue"]) { totalCount }
        helpWantedIssues: issues(states: OPEN, labels: ["help wanted"]) { totalCount }
        contributingGuide: object(expression: "HEAD:CONTRIBUTING.md") { id }
        mergedPullRequests: pullRequests(states: MERGED, last: 30, orderBy: {field: CREATED_AT, direction: ASC}) {
          totalCount
          nodes { createdAt mergedAt authorAssociation }
        }
      }
    }
  }
}
"""

PAGE_SIZE = 5


def search_repositories(search_string: str, limit: int) -> list[dict]:
    repositories, cursor = [], None
    while len(repositories) < limit:
        data = run_query(
            SEARCH_QUERY,
            {"searchString": search_string, "pageSize": PAGE_SIZE, "cursor": cursor},
        )["search"]
        repositories.extend(node for node in data["nodes"] if node)
        if not data["pageInfo"]["hasNextPage"]:
            break
        cursor = data["pageInfo"]["endCursor"]
    return repositories[:limit]
