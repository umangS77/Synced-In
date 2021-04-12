import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

var currentUser = JSON.parse(localStorage.getItem('currentUser'));


export default class ApplicantMyApplications extends Component {
  constructor(props) {
      super(props);
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));

      this.state = { 
          applications: [] ,
          jobs: [],
          rating: ""
    };
      this.rateJob=this.rateJob.bind(this);
  }

    componentDidMount() {
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
    console.log("Arrived in view applications\n");

      const newUser = {
        username: currentUser.user.username,
        type: currentUser.user.type,
        userid: currentUser.user._id,
      };
      if(newUser.type!=="applicant")
      {
        alert("You do not have permission to access this page")
        this.props.history.push("/");
      }
      console.log(newUser);
      axios
        .post("http://localhost:4000/viewApplicantApplications", newUser)
        .then(response => {
            console.log("Got jobs");
            console.log(response.data);
          this.setState({ jobs: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    rateJob(event)
    {
      this.setState({rating: event.target.value});
    }

    onSubmit(e)
    {

      let req = {
        jobId: e.job._id,
        rating: this.state.rating,
        status: e.status
      };

      console.log(req.status);


      if(req.status !== 'Accepted')
      {
        alert("You cannot rate a job until you are accepted!")
        return;
      }

      axios
        .post("http://localhost:4000/giveJobRating", req)
        .then(response => {
            console.log(response.data);
            if(response.data === 3)
            {
              alert("Job Deleted!");

            }
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
    if(currentUser.user.type !== 'applicant')
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
              <Nav.Link href="/applicantHome">HOME    </Nav.Link>
              <Nav.Link href="/applicantEditProfile">Edit Profile    </Nav.Link>
              <Nav.Link href="/applicantSeeJobs">Active Job Listings    </Nav.Link>
              <Navbar.Brand href="/myApplications">My Applications    </Navbar.Brand>
            </Nav>
            <Nav>
                <Nav.Link href="/">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>        
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Date of Joining</th>
              <th>Salary</th>
              <th>Name of Recruitor</th>
              <th>Status</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {this.state.jobs.map((j, i) => {
                console.log("j is");
                console.log(j);
              return (
                <tr>
                  <td>{j.job.title}</td>
                  <td>{j.dateOfJoining}</td>
                  <td>{j.job.salary}</td>
                  <td>{j.job.recruitorName}</td>
                  <td>{j.status}</td>
                  <td>
                  <Form>
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max="5"
                      onChange={this.rateJob}
                    />
                    <input type="submit" value="Rate" className="btn btn-primary" onClick={()=>{this.onSubmit(j);}} />
                  </div>
                  </Form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}




