import paho.mqtt.client as mqtt
import json
import time
import random
from datetime import datetime

# MQTT Configuration
BROKER = "test.mosquitto.org"
PORT = 1883
TOPIC = "face/metadata"

# Tên người để test
NAMES = ["Nguyen Van A", "Tran Thi B", "Le Van C", "Pham Thi D", "Unknown Visitor"]


def generate_fake_embedding():
    """Generate fake 512D embedding vector"""
    return [random.uniform(-1, 1) for _ in range(512)]


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ Connected to MQTT Broker successfully!")
    else:
        print(f"❌ Failed to connect, return code {rc}")


def on_publish(client, userdata, mid):
    print(f"📤 Message {mid} published successfully")


def send_detection():
    """Gửi một detection metadata qua MQTT"""
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_publish = on_publish

    print(f"🔌 Connecting to broker: {BROKER}:{PORT}")
    client.connect(BROKER, PORT, 60)
    client.loop_start()

    # Random chọn người
    person_name = random.choice(NAMES)
    is_known = person_name != "Unknown Visitor"

    metadata = {
        "person_id": f"person_{int(time.time())}",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "embedding": generate_fake_embedding(),
        "image_path": f"test_image_{int(time.time())}.jpg",
        "camera_id": "CAM-001",
    }

    # Publish message
    result = client.publish(TOPIC, json.dumps(metadata))

    print(f"\n{'=' * 60}")
    print(f"🎯 Detection Sent:")
    print(f"   Person: {person_name}")
    print(f"   Known: {is_known}")
    print(f"   Person ID: {metadata['person_id']}")
    print(f"   Timestamp: {metadata['timestamp']}")
    print(f"   Topic: {TOPIC}")
    print(f"{'=' * 60}\n")

    time.sleep(1)  # Wait for publish to complete
    client.loop_stop()
    client.disconnect()


def continuous_send(interval=5):
    """Gửi liên tục với khoảng thời gian nhất định"""
    print(f"\n🚀 Starting continuous MQTT sender...")
    print(f"📡 Sending to: {BROKER}:{PORT}")
    print(f"📢 Topic: {TOPIC}")
    print(f"⏱️  Interval: {interval} seconds")
    print(f"Press Ctrl+C to stop\n")

    try:
        count = 0
        while True:
            count += 1
            print(f"\n🔄 Sending detection #{count}...")
            send_detection()
            print(f"⏳ Waiting {interval} seconds...\n")
            time.sleep(interval)
    except KeyboardInterrupt:
        print("\n\n👋 Stopped by user")
        print(f"📊 Total detections sent: {count}")


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🎭 MQTT Face Detection Metadata Sender")
    print("=" * 60 + "\n")

    # Menu
    print("Choose mode:")
    print("1. Send single detection")
    print("2. Send continuously (every 5 seconds)")
    print("3. Send continuously (every 10 seconds)")
    print("4. Send burst (10 detections)")

    choice = input("\nEnter choice (1-4): ").strip()

    if choice == "1":
        send_detection()
    elif choice == "2":
        continuous_send(5)
    elif choice == "3":
        continuous_send(10)
    elif choice == "4":
        print("\n💥 Sending burst of 10 detections...\n")
        for i in range(10):
            print(f"Burst {i + 1}/10")
            send_detection()
            time.sleep(1)
        print("\n✅ Burst complete!")
    else:
        print("❌ Invalid choice")
