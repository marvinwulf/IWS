import paho.mqtt.client as mqtt
from dbcon import dbcon
import json
from datetime import datetime


class Colors:
    RESET = '\033[0m'
    RED = '\033[91m'
    GREEN = '\033[92m'
    LIME= '\033[86m'
    CYAN = '\033[96m'


with dbcon() as cursor:

    cursor.execute('''CREATE TABLE IF NOT EXISTS message_queue (
                        message TEXT
                    )''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS errorlog (
                        reporter INTEGER,
                        device TEXT,
                        error TEXT,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                    )''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS devices (
                        devicename TEXT PRIMARY KEY,
                        devicefriendlyname TEXT,
                        status TEXT,
                        threshold INTEGER,
                        watervolume INTEGER,
                        timestamp DATETIME
                    )''');

    cursor.execute('''CREATE TABLE IF NOT EXISTS measurements (
                        measurementId INTEGER PRIMARY KEY,
                        devicename TEXT,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                        measurementData TEXT,
                        FOREIGN KEY (devicename) REFERENCES devices(devicename)
                    )''');

    cursor.execute('''CREATE TABLE IF NOT EXISTS pump_activations (
                        pump_activationsId INTEGER PRIMARY KEY,
                        devicename TEXT,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (devicename) REFERENCES devices(devicename)
                    )''');

    cursor.execute('''CREATE TABLE IF NOT EXISTS waterlevels (
                        waterlevelId INTEGER PRIMARY KEY,
                        devicename TEXT,
                        waterlevel INTEGER,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (devicename) REFERENCES devices(devicename)
                    )''');

def on_connect(client, userdata, flags, rc, properties=None):
    client.subscribe("iwscom/info")
    if rc == 0:
        print(f"{Colors.GREEN}DB Manager:{Colors.LIME} Erfolgreich mit MQTT Broker verbunden{Colors.RESET}")
    else:
        print(f"{Colors.RED}DB Manager: Verbindung mit Fehlercode {rc} auf Adresse {config.get('staticip')} fehlgeschlagen{Colors.RESET}")


def on_message(client, userdata, msg):
    print(f"{Colors.GREEN}DB Manager:{Colors.RESET} MQTT Nachricht empfangen.")

    mdat = json.loads(msg.payload.decode())

    sendertype = mdat.get("sendertype")
    devicename = mdat.get("devicename")
    adc = mdat.get("adc")
    vbat = mdat.get("vbat")
    waterlevel = mdat.get("waterlevel")
    pump = mdat.get("pump")
    ecdump = mdat.get("ecdump")

    if sendertype == "0":
        with dbcon() as cursor:
            cursor.execute("INSERT INTO measurements (devicename, measurementData, timestamp) VALUES (?, ?, CURRENT_TIMESTAMP)", (devicename, adc,))
            # vbat but not there yet
            cursor.execute("INSERT INTO waterlevels (devicename, waterlevel, timestamp) VALUES (?, ?, CURRENT_TIMESTAMP)", (devicename, waterlevel,))

            if pump == "1":
                cursor.execute("INSERT INTO pump_activations (devicename, timestamp) VALUES (?, CURRENT_TIMESTAMP)", (devicename,))




client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_message = on_message
client.connect("192.168.178.29", 1883)

client.loop_forever()
