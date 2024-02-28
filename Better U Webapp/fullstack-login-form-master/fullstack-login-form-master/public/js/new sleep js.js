document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('sleepForm');
    const table = document.getElementById('sleepTable').getElementsByTagName('tbody')[0];
    const ctx = document.getElementById('sleepChart').getContext('2d');

    // Set current date as the default value for the date input field
    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = currentDate;

    // Chart.js configuration
    const chartConfig = {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Hours Slept',
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
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

    form.addEventListener('submit', function(event) {
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

        // Clear the form inputs
        form.reset();
    });
});
