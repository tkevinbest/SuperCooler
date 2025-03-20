// filepath: static/script.js

// Get the primary color from the CSS custom property
const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();

// Initialize the chart
const ctx = document.getElementById('sensorChart').getContext('2d');
const sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Time labels
        datasets: [{
            label: 'Sensor Value',
            data: [], // Sensor values
            borderColor: primaryColor, // Use the primary color
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false // Remove the legend
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute', // Display time in minutes
                    tooltipFormat: 'HH:mm:ss', // Tooltip format
                },
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Sensor Value'
                }
            }
        }
    }
});

// Function to update the sensor value and append a new point to the graph
function updateSensorValue() {
    fetch('/sensor_data')
        .then(response => response.json())
        .then(data => {
            // Get the latest sensor reading
            const latestEntry = data[data.length - 1];
            const latestTimestamp = new Date(latestEntry.timestamp);
            const latestValue = latestEntry.value;

            // Update the "Current Temperature" display
            document.getElementById('sensorValue').textContent = `${latestValue.toFixed(2)} °F`;

            // Check if the latest point is already on the chart
            const lastChartLabel = sensorChart.data.labels[sensorChart.data.labels.length - 1];
            if (!lastChartLabel || new Date(lastChartLabel).getTime() !== latestTimestamp.getTime()) {
                // Append the new data point to the chart
                sensorChart.data.labels.push(latestTimestamp);
                sensorChart.data.datasets[0].data.push(latestValue);

                // Remove old data points if exceeding the desired history length
                if (sensorChart.data.labels.length > 3600) {
                    sensorChart.data.labels.shift(); // Remove the oldest label
                    sensorChart.data.datasets[0].data.shift(); // Remove the oldest data point
                }

                // Update the chart to reflect the new data
                sensorChart.update('default'); // Use 'none' to avoid full re-render. Default is prettier
            }
        });
}

// Function to set a new setpoint
function setSetpoint() {
    const newSetpoint = document.getElementById('setpoint').value;
    fetch('/setpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `setpoint=${newSetpoint}`,
    }).then(response => {
        if (response.ok) {
            updateSensorValue();
        } else {
            alert("Invalid Setpoint");
        }
    });
}

// Update the sensor value and graph every second
setInterval(updateSensorValue, 1000);
