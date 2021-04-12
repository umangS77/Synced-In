const axios = require('axios');
const express = require("express");
const fileUpload = require("express-fileupload");
const mailer = require('express-mailer')


const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 4000;
const Routes = express.Router();

mongoose.set('useCreateIndex', true);

let User = require("./models/user");
let Jobs = require("./models/jobs");
let Applications = require("./models/applications");

app.use(express.static('./public'));
app.use(fileUpload());
app.use(cors());
app.use(bodyParser.json());


mongoose.connect("mongodb://127.0.0.1:27017/SyncedIn", { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, });
const connection = mongoose.connection;
connection.once("open", function() {
    console.log("MongoDB connection succesful.");
});



// home
Routes.route("/").get(function(req, res) {
    User.find(function(err, users) {
        if (err)
            console.log(err);
        else {
            console.log(users);
            res.json(users);
        }
    });
});

// login 
Routes.route("/login").post(function(req, res) {
    console.log("Here");
    console.log(req.body);
    let response = {
        val: "",
        user: {},
    };
    if (!req.body.username || !req.body.password) {
        response.val = 0;
        res.json(response);
    } else {
        User.findOne({ username: req.body.username }, function(err, users) {
            if (err)
                console.log(err);
            else
            {
                if (!users)
                {
                    //Not found username
                    User.findOne({ email: req.body.username }, function(err, users2) 
                    {
                        if (err)
                            console.log(err);
                        else
                        {
                            // not found email
                            if (!users2)
                            {
                                console.log("Not registered");
                                response.val = 1;
                                res.json(response);
                            } 
                            else 
                            {
                                users2.comparePassword(req.body.password, function(err, isMatch)
                                {
                                    if (err) throw err;
                                    // console.log(req.body.password, isMatch);
                                    if (isMatch)
                                    {
                                        currentuser = req.body.username;
                                        response.user = users2;
                                        response.val = 3;
                                        res.json(response);
                                        console.log("loginid = "+users2._id);
                                        
                                    } 
                                    else
                                    {
                                        response.val = 2;
                                        res.json(response);
                                    }
                                });
                            }
                        }
                    });
                }
                else 
                {
                    users.comparePassword(req.body.password, function(err, isMatch) {
                        if (err) throw err;
                        // console.log(req.body.password, isMatch);
                        if (isMatch) {
                            currentuser = req.body.username;
                            response.user = users;
                            response.val = 3;
                            res.json(response);
                            console.log("loginid = "+users._id);
                            
                        } else {
                            response.val = 2;
                            res.json(response);
                        }
                    });
                }
            }
        });
    }
    // console.log("in server", response);
});

// register user
Routes.route("/add").post(function(req, res) {
    // console.log(req);
    let response = {
        v:'',
        user: {

        },
    };
    let user = new User(req.body);
    response.user = req.body;
    
    User.findOne({ email: req.body.email }, async function(err, users) {
        if (err)
            console.log(err);
        else {
            if (!users) {
                console.log("Adding");
                User.findOne({username: req.body.username }, async function(err,users2) {
                    if(err)
                        console.log(err);
                    else
                    {
                        if(!users2)
                        {
                            console.log("New user");
                            user.save()
                                .then(user3 => {
                                    // response.user = req.body;
                                    // console.log(req.body);
                                    response.v = "2";

                                    console.log("Added\n");
                                    // console.log(user);
                                    response.user = user;



                                    User.findOneAndUpdate({_id:user._id},
                                        {
                                            $set:{
                                                userid: user._id,
                                            }
                                        },
                                        {returnOriginal: false},
                                        async (err,doc) => {
                                            if(err)
                                                console.log(err);
                                            else
                                            {
                                                console.log("setted userid");
                                                response.user = doc;
                                                
                                            }
                                        },
                                    );
                                    console.log("respnse is:\n");
                                    console.log(response);
                                    res.json(response);

                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(400).send("Error");
                                });
                        }
                        else
                        {
                            console.log("found duplicate username");
                                response.v = 3;
                                res.json(response);
                        }
                    }
                })
            } 
            else
                {
                    response.v = 1;
                    res.json(response);
                }
        }
    });
});


