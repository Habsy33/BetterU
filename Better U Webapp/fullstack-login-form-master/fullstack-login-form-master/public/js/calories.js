const apiKey = '91fba15f828371be49e664a480b46cd8';
const appId = '5748bd3a';
const endpoint = 'https://api.edamam.com/api/food-database/v2/parser';
const MAX_RESULTS = 12;
let myLineChart;

const searchInput = document.getElementById('foodInput');
const searchButton = document.getElementById('searchButton');
const clearButton = document.getElementById('clearButton');

// Array to store selected items
let calorieInfo = [];

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();

    if (query !== '') {
        fetch(`${endpoint}?app_id=${appId}&app_key=${apiKey}&ingr=${query}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                displayResults(data);
            })
            .catch(error => console.error('Error:', error));
    } else {
        console.log('Please enter a search query');
    }
});

clearButton.addEventListener('click', () => {
    clearResults();
});

function displayResults(data) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    if (data.hints && data.hints.length > 0) {
        const resultList = document.createElement('ul');
        const numResultsToDisplay = Math.min(MAX_RESULTS, data.hints.length);

        for (let i = 0; i < numResultsToDisplay; i++) {
            const hint = data.hints[i];
            const listItem = document.createElement('li');

            const selectButton = document.createElement('button');
            selectButton.innerHTML = `<strong>${hint.food.label}</strong><br><br><span style="font-size: smaller;">Calories: ${Math.round(hint.food.nutrients.ENERC_KCAL)}</span><br><span style="font-size: smaller;">Protein: ${Math.round(hint.food.nutrients.PROCNT)}g</span>`;
            selectButton.addEventListener('click', () => {
                addToTotalCalories(hint.food.nutrients.ENERC_KCAL, hint.food.nutrients.PROCNT, hint.food.label);
                addSelectedItem(hint.food.label, hint.food.nutrients.PROCNT, hint.food.nutrients.ENERC_KCAL);
            });

            selectButton.classList.add('special-button');

            if (selectButton.textContent.length > 20) {
                selectButton.classList.add('long-text');
            }

            listItem.appendChild(selectButton);
            resultList.appendChild(listItem);
        }

        resultsContainer.appendChild(resultList);
    } else {
        resultsContainer.textContent = 'No results found.';
    }
}

function addSelectedItem(name, protein, calories) {
    calorieInfo.push({
        name: name,
        protein: protein,
        calories: calories
    });

    updateSelectedItemsList();
    updateTotalCaloriesDisplay();
}

let dailyCalorieGoal = 2000; // Set your daily calorie goal

function updateProgressBar() {
    const progress = (totalCalories / dailyCalorieGoal) * 100;
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');

    if (progress <= 100) {
        progressBar.style.width = `${progress}%`;
        progressPercentage.textContent = `${Math.round(progress)}%`;
    } else {
        progressBar.style.width = '100%';
        progressPercentage.textContent = '100%';
        alert('You have exceeded the recommended daily calorie intake!');
    }
}

function clearProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');

    progressBar.style.width = '0%';
    progressPercentage.textContent = '0%';
}

function updateSelectedItemsList() {
    const selectedItemsList = document.getElementById('selectedItemsList');
    selectedItemsList.innerHTML = '';

    calorieInfo.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${item.name}</strong> | Protein: ${Math.round(item.protein)}g | Calories: ${Math.round(item.calories)}kcal`;
        selectedItemsList.appendChild(listItem);
    });
}

let totalCalories = 0;
let totalProtein = 0;

function addToTotalCalories(ENERC_KCAL, PROCNT, name) {
    Math.round(PROCNT);
    totalCalories += ENERC_KCAL;
    totalProtein += PROCNT;

    updateTotalCaloriesDisplay();
    updateProgressBar();
}

function updateTotalCaloriesDisplay() {
    const totalCaloriesDisplay = document.getElementById('totalCalories');
    const totalProteinDisplay = document.getElementById('totalProtein');
    totalCaloriesDisplay.textContent = `Total Calories: ${Math.round(totalCalories)}kcal`;
    totalProteinDisplay.textContent = `Total Protein: ${Math.round(totalProtein)}g`;
}

function clearResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';
}

function updateLineChart(data) {
    const dates = data.map(entry => entry.date);
    const calories = data.map(entry => entry.calories);
    const proteins = data.map(entry => entry.protein);

    if (myLineChart) {
        myLineChart.destroy();
    }

    const lineChartCanvas = document.getElementById('lineChart').getContext('2d');

    myLineChart = new Chart(lineChartCanvas, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Total Calories',
                data: calories,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                yAxisID: 'y-calories', // Associate this dataset with the first y-axis
            }, {
                label: 'Total Protein (g)',
                data: proteins,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                yAxisID: 'y-protein', // Associate this dataset with the second y-axis
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                'y-calories': {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Calories'
                    },
                    ticks: {
                        // Calibrate the scale for calories
                        callback: function(value) {
                            return value + 'kcal';
                        }
                    }
                },
                'y-protein': {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Protein (g)'
                    },
                    // Align the grid line to the left axis
                    grid: {
                        drawOnChartArea: false, // Only show the grid for this axis on its side
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true, // This will make the legend icons circles
                        pointStyle: 'circle', // Explicitly set the point style to circle
                        padding: 20 // Optional: adjust padding between legend items
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });
}






// Function to update the line chart whenever the table data changes
function updateChartData() {
    const tableRows = Array.from(document.querySelectorAll('#calorieTable tbody tr'));
    const chartData = tableRows.map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        return {
            date: cells[0].textContent,
            calories: parseFloat(cells[1].textContent),
            protein: parseFloat(cells[2].textContent)
        };
    });
    updateLineChart(chartData);
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('calorieChart');
    const table = document.getElementById('calorieTable').getElementsByTagName('tbody')[0];

    // Event listener for the form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log("Form submitted"); // For debugging

        const date = document.getElementById('selectedDate').value;
        const calories = totalCalories;
        const protein = totalProtein;

        // Insert data into the table
        const newRow = table.insertRow();
        const dateCell = newRow.insertCell(0);
        const caloriesCell = newRow.insertCell(1);
        const proteinCell = newRow.insertCell(2);

        dateCell.textContent = date;
        caloriesCell.textContent = calories;
        proteinCell.textContent = Math.round(protein);

        // Update the line chart
        updateChartData();

        // Clear the form inputs
        form.reset();

        // Reset selected items, total calories, and protein
        clearSelectedItemsAndResetTotals();
    });
});

function clearSelectedItemsAndResetTotals() {
    // Clear the selected items list
    calorieInfo = []; // Reset the array
    document.getElementById('selectedItemsList').innerHTML = ''; // Clear the list's HTML

    // Reset total calories and protein to 0
    totalCalories = 0;
    totalProtein = 0;

    // Update the display for total calories and protein
    document.getElementById('totalCalories').textContent = `Total Calories: 0kcal`;
    document.getElementById('totalProtein').textContent = `Total Protein: 0g`;

    // Optionally, reset the progress bar
    clearProgressBar();
}

function clearProgressBar() {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = '0%';
    document.getElementById('progressPercentage').textContent = '0%';
}

    // Call the function to update the line chart with initial data
    updateChartData();


