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

function addToSelectedExercises(exercise) {
    const selectedExercisesList = document.getElementById('selectedExercisesList');
    const workoutDuration = document.getElementById('workoutDuration').value; // Capture the duration value

    const exerciseLi = document.createElement('li');
    exerciseLi.className = 'selected-exercise-item';
    // Include the workout duration in the displayed information
    exerciseLi.innerHTML = `
        ${exercise.name} - Type: ${exercise.type}, Muscle: ${exercise.muscle}, Difficulty: ${exercise.difficulty}, Duration: ${workoutDuration} minutes
        <button class="removeExercise">&#10006;</button>
    `;

    // Append the newly created exercise to the selected exercises list
    selectedExercisesList.appendChild(exerciseLi);

    // Add click event listener to the remove button
    exerciseLi.querySelector('.removeExercise').addEventListener('click', function() {
        exerciseLi.remove();
    });
}
