package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleNotifications(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Notifications attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})

		cookie, err := r.Cookie("socialNetworkSession")
		UserID := validators.ValidateUserSession(cookie.Value)

		callback["login"] = "success"

		callback["groupInvNotifications"] = validators.ValidateNotifications(UserID)
		callback["eventNotifications"] = validators.ValidateEventNotifications(UserID)
		callback["groupRequests"] = validators.ValidateGroupRequests(UserID)
		callback["followRequests"] = validators.ValidateFollowRequests(UserID)
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandleNotificatons", err)
		w.Write(writeData)
	}
}
