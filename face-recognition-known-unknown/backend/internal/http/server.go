package http

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sync"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"

	"face-recognition-backend/internal/models"
	"face-recognition-backend/internal/recognition"
)

type Server struct {
    router    *mux.Router
    db        *recognition.FaceDatabase
    upgrader  websocket.Upgrader
    wsClients map[*websocket.Conn]bool
    wsMutex   sync.Mutex
}

func NewServer(db *recognition.FaceDatabase) *Server {
    s := &Server{
        router:    mux.NewRouter(),
        db:        db,
        upgrader:  websocket.Upgrader{
            CheckOrigin: func(r *http.Request) bool { return true },
        },
        wsClients: make(map[*websocket.Conn]bool),
    }
    
    s.routes()
    return s
}

func (s *Server) routes() {
    // API routes
    s.router.HandleFunc("/api/upload", s.handleUpload).Methods("POST")
    s.router.HandleFunc("/api/stats", s.handleStats).Methods("GET")
    s.router.HandleFunc("/api/visitors", s.handleVisitors).Methods("GET")
    s.router.HandleFunc("/ws", s.handleWebSocket)
    
    // Static files
    s.router.PathPrefix("/uploads/").Handler(
        http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))),
    )
}

func (s *Server) handleUpload(w http.ResponseWriter, r *http.Request) {
    err := r.ParseMultipartForm(10 << 20) // 10 MB
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    file, header, err := r.FormFile("image")
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    defer file.Close()
    
    filename := header.Filename
    filepath := filepath.Join("./uploads", filename)
    
    dst, err := os.Create(filepath)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer dst.Close()
    
    if _, err := io.Copy(dst, file); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{
        "message": "Upload successful",
        "path":    filename,
    })
}

func (s *Server) handleStats(w http.ResponseWriter, r *http.Request) {
    stats := s.db.GetStats()
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(stats)
}

func (s *Server) handleVisitors(w http.ResponseWriter, r *http.Request) {
    s.db.Mu.RLock()
    defer s.db.Mu.RUnlock()
    
    visitors := make([]recognition.Person, 0, len(s.db.People))
    for _, person := range s.db.People {
        visitors = append(visitors, *person)
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(visitors)
}

func (s *Server) handleWebSocket(w http.ResponseWriter, r *http.Request) {
    conn, err := s.upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
        return
    }
    
    s.wsMutex.Lock()
    s.wsClients[conn] = true
    s.wsMutex.Unlock()
    
    log.Println("New WebSocket client connected")
}

func (s *Server) BroadcastResult(result models.RecognitionResult) {
    s.wsMutex.Lock()
    defer s.wsMutex.Unlock()
    
    for client := range s.wsClients {
        err := client.WriteJSON(result)
        if err != nil {
            log.Printf("WebSocket error: %v", err)
            client.Close()
            delete(s.wsClients, client)
        }
    }
}

func (s *Server) Start(addr string) error {
    c := cors.New(cors.Options{
        AllowedOrigins:   []string{"*"},
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
        AllowedHeaders:   []string{"*"},
        AllowCredentials: true,
    })
    
    handler := c.Handler(s.router)
    log.Printf("Server starting on %s", addr)
    return http.ListenAndServe(addr, handler)
}