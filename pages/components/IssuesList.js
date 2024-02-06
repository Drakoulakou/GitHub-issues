import React from "react";

const IssuesList = ({ issues }) => {
  return (
    <ul>
      {issues?.map((issue) => (
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
  );
};

export default IssuesList;
