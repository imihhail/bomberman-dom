package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"net/http"
	"time"
)

func StartHandlers(r *http.ServeMux) {
	r.HandleFunc("/login", HandleLogin)
	r.HandleFunc("/register", HandleRegistration)
	r.HandleFunc("/status", HandleStatus)
	r.HandleFunc("/logout", HandleLogout)
	r.HandleFunc("/profile", HandleProfile)
	r.HandleFunc("/newprivacy", HandleNewPrivacy)
	r.HandleFunc("/posts", HandlePosts)
	r.HandleFunc("/newpost", HandleNewPost)
	r.HandleFunc("/comments", HandleComments)
	r.HandleFunc("/newcomment", HandleNewComment)
	r.HandleFunc("/groups", HandleGroups)
	r.HandleFunc("/newgroup", HandleNewGroup)
	r.HandleFunc("/websocket", HandleSocket)
	r.HandleFunc("/userlist", HandleUserList)
	r.HandleFunc("/messages", HandleChatMessages)
	r.HandleFunc("/notificationresponse", HandleNotificationResponse)
	r.HandleFunc("/notifications", HandleNotifications)
	r.HandleFunc("/groupcontent", HandleGroupContent)
	r.HandleFunc("/newgrouppost", HandleNewGroupPost)
	r.HandleFunc("/grouppostcomments", HandleGroupPostComments)
	r.HandleFunc("/newgroupcomment", HandleGetGroupPostComments)
	r.HandleFunc("/groupmessages", HandleGetGroupMessages)
	r.HandleFunc("/activequeue", HandleActiveQueue)
	r.HandleFunc("/joingamequeue", HandleJoinGameQueue)
	r.Handle("/avatar/", http.StripPrefix("/avatar/", http.FileServer(http.Dir("./database/images"))))
}

func handleSession(w http.ResponseWriter, r *http.Request) bool {
	cookie, err := r.Cookie("socialNetworkSession")
	if err != nil || validators.ValidateUserSession(cookie.Value) == "0" {
		var callback = make(map[string]string)
		// check status
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
		helpers.CheckErr("handleSession", err)
		w.Write(writeData)
		return false
	}
	return true
}
