package recognition

import (
	"math"
)

// CosineSimilarity tính độ tương đồng giữa 2 vector
func CosineSimilarity(a, b []float32) float32 {
    if len(a) != len(b) {
        return 0
    }
    
    var dotProduct, normA, normB float32
    
    for i := 0; i < len(a); i++ {
        dotProduct += a[i] * b[i]
        normA += a[i] * a[i]
        normB += b[i] * b[i]
    }
    
    if normA == 0 || normB == 0 {
        return 0
    }
    
    return dotProduct / (float32(math.Sqrt(float64(normA))) * float32(math.Sqrt(float64(normB))))
}

// FindBestMatch tìm người phù hợp nhất trong database
func (db *FaceDatabase) FindBestMatch(embedding []float32, threshold float32) (*Match, error) {
    db.Mu.RLock()
    defer db.Mu.RUnlock()
    
    var bestMatch *Match
    var bestScore float32 = 0
    
    for personID, person := range db.People {
        for _, knownEmbedding := range person.Embeddings {
            score := CosineSimilarity(embedding, knownEmbedding)
            
            if score > bestScore {
                bestScore = score
                bestMatch = &Match{
                    PersonID:   personID,
                    Name:       person.Name,
                    Confidence: score,
                }
            }
        }
    }
    
    if bestMatch != nil && bestScore >= threshold {
        return bestMatch, nil
    }
    
    return nil, nil // Không tìm thấy match
}

type Match struct {
    PersonID   string
    Name       string
    Confidence float32
}