/*           RECRUITER FUNCTIONS              */


// check for recruitor
Routes.route("/recruitor").post(function(req, res) {
    User.findOne({ email: req.body.email }, function(err, users) {
        if (err)
            console.log(err);
        else {
            if (!users) {
                //Not found
                console.log("Not registered");
                res.send("1");
            } else {
                console.log("detail=" + users.bio);
                res.json(users);
            }
        }
    });
});

// edit Details of recruiter

Routes.route("/editRecruiter").post(function(req, res) {
        let response = {
            v:'',
            user: {

            },
        };
        var edited = {
            userid: req.body.userid,
            username: req.body.username,
            email: req.body.email,
            fullname: req.body.fullname,
            password: req.body.password,
            bio: req.body.bio,
            contactNumber: req.body.contactNumber,
            type: "recruitor"
        }

        response.user = edited;
        response.v = 2;
        let t=0;
        if(edited.contactNumber !== "" && isNaN(edited.contactNumber))
        {
            response.v = 3;
            t=1;
        }

        console.log("to edit to:\n");
        console.log(edited);
        if(t===0)
        {
            User.find({email: edited.email}, (err, results) => {
            console.log("result: \n");
            console.log(results);
            if (err)
                console.log(err);
            else 
            {
                if(results.length === 0)
                {
                    response.v = 2;
                    User.findOneAndUpdate({username:edited.username},
                        {
                            $set:{
                                email: edited.email,
                                fullname: edited.fullname,
                                bio: edited.bio,
                                contactNumber: edited.contactNumber,
                            }
                        },
                        {returnOriginal: false},
                        (err,doc) => {
                            if(err)
                                console.log(err);
                            else
                            {
                                console.log(doc);
                                console.log("\nnew email\n");
                                
                            }
                        },
                    );
                    // res.json(response);
                }
                else if(results.length === 1 && (results[0].username === edited.username))
                    {
                        response.v = 2;
                        User.findOneAndUpdate({username:edited.username},
                            {
                                $set:{
                                    email: edited.email,
                                    fullname: edited.fullname,
                                    bio: edited.bio,
                                    contactNumber: edited.contactNumber,
                                }
                            },
                            {returnOriginal: false},
                            (err,doc) => {
                                if(err)
                                    console.log(err);
                                else
                                {
                                    console.log(doc);
                                    console.log("\nsame email\n");
                                    
                                }
                            },
                        );
                        // res.json(response);
                    }
                else
                {
                    response.v = 1;
                    console.log("\ncannot edit\n");
                    res.json(response);
                }

                if(response.v === 2)
                {
                    console.log("finally edited to :\n");
                    console.log(response.user);
                    res.json(response);
                }
            }
        });
        console.log("v= " + response.v);
    }
    else
    {
        res.json(response);
    }
    // let user = new User(req.body);
    // User.findOneAndUpdate({ email: req.body.email },req,)
});


// add a job by recruitor
Routes.route("/addJob").post(function(req, res) {
    let jobs = new Jobs(req.body);
    var now = new Date();
    now.setHours(now.getHours() + 5); 
    now.setMinutes(now.getMinutes() + 30);
    jobs.dateOfPosting = now;

    now = jobs.deadline;
    now.setHours(now.getHours() + 5); 
    now.setMinutes(now.getMinutes() + 30);
    deadline = now;




    console.log("entered:\n");
    console.log(jobs);
    if(!req.body.title
        || !req.body.salary 
        || !req.body.duration 
        || !req.body.deadline 
        || !req.body.maxApplications 
        || !req.body.maxPositions  
        || !req.body.requiredSkills )
    {
        // console.log("entered:\n");
        // console.log(jobs);
        res.send("1");
    }
    else if(isNaN(req.body.salary) || isNaN(req.body.duration) || isNaN(req.body.maxApplications)
    || isNaN(req.body.maxPositions))
    {
        res.send("3");
    }
    else if(req.body.salary < 0 || req.body.duration < 0 || req.body.maxApplications < 0 || req.body.maxPositions < 0)
    {
        res.send("5");
    }
    else{
        jobs.save()
        .then(jobs => {
            console.log("Saved:\n");
            // jobs.jobid = jobs._id;
            console.log(jobs);
            res.status(200).json({ Jobs: "Job posted successfully!" });
        })
        .catch(err => { 
            console.log(err);
            res.status(400).send("Error"); 
        });
    } 
});



