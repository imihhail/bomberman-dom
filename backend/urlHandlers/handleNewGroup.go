package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleNewGroup(w http.ResponseWriter, r *http.Request) {
	fmt.Println("New group attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		callback["login"] = "success"
		
		title := r.FormValue("title")
		description := r.FormValue("description")

		cookie, err := r.Cookie("socialNetworkSession")
		UserID := validators.ValidateUserSession(cookie.Value)
		validators.ValidateSetNewGroup(UserID, title, description)
		callback["newGroup"] = "accepted"
		callback["SendNewGroup"] = validators.ValidateNewGroup()
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandleNewGroup", err)
		w.Write(writeData)
	}
}
