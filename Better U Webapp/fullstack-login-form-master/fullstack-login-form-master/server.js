const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '.',
        database: 'loginforip3proj'
    }
})

const app = express();

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(intialPath, "index.html"));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(intialPath, "login.html"));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(intialPath, "register.html"));
})

app.post('/register-user', (req, res) => {
    const { name, email, password } = req.body;

    if(!name.length || !email.length || !password.length){
        res.json('fill all the fields');
    } else{
        db("users").insert({
            name: name,
            email: email,
            password: password
        })
        .returning(["name", "email"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            if(err.detail.includes('already exists')){
                res.json('email already exists');
            }
        })
    }
})

app.post('/login-user', (req, res) => {
    const { email, password } = req.body;

    db.select('name', 'email')
    .from('users')
    .where({
        email: email,
        password: password
    })
    .then(data => {
        if(data.length){
            res.json(data[0]);
        } else{
            res.json('email or password is incorrect');
        }
    })
})

app.post('/edit-event', (req, res) => {
    const { id, reminderId, date, remindername, priority, note } = req.body;
    console.log("Received data:", req.body);

    // Assuming you have logic to generate or handle reminderId, etc.
    // Replace the placeholder logic with your actual database operation
    db('reminders').insert({
        // Make sure these column names match your table's column names
        id: id,
        reminderid: reminderId,
        date: date,
        remindername: remindername,
        priority: priority,
        note: note
    })
    .returning('*')
    .then(response => {
        console.log("Database response:", response);
        res.json({ success: true, message: "Reminder added successfully", data: response });
    })
    .catch(err => {
        console.error("Database error:", err);
        res.status(500).json({ success: false, message: "Error adding reminder", error: err });
    });
});


app.post('/edit-event', (req, res) => {
    res.json({success: true, message: "Route is working"});
});

app.listen(3000, (req, res) => {
    console.log('listening on port 3000......')
})