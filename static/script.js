// filepath: static/script.js

// Initialize the chart
const ctx = document.getElementById('sensorChart').getContext('2d');
const sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Time labels
        datasets: [{
            label: 'Sensor Value',
            data: [], // Sensor values
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
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

// Function to update the sensor value and graph
function updateSensorValue() {
    fetch('/sensor_data')
        .then(response => response.json())
        .then(data => {
            // Clear the chart data
            sensorChart.data.labels = [];
            sensorChart.data.datasets[0].data = [];

            // Populate the chart with the last hour of data
            data.forEach(entry => {
                sensorChart.data.labels.push(new Date(entry.timestamp));
                sensorChart.data.datasets[0].data.push(entry.value);
            });

            // Update the current sensor value display
            if (data.length > 0) {
                const latestValue = data[data.length - 1].value;
                document.getElementById('sensorValue').textContent = latestValue.toFixed(2);
            }

            sensorChart.update();
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
