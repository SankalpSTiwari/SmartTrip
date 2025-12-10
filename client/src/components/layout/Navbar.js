import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link className="nav-pill" to="/planner">
          Planner
        </Link>
      </li>
      <li>
        <a onClick={logout} href="/" className="nav-pill">
          <i className="fas fa-sign-out-alt"></i>{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul>
      <li>
        <Link className="nav-pill" to="/planner">
          Planner
        </Link>
      </li>
      <li>
        <Link className="nav-pill" to="/register">
          Sign Up
        </Link>
      </li>
      <li>
        <Link className="nav-pill" to="/login">
          Login
        </Link>
      </li>
    </ul>
  );
  return (
    <nav className="navbar">
      <h1 className="navbar-heading brand">
        <Link to="/" className="brand">
          <i className="fas fa-route"></i> SmartTrip
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logout })(Navbar);
