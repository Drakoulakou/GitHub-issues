import React from "react";

const Dropdown = ({ filter, setFilter }) => {
  return (
    <label>
      Choose Status:
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>
    </label>
  );
};

export default Dropdown;
