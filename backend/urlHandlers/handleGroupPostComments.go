package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleGroupPostComments(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Comments attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		callback["login"] = "success"

		groupPostId := r.FormValue("groupPostId")
		callback["groupComments"] = validators.ValidateGroupPostComments(groupPostId)
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandlePosts", err)
		w.Write(writeData)
	}
}
