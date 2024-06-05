// UserSearch.tsx

import React, { ChangeEvent, useState } from "react";
import { searchUsernames, User } from "../utils/neynarAPI";

interface UserSearchProps {
  onSelect: (username: string) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<User[]>([]);

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      try {
        const response = await searchUsernames(value);
        setSuggestions(response);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (username: string) => {
    onSelect(username); // Call the onSelect function with the selected username
    setQuery(username); // Populate the input field with the selected username
    setSuggestions([]); // Clear the suggestions
  };

  return (
    <div>
      <input
        value={query}
        onChange={handleInputChange}
        placeholder="username"
        className="user-search-input form-input"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((user) => (
            <li
              key={user.username}
              onClick={() => handleSelectSuggestion(user.username)}
              className="suggestion-item"
            >
              <img
                src={user.pfp_url}
                alt={user.username}
                className="profile-thumbnail"
              />
              <span className="username">{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
