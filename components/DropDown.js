import React from "react";

const Dropdown = ({ filter, setFilter, options, label }) => {
  return (
    <label>
      {label}
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
};

export default Dropdown;
