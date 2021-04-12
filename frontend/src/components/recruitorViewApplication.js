import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import emailjs from 'emailjs-com';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

var currentUser = JSON.parse(localStorage.getItem('currentUser'));

let applicantsArr = [];

export default class recruitorViewApplications extends Component {
  constructor(props) {
      super(props);
    // var currentUser = JSON.parse(localStorage.getItem('currentUser'));

      this.state = {
          message: '',
          email: '',
          applicants: [],
          type: "fullname",
          loc: "",
          rating: ''
    };

    this.sort = this.sort.bind(this);
    this.revsort = this.revsort.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onDownload = this.onDownload.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
}


sendEmail() {

  var temp = {
    email: this.state.email,
    message: this.state.message,
  };

  emailjs.send('service_nlnssjj', 'template_31lv3j9', temp, 'user_6Yp2VKdKwwrZza6R7MJTH')
    .then((result) => {
        console.log(result.text);
    }, (error) => {
        console.log(error.text);
    });
}


  onChangeType(event)
  {
    this.setState({ type: event.target.value });
  }

  onDownload(event)
  {
      try {
        window.open(require(('../resume/' + event + '.pdf')));
      }
      catch{
        alert("No Resume Uploaded!");
        this.componentDidMount();
      }
  }

  onClickAccept(event)
  {
    const tp = {
      applicationId: event
    };
    axios
        .post("http://localhost:4000/recruitorAcceptApplicant", tp)
        .then(response => {
          // console.log(response.data);
          if(response.data.v === 1)
          {
            alert("Applicant Shortlisted!!");
            this.componentDidMount();
          }
          else if(response.data.v === 2)
          {
            this.setState({message: ("Your application for job " +response.data.jobtitle +  " is accepted by recruitor " + currentUser.user.fullname + ".")});
            this.setState({email: response.data.applicantEmail});
            this.sendEmail();
            alert("Applicant Accepted! Email Sent!");
            this.componentDidMount();

          }
        });
  }


  


  onClickReject(event)
  {
    const tp = {
      applicationId: event
    };

    axios
        .post("http://localhost:4000/recruitorRejectApplicant", tp)
        .then(response => {
          // console.log(response.data);

          if(response.data === 1)
          {
            alert("Applicant Rejected!!");
            this.componentDidMount();
          }
        });
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

     applicantsArr = [];

      axios
        .post("http://localhost:4000/recruitorViewApplications", newUser)
        .then(response => {
            // console.log("Got applications");
            // console.log(response.data);
          res = response.data;

          for( let r in res)
          {
            let temprating = 0;
            if(res[r].user.ratingCount !== 0)
              temprating = res[r].user.rating/res[r].user.ratingCount;
              
            applicantsArr.push({
              applicationId: res[r].application._id,
              applicantId: res[r].application.applicantId,
              fullname: res[r].user.fullname,
              sop: res[r].application.sop,
              dateOfApplication: res[r].application.dateOfApplication,
              status: res[r].application.status,
              skills: res[r].user.skills,
              username: res[r].user.username,
              rating: temprating,

            })

            console.log(res[r].application._id);
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
      axios
        .post("http://localhost:4000/recruitorSortApplications",temp)
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
      axios
        .post("http://localhost:4000/recruitorRevSortApplications",temp)
        .then(response => {
            this.setState({applicants:response.data});
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
              <Navbar.Brand href="/recruitorActiveJobs">Active Listings    </Navbar.Brand>
              <Nav.Link href="/recruitorAcceptedApplicants">My Employees   </Nav.Link>
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
            <Form.Label>Sort Type: </Form.Label>
            <Form.Control as="select">
              <option value="fullname">Name</option>
              <option value="dateOfApplication">Date of Application</option>
              <option value="rating">Rating</option>

            </Form.Control>
          </Form.Group>
            <Button style={{marginRight:15}}  onClick={()=>{this.sort();}} variant="outline-info">Sort in Ascending</Button>
            <Button style={{marginRight:15}}  onClick={()=>{this.revsort();}} variant="outline-info">Sort in Descending</Button>
        
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Skills</th>
              <th>Date of Appication</th>
              <th>Education</th>
              <th>Statement of Purpose</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Resume</th>
              <th>Shortlist/Accept</th>
              <th>Reject</th>
            </tr>
          </thead>
          <tbody>
            {this.state.applicants.map((j, i) => {
                console.log("j is");
                console.log(j);
                let tempstat;
                if(j.status === "Applied")
                  tempstat = "Shortlist";
                else
                  tempstat = "Accept"

              return (
                <tr>
                  <td>{j.fullname}</td>
                  <td>{j.skills}</td>
                  <td>{j.dateOfApplication}</td>
                  <th>
                    <div id="foo">

                    </div>
                  </th>
                  <td>{j.sop}</td>
                  <td>{j.rating}</td>
                  <td>{j.status}</td>

                  <td className="del-cell">
                  <Button variant="blue" className="btn btn-primary" value={j.username} onClick={()=>{this.onDownload(j.username);}}>Resume</Button>
                  </td>
                  <td className="del-cell">
                  <Button variant="success" className="btn btn-primary" value={j.username} onClick={()=>{this.onClickAccept(j.applicationId);}}>{tempstat}</Button>
                  </td>
                  <td className="del-cell">
                  <Button variant="danger" className="btn btn-primary" value={j.username} onClick={()=>{this.onClickReject(j.applicationId);}}>Reject</Button>
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




