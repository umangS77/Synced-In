import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import UsersList from './components/allusers'
import Register from './components/register'
import Login from './components/login'
import recruitorHome from './components/recruitorHome'
import applicantHome from './components/applicantHome'
import recruitorEditProfile from './components/recruitorEditProfile'
import applicantEditProfile from './components/applicantEditProfile'
import recruitorPostJob from './components/recruitorPostJob'
import recruitorActiveJobs from './components/recruitorActiveJobs'
import recruitorEditJob from './components/recruitorEditJob'
import applicantSeeJobs from './components/applicantSeeJobs'
import applicantMyApplications from './components/applicantMyApplications'
import recruitorViewApplication from './components/recruitorViewApplication'
import recruitorMyApplicants from './components/recruitorMyApplicants'


import Home from './components/homepage'


function App() {
  return (
    <Router>
      <div className="container">
        <br/>
        <Route path="/" exact component={Home}/>
        <Route path="/allusers" exact component={UsersList}/>
        <Route path="/register" component={Register}/>
        <Route path="/login" component={Login}/>
        <Route path="/recruitorHome" component={recruitorHome}/>
        <Route path="/applicantHome" component={applicantHome}/>
        <Route path="/recruitorEditProfile" component={recruitorEditProfile}/>
        <Route path="/applicantEditProfile" component={applicantEditProfile}/>
        <Route path="/recruitorPostJob" component={recruitorPostJob}/>
        <Route path="/recruitorActiveJobs" component={recruitorActiveJobs}/>
        <Route path="/recruitorEditJob" component={recruitorEditJob}/>
        <Route path="/applicantSeeJobs" component={applicantSeeJobs}/>
        <Route path="/myApplications" component={applicantMyApplications}/>
        <Route path="/recruitorViewApplication" component={recruitorViewApplication}/>
        <Route path="/recruitorAcceptedApplicants" component={recruitorMyApplicants}/>

        



      </div>
    </Router>
  );
}

export default App;
