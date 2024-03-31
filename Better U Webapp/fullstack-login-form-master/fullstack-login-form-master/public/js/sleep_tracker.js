document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('sleepForm');
    const table = document.getElementById('sleepTable').getElementsByTagName('tbody')[0];
    const ctx = document.getElementById('sleepChart').getContext('2d');

    // Set current date as the default value for the date input field
    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = currentDate;

    // Chart.js configuration
    const chartConfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Hours Slept',
                backgroundColor: 'rgba(45, 144, 149, 1)',
                borderColor: 'rgba(45, 144, 149, 1)',
                borderWidth: 3,
                data: []
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    };

    // Initialize chart
    const myChart = new Chart(ctx, chartConfig);

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const date = document.getElementById('date').value;
        const sleepTime = document.getElementById('sleepTime').value;
        const wakeUpTime = document.getElementById('wakeUpTime').value;

        // Calculate hours and minutes slept
        const sleepDate = new Date(`${date} ${sleepTime}`);
        const wakeUpDate = new Date(`${date} ${wakeUpTime}`);
        let milliseconds = wakeUpDate - sleepDate;

        // Adjust if wake-up time is before sleep time (crossing midnight)
        if (milliseconds < 0) {
            milliseconds += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
        }

        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

            // Save sleep data to session storage
        const sleepData = {
            date: date,
            sleepTime: sleepTime,
            wakeUpTime: wakeUpTime,
            hoursSlept: hours + minutes / 60
        };

        if (!sessionStorage.sleepRecords) {
            sessionStorage.sleepRecords = JSON.stringify([sleepData]);
        } else {
            const sleepRecords = JSON.parse(sessionStorage.sleepRecords);
            sleepRecords.push(sleepData);
            sessionStorage.sleepRecords = JSON.stringify(sleepRecords);
        }

        // Update chart data
        myChart.data.labels.push(date);
        myChart.data.datasets[0].data.push(hours + minutes / 60);
        myChart.update();

        // Create a new row
        const newRow = table.insertRow();
        const dateCell = newRow.insertCell(0);
        const sleepTimeCell = newRow.insertCell(1);
        const wakeUpTimeCell = newRow.insertCell(2);
        const hoursCell = newRow.insertCell(3);

        // Add data to the row
        dateCell.textContent = date;
        sleepTimeCell.textContent = sleepTime;
        wakeUpTimeCell.textContent = wakeUpTime;
        hoursCell.textContent = `${hours}h ${minutes}m`; // Display hours and minutes

        // Provide sleep insights
        displaySleepInsights(hours + minutes / 60);

        // Clear the form inputs
        form.reset();
    });

    function displaySleepInsights(hoursSlept) {
        const insightsElement = document.getElementById('sleepInsights');
        insightsElement.innerHTML = ''; // Clear previous insights
    
        // Calculate hours and minutes slept
        const hours = Math.floor(hoursSlept);
        const minutes = Math.round((hoursSlept - hours) * 60);
    
        // Display hours slept
        const sleepDuration = document.createElement('p');
        sleepDuration.textContent = `You slept for ${hours} hours and ${minutes} minutes.`;
        insightsElement.appendChild(sleepDuration);
    
        // Add insights based on sleep duration
        if (hoursSlept < 7) {
            insightsElement.innerHTML += '<p>Your sleep duration is lower than the recommended 7 hours for adults.</p>';
        } else if (hoursSlept >= 7 && hoursSlept <= 9) {
            insightsElement.innerHTML += '<p>Your sleep duration is within the recommended range of 7-9 hours for adults.</p>';
        } else {
            insightsElement.innerHTML += '<p>Your sleep duration is higher than the recommended 9 hours for adults.</p>';
        }
    }
    
});
