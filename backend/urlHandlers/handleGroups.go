package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleGroups(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Groups attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		callback["login"] = "success"

		cookie, err := r.Cookie("socialNetworkSession")
		sessionEmail := validators.ValidateEmailFromSession(cookie.Value)
		callback["currentUserEmail"] = sessionEmail
		callback["groups"] = validators.ValidateGroups()
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandleGroups", err)
		w.Write(writeData)
	}
}
