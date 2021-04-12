import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Navbar from 'react-bootstrap/Navbar'
import DateTimePicker from 'react-datetime-picker'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";


export default class RecruitorAddPost extends Component {
  constructor(props) {
    super(props);

    try {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.state = {
        title: "",
        jobid: "",
        recruitorId: currentUser.user._id,
        recruitorName: currentUser.user.username,
        applicants: [],
        maxApplications: "",
        requiredSkills : "",
        maxPositions: "",
        dateOfPosting: Date.now,
        deadline: "",
        duration: "0",
        salary: "",
        rating: "",
        countRating: "",
        type: "parttime"
    };

    

    this.onChangeJobTitle = this.onChangeJobTitle.bind(this);
    this.onChangeRequiredSkills = this.onChangeRequiredSkills.bind(this);
    this.onChangeType= this.onChangeType.bind(this);
    this.onChangeSalary= this.onChangeSalary.bind(this);
    this.onChangeDuration= this.onChangeDuration.bind(this);
    this.onChangeDeadline= this.onChangeDeadline.bind(this);
    this.onChangeMaxApplications= this.onChangeMaxApplications.bind(this);
    this.onChangeMaxPositions= this.onChangeMaxPositions.bind(this);
    



    this.onSubmit = this.onSubmit.bind(this);
  }
  catch(err)
  {
    return
  }
  }
  componentDidMount() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    try{
      console.log(currentUser.user);
    }
    catch(error){
      return " Please Login ";
    }
  
    console.log("rec == " + currentUser);
    console.log(currentUser.user);
    if(currentUser.user.type!=="recruitor")
    {
      alert("You do not have permission to access this page")
      this.props.history.push("/");
    }
    this.setState({ recruitorId: currentUser.user._id });
  }

  

  onChangeJobTitle(event) {
    this.setState({ title : event.target.value });
  }
  onChangeRequiredSkills(event) {
    this.setState({ requiredSkills: event.target.value });
  }
  onChangeType(event) {
    this.setState({ type: event.target.value });
  }
  onChangeSalary(event) {
    this.setState({ salary: event.target.value });
  }
  onChangeDuration(event) {
    this.setState({ duration: event.target.value });
  }
  onChangeMaxApplications(event) {
    this.setState({ maxApplications: event.target.value });
  }
  onChangeMaxPositions(event) {
    this.setState({ maxPositions: event.target.value });
  }
  onChangeDeadline(date) {
    console.log("value:\n");
    console.log(date);
    // date.setHours(date.getHours() + 5); 
    // date.setMinutes(date.getMinutes() + 30);
    this.setState({ deadline: date });
  }


  onSubmit(e) {
    e.preventDefault();

    const newJob = this.state;
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // console.log("sending job to server");
    // console.log(newJob);

    axios.post("http://localhost:4000/addJob", newJob).then(res => {
      if (res.data === 2) alert("Duplicate Product! Already exists");
      else if(res.data === 1) alert("Please enter required fields")
      else if(res.data === 3) alert("Incorrect field types!")
      else if(res.data === 5) alert("Numeric Values should be positive!")
      else 
      {
        alert("Job succesfully added!")
        // console.log(res.data);
        this.setState({duration : "0"});
        this.props.history.push("/recruitorActiveJobs");
      }

    });

    this.setState({
        title: "",
        recruitorId: currentUser.user._id,
        applicants: [],
        maxApplications: "",
        requiredSkills : "",
        maxPositions: "",
        dateOfPosting: "",
        deadline: "",
        duration: "0",
        salary: "",
        rating: "",
        countRating: "",
        type: "parttime",
        recruitorName: currentUser.user.fullname,

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
              <Nav.Link href="/recruitorEditProfile">Edit Profile    </Nav.Link>
              <Navbar.Brand href="/recruitorPostJob">Post a Job    </Navbar.Brand>
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
        <h1>Add New Job!</h1>
        
        <Form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Job Title: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.title}
              onChange={this.onChangeJobTitle}
            />
          </div>
          <div className="form-group">
            <label>Required Skill Sets: (Enter comma seperated options)</label>
            <input
              type="text"
              className="form-control"
              value={this.state.requiredSkills}
              onChange={this.onChangeRequiredSkills}
            />
          </div>
          <Form.Group
            controlId="exampleForm.ControlSelect1"
            value={this.state.type}
            onChange={this.onChangeType}
            inputRef={el => (this.inputEl = el)}
          >
            <Form.Label>Job Type</Form.Label>
            <Form.Control as="select">
              <option value="parttime">Part Time</option>
              <option value="fulltime">Full Time</option>
              <option value="wfh">Work From Home</option>
            </Form.Control>
          </Form.Group>
          <div className="form-group">
            <label>Salary: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.salary}
              onChange={this.onChangeSalary}
            />
          </div>
          <div className="form-group">
            <Form.Group
            controlId="exampleForm.ControlSelect1"
            value={this.state.duration}
            onChange={this.onChangeDuration}
            inputRef={el => (this.inputEl = el)}
            >
            <Form.Label>Duration: </Form.Label>
            <Form.Control as="select">
              <option value="0">0 (Indefinite)</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </Form.Control>
          </Form.Group>
          </div>
          <div className="form-group">
            <label>DeadLine : </label>
            <DateTimePicker
              value={this.state.deadline}
              onChange={this.onChangeDeadline}
            />
          </div>
          <div className="form-group">
            <label>Max number of  Applications: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.maxApplications}
              onChange={this.onChangeMaxApplications}
            />
          </div>
          <div className="form-group">
            <label>Max number of Positions: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.maxPositions}
              onChange={this.onChangeMaxPositions}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Post Job" className="btn btn-primary" />
          </div>
        </Form>
      </div>
    );
  }
}
