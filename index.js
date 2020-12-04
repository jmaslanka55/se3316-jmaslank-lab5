//Declare express and fs as well as port number


const jwt = require('jsonwebtoken');
var stringSimilarity = require('string-similarity');
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
//Read timetable file into data variable
const data1 = fs.readFileSync('./Lab3-timetable-data.json');
const data = JSON.parse(data1.toString());
//Declare express sanitizer for input sanitization
const expressSanitizer = require('express-sanitizer');
app.use(express.json());
app.use(expressSanitizer());
//Use static folder for front end
app.use('/', express.static('static'));
//LowDB
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const adapterUser = new FileSync('dbUser.json');
const dbUser = low(adapterUser);

const cors = require('cors');
app.use(cors());
app.get('/api/', (req, res) => {
    res.send(data)
});


//creates schedule database
function create_schedule_db() {
    db.defaults({
        Schedule: []
    }).write();
}

function create_user_db() {
    dbUser.defaults({
        Users: []
    }).write();
}

//call create db function
create_schedule_db();
create_user_db();
//listening for requests
app.listen(port, () => {
    console.log('Listening on port ' + port);
});
//JWT Authentication Method
const accessTokenSecret = 'JmaslankSecretCode1234';
const authenticateJWT = (req, res) => {
    const authHeader = req.headers.Authorization;
    const token = authHeader.split(' ')[1];
    if (authHeader.exp) {
        console.log("expired");
    }
    let verification = jwt.verify(token, accessTokenSecret, (err) => {
        if (err) {
            return 404;
        } else {
            return 101;
        }
    });
    return verification;
};
//Method to handle log ins
app.post('/api/login', (req, res) => {
    const logData = req.body;
    let email = req.sanitize(logData.emailaddress);
    let passcode = req.sanitize(logData.passcode);
    for (let i = 0; i < dbUser.getState().Users.length; i++) {
        if (dbUser.getState().Users[i].emailaddress === email) {
            if (dbUser.getState().Users[i].password === passcode) {
                if (dbUser.getState().Users[i].accountStatus.toLowerCase() === "deactivated") {
                    res.json({message: "deactivated"});
                    return;
                }
                const accessToken = jwt.sign({
                    emailAddress: email,
                    userPassword: passcode
                }, accessTokenSecret, {expiresIn: "100s"});
                res.json({accessToken, message: "success"});
                console.log("logged in");
                return;
            }
        }
    }
    res.json({message: 'Username or password incorrect'});
});

//Method to create a new user and add them to the User database
app.put('/api/users', (req, res) => {
    let userData = req.body;
    let userName = req.sanitize(userData.name);
    let email = req.sanitize(userData.email);
    let passcode = req.sanitize(userData.finalPassword);
    for (let i = 0; i < dbUser.getState().Users.length; i++) {
        if (dbUser.getState().Users[i].emailaddress === email) {
            res.json({message: "Email already registered"});
            return;
        }
    }
    dbUser.get('Users').push({
        userName: userName,
        emailaddress: email,
        password: passcode,
        accountStatus: "Active"
    }).write();
    dbUser.update('Users').write();
    res.json({message: "Account created"});

});


//TASK 1
function get_subject_classname() {
    let returned_value = {};
    //loop through data and store subject and classname in array to be returned
    for (let i = 0; i < data.length; i++) {
        returned_value["Subject code " + (i + 1)] = data[i].subject;
        returned_value["className " + (i + 1)] = data[i].className;
    }
    //return array
    return returned_value;
}

//get request for subjects
app.get('/api/subject', (req, res) => {

    res.send(get_subject_classname());

});

//Task 2
function get_coursecode(courseCode) {
    let returned_value = [];
    returned_value.subject = courseCode[0].subject;
    for (let i = 0; i < courseCode.length; i++) {
        returned_value.push(courseCode[i].catalog_nbr);
    }

    return returned_value;
}

