package recognition

import (
	"encoding/json"
	"os"
	"sync"
	"time"
)

type Person struct {
    ID         string      `json:"id"`
    Name       string      `json:"name"`
    Embeddings [][]float32 `json:"embeddings"` // Nhiều ảnh của 1 người
    VisitCount int         `json:"visit_count"`
    LastSeen   time.Time   `json:"last_seen"`
}

type FaceDatabase struct {
    People map[string]*Person
    Mu     sync.RWMutex
    path   string
}

func NewFaceDatabase(path string) (*FaceDatabase, error) {
    db := &FaceDatabase{
        People: make(map[string]*Person),
        path:   path,
    }
    
    // Load existing data
    if err := db.Load(); err != nil {
        if !os.IsNotExist(err) {
            return nil, err
        }
    }
    
    return db, nil
}

func (db *FaceDatabase) AddPerson(id, name string, embedding []float32) {
    db.Mu.Lock()
    defer db.Mu.Unlock()
    
    if person, exists := db.People[id]; exists {
        person.Embeddings = append(person.Embeddings, embedding)
        person.VisitCount++
        person.LastSeen = time.Now()
    } else {
        db.People[id] = &Person{
            ID:         id,
            Name:       name,
            Embeddings: [][]float32{embedding},
            VisitCount: 1,
            LastSeen:   time.Now(),
        }
    }
    
    db.Save()
}

func (db *FaceDatabase) UpdateVisit(personID string) {
    db.Mu.Lock()
    defer db.Mu.Unlock()
    
    if person, exists := db.People[personID]; exists {
        person.VisitCount++
        person.LastSeen = time.Now()
        db.Save()
    }
}

func (db *FaceDatabase) Save() error {
    data, err := json.MarshalIndent(db.People, "", "  ")
    if err != nil {
        return err
    }
    return os.WriteFile(db.path, data, 0644)
}

func (db *FaceDatabase) Load() error {
    data, err := os.ReadFile(db.path)
    if err != nil {
        return err
    }
    return json.Unmarshal(data, &db.People)
}

func (db *FaceDatabase) GetStats() map[string]interface{} {
    db.Mu.RLock()
    defer db.Mu.RUnlock()
    
    stats := map[string]interface{}{
        "total_people":   len(db.People),
        "total_visits":   0,
        "top_visitors":   []Person{},
    }
    
    for _, person := range db.People {
        stats["total_visits"] = stats["total_visits"].(int) + person.VisitCount
    }
    
    return stats
}