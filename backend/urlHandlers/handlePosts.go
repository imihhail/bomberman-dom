package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandlePosts(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Posts attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		callback["login"] = "success"

		cookie, err := r.Cookie("socialNetworkSession")
		userId := validators.ValidateUserSession(cookie.Value)

		callback["posts"] = validators.ValidatePosts(userId)
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandlePosts", err)
		w.Write(writeData)
	}
}
