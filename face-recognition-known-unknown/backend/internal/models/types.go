package models

import "time"

// FaceMetadata từ MQTT
type FaceMetadata struct {
    PersonID    string    `json:"person_id"`
    Timestamp   time.Time `json:"timestamp"`
    Embedding   []float32 `json:"embedding"` // Vector 512D
    ImagePath   string    `json:"image_path"`
    CameraID    string    `json:"camera_id"`
}

// RecognitionResult kết quả nhận diện
type RecognitionResult struct {
    PersonID     string    `json:"person_id"`
    Name         string    `json:"name"`
    IsKnown      bool      `json:"is_known"`
    Confidence   float32   `json:"confidence"`
    Timestamp    time.Time `json:"timestamp"`
    ImageURL     string    `json:"image_url"`
    VisitCount   int       `json:"visit_count"`
}

// VisitorStats thống kê
type VisitorStats struct {
    TotalVisits    int                  `json:"total_visits"`
    KnownVisitors  int                  `json:"known_visitors"`
    NewVisitors    int                  `json:"new_visitors"`
    TopVisitors    []VisitorFrequency   `json:"top_visitors"`
}

type VisitorFrequency struct {
    PersonID   string `json:"person_id"`
    Name       string `json:"name"`
    Count      int    `json:"count"`
    LastSeen   time.Time `json:"last_seen"`
}