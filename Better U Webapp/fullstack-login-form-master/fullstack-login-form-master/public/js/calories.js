const apiKey = '91fba15f828371be49e664a480b46cd8';
const appId = '5748bd3a';
const endpoint = 'https://api.edamam.com/api/food-database/v2/parser';

const searchInput = document.getElementById('foodInput');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();

    if (query !== '') {
        fetch(`${endpoint}?app_id=${appId}&app_key=${apiKey}&ingr=${query}`)
            .then(response => response.json())
            .then(data => {
                // Handle the response data here
                console.log(data);
                displayResults(data);
            })
            .catch(error => console.error('Error:', error));
    } else {
        console.log('Please enter a search query');
    }
});

function displayResults(data) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    if (data.hints && data.hints.length > 0) {
        const resultList = document.createElement('ul');

        data.hints.forEach(hint => {
            const listItem = document.createElement('li');
            listItem.textContent = `${hint.food.label} - Calories: ${Math.round(hint.food.nutrients.ENERC_KCAL)}`;

            resultList.appendChild(listItem);
        });

        resultsContainer.appendChild(resultList);
    } else {
        resultsContainer.textContent = 'No results found.';
    }
}
