import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isActive = (path) => location.pathname === path;

  return (
    <Navbar
      expand="lg"
      className={`sticky-top ${
        isAuthPage ? "transparent-navbar" : "custom-navbar"
      }`}
    >
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold brand-text d-flex align-items-center gap-2 fs-5"
        >
          💰 <span>ExpenseTracker</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar" className="justify-content-end">
          <Nav className="d-flex align-items-center gap-3">
            {user && (
              <>
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  className={`nav-link-custom ${isActive("/dashboard") ? "active-link" : ""}`}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/add"
                  className={`nav-link-custom ${isActive("/add") ? "active-link" : ""}`}
                >
                  Add
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/reports"
                  className={`nav-link-custom ${isActive("/reports") ? "active-link" : ""}`}
                >
                  Reports
                </Nav.Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="rounded-pill fw-semibold px-3 logout-btn"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </Button>
              </>
            )}
            {!user && (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={`nav-link-custom ${isActive("/login") ? "active-link" : ""}`}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/register"
                  className={`nav-link-custom ${isActive("/register") ? "active-link" : ""}`}
                >
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
