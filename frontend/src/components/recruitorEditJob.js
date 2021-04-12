import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Navbar from 'react-bootstrap/Navbar'
import DateTimePicker from 'react-datetime-picker'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

var currentUser = JSON.parse(localStorage.getItem('currentUser'));
var currentJobId = localStorage.getItem('currentJobId');
var currentJob;
export default class RecruitorEditJob extends Component {
  constructor(props) {
    super(props);
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(currentUser.user.type !== 'recruitor')
    {
      return
    }

    try
    {
    var currentJobId = localStorage.getItem('currentJobId');

    this.state = {
        maxApplications: "",
        maxPositions: "",
        deadline: "",
        title:"",
    };
    this.onChangeDeadline= this.onChangeDeadline.bind(this);
    this.onChangeMaxApplications= this.onChangeMaxApplications.bind(this);
    this.onChangeMaxPositions= this.onChangeMaxPositions.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    const job = {
        jobid: currentJobId,
        recruitorId: currentUser.user._id
    };
    axios
        .post("http://localhost:4000/getJob", job)
        .then(response => {
            console.log("response is:\n");
            console.log(response.data);
            if(response.data === 1)
            {
                alert("Error!!");
                this.props.history.push("/");
            }
            else
            {
                console.log("found job: ");
                currentJob = response.data[0];
            }
            console.log(currentJob);
            this.setState({ title: currentJob.title});
          });
        }
        catch(err)
        {
          return
        }
  }


  componentDidMount() 
  {
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
    // var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log("current jobid:\n");
    console.log(currentJobId);
    if(currentUser.user.type!=="recruitor")
    {
      alert("You do not have permission to access this page")
      // return
      this.props.history.push("/");
    }

    
  }


  onChangeMaxApplications(event) {
    this.setState({ maxApplications: event.target.value });
  }
  onChangeMaxPositions(event) {
    this.setState({ maxPositions: event.target.value });
  }
  onChangeDeadline(date) {
    this.setState({ deadline: date });

}


  onSubmit(e) {
    e.preventDefault();
    const newJob = currentJob;
    
    // console.log("sending job to server");
    // console.log(newJob);

    if(this.state.deadline === "" || this.state.maxApplications === "" || this.state.maxPositions==="")
    {
        alert("Input all fields!!");
    }
    else if(isNaN(this.state.maxPositions) || isNaN(this.state.maxApplications))
    {
        alert("Incorrect input format!!");
    }
    else
    {
        newJob.deadline=this.state.deadline;
        newJob.maxApplications=this.state.maxApplications;
        newJob.maxPositions=this.state.maxPositions;

        axios
        .post("http://localhost:4000/editRecruitorJob", newJob)
        .then(response => {
            if(response.data === "1")
                alert("Error in editing job");
            else
            {
                alert("Job edited!");
                this.props.history.push("/recruitorHome");
            }
                
        })
        .catch(function(error) {
            console.log(error);
        });

        this.setState ({
            job: {}
        });
    }

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
              <Nav.Link href="/recruitorPostJob">Post a Job    </Nav.Link>
              <Navbar.Brand href="/recruitorActiveJobs">Active Listings    </Navbar.Brand>
              <Nav.Link href="/recruitorAcceptedApplicants">My Employees    </Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link href="/">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <br/>
        <br/>
    <h1>Edit Job {this.state.title}!</h1>
        
        <Form onSubmit={this.onSubmit}>
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
            <input type="submit" value="Edit Job" className="btn btn-primary" />
          </div>
        </Form>
      </div>
    );
  }
}
