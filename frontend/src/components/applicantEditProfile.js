import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";

import Navbar from 'react-bootstrap/Navbar';
import Form from "react-bootstrap/Form";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

var currentUser = JSON.parse(localStorage.getItem('currentUser'));

export default class applicantEditProfile extends Component {
  

  constructor(props) {
    super(props);
    try{
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    console.log("Starting to edit: \n");
    console.log(currentUser.user);

    this.state = {
      username: currentUser.user.username || "",
      email: currentUser.user.email || "",
      userid: currentUser.user.userid,
      fullname: currentUser.user.fullname || "",
      password: currentUser.user.password || "",
      skills: currentUser.user.skills || "",
      resume: {},
      profilePic: {},
      rating: currentUser.user.rating,
      ratingCount: currentUser.user.ratingCount,
      type: "applicant",
      education: [],
      institution: "",
      startyear: '',
      endyear: '',
    };
    
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeFullname = this.onChangeFullname.bind(this);
    this.onChangeResume = this.onChangeResume.bind(this);
    this.onChangeSkills = this.onChangeSkills.bind(this);
    // this.addEducation = this.addEducation.bind(this);
    this.onChangeEducationInstitution = this.onChangeEducationInstitution.bind(this);
    this.onChangeEducationStartYear = this.onChangeEducationStartYear.bind(this);
    this.onChangeEducationEndYear = this.onChangeEducationEndYear.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
  }
  catch(err)
  {
    return;
  }
  if(currentUser.user.type !== 'applicant')
    return
  
  }

  // addEducation()
  // {
    
  //   return;
  // }

  onChangeEducationEndYear(event) {
    console.log("ins = " + event.target.value);
    this.setState({endyear: event.target.value});
  }

  onChangeEducationStartYear(event) {
    console.log("ins = " + event.target.value);
    this.setState({startyear: event.target.value});
  }

  onChangeEducationInstitution(event) {
    console.log("ins = " + event.target.value);

    this.setState({institution: event.target.value});
  }


  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }
  onChangeFullname(event) {
    this.setState({ fullname: event.target.value });
  }
  onChangeResume(event) {
    console.log("Entering ....\n");
    let files = event.target.files;
    this.setState({ resume: files[0]},() =>
    {
      console.log("this.set.resume is :\n");
      console.log(this.state.resume);
    });
  }
  onChangeProfilePic(event) {
    console.log("Entering ....\n");
    let files = event.target.files;
    this.setState({ profilePic: files[0]},() =>
    {
      console.log("this.set.profilepic is :\n");
      console.log(this.state.profilePic);
    });
  }
  onChangeSkills(event) {
    this.setState({ skills: event.target.value });
  }
  onChangeBio(event) {
    this.setState({ bio: event.target.value });
  }

  

  onSubmit(e) {
    e.preventDefault();
    if((this.state.institution==='' && this.state.startyear!=='') || (this.state.institution==='' && this.state.endyear!=='') || (this.state.startyear==='' && this.state.endyear!=='')
     || isNaN(this.state.startyear) || (this.state.endyear !== "" && isNaN(this.state.endyear)) || (this.state.endyear !== "" && this.state.startyear !== "" && this.state.startyear > this.state.endyear))
    {
      alert("invalid inputs!");
      return;
    }
    console.log("before editing: ");

    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log("current user is\n");
    console.log(currentUser.user);
    var fd = new FormData();
    fd.append("username",currentUser.user.username);
    fd.append("resume",this.state.resume);

    var fd2 = new FormData();
    fd2.append("username",currentUser.user.username);
    fd2.append("profilePic",this.state.profilePic);

    console.log("lala\n");

    for (let [key, value] of fd) {
      console.log(`${key}: ${value}`)
    }

    fetch("http://localhost:4000/addResume",{
      method: 'POST',
      body:fd,
    })
    .then((res)=>{
      console.log(1);
    })
    .then((data)=>{
      console.log(data);
    });

    fetch("http://localhost:4000/addProfilePic",{
      method: 'POST',
      body:fd2,
    })
    .then((res)=>{
      console.log(1);
    })
    .then((data)=>{
      console.log(data);
    });

    this.setState({ 
      education: this.state.education.concat([{
        institution : this.state.institution,
        startyear: this.state.startyear,
        endyear: this.state.endyear
      }])
    });
    console.log("added");
    console.log(this.state.education);

    const newUser = {
        username: this.state.username,
        fullname: this.state.fullname,
        password: this.state.password,
        email: this.state.email,
        rating: this.state.rating,
        ratingCount: this.state.ratingCount,
        resume: this.state.resume,
        userid: this.state.userid,
        profileImage: this.state.profilePic,
        skills: this.state.skills,
        type: "applicant",
        institution: this.state.institution || " ",
        startyear: this.state.startyear || " ",
        endyear: this.state.endyear || " " 

    };

  var currentUser = JSON.parse(localStorage.getItem('currentUser'));
  axios.post("http://localhost:4000/editApplicant", newUser).then(res => {
    console.log("editing: ");
    console.log(newUser);
    if(res.data.v === 1)
      alert("This email-id has already been taken! Try with a different email-id.");
    else
      {
        console.log("received after edit = ")
        console.log(res.data);
        localStorage.setItem("currentUser",JSON.stringify(res.data));
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        alert("Profile Edited!");
        this.props.history.push("/applicantHome");
      }
  });

    this.setState({
        userid: currentUser.user._id,
        email: currentUser.user.email,
        username: currentUser.user.username,
        password: currentUser.user.password,
        fullname: currentUser.user.fullname,
        rating: currentUser.user.rating,
        ratingCount: currentUser.user.ratingCount,
        skills: "",
        resume: null,
        profilePic: null,
        type: "applicant",
        education: [],

      });
  }

  render() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    try{
      console.log(currentUser.user.username);
    }
    catch(err)
    {
      return "Please Login2"
    }
    if(currentUser.user.type !== 'applicant')
    {
      alert ("You are not permitted to view this page");
      return "Please Login3"
    }
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/applicantHome">HOME    </Nav.Link>
              <Navbar.Brand href="/applicantEditProfile">Edit Profile    </Navbar.Brand>
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
            <label>Skills: (Enter skills separated by Comma) </label>
            <input
              type="text"
              className="form-control"
              value={this.state.skills}
              onChange={this.onChangeSkills}
            />
          </div>
          
          <div className="form-group">
            <label>Add Education: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.institution}
              onChange={this.onChangeEducationInstitution}
              placeholder="Institution Name"
            />
            <input
              type="text"
              className="form-control"
              value={this.state.startyear}
              onChange={this.onChangeEducationStartYear}
              placeholder="Start Year"

            />
            <input
              type="text"
              className="form-control"
              value={this.state.endyear}
              onChange={this.onChangeEducationEndYear}
              placeholder="End Year"

            />
          </div>
          <br/>

          <div className="form-group">
            <label>Resume: </label>
            <input
              type="file"
              accept=".pdf"
              className="form-control"
              onChange={this.onChangeResume.bind(this)}
            />
          </div>

          <div className="form-group">
            <label>Profile Picture: </label>
            <input
              type="file"
              accept=".jpg , .jpeg , .png , .gif"
              className="form-control"
              onChange={this.onChangeProfilePic.bind(this)}
            />
          </div>

          <div className="form-group">
            
          </div>
          <div className="form-group">
            <input type="submit" value="Edit" className="btn btn-primary" />
          </div>
        </Form>
      </div>
    );
  }
}