app.get('/api/courses/:subject_code', (req, res) => {
    const course = data.filter(a => a.subject.toString().toLowerCase() === req.sanitize(req.params.subject_code.toString().toLowerCase()));
    if (course === undefined || course.length == 0) res.status(404).send("Subject with code " + req.sanitize(req.params.subject_code) + " was not found ");
    res.send(get_coursecode(course));

});

//TASK 3

app.get('/api/timetable/:subjectCode/:course_code/:course_component?', (req, res) => {
    const course = data.filter(a => a.subject.toString().toLowerCase() === req.sanitize(req.params.subjectCode.toString().toLowerCase()));
    const course_code = course.filter(a => a.catalog_nbr.toString().toLowerCase().includes(req.sanitize(req.params.course_code.toString().toLowerCase())));
    if (course === undefined || course.length == 0 || course_code === undefined || course_code.length == 0) {
        res.status(404).send("Subject with code " + req.sanitize(req.params.subjectCode) + " code " + req.sanitize(req.params.course_code) + " does not exist");
    } else {
        if (course_code.filter(a => a.course_info[0].ssr_component.toString().toLowerCase() === req.sanitize(req.params.course_component))) {
            res.send(course_code);
        } else {
            res.send(course_code);
        }
    }
});

//task 4
app.put('/api/schedule/:scheduleName/:auth_token', (req, res) => {
    const token = req.sanitize(req.params.auth_token);
    const jsonToken = JSON.parse(token);
    if (authenticateJWT(jsonToken) == 101) {
        let schedName = req.sanitize(req.params.scheduleName);
        for (let i = 0; i < db.getState().Schedule.length; i++) {
            if (db.getState().Schedule[i].schedule_name === schedName) {
                res.status(404).send("Name already exists");
                return;
            }
        }
        db.get('Schedule').push({
            schedule_name: schedName,
            description: [],
            subject: [],
            course_name: [],
            visibility: "private"
        }).write();
        res.status(200).send();
    } else {
        res.json({message: "failed"});
    }
});


//Task 5

app.put('/api/make/schedule/:scheduleName/:auth_token', (req, res) => {
    const token = req.sanitize(req.params.auth_token);
    const jsonToken = JSON.parse(token);
    if (authenticateJWT(jsonToken) == 101) {
        let schedName = req.sanitize(req.params.scheduleName);
        const schedule = req.body;
        let course = req.sanitize(schedule.catalog_nbr);
        let subject = req.sanitize(schedule.subject);
        let sanitizedCourse = JSON.parse(`"${course}"`);
        let sanitizedSubject = JSON.parse(`"${subject}"`);

        for (let i = 0; i < db.getState().Schedule.length; i++) {
            if (db.getState().Schedule[i].schedule_name.toUpperCase() === schedName.toUpperCase()) {
                for (let k = 0; k < db.getState().Schedule[i].course_name.length; k++) {
                    if (db.getState().Schedule[i].course_name[k].toUpperCase() === sanitizedCourse.toUpperCase() && db.getState().Schedule[i].subject[k].toUpperCase() === sanitizedSubject.toUpperCase()) {
                        db.getState().Schedule[i].course_name[k] = sanitizedCourse;
                        db.getState().Schedule[i].subject[k] = sanitizedSubject;
                        db.update('Schedule').write();
                        res.status(200).send("Overwrite");
                        return;
                    }
                }
                db.getState().Schedule[i].course_name.push(sanitizedCourse);
                db.getState().Schedule[i].subject.push(sanitizedSubject);
                db.update('Schedule').write();
                res.status(200).send("Added");
                return;
            }
        }
    } else {
        res.json({message: "failed"});
    }

});

