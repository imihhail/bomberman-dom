package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
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

		if len(queue) > 1 {
			var msg SocketMessage
			msg.Type = "gameLogic"
			msg.GameStatus = "Start"
			msg.GameParty = gameParty
			broadcast <- msg
		}

		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandleStatus", err)
		w.Write(writeData)
	}
}
