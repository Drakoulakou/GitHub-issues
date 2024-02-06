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
  const { loading, error, data } = useQuery(GET_GITHUB_ISSUES, {
    context: {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
      },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log("data", data);

  return <div>{JSON.stringify(data)}</div>;
}

export default Issues;
