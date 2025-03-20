# filepath: c:\Users\tkevi\Downloads\temp.py
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
import time
import json

# Shared sensor value and setpoint
current_sensor_value = 25.0
setpoint = 30.0

lock = threading.Lock()

# Function to simulate sensor readings
def read_sensor():
    global current_sensor_value
    while True:
        with lock:
            current_sensor_value += (time.time() % 2 - 1) * 0.1
        time.sleep(1)

# Start the sensor simulation in a separate thread
sensor_thread = threading.Thread(target=read_sensor)
sensor_thread.daemon = True
sensor_thread.start()

class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        global current_sensor_value, setpoint
        if self.path == '/':
            # Serve the main HTML file
            self.path = '/static/index.html'

        if self.path.startswith('/static/'):
            # Serve static files (HTML, CSS, JS)
            try:
                file_path = os.path.join(os.getcwd(), self.path[1:])
                with open(file_path, 'rb') as file:
                    self.send_response(200)
                    if self.path.endswith('.html'):
                        self.send_header('Content-type', 'text/html')
                    elif self.path.endswith('.css'):
                        self.send_header('Content-type', 'text/css')
                    elif self.path.endswith('.js'):
                        self.send_header('Content-type', 'application/javascript')
                    self.end_headers()
                    self.wfile.write(file.read())
            except FileNotFoundError:
                self.send_response(404)
                self.end_headers()
        elif self.path == '/sensor_data':
            # Serve sensor data as JSON
            with lock:
                sensor_value = current_sensor_value
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"sensorValue": sensor_value}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        global setpoint
        if self.path == '/setpoint':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            form_data = dict(x.split('=') for x in post_data.split('&'))
            try:
                with lock:
                    setpoint = float(form_data['setpoint'])
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b"Setpoint updated")
            except (ValueError, KeyError):
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"Invalid setpoint.")
        else:
            self.send_response(404)
            self.end_headers()

def run(server_class=HTTPServer, handler_class=MyHandler, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting server on port {port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print("Stopping server...")

if __name__ == '__main__':
    run()