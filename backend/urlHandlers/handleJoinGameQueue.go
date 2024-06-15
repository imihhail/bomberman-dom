package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleJoinGameQueue(w http.ResponseWriter, r *http.Request) {
	fmt.Println("HandleJoinGameQueue attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		cookie, err := r.Cookie("socialNetworkSession")
		userId := validators.ValidateUserSession(cookie.Value)
		callback["login"] = "success"
		if len(validators.ValidateQueue()) < 4 {
			valid := validators.ValidateJoinQueue(userId)
			if valid {
				callback["join"] = "success"
			} else {
				callback["join"] = "fail"
			}
		} else {
			callback["join"] = "fail"
		}

		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandleStatus", err)
		w.Write(writeData)
	}
}
