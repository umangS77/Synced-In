import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

var currentUser = JSON.parse(localStorage.getItem('currentUser'));


export default class RecruitorActiveJobs extends Component {
  constructor(props) {
      super(props);
    // var currentUser = JSON.parse(localStorage.getItem('currentUser'));

      this.state = { jobs: [] };
      this.deleteJob=this.deleteJob.bind(this);
      this.editJob=this.editJob.bind(this);
    }


  
    componentDidMount() {
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
      const newUser = {
        username: currentUser.user.username,
        type: currentUser.user.type,
        userid: currentUser.user._id,
      };
      if(newUser.type!=="recruitor")
      {
        alert("You do not have permission to access this page")
        this.props.history.push("/");
      }
      axios
        .post("http://localhost:4000/viewRecruitorJobs", newUser)
        .then(response => {
          this.setState({ jobs: response.data });
          console.log(this.state.jobs);
        })
        .catch(function(error) {
          console.log(error);
        });
    }


  deleteJob(job_id) {
    console.log(job_id)
    const newJob = {
      id: job_id,
      recruitorId: currentUser.user._id,
    };
    axios
      .post("http://localhost:4000/deleteRecruitorJob", newJob)
      .then(response => {
        console.log("Deleted")
        this.componentDidMount()
      })
      .catch(function(error) {
        console.log(error);
      });
  }


  editJob(j) {

    localStorage.setItem("currentJobId",j);
    this.props.history.push("/recruitorEditJob");
  }

  viewApplicants(j) {

    localStorage.setItem("currentJobId",j);
    this.props.history.push("/recruitorViewApplication");
    
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
        
        <h1>{currentUser.user.fullname}'s Jobs</h1>
        
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Date of Posting</th>
              <th>Number of Applicants</th>
              <th>Remaining number of Positions</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>View Applicants</th>
            </tr>
          </thead>
          <tbody>
            {this.state.jobs.map((j, i) => {

              let remp = j.maxPositions - j.currentPositions;
              if(remp === 0)
              {
                return null
              }
              return (
                <tr>
                  <td>{j.title}</td>
                  <td>{j.dateOfPosting}</td>
                  <td>{j.currentApplications}</td>
                  <td>{remp}</td>
                  <td className="del-cell">
                  <Button variant="blue" className="btn btn-primary" value="Edit" onClick={()=>{this.editJob(j._id);}}>Edit</Button>
                  </td>
                  <td className="del-cell">
                  <Button variant="danger" className="btn btn-primary" value="Delete" onClick={()=>{this.deleteJob(j._id);}}>Delete</Button>
                  </td>
                  <td className="del-cell">
                  <Button variant="success" className="btn btn-primary" value="ViewApplicants" onClick={()=>{this.viewApplicants(j._id);}}>View Applicants</Button>
                  
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




