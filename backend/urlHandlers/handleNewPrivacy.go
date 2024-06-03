package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleNewPrivacy(w http.ResponseWriter, r *http.Request) {
	fmt.Println("NewPrivacy attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		callback["login"] = "success"
		
		err := r.ParseMultipartForm(10 << 20) // 10 MB
		if err != nil {
			http.Error(w, "HandleNewPrivacy; Error parsing form ", http.StatusInternalServerError)
			return
		}

		privacy := r.FormValue("privacy")

		cookie, err := r.Cookie("socialNetworkSession")
		UserID := validators.ValidateUserSession(cookie.Value)
		callback["newPrivacy"] = "accepted"

		validators.ValidateSetUserPrivacy(UserID, privacy)
		callback["SendNewPrivacy"] = validators.ValidateUserPrivacyHash(cookie.Value)
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandlePrivacy", err)
		w.Write(writeData)
	}
}
