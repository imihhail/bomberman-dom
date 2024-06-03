package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleGroupContent(w http.ResponseWriter, r *http.Request) {
	fmt.Println("GroupContent attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		callback["login"] = "success"

		cookie, err := r.Cookie("socialNetworkSession")
		userId := validators.ValidateUserSession(cookie.Value)
		callback["isGroupMember"] = false
		GroupId := r.FormValue("GroupId")

		groupMemebers := validators.ValidateGetGroupMembers(GroupId)

		// Send additional groupcontent if current user is groupmember
		for _, member := range groupMemebers {
			if member.Id == userId {
				callback["isGroupMember"] = true
				callback["groupMembers"] = groupMemebers
				callback["events"] = validators.ValidateGroupEvents(GroupId)
				break
			}
		}

		callback["posts"] = validators.ValidateGroupPosts(GroupId)
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandleGroupContent", err)
		w.Write(writeData)
	}
}
