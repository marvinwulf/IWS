import json
import paho.mqtt.client as mqtt
from dbcon import dbcon
import time

# Define MQTT parameters
mqtt_broker = "192.168.178.29"
mqtt_port = 1883

def on_message(client, userdata, message):
    global received_flag
    data = message.payload.decode("utf-8")
    if data.split(",")[1] == "received":
        received_flag = True

while True:

    received_flag = False

    with dbcon() as cursor:
        cursor.execute("SELECT COUNT(*) FROM message_queue")
        queue_lenght = cursor.fetchone()[0]

    if queue_lenght > 0:
        try:
            with dbcon() as cursor:
                cursor.execute("SELECT * FROM message_queue ORDER BY rowid LIMIT 1;")
                data = cursor.fetchone()[0].split(",")

            print(f"\033[96mPayload {data} aus DB gefetched\033[0m")

            sender = data[0]

            with dbcon() as cursor:
                cursor.execute("SELECT COUNT(*) FROM devices WHERE devicename = ?", (sender,))
                device_exists = cursor.fetchone()[0]

            if device_exists > 0:
                print("Existiert")
                with dbcon() as cursor:
                    cursor.execute("UPDATE devices SET timestamp = CURRENT_TIMESTAMP WHERE devicename = ?", (sender,))
                    cursor.execute("SELECT threshold, watervolume,status FROM devices WHERE devicename = ?", (sender,))
                    instructiondata = cursor.fetchall()

                # Define MQTT client
                client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
                client.on_message = on_message
                client.connect(mqtt_broker, mqtt_port)
                client.subscribe("iwscom/wakeup")
                client.loop_start()

                retries = 0
                while not received_flag and retries < 10:
                    print(instructiondata)

                    json_data = {
                        "devicename": sender,
                        "status": instructiondata[0][2],
                        "threshold": instructiondata[0][0],
                        "watervolume": instructiondata[0][1]
                    }

                    print(json.dumps(json_data))

                    client.publish("iwscom/instruct", json.dumps(json_data), qos=1)

                    time.sleep(1)
                    retries += 1

                client.disconnect()

            else:
                print("Existiert nicht")

                client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
                client.on_message = on_message
                client.connect(mqtt_broker, mqtt_port)
                client.loop_start()

                json_data = {
                    "devicename": sender,
                    "status": 0
                }

                print(json.dumps(json_data))

                client.publish("iwscom/instruct", json.dumps(json_data), qos=1)


            with dbcon() as cursor:
                cursor.execute("DELETE FROM message_queue WHERE rowid = (SELECT MIN(rowid) FROM message_queue);")

            print(f"\n\033[96mPayload {data} aus DB gelöscht\033[0m")

        except Exception as e:
            print("failed")
            print(e)
