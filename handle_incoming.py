import paho.mqtt.client as mqtt
from dbcon import dbcon


class Colors:
    RESET = '\033[0m'
    RED = '\033[91m'
    GREEN = '\033[92m'
    LIME= '\033[86m'
    CYAN = '\033[96m'


def on_connect(client, userdata, flags, rc, properties=None):
    client.subscribe("iwscom/wakeup")
    if rc == 0:
        print(f"{Colors.GREEN}Handle:{Colors.LIME} Erfolgreich mit MQTT Broker verbunden{Colors.RESET}")
    else:
        print(f"{Colors.RED}Handle: Verbindung mit Fehlercode {rc} fehlgeschlagen{Colors.RESET}")


def on_message(client, userdata, msg):
    print(f"{Colors.GREEN}Handle:{Colors.RESET} MQTT Nachricht empfangen.")

    data = msg.payload.decode().split(",")

    if data[1] == "wakeup":

        with dbcon() as cursor:
            cursor.execute("INSERT INTO message_queue (message) VALUES (?)", (msg.payload.decode(),))

        print(f"{Colors.GREEN}Handle:{Colors.RESET} Payload {Colors.CYAN}{data}{Colors.RESET} in DB eingefügt")


client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_message = on_message
client.connect("192.168.178.29", 1883)

client.loop_forever()