// recruiter can view jobs listed by them

Routes.route("/viewRecruitorJobs").post(function(req, res) {
    console.log("In view ");
    console.log(req.body);
    
    Jobs.find({ recruitorName: req.body.username }, function(err, j) {
        if (err)
            console.log(err);
        else {
            if (!j.length) {
                //Not found
                console.log("No Jobs");
                res.json(j);
            } 
            else {
                console.log(j);
                res.json(j);
            }
        }
    });
});


Routes.route("/getJob").post(function(req, res) {
    console.log("\n\narrived: \n\n")
    console.log(req.body.jobid);
    Jobs.find({_id:req.body.jobid} , function(err, j) {
        if (err)
            console.log(err);
        else {
            if (!j.length) {
                //Not found
                console.log("No Jobs");
                res.send("1");
            } 
            else {
                console.log("Sending job:\n");
                console.log(j);
                res.json(j);
            }
        }
    });
});


// recruitor can delete jobs

Routes.route("/deleteRecruitorJob").post( async function(req, res) {
    let id = req.body.id;
    Jobs.findById(id, async function(err, job) {
        if(err)
            console.log(err);
        else{
            let v = await Applications.deleteMany({jobId : id});
            v = await Jobs.deleteOne(job, function(err, obj) {
                if (err) throw err;
                else 
                {
                    console.log("job deleted is:  ", job);
                    res.json(job);
                }
            });
        }
    });
});

Routes.route("/editRecruitorJob").post(function(req, res) {
    let id = req.body._id;
    console.log("job to edit to is\n");
    console.log(req.body);
    var newvalues = { $set: { maxApplications: req.body.maxApplications,
        maxPositions: req.body.maxPositions,
        deadline: req.body.deadline }};
    Jobs.findByIdAndUpdate(req.body._id,newvalues, 
    function(err, job) {
        if(err)
        {
            console.log(err);
            res.send("1");
        }
        else{
            console.log("Final edited job is: \n");
            console.log(job);
            res.send("2");
        }
    });
});

Routes.route("/recruitorMyApplicants").post(async function(req,res) {
    const recruitor = req.body;
    
    let apps = await Applications.find({recruitorName: recruitor.username, status:"Accepted"});

    let response = [];
    for(ap in apps)
    {
        let applicant = await User.find({username: apps[ap].applicantName});

        let job = await Jobs.find({_id: apps[ap].jobId});
        console.log(applicant);
        console.log(job);
        let temp = {
            applicantUsername: applicant[0].username,
            applicantName: applicant[0].fullname,
            dateOfJoining: apps[ap].dateOfJoining,
            type: job[0].type,
            title: job[0].title,
            rating: applicant[0].rating,
            ratingCount: applicant[0].ratingCount,
        };

        if(temp.type === 'parttime')
        {
            temp.type = 'Part Time';
        }
        else if(temp.type === 'fulltime')
        {
            temp.type = 'Full Time';
        }
        else
        {
            temp.type = 'Work From Home';
        }

        response.push(temp);
    }
    console.log("response is:\n");
    console.log(response);
    res.json(response);

})


