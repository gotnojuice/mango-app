import React, { ChangeEvent, useState } from "react";

interface UserSearchProps {
  onSelect: (username: string, ethAddress: string) => void; // Update props to include ethAddress
}

interface VerifiedAddresses {
  eth_addresses: string[];
  sol_addresses: string[];
}

export interface User {
  username: string;
  display_name: string;
  pfp_url: string;
  verified_addresses: VerifiedAddresses;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<User[]>([]);

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      try {
        const response = await fetch(`/api/searchUsernames?query=${value}`);
        const users: User[] = await response.json();
        setSuggestions(users);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (selectedUser: User) => {
    const ethAddress =
      selectedUser.verified_addresses?.eth_addresses[0] ??
      "No ETH address found";
    onSelect(selectedUser.username, ethAddress); // Call the onSelect function with the selected username and ethAddress
    setQuery(selectedUser.username); // Populate the input field with the selected username
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
              onClick={() => handleSelectSuggestion(user)}
              className="suggestion-item"
            >
              <img
                src={user.pfp_url}
                alt={user.username}
                className="profile-thumbnail"
              />
              <span className="username">
                {user.username} - {user.display_name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
