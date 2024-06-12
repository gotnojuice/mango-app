import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link href="/home">
            <a className="navbar-link">Home</a>
          </Link>
        </li>
        <li className="navbar-item">
          <Link href="/pay">
            <a className="navbar-link">Pay</a>
          </Link>
        </li>
        <li className="navbar-item">
          <Link href="/approve">
            <a className="navbar-link">Approve</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
