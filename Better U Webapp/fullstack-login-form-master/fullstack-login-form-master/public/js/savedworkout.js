// saved_workouts.js

document.addEventListener('DOMContentLoaded', function () {
    displaySavedWorkouts();
});

function displaySavedWorkouts() {
    const savedWorkoutsList = document.getElementById('savedWorkoutsList');
    savedWorkoutsList.innerHTML = '';

    const savedWorkouts = JSON.parse(sessionStorage.getItem('savedWorkouts'));

    if (savedWorkouts) {
        savedWorkouts.forEach(workout => {
            const workoutLi = document.createElement('li');
            workoutLi.textContent = `${workout.name} - ${workout.details}`;
            savedWorkoutsList.appendChild(workoutLi);
        });
    } else {
        const noWorkoutLi = document.createElement('li');
        noWorkoutLi.textContent = 'No saved workouts found.';
        savedWorkoutsList.appendChild(noWorkoutLi);
    }
}
