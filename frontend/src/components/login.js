import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import axios from "axios";
import { GoogleLogin } from 'react-google-login';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      type:""
    };
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  responseGoogle=(response)=>
  {
    // console.log(response);
    console.log(response.profileObj);
    
    this.setState({username: response.profileObj.email});
    this.setState({ password: response.profileObj.googleId});

    const newUser = {
      username: this.state.username,
      password: this.state.password
    };

    console.log(newUser);

    axios.post("http://localhost:4000/login", newUser).then(res => {
      console.log("responseee", res.data);
      if (res.data.val === 0)
      {
        alert("Please enter your credentials");
      } 
      else if (res.data.val === 1)
      {
        alert("You are not registered. Register Now!");
      }
      else if (res.data.val === 2)
      {
        alert("Password incorrect! Try again...");
      }
      if (res.data.val === 3) {
        localStorage.setItem("currentUser",JSON.stringify(res.data));
        localStorage.setItem('currentJob',"");
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log("loginid = "+ currentUser.user.username);
        if(currentUser.user.type === "recruitor")
          this.props.history.push("/RecruitorHome");
        else 
          this.props.history.push("/ApplicantHome");
      }
    });




  }

  onChangeUsername(event) {
    this.setState({ username: event.target.value });
  }
  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }
  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      username: this.state.username,
      password: this.state.password
    };

    console.log(newUser);

    axios.post("http://localhost:4000/login", newUser).then(res => {
      console.log("responseee", res.data);
      if (res.data.val === 0)
      {
        alert("Please enter your credentials");
      } 
      else if (res.data.val === 1)
      {
        alert("You are not registered. Register Now!");
      }
      else if (res.data.val === 2)
      {
        alert("Password incorrect! Try again...");
      }
      if (res.data.val === 3) {
        localStorage.setItem("currentUser",JSON.stringify(res.data));
        localStorage.setItem('currentJob',"");
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log("loginid = "+ currentUser.user.username);
        if(currentUser.user.type === "recruitor")
          this.props.history.push("/RecruitorHome");
        else 
          this.props.history.push("/ApplicantHome");
      }
    });
    this.setState({
      username: "",
      password: "",
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
          <Link to="/login" className="navbar-brand">Sign In</Link>
          <Link to="/register" className="nav-link">Sign Up</Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
        <br/>
        <br/>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Username/Email: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.username}
              onChange={this.onChangeUsername}
            />
          </div>
          <div className="form-group">
            <label>Password: </label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-control"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="LOGIN" className="btn btn-primary" />
          </div>
        </form>

        <GoogleLogin
          clientId="758385782295-9bpcpv513gbbkpio10bqkve1931jbh0n.apps.googleusercontent.com"
          buttonText="Login through Google"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          // cookiePolicy={'single-host-origin'}
          />




        
        {/* </GoogleLogin> */}
      </div>
    );
  }
}
