// filepath: static/script.js

function updateSensorValue() {
    fetch('/sensor_data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('sensorValue').textContent = data.sensorValue.toFixed(2);
        });
}

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

// Update the sensor value every second
setInterval(updateSensorValue, 1000);