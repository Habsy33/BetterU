document.addEventListener("DOMContentLoaded", function () {
    // Retrieve saved calorie tracker data from session storage
    const savedCalorieTrackerData = sessionStorage.calorieTrackerData ? JSON.parse(sessionStorage.calorieTrackerData) : {};

    // Display retrieved calorie data
    if (savedCalorieTrackerData.selectedDate) {
        // Display the selected date
        document.getElementById('calorieBreakdownDate').textContent = savedCalorieTrackerData.selectedDate;
    }

    if (savedCalorieTrackerData.totalCalories || savedCalorieTrackerData.totalProtein) {
        // Display the total calories and total protein
        const totalCaloriesDisplay = document.getElementById('totalCalories');
        const totalProteinDisplay = document.getElementById('totalProtein');

        totalCaloriesDisplay.textContent = `Total Calories: ${savedCalorieTrackerData.totalCalories || 0} kcal`;
        totalProteinDisplay.textContent = `Total Protein: ${savedCalorieTrackerData.totalProtein || 0} g`;
    }

    // Display the selected items
    if (savedCalorieTrackerData.calorieInfo && savedCalorieTrackerData.calorieInfo.length > 0) {
        const selectedItemsList = document.getElementById('selectedItemsList');

        savedCalorieTrackerData.calorieInfo.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} | Protein: ${item.protein}g | Calories: ${item.calories}kcal`;
            selectedItemsList.appendChild(listItem);
        });
    }
});
