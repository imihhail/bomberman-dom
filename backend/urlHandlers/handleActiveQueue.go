package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"
)

var (
	isCountdownRunning bool
	countdownMutex     sync.Mutex
	lobbyFull          bool
	gameStarted        bool
)

func HandleActiveQueue(w http.ResponseWriter, r *http.Request) {
	fmt.Println("HandleActiveQueue attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		cookie, err := r.Cookie("socialNetworkSession")
		userId := validators.ValidateUserSession(cookie.Value)
		callback["login"] = "success"
		callback["userid"] = userId
		callback["useremail"] = validators.ValidateUserEmailFromId(userId)
		queue := validators.ValidateQueue()
		callback["gameQueue"] = queue
		var gameParty []string

		for i := 0; i < len(queue); i++ {
			gameParty = append(gameParty, queue[i].LobbyId)
		}

		if len(queue) >= 1 {
			var msg SocketMessage
			msg.Type = "gameLogic"
			msg.GameStatus = "Start"
			msg.GameParty = gameParty
			broadcast <- msg
		}

		if len(queue) == 3 {
			lobbyFull = true
		}

		if len(queue) == 2 {
			countdownMutex.Lock()
			if !isCountdownRunning {
				isCountdownRunning = true
				countdownMutex.Unlock()

				go func() {
					countdown := 20
					var msg SocketMessage

					for countdown > -1 {
						if lobbyFull {
							countdown = 10
							lobbyFull = false
							gameStarted = true
							var msg SocketMessage
							msg.Type = "gameLogic"
							msg.GameStatus = "Prepare"
							msg.GameParty = gameParty
							broadcast <- msg
						}

						time.Sleep(1 * time.Second)
						msg.Type = "countDown"
						msg.CountDown = countdown
						broadcast <- msg
						countdown--

						if !gameStarted && countdown == -1 {
							countdown = 10
							var msg SocketMessage
							msg.Type = "gameLogic"
							msg.GameStatus = "Prepare"
							msg.GameParty = gameParty
							broadcast <- msg
							gameStarted = true
						}
					}
					countdownMutex.Lock()
					isCountdownRunning = false
					countdownMutex.Unlock()
					fmt.Println("FIGHT!!!")
				}()
			} else {
				countdownMutex.Unlock()
			}
		}

		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandleStatus", err)
		w.Write(writeData)
	}
}
