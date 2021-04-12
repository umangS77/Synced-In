import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class UsersList extends Component {
  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  componentDidMount() {
    axios
      .get("http://localhost:4000/")
      .then(response => {
        this.setState({ users: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/allusers" className="navbar-brand">Users</Link>
          <Link to="/login" className="nav-link">Sign In</Link>
          <Link to="/register" className="nav-link">Sign Up</Link>
          </Nav>

        </Navbar.Collapse>
      </Navbar>
        <br/>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map((currentUser, i) => {
              return (
                <tr>
                  <td>{currentUser.fullname}</td>
                  <td>{currentUser.username}</td>
                  <td>{currentUser.email}</td>
                  <td>{currentUser.type}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