app.put('/api/make/description/:schedName/:auth_token', (req, res) => {
    const token = req.sanitize(req.params.auth_token);
    const jsonToken = JSON.parse(token);
    if (authenticateJWT(jsonToken) === 101) {
        const desc = req.body;
        let descrip = req.sanitize(desc.description);
        let sanitizeDesc = JSON.parse(`"${descrip}"`);
        let schedName = req.sanitize(req.params.schedName);
        for (let i = 0; i < db.getState().Schedule.length; i++) {
            if (db.getState().Schedule[i].schedule_name.toUpperCase() === schedName.toUpperCase()) {
                db.getState().Schedule[i].description = sanitizeDesc;
                db.update('Schedule').write();
                res.status(200).send("added")
                return;
            }
        }
    }
});
app.post(`/api/set/public/:schedName/:auth_token`, (req,res)=>{
    const token = req.sanitize(req.params.auth_token);
    const jsonToken = JSON.parse(token);
    if (authenticateJWT(jsonToken) === 101) {
        let schedName = req.sanitize(req.params.schedName);
        for (let i = 0; i < db.getState().Schedule.length; i++) {
            if (db.getState().Schedule[i].schedule_name.toUpperCase() === schedName.toUpperCase()){
                db.getState().Schedule[i].visibility = "Public";
                db.update('Schedule').write();
                res.status(200).send("set public")
                return;
            }
        }

    }
});

//Task 6
app.get('/api/display/schedule/:scheduleName', (req, res) => {
    let schedName = req.sanitize(req.params.scheduleName);
    let showSched = [];
    for (let i = 0; i < db.getState().Schedule.length; i++) {
        if (db.getState().Schedule[i].schedule_name.toUpperCase() === schedName.toUpperCase()) {
            for (let k = 0; k < db.getState().Schedule[i].course_name.length; k++) {
                let showCourse = db.getState().Schedule[i].course_name[k];
                let showSubject = db.getState().Schedule[i].subject[k];
                const course = data.filter(a => a.subject.toString().toLowerCase() === req.sanitize(showSubject.toString().toLowerCase()));
                const final = course.filter(a => a.catalog_nbr.toString().toUpperCase() === req.sanitize(showCourse.toString().toUpperCase()));
                showSched.push(final);
            }
            res.send(showSched);
            return;
        }
    }
    res.status(404).send("Schedule not found");
});

//Allow to remove schedule by name
app.post('/api/remove/schedule/:scheduleName', (req, res) => {
    let schedName = req.sanitize(req.params.scheduleName);
    for (let i = 0; i < db.getState().Schedule.length; i++) {
        if (db.getState().Schedule[i].schedule_name.toUpperCase() === schedName.toUpperCase()) {
            schedName = db.getState().Schedule[i].schedule_name;
            db.get('Schedule').remove({schedule_name: schedName}).write();
            res.status(200).send("deleted");
            return;
        }
    }
    res.status(404).send("does not exist");
});
//get list of all schedule names (Task 8)
app.get('/api/show/schedule', (req, res) => {
    let schedList = [];
    for (let i = 0; i < db.getState().Schedule.length; i++) {
        if (db.getState().Schedule[i].course_name.length > 0) {
            schedList.push(`Schedule Name: ${db.getState().Schedule[i].schedule_name} Amount of courses: ${db.getState().Schedule[i].course_name.length}`);
        } else {
            schedList.push(`Schedule Name: ${db.getState().Schedule[i].schedule_name} Amount of courses: 0`)
        }
    }
    res.send(schedList);
});




//Search Courses by keywords

app.get(`/api/courses/keyword/:search`, (req, res) => {
    let namearr = [];
    let codearr = [];
    let resultarr = [];
    let keySearch = req.sanitize(req.params.search);
    for (let i = 0; i < data.length; i++) {
        namearr[i] = JSON.stringify(data[i].className);
        codearr[i] = JSON.stringify(data[i].catalog_nbr);
    }

    for (let j = 0; j < data.length; j++) {
        if (stringSimilarity.compareTwoStrings(keySearch.toUpperCase(), namearr[j]) > 0.60) {
            resultarr.push(data[j]);
            console.log(stringSimilarity.compareTwoStrings(keySearch.toUpperCase(), namearr[j]));
        }
        if (stringSimilarity.compareTwoStrings(keySearch, codearr[j]) > 0.44) {
            resultarr.push(data[j]);
            console.log(stringSimilarity.compareTwoStrings(keySearch, codearr[j]));
        }
    }
    console.log(resultarr);
    res.send(resultarr);
});









