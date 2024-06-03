package main

import (
	"backend/database/sqlite"
	"backend/midware"
	"backend/urlHandlers"
	"fmt"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	sqlite.Create()
	mux := http.NewServeMux()
	server := &http.Server{
		Addr: ":8080",
		// Addr:    ":443",
		Handler: midware.CorsMiddleware(mux),
	}
	urlHandlers.StartHandlers(mux)
	fmt.Println("Backend running on port 8080")
	// err := server.ListenAndServeTLS("/certs/fullchain.pem", "/certs/privkey.pem")
	err := server.ListenAndServe()
	if err != nil {
		panic(err)
	}
}
