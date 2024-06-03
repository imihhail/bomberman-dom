package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Login attempt!")

	email := r.PostFormValue("email")
	password := r.PostFormValue("password")

	// check user auth
	success, userCookie, userId := validators.ValidateUserLogin(email, password)
	var callback = make(map[string]string)
	if success {
		sessionCookie := http.Cookie{
			Name:     "socialNetworkSession",
			Value:    userCookie,
			Expires:  time.Now().Add(time.Minute * 500),
			Path:     "/",
			HttpOnly: true,
			SameSite: http.SameSiteNoneMode,
			Secure:   true,
		}
		http.SetCookie(w, &sessionCookie)

		authCookie := http.Cookie{
			Name:     "socialNetworkAuth",
			Value:    "true",
			Expires:  time.Now().Add(time.Minute * 500),
			Path:     "/",
			SameSite: http.SameSiteNoneMode,
			Secure:   true,
		}
		http.SetCookie(w, &authCookie)
		callback["login"] = "success"
		callback["userid"] = userId
		callback["useravatar"] = validators.ValidateUserAvatar(userId)
		callback["useremail"] = validators.ValidateUserEmailFromId(userId)
	} else {
		callback["login"] = "fail"
		callback["error"] = userCookie
	}

	writeData, err := json.Marshal(callback)
	helpers.CheckErr("handleLogin", err)
	w.Write(writeData)
}
