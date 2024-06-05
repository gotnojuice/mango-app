import React from "react";

interface UserInspectProps {
  username: string;
}

const UserInspect: React.FC<UserInspectProps> = ({ username }) => {
  const handleInspect = () => {
    const warpcastUrl = `https://warpcast.com/${username}`;
    window.open(warpcastUrl, "_blank");
  };

  return (
    <button
      className="user-inspect-button btn"
      onClick={handleInspect}
      disabled={!username}
    >
      view user
    </button>
  );
};

export default UserInspect;
