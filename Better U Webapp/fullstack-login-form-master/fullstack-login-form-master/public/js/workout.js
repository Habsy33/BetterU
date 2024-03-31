document.addEventListener('DOMContentLoaded', function () {
    const exerciseNameInput = document.getElementById('exerciseName');

    // Existing event listener for live search
    exerciseNameInput.addEventListener('input', debounce(function(event) {
        performSearch();
    }, 250)); // Debounce implementation
});

// Debounce function to prevent excessive API calls
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function performSearch() {
    const exerciseName = document.getElementById('exerciseName').value;
    if (exerciseName.length > 2) { // Check if input length is greater than 2
        let apiUrl = 'https://api.api-ninjas.com/v1/exercises?name=' + encodeURIComponent(exerciseName);
        // Call the API using the fetch function
        fetch(apiUrl, {
            method: 'GET',
            headers: { 'X-Api-Key': 'iFprE+m21S+UvIi4n+2CXQ==mnbUElKdzuRDDNWK', 'Content-Type': 'application/json'},
        })
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        document.getElementById('resultsList').innerHTML = ''; // Clear results if input is too short
    }
}

function displayResults(results) {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = ''; // Clear existing results

    results.forEach(exercise => {
        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'exercise-item';
        exerciseDiv.innerHTML = `
            <h3>${exercise.name}</h3>
            <p>Type: ${exercise.type}</p>
            <p>Muscle: ${exercise.muscle}</p>
            <p>Difficulty: ${exercise.difficulty}</p>
        `;
        // Add click event listener to each exercise item
        exerciseDiv.addEventListener('click', function() {
            addToSelectedExercises(exercise);
        });

        resultsList.appendChild(exerciseDiv);
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addToSelectedExercises(exercise) {
    const selectedExercisesList = document.getElementById('selectedExercisesList');
    const weight = document.getElementById('workoutWeight').value; // Ensure this is corrected in your HTML
    const reps = document.getElementById('workoutReps').value; // Ensure this is corrected in your HTML

    //Checks if there is a weight variable

    if (!weight || weight <= 0 || !reps || reps <= 0) {
        alert('You must enter a value for both weight and reps');
        return; // Stop the function if validation fails
    }

    const exerciseLi = document.createElement('li');
    exerciseLi.className = 'selected-exercise-item';

    // Set display variables
    const type = capitalizeFirstLetter(exercise.type);
    const muscle = capitalizeFirstLetter(exercise.muscle);
    const difficulty = capitalizeFirstLetter(exercise.difficulty);
    const weightDisplay = weight ? `${weight}kg` : '';
    const repsDisplay = reps ? `${reps}reps` : '';

    // Updated HTML structure with capitalized values
    exerciseLi.innerHTML = `
        <h3>${exercise.name}</h3>
        <hr>
        <div class="exercise-details">
            ${type}    ${muscle}  ${difficulty}  ${weightDisplay}   ${repsDisplay}
        </div>
        <button class="removeExercise">&#10006;</button>
    `;

    // Append the newly created exercise to the selected exercises list
    selectedExercisesList.appendChild(exerciseLi);

    // Add click event listener to the remove button
    exerciseLi.querySelector('.removeExercise').addEventListener('click', function() {
        exerciseLi.remove();
    });
}

// Add event listener to the "Save Workouts" button
document.getElementById('saveWorkouts').addEventListener('click', function() {
    saveWorkoutsToSessionStorage();
});

function saveWorkoutsToSessionStorage() {
    const selectedExercisesList = document.getElementById('selectedExercisesList');
    const selectedExercises = selectedExercisesList.querySelectorAll('.selected-exercise-item');
    const workouts = [];

    selectedExercises.forEach(exercise => {
        const name = exercise.querySelector('h3').textContent;
        const details = exercise.querySelector('.exercise-details').textContent;
        workouts.push({ name, details });
    });

    sessionStorage.setItem('savedWorkouts', JSON.stringify(workouts));

    // Alert user that workouts have been saved
    alert('Your workouts have been saved!');
}
