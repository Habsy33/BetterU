const apiKey = '91fba15f828371be49e664a480b46cd8';
const appId = '5748bd3a';
const endpoint = 'https://api.edamam.com/api/food-database/v2/parser';
const MAX_RESULTS = 7;

const searchInput = document.getElementById('foodInput');
const searchButton = document.getElementById('searchButton');
const clearButton = document.getElementById('clearButton');

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
    const selectedItemsList = document.getElementById('selectedItemsList');
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${name}</strong> | Protein: ${Math.round(protein)}g | Calories: ${Math.round(calories)}kcal`;
    selectedItemsList.appendChild(listItem);
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

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', () => {
    resetTotalCalories();
});

function resetTotalCalories() {
    totalCalories = 0;
    totalProtein = 0;
    updateTotalCaloriesDisplay();
}

updateTotalCaloriesDisplay(); // Call this function to initialize the display

const clearListButton = document.getElementById('clearListButton');
clearListButton.addEventListener('click', () => {
    clearSelectedItemsList();
});

function clearSelectedItemsList() {
    const selectedItemsList = document.getElementById('selectedItemsList');
    selectedItemsList.innerHTML = '';
}
