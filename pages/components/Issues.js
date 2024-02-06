import { useState } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_GITHUB_ISSUES = gql`
  query ($cursor: String) {
    repository(owner: "reactjs", name: "reactjs.org") {
      issues(first: 10, after: $cursor) {
        nodes {
          title
          url
          createdAt
          closed
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

function Issues() {
  const [filter, setFilter] = useState("all");

  const { loading, error, data, fetchMore } = useQuery(GET_GITHUB_ISSUES, {
    context: {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
      },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const issues = data?.repository?.issues?.nodes;
  const hasNextPage = data?.repository?.issues?.pageInfo?.hasNextPage;

  const loadMoreIssues = () => {
    if (hasNextPage) {
      fetchMore({
        variables: { cursor: data?.repository?.issues?.pageInfo?.endCursor },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          return {
            repository: {
              issues: {
                __typename: prevResult.repository.issues.__typename,
                nodes: [
                  ...prevResult.repository.issues.nodes,
                  ...fetchMoreResult.repository.issues.nodes,
                ],
                pageInfo: fetchMoreResult.repository.issues.pageInfo,
              },
            },
          };
        },
        concatenateData: true,
      });
    }
  };

  const filteredIssues = issues?.filter((issue) => {
    if (filter === "all") {
      return true;
    } else if (filter === "open") {
      return !issue.closed;
    } else if (filter === "closed") {
      return issue.closed;
    }
    return true;
  });

  return (
    <div>
      <h2>GitHub Issues</h2>
      <label>
        Choose Status:
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </label>
      <ul>
        {filteredIssues?.map((issue) => (
          <li key={issue.url}>
            <strong>{issue.title}</strong>
            <p>Created at: {new Date(issue.createdAt).toLocaleDateString()}</p>
            <p>Status: {issue.closed ? "Closed" : "Open"}</p>
            <a href={issue.url} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </li>
        ))}
      </ul>
      {hasNextPage && <button onClick={loadMoreIssues}>Load More</button>}
    </div>
  );
}

export default Issues;
