import { useState } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import IssuesList from "./IssuesList";
import Dropdown from "./DropDown";

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
  const [statusFilter, setStatusFilter] = useState("all");

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
    if (statusFilter === "all") {
      return true;
    } else if (statusFilter === "open") {
      return !issue.closed;
    } else if (statusFilter === "closed") {
      return issue.closed;
    }
    return true;
  });

  return (
    <div>
      <h1>GitHub Issues</h1>
      <Dropdown filter={statusFilter} setFilter={setStatusFilter} />
      <IssuesList issues={filteredIssues} />
      {hasNextPage && <button onClick={loadMoreIssues}>Load More</button>}
    </div>
  );
}

export default Issues;
