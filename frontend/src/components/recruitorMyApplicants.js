import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

var currentUser = JSON.parse(localStorage.getItem('currentUser'));

let applicantsArr = [];
export default class RecruitorMyApplicants extends Component {
  constructor(props) {
      super(props);
    // var currentUser = JSON.parse(localStorage.getItem('currentUser'));

      this.state = { 
          applicants: [],
          rating:'',
          type: 'fullname'
          
    };

    this.sort = this.sort.bind(this);
    this.revsort = this.revsort.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.rateApplicant = this.rateApplicant.bind(this);

}



  onChangeType(event)
  {
    this.setState({ type: event.target.value });
  }

  rateApplicant(event)
  {
    this.setState({rating: event.target.value})
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
      // var currentUser = JSON.parse(localStorage.getItem('currentUser'));
      // console.log(currentUser.user);
      const newUser = {
        username: currentUser.user.username,
        type: currentUser.user.type,
        userid: currentUser.user._id,
        jobId: localStorage.getItem("currentJobId"),
      };
      if(newUser.type!=="recruitor")
      {
        alert("You do not have permission to access this page")
        this.props.history.push("/");
      }
      let res;
      axios
        .post("http://localhost:4000/recruitorMyApplicants", newUser)
        .then(response => {
            console.log("Got applications");
            console.log(response.data);
          res = response.data;

          for( let r in res)
          {
            applicantsArr.push({
                applicantUsername: res[r].applicantUsername,
                applicantName: res[r].applicantName,
                dateOfJoining: res[r].dateOfJoining,
                type: res[r].type,
                title: res[r].title,
                rating: res[r].rating,
                ratingCount: res[r].ratingCount
            })
          }

      this.setState({applicants: applicantsArr});
        })
        .catch(function(error) {
          console.log(error);
        });

    }

    sort()
    {
      let temp = {
        type:this.state.type,
        applicants: this.state.applicants
      };
      console.log("sending ");
      console.log(this.state.applicants);
      axios
        .post("http://localhost:4000/recruitorSortApplicants",temp)
        .then(response => {
            this.setState({applicants:response.data});
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  
  
    revsort()
    {
      let temp = {
        type:this.state.type,
        applicants: this.state.applicants
      };
      console.log("sending ");
      console.log(this.state.type);
      axios
        .post("http://localhost:4000/recruitorRevSortApplicants",temp)
        .then(response => {
            this.setState({applicants:response.data});
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    onSubmit(e)
    {
      let req = {
        username: e.applicantUsername,
        rating: this.state.rating,
      };

      axios
        .post("http://localhost:4000/giveApplicantRating", req)
        .then(response => {
            console.log(response.data);
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
              <Nav.Link href="/recruitorHome">HOME    </Nav.Link>
              <Nav.Link href="/recruitorEditProfile">Edit Profile    </Nav.Link>
              <Nav.Link href="/recruitorPostJob">Post a Job    </Nav.Link>
              <Nav.Link href="/recruitorActiveJobs">Active Listings    </Nav.Link>
              <Navbar.Brand href="/recruitorAcceptedApplicants">My Employees    </Navbar.Brand>
            </Nav>
            <Nav>
                <Nav.Link href="/">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Form.Group
            controlId="exampleForm.ControlSelect1"
            value={this.state.type}
            onChange={this.onChangeType}
            inputRef={el => (this.inputEl = el)}
          >
            <Form.Label>Sort Type</Form.Label>
            <Form.Control as="select">
              <option value="fullname" selected>Name</option>
              <option value="jobTitle">Job Title</option>
              <option value="dateOfJoining">Date of Joining</option>
              <option value="rating">Rating</option>

            </Form.Control>
          </Form.Group>
          <Button style={{marginRight:15}}  onClick={()=>{this.sort();}} variant="outline-info">Sort in Ascending</Button>
          <Button style={{marginRight:15}}  onClick={()=>{this.revsort();}} variant="outline-info">Sort in Descending</Button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Joining</th>
              <th>Job Type</th>
              <th>Job Title</th>
              <th>Rating</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {this.state.applicants.map((j, i) => {
              let rating = "Not Rated";
              if(j.ratingCount != 0)
                rating = j.rating / j.ratingCount;
              return (
                <tr>
                  <td>{j.applicantName}</td>
                  <td>{j.dateOfJoining}</td>
                  <td>{j.type}</td>
                  <td>{j.title}</td>
                  <td>{rating}</td>
                  <td>
                  <Form>
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max="5"
                      onChange={this.rateApplicant}
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


