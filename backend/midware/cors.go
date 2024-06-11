package midware

import (
	"net/http"
)

func CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch origin := r.Header.Get("Origin"); origin {
		case "http://localhost:3000",
			"ws://localhost:3000",
			"http://www.devpipe.ee",
			"http://devpipe.ee",
			"wss://www.devpipe.ee",
			"wss://devpipe.ee",
			"ws://www.devpipe.ee",
			"ws://devpipe.ee",
			"https://www.devpipe.ee",
			"https://devpipe.ee",
			"http://192.168.0.11:3000/":
			(w).Header().Set("Access-Control-Allow-Origin", origin)
		}
		(w).Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		(w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		(w).Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
