package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleUserList(w http.ResponseWriter, r *http.Request) {
	fmt.Println("UserList attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		callback["login"] = "success"

		cookie, err := r.Cookie("socialNetworkSession")

		callback["userList"], callback["activeUser"] = validators.ValidateUserList(cookie.Value)
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("handleLogin", err)
		w.Write(writeData)
	}
}
