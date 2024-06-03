package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleChatMessages(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get Message attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		callback["login"] = "success"

		cookie, err := r.Cookie("socialNetworkSession")
		// fetch return messages
		partnerId := r.FormValue("partner")
		callback["messages"] = validators.ValidateUserMessages(cookie.Value, partnerId)
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("handleLogin", err)
		w.Write(writeData)
	}
}