Routes.route("/recruitorAcceptApplicant").post(async function(req,res) {
    let response = {
        v : 1,
        applicantEmail : '',
        jobtitle: ""
    };
    let app = await Applications.find({_id: req.body.applicationId});
    console.log("got");
    console.log(app[0].stage);
    if(app[0].stage === 1)
    {
        Applications.findByIdAndUpdate(req.body.applicationId,
            {status: "ShortListed", stage:2}, function(err,docs) {
                if(err)
                    console.log(err);
                else
                {
                    console.log("Updated:\n");
                    console.log(docs);
                }
            });
    }
    else
    {
        var now = new Date();
        now.setHours(now.getHours() + 5); 
        now.setMinutes(now.getMinutes() + 30);
        let temp = now.toISOString();
        console.log(temp);
        let appli;
        appli = await Applications.findByIdAndUpdate(req.body.applicationId,{ status: "Accepted", dateOfJoining: temp });
        console.log(appli);
        let receiver;
        try {
           receiver  = await User.find({username: appli.applicantName});
        }
        catch(err){
            console.log(err);
        }

        let job;
        try {
           job  = await Jobs.find({_id : appli.jobId});
        }
        catch(err){
            console.log(err);
        }

        let k = job[0].currentPositions + 1;

        appli = await Jobs.findByIdAndUpdate(job[0]._id,{ currentPositions: k });


        response.v = 2;
        response.applicantEmail = receiver[0].email;
        response.jobtitle = job[0].title;
    }
    
        res.json(response);
})

Routes.route("/recruitorRejectApplicant").post(async function(req,res) {
    Applications.findByIdAndUpdate(req.body.applicationId,
        {status: "Rejected"}, function(err,docs) {
            if(err)
                console.log(err);
            else
            {
                console.log("Updated:\n");
                console.log(docs);
            }
        });
        res.send("1");
})






















/*               APPLICANT FUNTIONS              */

Routes.route("/addResume").post(function(req,res) {
    var resumeFile = req.files.resume;
    var loc = '../frontend/src/resume/' + req.body.username + '.pdf';
    resumeFile.mv(loc, function(err) {
        if(err)
            console.log(err);
        else
        {
            console.log("Save successful");
            res.send(loc);
        }
    });
})


Routes.route("/addProfilePic").post(function(req,res) {
    var picture = req.files.profilePic;
    var loc = '../frontend/src/images/' + req.body.username;
    picture.mv(loc, function(err) {
        if(err)
            console.log(err);
        else
        {
            console.log("Save successful");
            res.send(loc);
        }
    });
})


Routes.route("/viewApplicantApplications").post(async function(req, res) {
    console.log("In view ");
    var vp = [];
    // let tp = await Applications.find({status: "Applied"});
    // console.log(tp);
    Applications.find({ applicantName: req.body.username }, async function(err, apl) {
        if (err)
            console.log(err);
        else {
            if (!apl.length) {
                console.log("No Jobs");
                res.json(apl);
            } 
            else {
                for (ap in apl)
                {
                    let job = await Jobs.findById(apl[ap].jobId);
                    let kp = {
                        job: job,
                        status: apl[ap].status,
                        dateOfJoining: apl[ap].dateOfJoining
                    }
                    vp.push(kp);
                }
                // console.log("vp is :\n");
                console.log(vp);

                res.json(vp);
            }
        }
    });
});

Routes.route("/recruitorViewApplications").post( async function(req,res) {

    let response = [];
    console.log("received request\n");
    console.log(req.body);
    console.log("\n\n");

    let apps = await Applications.find({recruitorName: req.body.username, jobId: req.body.jobId});
    // console.log(apps);
    for(ap in apps)
    {
        console.log("\n\nv");
        console.log(apps[ap]);
        let users = await User.find({username: apps[ap].applicantName});
        console.log("found user is:\n");
        console.log(users);
        let applications = await apps[ap];
        if(apps[ap].status !== "Rejected")
        {
            let k = await response.push({user: users[0], application: applications});
        }
    }
    console.log("Sending");
    // console.log(response);
    res.json(response);
});


Routes.route("/giveJobRating").post(async function(req, res) {
    console.log("In rating view ");
    console.log(req.body);
    let j = await Jobs.find({_id: req.body.jobId});
    if(!j)
    {
        console.log("error");
        res.send(3);
    }

    if(j[0].rating === null)
        j[0].rating = 0;

    j[0].rating = parseInt(j[0].rating) + parseInt(req.body.rating);
    j[0].countRating = j[0].countRating + 1;

    // console.log('rating = ' + j[0].rating);

    try
    {
    let p = await Jobs.findByIdAndUpdate(j[0]._id, 
        {
            rating: j[0].rating,
            countRating: j[0].countRating
        });
    p = await Jobs.find({_id: j[0]._id})
    // console.log(p[0]);
        res.send("1");
    }
    catch(error)
    {
        console.log(error);
        res.send("0");

    }
});

