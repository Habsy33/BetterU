const apiKey = '91fba15f828371be49e664a480b46cd8';
const appId = '5748bd3a';
const endpoint = 'https://api.edamam.com/api/food-database/v2/parser';
const MAX_RESULTS = 9;

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

updateTotalCaloriesDisplay();

const clearListButton = document.getElementById('clearListButton');
clearListButton.addEventListener('click', () => {
    clearSelectedItemsList();
});

function clearSelectedItemsList() {
    calorieInfo = [];
    updateSelectedItemsList();
    totalCalories = 0;
    totalProtein = 0;
    updateTotalCaloriesDisplay();
}

