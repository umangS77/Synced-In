import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Navbar from 'react-bootstrap/Navbar'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
export default class recruitorHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      data: {}
    };
  }

  componentDidMount() {
    // var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    try{
      console.log(currentUser.user);
    }
    catch(error){
      return " Please Login ";
    }
    if(currentUser.user.type !== 'recruitor')
    {
      alert ("You are not permitted to view this page");
      return "Please Login"
    }

    console.log("current user is:\n");
    console.log(currentUser);

    const newUser = {
      username: currentUser.user.username,
      email: currentUser.user.email,
      type: 'recruitor',
    };

    console.log("aaaaa" + newUser.email + "  " + newUser.type);
    if(newUser.type!=="recruitor")
    {
      alert("This page is only for Recruitors! You are not allowed to access this page.")
      this.props.history.push("/");
    }
    axios.post("http://localhost:4000/recruitor", newUser)
      .then(response => {
        this.setState({ data: response.data });
        console.log("this is response\n" + response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    try{
      console.log(currentUser.user);
    }
    catch(error){
      return " Please Login ";
    }
    if(currentUser.user.type !== 'recruitor')
    {
      alert ("You are not permitted to view this page");
      return "Please Login"
    }
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Navbar.Brand href="/recruitorHome">HOME    </Navbar.Brand>
              <Nav.Link href="/recruitorEditProfile">Edit Profile    </Nav.Link>
              <Nav.Link href="/recruitorPostJob">Post a Job    </Nav.Link>
              <Nav.Link href="/recruitorActiveJobs">Active Listings    </Nav.Link>
              <Nav.Link href="/recruitorAcceptedApplicants">My Employees    </Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link href="/">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <br/>
        <br/>

        <div style={{backgroundColor:"lightpink", padding:100, textAlign:"center"}}>
        <h1>Welcome {this.state.data.username} !</h1>
        </div>

        <div>
          <div>
            <h1>Details:</h1>
            <div className="form-group">
            <p><label>Full Name: {currentUser.user.fullname} </label></p>
            <p><label>Email: {currentUser.user.email}</label></p>
            <p><label>Bio: {currentUser.user.bio}</label></p>
            <p><label>Contact Number: {currentUser.user.contactNumber }</label></p>
          </div>
          </div>
          <div>

          </div>
        </div>
      </div>
    );
  }
}