Routes.route("/giveApplicantRating").post(async function(req, res) {
    console.log("In rating view ");
    console.log(req.body);
    let j = await User.find({username: req.body.username});
    if(!j)
    {
        console.log("error");
        res.send(3);
    }

    if(j[0].rating === null)
        j[0].rating = 0;

    j[0].rating = parseInt(j[0].rating) + parseInt(req.body.rating);
    j[0].ratingCount = j[0].ratingCount + 1;

    console.log('rating = ' + j[0].rating);

    try
    {
    let p = await User.findByIdAndUpdate(j[0]._id, 
        {
            rating: j[0].rating,
            ratingCount: j[0].ratingCount
        });
    p = await User.find({_id: j[0]._id})
    console.log(p[0]);
        res.send("1");
    }
    catch(error)
    {
        console.log(error);
        res.send("0");
    }
});



Routes.route("/editApplicant").post(function(req, res) {
    let response = {
        v:'',
        user: {},
    };
    var edited = {
        userid: req.body.userid,
        username: req.body.username,
        email: req.body.email,
        fullname: req.body.fullname,
        password: req.body.password,
        skills:req.body.skills,
        resume:req.body.resume,
        profileImage:req.body.profileImage,
        rating:req.body.rating,
        ratingCount:req.body.ratingCount,
        type: "applicant",
        rating: req.body.rating,
        countRating: req.body.countRating,
        education: {
            institution : req.body.institution,
            startyear : req.body.startyear,
            endyear: req.body.endyear
        }
    }

    console.log(req.body);

    response.user = edited;
    response.v = 2;

    console.log("to edit to:\n");
    console.log(edited);

    User.find({email: edited.email}, (err, results) => {
        console.log("result: \n");
        console.log(results);
        if (err)
            console.log(err);
        else 
        {
            if(results.length === 0)
            {
                response.v = 2;
                User.findOneAndUpdate({username:edited.username},
                    {
                        $set:{
                            email: edited.email,
                            fullname: edited.fullname,
                            skills:edited.skills,
                            resume:edited.resume,
                            profileImage:edited.profileImage,
                        },
                        $push:{
                            education: edited.education
                        }

                    },
                    {returnOriginal: false},
                    (err,doc) => {
                        if(err)
                            console.log(err);
                        else
                        {
                            console.log(doc);
                            console.log("\nnew email\n");
                            
                        }
                    },
                );
                // res.json(response);
            }
            else if(results.length === 1 && (results[0].username === edited.username))
                {
                    response.v = 2;
                    User.findOneAndUpdate({username:edited.username},
                        {
                            $set:{
                                email: edited.email,
                                fullname: edited.fullname,
                                skills:edited.skills,
                                resume:edited.resume,
                                profileImage:edited.profileImage,
                            },
                            $push:{
                                education: edited.education
                            }
                        },
                        {returnOriginal: false},
                        (err,doc) => {
                            if(err)
                                console.log(err);
                            else
                            {
                                console.log(doc);
                                console.log("\nnew email\n");
                                
                            }
                        },
                    );
                    // res.json(response);
                }
            else
            {
                response.v = 1;
                console.log("\ncannot edit\n");
                res.json(response);
            }

            if(response.v === 2)
            {
                res.json(response);
            }
        }
    });
    console.log("v= " + response.v);

});

Routes.route("/recruitorSortApplicants").post(function(req, res) {
    let s=req.body.type;
    // console.log(s);
    let myData = req.body.applicants;
    console.log("before sorting: ");
    console.log(myData);

    if(s==="fullname")
    {   
        myData.sort((a,b) => {
            // console.log(a.applicantName);
            // console.log(b.applicantName);
            return a.applicantName > b.applicantName;
        });
    }
    else if(s === "dateOfJoining")
    {
        myData.sort((a,b) => {
            // console.log(a.dateOfJoining);
            // console.log(b.dateOfJoining);
            return a.dateOfJoining > b.dateOfJoining;
        });
    }
    else if(s === "rating")
    {
        myData.sort((a,b) => {
            if(a.ratingCount === 0)
                return true;
            if(b.ratingCount === 0)
                return true;
            return (a.rating/a.ratingCount) > (b.rating/b.ratingCount);
        });
    }
    else
    {
        myData.sort((a,b) => {
            // console.log(a.title);
            // console.log(b.title);
            return a.title > b.title;
        });
    }
    console.log("after sorting: ");

    console.log(myData);

    res.json(myData);
});

