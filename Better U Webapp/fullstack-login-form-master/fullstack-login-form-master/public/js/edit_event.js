const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '.',
        database: 'loginforip3proj'
    }
});

function saveEvent() {
    // Get values from the input fields
    const titleInput = document.querySelector('.text');
    const dateInput = document.querySelector('.date');
    const timeInput = document.querySelector('.time');
    const noteInput = document.querySelector('.text.note');
    const priorityInputs = document.querySelectorAll('input[name="priority"]');

    const title = titleInput.value;
    const date = dateInput.value;
    const time = timeInput.value;
    const note = noteInput.value;
    // Get priority value
    const priority = document.querySelector('input[name="priority"]:checked')?.value;

    if (!title || !date || !note) {
        alert('Please fill in all required fields (title, date, and note) before saving.');
        return;
    }

    // Create a combined date and time string
    const dateTimeString = `${date} ${time}`;

    // Validate if the selected date and time are in the future
    const selectedDateTime = new Date(dateTimeString);
    const currentDateTime = new Date();

    if (selectedDateTime <= currentDateTime) {
        alert('Please select a future date and time.');
        return;
    }

    // Create an object to represent the event
    const event = {
        title: title,
        date: date,
        time: time,
        note: note,
        priority: priority || 'Not set', // Add priority to the event object
    };

    // Log the event object to the console
    console.log('Saved Event:', event);

    // Save the event data to the Reminders table
    db('Reminders')
        .insert({
            ReminderID: null, // Assuming ReminderID is auto-generated
            Date: date,
            ReminderName: title,
            Priority: priority,
            UserID: null, // You need to specify the user ID here
            Note: note
        })
        .then(() => {
            console.log('Event saved to the Reminders table.');
        })
        .catch(err => {
            console.error('Error saving event to the Reminders table:', err);
        });

    // Clear the form inputs
    titleInput.value = '';
    dateInput.value = '';
    timeInput.value = '';
    noteInput.value = '';
    priorityInputs.forEach(input => { input.checked = false; });

    // Display an alert confirming that the event has been saved
    alert(`Event has been saved!`);
}
