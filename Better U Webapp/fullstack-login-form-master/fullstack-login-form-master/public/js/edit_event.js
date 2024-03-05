let isReminderSet = true; // Default state is true

function toggleReminder() {
    // Toggle the boolean value
    isReminderSet = !isReminderSet;

    // Update the button color based on the boolean value
    const reminderButton = document.querySelector('.reminder');
    reminderButton.style.backgroundColor = isReminderSet ? '#42BFC6' : '#FC5F3D';

    // Log the boolean value to the console
    console.log('Reminder Set:', isReminderSet);
}

function saveEvent() {
    // Get values from the input fields
    const title = document.querySelector('.text').value;
    const date = document.querySelector('.date').value;
    const time = document.querySelector('.time').value;
    const note = document.querySelector('.text.note').value;

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
        setReminder: isReminderSet
    };

    // Log the event object to the console
    console.log('Saved Event:', event);

    // Display an alert confirming that the event has been logged
    alert(`Event has been logged! The Reminder has been set: ${isReminderSet}`);
}

// Add the script tag to go back
function goBack() {
    // Go back to the previous page
    window.history.back();
}
