//Declare express and fs as well as port number


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

//call create db function
create_schedule_db();
//listening for requests
app.listen(port, () => {
    console.log('Listening on port ' + port);
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
    let returned_value = {};
    returned_value.subject = courseCode[0].subject;
    for (let i = 0; i < courseCode.length; i++) {
        returned_value["Course code " + (i + 1)] = courseCode[i].catalog_nbr;
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
    const course_code = course.filter(a => a.catalog_nbr.toString().toLowerCase() === req.sanitize(req.params.course_code.toString().toLowerCase()));
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
app.put('/api/schedule/:scheduleName', (req, res) => {
    let schedName = req.sanitize(req.params.scheduleName);
    for (let i = 0; i < db.getState().Schedule.length; i++) {
        if (db.getState().Schedule[i].schedule_name === schedName) {
            res.status(404).send("Name already exists");
            return;
        }
    }
    db.get('Schedule').push({schedule_name: schedName, subject: [], course_name: []}).write();
    res.status(200).send("Added");
});


//Task 5

app.put('/api/make/schedule/:scheduleName', (req, res) => {

    let schedName = req.sanitize(req.params.scheduleName);
    const schedule = req.body;
    let course = req.sanitize(schedule.catalog_nbr);
    let subject = req.sanitize(schedule.subject);
    let sanitizedCourse = JSON.parse(`"${course}"`);
    let sanitizedSubject = JSON.parse(`"${subject}"`);
    console.log(sanitizedSubject);
    console.log(sanitizedCourse);
    for (let i = 0; i < db.getState().Schedule.length; i++) {
        if (db.getState().Schedule[i].schedule_name === schedName) {
            for (let k = 0; k < db.getState().Schedule[i].course_name.length; k++) {
                if (db.getState().Schedule[i].course_name[k] == sanitizedCourse && db.getState().Schedule[i].subject[k] == sanitizedSubject) {
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

    res.status(404).send("Name does not exist");
});

//Task 6
app.get('/api/display/schedule/:scheduleName', (req, res) => {
    let schedName = req.sanitize(req.params.scheduleName);
    let showSched = {};
    for (let i = 0; i < db.getState().Schedule.length; i++) {
        if (db.getState().Schedule[i].schedule_name == schedName) {
            for (let k = 0; k < db.getState().Schedule[i].course_name.length; k++) {
                let showCourse = db.getState().Schedule[i].course_name[k];
                let showSubject = db.getState().Schedule[i].subject[k];
                const course = data.filter(a => a.subject.toString().toLowerCase() === req.sanitize(showSubject.toString().toLowerCase()));
                showSched[k] = course.filter(a => a.catalog_nbr.toString().toLowerCase() === req.sanitize(showCourse.toString().toLowerCase()));
            }
            res.send(showSched);i
            return;
        }
    }
    res.status(404).send("Schedule not found");
});

//Allow to remove schedule by name
app.post('/api/remove/schedule/:scheduleName', (req, res) => {
    let schedName = req.sanitize(req.params.scheduleName);
    for (let i = 0; i < db.getState().Schedule.length; i++) {
        if (db.getState().Schedule[i].schedule_name === schedName) {
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

//Task 9 Delete all schedules
app.post('/api/schedulelist', (req, res) => {
    for (let i = 0; i < db.getState().Schedule.length; i++) {
        db.set('Schedule', []).write();
        res.send("Reset schedule list");
    }
});