Routes.route("/recruitorRevSortApplicants").post(function(req, res) {
    let s=req.body.type;
    // console.log(s);
    let myData = req.body.applicants;
    console.log("before sorting: ");
    console.log(myData);

    if(s==="fullname")
    {   
        myData.sort((a,b) => {
            // console.log(a.applicantName);
            // console.log(b.applicantName);
            return a.applicantName < b.applicantName;
        });
    }
    else if(s === "dateOfJoining")
    {
        myData.sort((a,b) => {
            // console.log(a.dateOfJoining);
            // console.log(b.dateOfJoining);
            return a.dateOfJoining < b.dateOfJoining;
        });
    }
    else if(s === "rating")
    {
        myData.sort((a,b) => {
            if(a.ratingCount === 0)
                return true;
            if(b.ratingCount === 0)
                return true;
            return (a.rating/a.ratingCount) < (b.rating/b.ratingCount);
        });
    }
    else
    {
        myData.sort((a,b) => {
            // console.log(a.title);
            // console.log(b.title);
            return a.title < b.title;
        });
    }
    console.log("after sorting: ");

    console.log(myData);

    res.json(myData);
});



Routes.route("/recruitorSortApplications").post(function(req, res) {
    let s=req.body.type;
    // console.log(s);
    let myData = req.body.applicants;
    console.log("before sorting2: ");
    console.log(myData);

    if(s==="fullname")
    {   
        myData.sort((a,b) => {
            // console.log(a.applicantName);
            // console.log(b.applicantName);
            return a.fullname > b.fullname;
        });
    }
    else if(s === "dateOfApplication")
    {
        myData.sort((a,b) => {
            // console.log(a.dateOfJoining);
            // console.log(b.dateOfJoining);
            return a.dateOfApplication > b.dateOfApplication;
        });
    }
    else if(s === "rating")
    {
        myData.sort((a,b) => {
            
            return a.rating > b.rating;
        });
    }
    console.log("after sorting2: ");

    console.log(myData);

    res.json(myData);
});

Routes.route("/recruitorRevSortApplications").post(function(req, res) {
    let s=req.body.type;
    // console.log(s);
    let myData = req.body.applicants;
    console.log("before sorting2: ");
    console.log(myData);

    if(s==="fullname")
    {   
        myData.sort((a,b) => {
            // console.log(a.applicantName);
            // console.log(b.applicantName);
            return a.fullname < b.fullname;
        });
    }
    else if(s === "dateOfApplication")
    {
        myData.sort((a,b) => {
            // console.log(a.dateOfJoining);
            // console.log(b.dateOfJoining);
            return a.dateOfApplication < b.dateOfApplication;
        });
    }
    else if(s === "rating")
    {
        myData.sort((a,b) => {
            
            return a.rating < b.rating;
        });
    }
    console.log("after sorting2: ");

    console.log(myData);

    res.json(myData);
});


Routes.route("/applicantSortJobs").post(function(req, res) {
    let s=req.body.type
    if(!req.body.type)
    {   
        console.log("default")
        s="salary"
    }
    else
        console.log(s)
        // var mysort = {s:1};
        Jobs.find({}).sort(s).exec(function(err, p) {
            if (err)
                console.log(err);
            else {
                console.log("\nsorted\n");
                console.log(p);
                
                res.json(p);
            }
        });
});

