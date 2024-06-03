package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func HandleLogout(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Logout attempt!")

	var callback = make(map[string]string)
	cookie, err := r.Cookie("socialNetworkSession")
	if err != nil {
		fmt.Println("Cookie missing")
	} else {
		// remove cookie.Value from db
		validators.ValidateRemoveUserSession(cookie.Value)
	}

	// if not err and cookie valid
	sessionCookie := http.Cookie{
		Name:     "socialNetworkSession",
		Value:    "",
		Expires:  time.Now(),
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
		Secure:   true,
	}
	http.SetCookie(w, &sessionCookie)

	authCookie := http.Cookie{
		Name:     "socialNetworkAuth",
		Value:    "false",
		Expires:  time.Now(),
		Path:     "/",
		SameSite: http.SameSiteNoneMode,
		Secure:   true,
	}
	http.SetCookie(w, &authCookie)
	callback["login"] = "fail"
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandleLogout", err)
	w.Write(writeData)
}
