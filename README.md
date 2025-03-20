# SuperCooler: A refrigeration system for recrational coolers. 
## Why?
My truck has a large alternator on for powering a trailer. Since I don't often tow, I have plenty of extra 12 V DC available when driving. To be able to extend camping trips and other outings without needing to go get ice, I want to use my truck's extra electrical power to help keep the cooler cold (or warm in the winter). 

## How? 
I'm using a simple peltier cooling module to pump heat out of the cooler. The peltier module will be controlled in closed loop to a desired temperature setpoint with a Raspberry Pi Zero. 

## Contents
- `main.py`: A main script that spins up a webserver to see temperature readings and configure the setpoint.
- `control.py`: Coming soon - will contain the control code. 
