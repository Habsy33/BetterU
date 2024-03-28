function saveEvent() {
    // Get values from the input fields
    const titleInput = document.querySelector('.text');
    const dateInput = document.querySelector('.date');
    const timeInput = document.querySelector('.time');
    const noteInput = document.querySelector('.text.note');
    const priorityInputs = document.querySelectorAll('input[name="priority"]');
    const userId = 5;

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
        id: userId,
        reminderId: 1,
        date: date,
        remindername:title,
        priority: priority,
        note: note
    };

// Replace the console.log with this fetch request
fetch('/add-event', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
})
.then(response => response.json())
.then(data => {
    console.log('Success:', data);
    alert(`Event has been saved!`); // You can keep or modify this alert based on response
    // Clear form or redirect user here if desired
})
.catch((error) => {
    console.error('Error:', error);
});



    // Log the event object to the console
    console.log('Saved Event:', event);

    // Clear the form inputs
    titleInput.value = '';
    dateInput.value = '';
    timeInput.value = '';
    noteInput.value = '';
    priorityInputs.forEach(input => { input.checked = false; });

    // Display an alert confirming that the event has been saved
    alert(`Event has been saved!`);
}

function goBack() {
    // Go back to the previous page
    window.history.back();
}

window.onload = function() {
    console.log('Page loaded.');
};