Routes.route("/applicantRevSortJobs").post(function(req, res) {
    let s=req.body.type;
    var mysort = {s:-1};
    if(req.body.type==="salary")
    {   
        mysort = {salary: -1};
    }
    else if(req.body.type==="rating")
    {
        mysort = {rating: -1};
    }
    else
    {
        mysort = {duration: -1};
    }
        console.log(s)
        
        Jobs.find({}).sort(mysort).exec(function(err, p) {
            if (err)
                console.log(err);
            else {
                console.log(p);
                res.json(p);
            }
        });
});


Routes.route("/applicantAllJobs").post(function(req,res) {
    let p = req.body;
    Jobs.find({} , function(err, j) {
        if (err)
            console.log(err);
        else {
            if (!j.length) {
                //Not found
                console.log("No Jobs");
                res.json(j);
            } 
            else {
                console.log("Sending job:\n");
                console.log(j);
                res.json(j);
            }
        }
    });
});

Routes.route("/getApplicationCount").post( async function(req,res) {
    
    let tp = {
        v:''
    };
    let apps = [];
    apps = await Applications.find({applicantName : req.body.username, status: "Applied"});
    apps.push({});
    let apps2 = [];
    apps2 = await Applications.find({applicantName : req.body.username, status: "ShortListed"});
    apps2.push({});
    console.log(apps.length);
    console.log(apps2.length);
    console.log("Application count:\n");
    
    console.log(apps2.length + apps.length - 2);
    tp.v = apps2.length + apps.length - 2;
    res.json(tp);
});


Routes.route("/checkApplication").post( async function(req,res) {
    // let p = req.body;
    console.log("Received job id: " + req.body.jobId);
    Applications.find({applicantName: req.body.applicantName, jobId: req.body.jobId}, function(err,j) {
        if(err)
            console.log(err);
        else
        {
            if(j.length > 0)
            {
                console.log("Already applied");
                res.send("1");
            }
            else
            {
                let tpdate = new Date()
                tpdate.setHours(tpdate.getHours() + 5); 
                tpdate.setMinutes(tpdate.getMinutes() + 30);
                req.body.dateOfPosting = tpdate;
                let application = new Applications(req.body);
                application.status = "Applied";
                application.save()
                    .then(async function(err,applications) {
                        console.log("Saved:\n");
                        console.log(applications);
                            Jobs.findOneAndUpdate({_id:req.body.jobId},
                                {
                                    $push:{
                                        applicants: req.body.applicantName
                                    }
                                },
                                {returnOriginal: false},
                                (err,doc) => {
                                    if(err)
                                        console.log(err);
                                    else
                                    {
                                        console.log("setted applicants");
                                        console.log(doc);
                                    }
                                },
                            );
                            let j = await Jobs.find({_id:req.body.jobId});
                            j[0].currentApplications = j[0].currentApplications + 1;
                            Jobs.findOneAndUpdate({_id:req.body.jobId},
                                {
                                    currentApplications : j[0].currentApplications
                                },
                                {returnOriginal: false},
                                (err,doc) => {
                                    if(err)
                                        console.log(err);
                                    else
                                    {
                                        console.log("setted applicants");
                                        console.log(doc);
                                    }
                                },
                            );
                            
                        res.send("2")
                        })
                    // })
                    .catch(err => { 
                        console.log(err);
                        res.status(400).send("Error"); 
                    });
            }
        }
    })
})

// Getting a user by id
Routes.route("/:id").get(function(req, res) {
    let id = req.params.id;
    User.findById(id, function(err, user) {
        res.json(user);
    });
});

Routes.route("/recruitor").post(function(req, res) {
    User.findOne({ email: req.body.email }, function(err, users) {
        if (err)
            console.log(err);
        else {
            if (!users) {
                //Not found
                console.log("Not registered");
                res.send("1");
            } else {
                

                console.log("detail=" + users.bio);
                res.json(users);
            }
        }
    });
});

Routes.route("/applicant").post(function(req, res) {
    User.findOne({ email: req.body.email }, function(err, users) {
        if (err)
            console.log(err);
        else {
            if (!users) {
                //Not found
                console.log("Not registered");
                res.send("1");
            } else {
                res.json(users);
            }
        }
    });
});




app.use("/", Routes);

app.listen(PORT, function() {
    console.log("Server is running on port: " + PORT);
});


