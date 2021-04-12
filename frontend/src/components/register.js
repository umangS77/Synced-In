import React, { Component } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';


export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      fullname: "",
      password: "",
      type: "applicant"
    };
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeFullname = this.onChangeFullname.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  responseGoogle=(response)=>
  {
    this.setState({email: response.profileObj.email})
    this.setState({password: response.profileObj.googleId})
    return
  }
  

  onChangeUsername(event) {
    this.setState({ username: event.target.value });
  }
  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }
  onChangeFullname(event) {
    this.setState({ fullname: event.target.value });
  }
  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }
  onChangeType(event) {
    this.setState({ type: event.target.value });
  }
  onSubmit(e) {
    e.preventDefault();

    const newUser = {
        username: this.state.username,
        fullname: this.state.fullname,
        password: this.state.password,
        email: this.state.email,
        type: this.state.type
    };

    axios.post("http://localhost:4000/add", newUser).then(res => {
      console.log("Adding: \n");
      console.log(res.data);
      if (res.data.v === 3) 
        alert("This username has already been taken! Try with a different username");
      else if(res.data.v === 1)
        alert("This email-id has already been taken! Try with a different email-id");
      else
      {
        console.log("registered data is: \n");
        console.log(res.data);
        localStorage.removeItem("currentUser");
        localStorage.setItem('currentUser',JSON.stringify(res.data));
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log("setting local storage as: \n");
        console.log(currentUser.user);
        if(newUser.type === 'recruitor')
          this.props.history.push("/recruitorEditProfile");
        else
        this.props.history.push("/applicantEditProfile");
      }
    });


    this.setState({
      username: "",
      email: "",
      password: "",
      fullname: "",
      type: "applicant"
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
          <Link to="/allusers" className="nav-link">Users</Link>
          <Link to="/login" className="nav-link">Sign In</Link>
          <Link to="/register" className="navbar-brand">Sign Up</Link>
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
            <label>Username: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.username}
              onChange={this.onChangeUsername}
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
            <label>Password: </label>
            <input
              type="password"
              className="form-control"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </div>
          <Form.Group
            controlId="exampleForm.ControlSelect1"
            value={this.state.type}
            onChange={this.onChangeType}
            inputRef={el => (this.inputEl = el)}
          >
            <Form.Label>Type</Form.Label>
            <Form.Control as="select">
              <option value="applicant">Applicant</option>
              <option value="recruitor">Recruitor</option>
            </Form.Control>
          </Form.Group>
          <div className="form-group">
            <input type="submit" value="SignUp" className="btn btn-primary" />
          </div>
          <div>
          <GoogleLogin
          clientId="758385782295-9bpcpv513gbbkpio10bqkve1931jbh0n.apps.googleusercontent.com"
          buttonText="SignUp Through Google"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          // cookiePolicy={'single-host-origin'}
          />
          </div>
        </Form>
      </div>
    );
  }
}

