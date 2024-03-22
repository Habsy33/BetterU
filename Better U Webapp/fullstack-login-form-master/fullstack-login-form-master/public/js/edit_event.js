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
