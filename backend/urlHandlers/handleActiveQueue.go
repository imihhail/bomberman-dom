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
		callback["gameQueue"] = validators.ValidateQueue()
		callback["useremail"] = validators.ValidateUserEmailFromId(userId)

		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandleStatus", err)
		w.Write(writeData)
	}
}
