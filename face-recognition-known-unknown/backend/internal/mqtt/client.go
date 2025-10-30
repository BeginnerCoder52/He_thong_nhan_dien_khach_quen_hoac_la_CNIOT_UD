package mqtt

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"face-recognition-backend/internal/models"
	"face-recognition-backend/internal/recognition"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type MQTTClient struct {
    client   mqtt.Client
    db       *recognition.FaceDatabase
    onResult chan models.RecognitionResult
}

func NewMQTTClient(broker, clientID string, db *recognition.FaceDatabase) (*MQTTClient, error) {
    opts := mqtt.NewClientOptions()
    opts.AddBroker(broker)
    opts.SetClientID(clientID)
    opts.SetDefaultPublishHandler(messagePubHandler)
    opts.OnConnect = connectHandler
    opts.OnConnectionLost = connectLostHandler
    
    client := mqtt.NewClient(opts)
    
    mqttClient := &MQTTClient{
        client:   client,
        db:       db,
        onResult: make(chan models.RecognitionResult, 100),
    }
    
    if token := client.Connect(); token.Wait() && token.Error() != nil {
        return nil, token.Error()
    }
    
    return mqttClient, nil
}

func (m *MQTTClient) Subscribe(topic string) error {
    token := m.client.Subscribe(topic, 1, func(client mqtt.Client, msg mqtt.Message) {
        m.handleMessage(msg.Payload())
    })
    
    token.Wait()
    return token.Error()
}

func (m *MQTTClient) handleMessage(payload []byte) {
    log.Printf("MQTT Message Received (Size: %d bytes)", len(payload))
    
    var metadata models.FaceMetadata
    if err := json.Unmarshal(payload, &metadata); err != nil {
        log.Printf("Error parsing metadata: %v", err)
        return
    }
    
    log.Printf("   Metadata parsed successfully:")
    log.Printf("   PersonID: %s", metadata.PersonID)
    log.Printf("   Timestamp: %s", metadata.Timestamp)
    log.Printf("   Embedding size: %d", len(metadata.Embedding))
    log.Printf("   ImagePath: %s", metadata.ImagePath)
    log.Printf("   CameraID: %s", metadata.CameraID)
    
    // Tìm match trong database
    match, err := m.db.FindBestMatch(metadata.Embedding, 0.7)
    if err != nil {
        log.Printf("Error finding match: %v", err)
        return
    }
    
    result := models.RecognitionResult{
        Timestamp: metadata.Timestamp,
        ImageURL:  "/uploads/" + metadata.ImagePath,
    }
    
    if match != nil {
        // Khách quen
        log.Printf("Known visitor detected: %s (Confidence: %.2f)", match.Name, match.Confidence)
        result.PersonID = match.PersonID
        result.Name = match.Name
        result.IsKnown = true
        result.Confidence = match.Confidence
        m.db.UpdateVisit(match.PersonID)
        result.VisitCount = m.getVisitCount(match.PersonID)
    } else {
        // Khách mới
        newID := fmt.Sprintf("person_%d", time.Now().Unix())
        log.Printf("New visitor detected: %s", newID)
        result.PersonID = newID
        result.Name = "Unknown Visitor"
        result.IsKnown = false
        result.Confidence = 0
        result.VisitCount = 1
        
        m.db.AddPerson(newID, "Unknown Visitor", metadata.Embedding)
    }
    
    log.Printf("Broadcasting result to WebSocket clients...")
    m.onResult <- result
}

func (m *MQTTClient) GetResultChannel() <-chan models.RecognitionResult {
    return m.onResult
}

func (m *MQTTClient) getVisitCount(personID string) int {
    m.db.Mu.RLock()
    defer m.db.Mu.RUnlock()
    if person, exists := m.db.People[personID]; exists {
        return person.VisitCount
    }
    return 0
}

var messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
    log.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())
}

var connectHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
    log.Println("Connected to MQTT broker")
}

var connectLostHandler mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
    log.Printf("Connection lost: %v", err)
}