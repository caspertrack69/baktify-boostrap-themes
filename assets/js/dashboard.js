// This file contains JavaScript specific to the dashboard page, including dynamic data loading and interactivity for charts and cards.

document.addEventListener('DOMContentLoaded', function() {
    // Example of dynamic data loading for charts
    loadChartData();

    // Event listeners for interactive elements
    const refreshButton = document.getElementById('refresh-data');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            loadChartData();
        });
    }

    function loadChartData() {
        // Simulate an API call to fetch data
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'Sales',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        // Update the chart with new data
        updateChart(data);
    }

    function updateChart(data) {
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});