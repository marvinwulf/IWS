#!/bin/bash
echo -e "\033[0;32mStarting IWS Server setup..\033[0m"

# Change directory to /root
cd /root/
echo
# Update the package list
sudo apt update -y

echo -e "\033[0;32mInstalling mosquitto broker.\033[0m"

# Install and configure Mosquitto
sudo apt install mosquitto -y
systemctl start mosquitto
systemctl enable mosquitto
echo "$(systemctl status mosquitto)"

config_file="/etc/mosquitto/mosquitto.conf"

# Add the line 'allow_anonymous true' if it doesn't exist, otherwise update it
if ! grep -q "allow_anonymous true" "$config_file"; then
    echo "allow_anonymous true" >> "$config_file"
else
    sed -i "s/^allow_anonymous .*/allow_anonymous true/" "$config_file"
    echo "allow_anonymous true" >> "$config_file"
fi

# Add or update the listener port
if ! grep -q "^listener $port" "$config_file"; then
    echo "listener $port" >> "$config_file"
else
    sed -i "s/^listener .*/listener $port/" "$config_file"
    echo "listener $port" >> "$config_file"
fi

echo -e "\033[0;32mInstalling Python and virtual environment.\033[0m"

# Install Python dependencies
sudo apt install python3.11-venv python3-pip -y
python3 -m venv /root/.iws
source /root/.iws/bin/activate
pip3 install paho-mqtt datetime requests schedule
deactivate

echo -e "\033[0;32mInstalling the IWS Server scripts.\033[0m"

# Install additional tools
sudo apt install tmux wget unzip sqlite3 -y

# Download and set up IWS
cd /root/.iws/
wget https://github.com/marvinwulf/IWS/archive/main.zip
unzip main.zip
rm main.zip

echo -e "\033[0;32mInstalling the Node.js Server.\033[0m"

# Install Node.js and npm, set up local server for IWS
cd /root/.iws/IWS-main/localserver
sudo apt install nodejs npm -y
npm init -y
npm install express sqlite3 ejs

echo -e "\033[0;36mIWS Server Installation finished.\033[0m"
