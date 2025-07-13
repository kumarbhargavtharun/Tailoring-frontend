import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light mb-3">
      <div className="container">
        <Link className="navbar-brand" to="/">Kumar Hand Embroidery</Link>
        <div>
          <Link className="nav-link d-inline" to="/">Service Order</Link>
          <Link className="nav-link d-inline ms-3" to="/admin">Admin Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}
