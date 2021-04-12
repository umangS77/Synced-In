import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Popup from 'react-popup';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Fuse from 'fuse.js'
let applied=[]; 
let variant=[];

export default class ApplicantSeeJobs extends Component {
  constructor(props) {
      super(props);
      this.state = { 
        jobs: [],
        search:"",
        fuzzysearch:"",
        currentApplications:0,
        currentPositions: 0,
        rating: 0,
        duration: 0,
        deadline: "",
        type: "salary",
        filterType: "none",
        applied: [],
        variant: [],

        
        filterJobType:"none",
        filterMaxSalary:"10000000000",
        filterMinSalary:"0",
        filterDuration:"7"
      };

      this.sort=this.sort.bind(this);
      this.fuzzyMatch = this.fuzzyMatch.bind(this);
      this.revsort=this.revsort.bind(this);
      this.onChangeFilterMaxSalary = this.onChangeFilterMaxSalary.bind(this);
      this.onChangeFilterMinSalary= this.onChangeFilterMinSalary.bind(this);
      this.onChangeFilterDuration = this.onChangeFilterDuration.bind(this);
      this.onChangeFilterJobType = this.onChangeFilterJobType.bind(this);

      this.onChangeType = this.onChangeType.bind(this);

    }

    onChangeFilterDuration(event)
    {
      this.setState({filterDuration: event.target.value});
    }
    onChangeFilterJobType(event)
    {
      this.setState({filterJobType: event.target.value});
    }
    onChangeFilterMaxSalary(event)
    {
      if(!isNaN(event.target.value))
        this.setState({filterMaxSalary: event.target.value});
      else
      {
        alert('Incorrect Field Type! Max Salary should be a number');
      }
    }
    onChangeFilterMinSalary(event)
    {
      if(!isNaN(event.target.value))
        this.setState({filterMinSalary: event.target.value});
      else
      {
        alert('Incorrect Field Type! Min Salary should be a number');
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
    if(currentUser.user.type !== 'applicant')
    {
      alert ("You are not permitted to view this page");
      return "Please Login"
    }
    // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser.user.type !=="applicant")
    {
      alert("You do not have permission to access this page")
      this.props.history.push("/");
    }
    // console.log("Arriced in view jobs");
    axios
      .post("http://localhost:4000/applicantAllJobs")
      .then(response => {
          // console.log("jobs are:\n");
          this.setState({ jobs: response.data });
          for (let j in this.state.jobs)
          {
            // console.log(this.state.jobs[j]);
            let pp = 0;
            for(let a in this.state.jobs[j].applicants)
            {
              // console.log(applicants);
              if(this.state.jobs[j].applicants[a] === currentUser.user.username)
              {
                applied.push("Applied");
                variant.push("danger");
                pp = 1;
                break;
              }
              else if(this.state.jobs[j].maxApplications === this.state.jobs[j].currentApplications || 
                this.state.jobs[j].maxPositions === this.state.jobs[j].currentPositions)
              {
                applied.push("Full");
                variant.push("danger");
                pp = 1;
                break;
              }
            }
            if(pp === 0)
            {
              applied.push("Apply");
              variant.push("success");
            }
          }
          
          this.setState({ applied: applied });
          this.setState({ variant: variant});
      })
      .catch(function(error) {
        console.log(error);
      });
      console.log(this.state.jobs);


      
      
  }
  onChangeType(event) {
    this.setState({ type: event.target.value });
  }
  onchange = e =>{
    this.setState({search : e.target.value});
  }
  onchangeFuzzy = e =>{
    this.setState({fuzzysearch : e.target.value});
  }
  onChangeFilterType = e => {
    this.setState({ filterType: e.target.value});

  }
  sort=(s)=>{
    const t = {
      type:this.state.type
    };
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log("sending ",t.type)
    console.log("before sort");
    console.log(this.state.jobs);
    axios
      .post("http://localhost:4000/applicantSortJobs",t)
      .then(response => {
          this.setState({jobs:response.data});
          this.setState({applied: [], variant: []});

          console.log("After sort");
          console.log(this.state.jobs);
          applied=[]; 
          variant=[];
          for (let j in this.state.jobs)
          {
            let pp = 0;
            for(let a in this.state.jobs[j].applicants)
            {
              // console.log(applicants);
              if(this.state.jobs[j].applicants[a] === currentUser.user.username)
              {
                applied.push("Applied");
                variant.push("danger");
                pp = 1;
                break;
              }
              else if(this.state.jobs[j].maxApplications  === this.state.jobs[j].currentApplications || 
                this.state.jobs[j].maxPositions === this.state.jobs[j].currentPositions)
              {
                applied.push("Full");
                variant.push("danger");
                pp = 1;
                break;
              }
            }
            if(pp === 0)
            {
              applied.push("Apply");
              variant.push("success");
            }
          }

          
          
          this.setState({ applied: applied });
          this.setState({ variant: variant});
      })
      .catch(function(error) {
        console.log(error);
      });
  }


  revsort=(s)=>{
    const t = {
      type:this.state.type
    };
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    console.log("sending ",t.type)
    axios
      .post("http://localhost:4000/applicantRevSortJobs",t)
      .then(response => {
          this.setState({jobs:response.data});

          this.setState({applied: [], variant: []});
          applied=[]; 
          variant=[];
          for (let j in this.state.jobs)
          {
            let pp = 0;
            for(let a in this.state.jobs[j].applicants)
            {
              // console.log(applicants);
              if(this.state.jobs[j].applicants[a] === currentUser.user.username)
              {
                applied.push("Applied");
                variant.push("danger");
                pp = 1;
                break;
              }
              else if(this.state.jobs[j].maxApplications === this.state.jobs[j].currentApplications || 
                this.state.jobs[j].maxPositions === this.state.jobs[j].currentPositions)
              {
                applied.push("Full");
                variant.push("danger");
                pp = 1;
                break;
              }
            }
            if(pp === 0)
            {
              applied.push("Apply");
              variant.push("success");
            }
          }
          this.setState({ applied: applied });
          this.setState({ variant: variant});

      })
      .catch(function(error) {
        console.log(error);
      });
  }

  async applyForJob(e) {
  console.log("received");
  console.log(e.j);
  console.log(e.i)
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const application = {
        jobId: e.j._id,
        applicantId: currentUser.user._id,
        applicantName: currentUser.user.username,
        recruitorId: e.j.recruitorId,
        recruitorName: e.j.recruitorName,
        status: "applied",
        sop: ""
    };

    console.log(application);
    if(applied[e.i] === "Applied")
    {
      alert("You have already applied for this job!!");
      return;
    }
    if(applied[e.i] === "Full")
    {
      alert("Sorry! Max application limit reached");
      return;
    }

    let temp = {
      username : currentUser.user.username
    };
    let cnt = 0;
    axios
    .post("http://localhost:4000/getApplicationCount",temp)
    .then(res => {
        console.log("got application count as: ");
        console.log(res.data.v);
        cnt = res.data.v;
        if(cnt > 9)
        {
          alert("You have already 10 open applications!!");
          // this.props.history.push('/applicantHome');
        }
        else
        {
          application.sop = prompt("Enter your Statement of Purpose: ");
          axios
          .post("http://localhost:4000/checkApplication",application)
          .then(response => {
              if(response.data === 1)
              {
                  applied[e.i]="Applied";
                  variant[e.i]="danger";
                  this.setState({ applied : applied});
                  this.setState({ variant : variant});
                  alert("You have already applied for this job!!");
                  
              }
              else
              {
                  applied[e.i]="Applied";
                  variant[e.i]="danger";
                  this.setState({ applied : applied});
                  this.setState({ variant : variant});

                  alert("Applied Successfully");
              }
          })
          .catch(function(err)
          {
              console.log(err);
          });
        }
        
    })
    .catch(function(err)
    {
        console.log(err);
    });


    this.state = { 
      jobs: [],
      search:"",
      currentApplications:0,
      currentPositions: 0,
      rating: 0,
      duration: 0,
      deadline: "",
      type: "salary",
      filterType: "",
      applied
      
    };
    

}


fuzzyMatch(text, search)
{
  let temp = [text];
  const options = { includeScore: true};
  const fuse = new Fuse(temp, options);
  const result = fuse.search(search);
  console.log(result);
  if(result.length === 0)
  return false;
  if(result[0].score < 0.7)
  {
    return true;
  }
  return false;

}

  render() 
  {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    try{
      console.log();
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
              <Navbar.Brand href="/applicantSeeJobs">Active Job Listings    </Navbar.Brand>
              <Nav.Link href="/myApplications">My Applications    </Nav.Link>
            </Nav>
            </Navbar.Collapse>


            <Form.Group style={{paddingTop:15, paddingRight:15}}  controlId="exampleForm.ControlSelect1" value="none" onChange={this.onChangeType} inputRef={el => (this.inputEl = el)}>
              <Form.Control as="select">
                <option value="salary">Salary</option>
                <option value="duration">Duration</option>
                <option value="rating">Rating</option>
              </Form.Control>
             </Form.Group>
            <Button style={{marginRight:15}}  onClick={()=>{this.sort();}} variant="outline-info">Sort in Ascending</Button>
            <Button style={{marginRight:15}}  onClick={()=>{this.revsort();}} variant="outline-info">Sort in Descending</Button>

            <Nav>
                <Nav.Link style={{paddingLeft:15}} href="/">Logout</Nav.Link>
            </Nav>
            
        </Navbar>
        <br/>
        <br/>
        <h3>Search By Job Title: </h3>
        <Form inline>
              <FormControl type="text" placeholder="Simple Search" className="mr-sm-2" onChange={this.onchange}/>
        </Form>
        <Form inline>
              <FormControl type="text" placeholder="Fuzzy Search" className="mr-sm-2" onChange={this.onchangeFuzzy}/>
        </Form>
        <br/>
        <h3>Filter by: </h3>
        <Form.Group style={{paddingTop:15, paddingRight:15}}  controlId="exampleForm.ControlSelect1" value="none" onChange={this.onChangeFilterJobType} inputRef={el => (this.inputEl = el)}>
          <label>Job Type: </label>
          <Form.Control as="select">
            <option value="none">None</option>
            <option value="parttime">Part Time</option>
            <option value="fulltime">Full Time</option>
            <option value="wfh">Work From Home</option>
          </Form.Control>
        </Form.Group>

        <Form.Group style={{paddingTop:15, paddingRight:15}}  controlId="exampleForm.ControlSelect1" value="none" onChange={this.onChangeFilterDuration} inputRef={el => (this.inputEl = el)}>
          <label>Duration: </label>
          <Form.Control as="select">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7" selected>7</option>
          </Form.Control>
        </Form.Group>

        <div className="form-group mr-sm-2">
            <label>Salary : </label>
            <div class="col-xs-2">
            <input
              type="text"
              className="form-control"
              value={this.state.filterMinSalary}
              onChange={this.onChangeFilterMinSalary}
              placeholder="Min Salary"
              width="10"
            />
            </div>
            <input
              type="text"
              className="form-control"
              value={this.state.filterMaxSalary}
              onChange={this.onChangeFilterMaxSalary}
              placeholder="Max Salary"
              width="10"
            />
          </div>

        <br/>
        <h1>Jobs Available: </h1>        
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Recruitor Name</th>
              <th>Salary</th>
              <th>Job Rating</th>
              <th>Duration</th>
              <th>Deadline</th>
              <th>Apply</th>
            </tr>
          </thead>
          <tbody>
            {
            this.state.jobs.map((j, i) => {
              const {search}=this.state;
              const {fuzzysearch}=this.state;

              let temprating = 0;
              if(j.countRating !== 0 && j.countRating !== null)
                temprating = j.rating/j.countRating;

              if(search !== "" && j.title.toLowerCase().indexOf( search.toLowerCase() )=== -1 )
              {
                return null
              }
              if(fuzzysearch !== "" && !(this.fuzzyMatch(j.title.toLowerCase(), fuzzysearch.toLowerCase())))
              {
                // console.log(fuzzysearch);
                  return null
              }
              else if(j.salary < this.state.filterMinSalary || j.salary > this.state.filterMaxSalary)
              {
                return null
              }
              else if(this.state.filterJobType !== "none")
              {
                if(this.state.filterJobType !== j.type)
                {
                  return null
                }
              }
              else if(j.duration >= this.state.filterDuration)
              {
                return null
              }
              else 
              {
                var now = new Date();
                now.setHours(now.getHours() + 5); 
                now.setMinutes(now.getMinutes() + 30);
                var iso = now.toISOString();

                if(j.deadline < iso)
                  return null
              }
              return (
                <tr>
                  <td>{j.title}</td>
                  <td>{j.recruitorName}</td>
                  <td>{j.salary}</td>
                  <td>{temprating}</td>
                  <td>{j.duration}</td>
                  <td>{j.deadline}</td>

                  <td className="del-cell">
                      <Button variant={this.state.variant[i]} className="btn btn-primary" value="apply" onClick={()=>{this.applyForJob({j,i});}}>{ this.state.applied[i] }</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        <br/>
        <br/>
        <br/>
        <br/>

      </div>
    );
  }
}




