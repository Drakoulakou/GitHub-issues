import React from "react";

const IssuesList = ({ issues, linkTitle, statusTitle, createdAtTitle }) => {
  return (
    <ul>
      {issues?.map((issue) => (
        <li key={issue.url}>
          <strong>{issue.title}</strong>
          <p>
            {createdAtTitle} {new Date(issue.createdAt).toLocaleDateString()}
          </p>
          <p>
            {statusTitle} {issue.closed ? "Closed" : "Open"}
          </p>
          <a href={issue.url} target="_blank" rel="noopener noreferrer">
            {linkTitle}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default IssuesList;
