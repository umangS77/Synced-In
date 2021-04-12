import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Navbar from 'react-bootstrap/Navbar'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


export default class applicantHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      data: {},
      education: ""

    };
  }


  async componentDidMount() {


  
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    try{
      console.log(currentUser.user);
    }
    catch(error){
      return " Please Login ";
    }
    if(currentUser.user.type !== 'applicant')
    {
      alert ("You are not permitted to view this page");
      return "Please Login"
    }

    const newUser = {
      username: currentUser.user.username,
      email: currentUser.user.email,
      type: 'applicant',
    };

    if(newUser.type!=="applicant")
    {
      alert("This page is only for Applicants! You are not allowed to access this page.")
      this.props.history.push("/");
    }
    
    axios.post("http://localhost:4000/applicant", newUser)
      .then( async response => {
        let v = await this.setState({ data: response.data });
        console.log("this is response\n")
        console.log(response.data);
        var list = document.createElement('ul');
        for(var i = 0; i < response.data.education.length; i++) {
          if(response.data.education[i] === null)
            continue;

          var item = document.createElement('li');
          item.appendChild(document.createTextNode((response.data.education[i].institution + " : " + response.data.education[i].startyear + " - " + response.data.education[i].endyear)));
          list.appendChild(item);
        }

        document.getElementById('foo').appendChild(list);

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
      return "Please Login";
    }
    if(currentUser.user.type !== 'applicant')
    {
      alert ("You are not permitted to view this page");
      return "Please Login"
    }
    let temprating = 0;
    if(currentUser.user.ratingCount !== null && currentUser.user.ratingCount !== 0)
    {
      temprating = currentUser.user.rating/currentUser.user.ratingCount;
    }
    
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Navbar.Brand href="/applicantHome">HOME    </Navbar.Brand>
              <Nav.Link href="/applicantEditProfile">Edit Profile    </Nav.Link>
              <Nav.Link href="/applicantSeeJobs">Active Job Listings    </Nav.Link>
              <Nav.Link href="/myApplications">My Applications    </Nav.Link>
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
              {/* <p>Profile Image: </p>
              <div style={{width: 500, height: 'auto'}}>
                <img src='' alt = "Profile Image"/>
              </div> */}
            <p><label>Full Name: {currentUser.user.fullname} </label></p>
            <p><label>Email: {currentUser.user.email}</label></p>
            <p>
            <label>Education: </label>
            <div id = 'foo'></div>
            </p>
            <p>
            <label>Skills: {currentUser.user.skills} </label>
            </p>
            <p><label>Rating: {temprating}</label> 
            </p>
            
          </div>
          </div>
          <div>

          </div>
        </div>
      </div>
    );
  }
}
