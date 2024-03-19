# About IWS
The IWS or Intelligent Watering System by MS Automation is a network integration for automatic watering of plants, which is designed to provide centralized control of as many watering systems as desired, without sending or requiering data from the outside. The thought behind the centralized control is to faciliate the management of a lot of plants in buildings, making it easy to maintain a high number of plants located all over the facility.
That is provided by the Dashboard. 

The Dashboard is accessible through a locally hosted website on a server in the local network, which lets people in charge of the plants control watering volume, soil moisture threshold, and season cycles, aswell as quantity of measurement points and descriptions for every system. 
The Dashboard highlights watering systems which need attention too, for example a refill of the integrated tank. Water level and battery charge are directly shown on the Dashboard, and opening the corresponding card reveals soil moisture and the last time of measurement readings. Furthermore, the individual cards provide graphs for visualizing changes in all of the above measurements, plus actions like pump activations.

The control boards of the IWS pots communicate with the server over MQTT for notifying it about the controllers wakeup. After that, the server retrieves data from the IWS pot over API requests, processes it, and stores it in a database, which is read out by the Dashboard. The entire system, albeit connected to the network, doesn't send any data outside and can run completely isolated from the internet. No cloud, completely local.
The IWS boards run on ESPhome firmware for the API functionality, therefore making further custom integrations and OTA possible.

The server can be any computer available on your network. Here, it natively runs on a Raspberry Pi (`ARMv7 or later`), with headless DietPi OS to conserve resources. Instructions for installation and booting can be found below:

# Installation of the IWS Server / OUTDATED
If you don't have an operating system running on your Pi already, we recommend you to use DietPi, although any desired OS will work.
If you want to run the IWS Server on another device and operating system, it is totally possible too.

### Raspberry Pi: DietPi or another Linux-based distro
1.  - Install DietPi on your Raspberry Pi (**or other Pi based device. Only requirement is ARMv7 or later!**). For this, follow these steps: https://dietpi.com/docs/install/
    - OR
    - Install your desired OS and follow the steps stated in its documentation.

2.  Open the terminal if not already in, and create the `.iws-sh` sub directory and fetch the installation script from the shortended GitHub link. Follow the commands listed below.
    - `sudo apt install wget`
    - `mkdir -p /root/.iws/IWS-main/`
    - `cd /root/.iws/IWS-main/`
    - `wget -O iws-setup.sh http://tinyurl.com/iws-setup`
      
    Your directory should now look like this: 
    ```
    |-- root
    |   |-- .iws
    |       |-- IWS-main 
    |           |-- iws-setup.sh
    ```
        
4.  To start the installation, run the following commands. The installation might take some minutes.
    - `chmod +x iws-setup.sh`
    - `bash iws-setup.sh`

    After installation is complete, a confirmation will be prompted in blue.

5.  Lastly, set up a static IP address.
    1. Open the device's network settings (on DietPi OS: dietpi-config -> Network Options: Adapters) and under the corresponding adapter set the following:
       - `Mode: STATIC`
       - `Static IP:` Enter desired static IP address
       - `Static Gateway:` Enter the gateway's (router) IP
    
       - Update your Subnet Mask (Static Mask) if necessary. 255.255.255.0 is the default.
       - Hit Apply and Save all changes.

    2. In your routers settings, set the IP for your device to be `static` and enter _the same_ as in the config.
       To open your router's settings and set a static IP, check the instructions provided by the manufacturer online.

    4. Finally, open the explorer (on DietPi OS: dietpi-explorer), navigate to /root/.iws/IWS-main/config.txt and open the file in a text editor.
       Enter the same IP, Subnet Mask, and Gateway IP as set in the device's network settings, and save.

Congratulations! The IWS Server is now ready to run. Use `iws-start` in the terminal to start it up.
Use `sqlite3` to enter SQL queries to set up your device table.


### Other devices: Windows, Linux or MacOS
For other devices running Windows, Linux or MacOS, we recommend using a virtual machine running the IWS Server diskimage. With that, we have taken a similar approach to that of Home Assistant. Advantage of this method is the isolation of all of the components and files from the rest of your system, having everything in one place. The startup is also as simple as it gets, with no command being involved.
