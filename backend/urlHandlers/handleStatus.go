package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleStatus(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Status attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]string)
		cookie, err := r.Cookie("socialNetworkSession")
		userId := validators.ValidateUserSession(cookie.Value)

		callback["login"] = "success"
		callback["userid"] = userId
		callback["useravatar"] = validators.ValidateUserAvatar(userId)
		callback["useremail"] = validators.ValidateUserEmailFromId(userId)

		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandleStatus", err)
		w.Write(writeData)
	}
}
