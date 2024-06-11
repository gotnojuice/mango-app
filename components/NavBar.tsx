import Link from "next/link";
import React from "react";

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link href="/pay" className="navbar-link">
            Pay
          </Link>
        </li>
        <li className="navbar-item">
          <Link href="/approve" className="navbar-link">
            Approve
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
