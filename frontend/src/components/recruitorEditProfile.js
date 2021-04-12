import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Navbar from 'react-bootstrap/Navbar'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class recruitorEditProfile extends Component {
  constructor(props) {
    super(props);
    try{
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));

    console.log("current user in reg edit is:\n");
    console.log(currentUser.user);

    this.state = {
      userid: currentUser.user._id,
      username: currentUser.user.username || "",
      email: currentUser.user.email || "",
      userid: currentUser.user._id || "",
      fullname: currentUser.user.fullname || "",
      password: currentUser.user.password || "",
      contactNumber: currentUser.user.contactNumber || "",
      bio: currentUser.user.bio || "",
      type: "recruitor"
    };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeFullname = this.onChangeFullname.bind(this);
    this.onChangeContact = this.onChangeContact.bind(this);
    this.onChangeBio = this.onChangeBio.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  catch(err)
  {
    return;
  }
  if(currentUser.user.type !== 'recruitor')
    {
      return
    }
    
  }

  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }
  onChangeFullname(event) {
    this.setState({ fullname: event.target.value });
  }

  onChangeContact(event) {
    this.setState({ contactNumber: event.target.value });
  }
  onChangeBio(event) {
    this.setState({ bio: event.target.value });
  }

  

  onSubmit(e) {
    e.preventDefault();
    console.log("before editing: " + this.state.email + " " + this.state.contactNumber 
    + " " + this.state.bio + " ");
    const newUser = {
        bio: this.state.bio || "",
        username: this.state.username || "",
        fullname: this.state.fullname || "",
        password: this.state.password,
        email: this.state.email || "",
        contactNumber: this.state.contactNumber || "",
        userid: this.state.userid,
        type: "recruitor",
        userid: this.state.userid,
    };

    var currentUser = JSON.parse(localStorage.getItem('currentUser'));


    // console.log("before sending: ");
    // console.log(currentUser.user._id);
    axios.post("http://localhost:4000/editRecruiter", newUser).then(res => {
      if(res.data.v === 1)
        alert("This email-id has already been taken! Try with a different email-id");
      else if(res.data.v === 3)
        alert("Invalid Contact Number!"); 
      else
        {
          // console.log("received after edit = ");
          // console.log(res.data);
          localStorage.removeItem("currentUser");
          localStorage.setItem("currentUser",JSON.stringify(res.data));
          currentUser = JSON.parse(localStorage.getItem('currentUser'));
          console.log(currentUser.user._id);
          alert("Profile Edited!");
          this.props.history.push("/recruitorHome");

        }
    });

    this.setState({
        userid: currentUser.user._id,
        email: currentUser.user.email,
        username: currentUser.user.username,
        password: currentUser.user.password,
        fullname: currentUser.user.fullname,
        contactNumber: currentUser.user.contactNumber,
        bio: currentUser.user.bio,
        type: "recruitor"
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
              <Nav.Link href="/recruitorHome">HOME    </Nav.Link>
              <Navbar.Brand href="/recruitorEditProfile">Edit Profile    </Navbar.Brand>
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
        <Form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Full Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.fullname}
              onChange={this.onChangeFullname}
            />
          </div>
          <div className="form-group">
            <label>Email: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.email}
              onChange={this.onChangeEmail}
            />
          </div>
          <div className="form-group">
            <label>Contact: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.contactNumber}
              onChange={this.onChangeContact}
            />
          </div>
          <div className="form-group">
            <label>Bio: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.bio}
              onChange={this.onChangeBio}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Edit" className="btn btn-primary" />
          </div>
        </Form>
      </div>
    );
  }
}
