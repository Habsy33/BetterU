document.addEventListener('DOMContentLoaded', function () {
    const workoutTypeInput = document.getElementById('workoutType');
    const workoutDurationInput = document.getElementById('workoutDuration');
    const saveWorkoutButton = document.getElementById('saveWorkout');
    const historyList = document.getElementById('historyList');

    saveWorkoutButton.addEventListener('click', saveWorkout);

    displayWorkoutHistory();

    function saveWorkout() {
        const workoutType = workoutTypeInput.value;
        const workoutDuration = parseInt(workoutDurationInput.value);

        if (!isNaN(workoutDuration) && workoutDuration > 0) {
            const workout = {
                type: workoutType,
                duration: workoutDuration,
                date: new Date().toLocaleString()
            };

            // Retrieve existing workouts from local storage
            const existingWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];

            // Add the new workout
            existingWorkouts.push(workout);

            // Save the updated workouts to local storage
            localStorage.setItem('workouts', JSON.stringify(existingWorkouts));

            // Display the updated workout history
            displayWorkoutHistory();

            // Clear input fields
            workoutTypeInput.value = 'cardio';
            workoutDurationInput.value = '';
        } else {
            alert('Please enter a valid workout duration.');
        }
    }

    function displayWorkoutHistory() {
        // Retrieve workouts from local storage
        const workouts = JSON.parse(localStorage.getItem('workouts')) || [];

        // Clear existing history list
        historyList.innerHTML = '';

        // Display each workout in the history list
        workouts.forEach(workout => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${workout.type}</strong> - ${workout.duration} minutes (${workout.date})`;
            historyList.appendChild(listItem);
        });
    }
});
