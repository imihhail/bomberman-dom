package urlHandlers

import (
	"backend/helpers"
	"backend/structs"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleNotificationResponse(w http.ResponseWriter, r *http.Request) {
	fmt.Println("NotificationResponse attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		callback["login"] = "success"

		cookie, err := r.Cookie("socialNetworkSession")
		UserID := validators.ValidateUserSession(cookie.Value)
		var notificationResponse structs.GrInvNotifications

		err = json.NewDecoder(r.Body).Decode(&notificationResponse)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// Add user to group or event, depending if he accepted or declined
		if notificationResponse.NotificationType == "groupInvatation" {
			validators.ValidateSetNewGroupMember(notificationResponse.GroupId,
				UserID,
				notificationResponse.NotificationResponse,
				notificationResponse.NotificationType)
		}

		if notificationResponse.NotificationType == "event" {
			validators.ValidateSetNewEventParticipant(notificationResponse.GroupId,
				notificationResponse.EventId,
				notificationResponse.NotificationId,
				UserID,
				notificationResponse.NotificationResponse)
		}

		if notificationResponse.NotificationType == "groupRequest" {
			validators.ValidateSetNewGroupMember(notificationResponse.GroupId,
				notificationResponse.SenderId,
				notificationResponse.NotificationResponse,
				notificationResponse.NotificationType)
		}

		if notificationResponse.NotificationType == "followUser" {
			validators.ValidateSetNewFollower(notificationResponse.SenderId,
				UserID,
				notificationResponse.NotificationResponse)
		}
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("Handlenofiticationresp", err)
		w.Write(writeData)
	}
}
