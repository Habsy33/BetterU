document.addEventListener("DOMContentLoaded", function () {
    // Retrieve saved sleep records from session storage
    const sleepRecords = sessionStorage.sleepRecords ? JSON.parse(sessionStorage.sleepRecords) : [];

    // Display sleep records
    const table = document.getElementById('sleepRecordsTable').getElementsByTagName('tbody')[0];

    sleepRecords.forEach(record => {
        const newRow = table.insertRow();
        const dateCell = newRow.insertCell(0);
        const sleepTimeCell = newRow.insertCell(1);
        const wakeUpTimeCell = newRow.insertCell(2);
        const hoursCell = newRow.insertCell(3);

        dateCell.textContent = record.date;
        sleepTimeCell.textContent = record.sleepTime;
        wakeUpTimeCell.textContent = record.wakeUpTime;
        hoursCell.textContent = `${Math.floor(record.hoursSlept)}h ${Math.round((record.hoursSlept - Math.floor(record.hoursSlept)) * 60)}m`;
    });
});
