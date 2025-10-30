package main

import (
	"log"
	"os"

	httpServer "face-recognition-backend/internal/http"
	mqttClient "face-recognition-backend/internal/mqtt"
	"face-recognition-backend/internal/recognition"
)

func main() {
    // Tạo thư mục cần thiết
    os.MkdirAll("./uploads", 0755)
    os.MkdirAll("./data", 0755)
    
    // Khởi tạo database
    db, err := recognition.NewFaceDatabase("./data/faces.json")
    if err != nil {
        log.Fatal(err)
    }
    
    // Khởi tạo MQTT client
    mqttBroker := getEnv("MQTT_BROKER", "tcp://test.mosquitto.org:1883")
    mqtt, err := mqttClient.NewMQTTClient(mqttBroker, "face-recognition-backend", db)
    if err != nil {
        log.Fatal(err)
    }
    
    // Subscribe to topic
    if err := mqtt.Subscribe("face/metadata"); err != nil {
        log.Fatal(err)
    }
    
    // Khởi tạo HTTP server
    server := httpServer.NewServer(db)
    
    // Listen for MQTT results and broadcast via WebSocket
    go func() {
        for result := range mqtt.GetResultChannel() {
            log.Printf("New recognition: %s (Known: %v, Confidence: %.2f)", 
                result.Name, result.IsKnown, result.Confidence)
            server.BroadcastResult(result)
        }
    }()
    
    // Start HTTP server
    port := getEnv("PORT", "8080")
    log.Fatal(server.Start(":" + port))
}

func getEnv(key, fallback string) string {
    if value, ok := os.LookupEnv(key); ok {
        return value
    }
    return fallback
}