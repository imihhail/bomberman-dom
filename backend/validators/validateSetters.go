package validators

import (
	"backend/database"
	"backend/helpers"
	"time"
)

// Create new user in users table
func ValidateSetToUsers(email, password, firstName, lastName, date_of_birth, avatar, username, aboutuser string) {
	email = helpers.StandardizeName(email)

	password, err := helpers.GenerateHashPassword(password)
	if err != nil {
		helpers.CheckErr("ValidateSetToUsers, password", err)
	}

	firstName = helpers.StandardizeName(firstName)
	lastName = helpers.StandardizeName(lastName)

	parsedDate, err := time.Parse("2006-01-02", date_of_birth)
	if err != nil {
		helpers.CheckErr("ValidateSetToUsers, convert Date", err)
	}
	if len(username) > 0 {
		username = helpers.StandardizeName(username)
	}

	database.SetToUsers(email, password, firstName, lastName, parsedDate, avatar, username, aboutuser)
}

func ValidateRemoveUserSession(hash string) {
	database.SetRemoveHash(hash)
}

func ValidateSetNewPost(user, title, postContent, image, privacy string) {
	database.SetNewPost(user, title, postContent, image, privacy)
}

func ValidateSetNewGroupPost(user, title, postContent, group, image string) {
	database.SetNewGroupPost(user, title, postContent, group, image)
}

func ValidateSetNewComment(user, commentContent, image, postID string) {
	database.SetNewComment(user, commentContent, image, postID)
}

func ValidateSetNewGroupComment(user, commentContent, image, postID string) {
	database.SetNewGroupComment(user, commentContent, image, postID)
}

func ValidateSetNewMessage(messageSender, message, messageReceiver string) {
	database.SetNewMessage(messageSender, message, messageReceiver)
}

func ValidateSetNewGroupMessage(messageSender, message, group string) {
	database.SetNewGroupMessage(messageSender, message, group)
}

func ValidateSetUserPrivacy(userId, privacyNmbr string) {
	database.SetUserPrivacy(userId, privacyNmbr)
}

func ValidateSetNewGroup(user, title, description string) {
	database.SetNewGroup(user, title, description)
}

func ValidateSetNewGroupNotification(messageSender, groupId, messageReceiver string) (string, string) {
	return database.SetNewGroupNotification(messageSender, groupId, messageReceiver)
}

func ValidateSetNewGroupMember(groupId, userId, userResponse, notfType string) {
	database.SetNewGroupMember(groupId, userId, userResponse, notfType)
}

func ValidateSetNewEvent(groupId, eventCreatorId, title, description, eventTime, participation string) (string, string) {
	return database.SetNewEvent(groupId, eventCreatorId, title, description, eventTime, participation)
}

func ValidateSetNewEventNotification(fromId, groupId, eventID, eventReciever string) string {
	return database.SetNewEventNotification(fromId, groupId, eventID, eventReciever)
}

func ValidateSetNewEventParticipant(groupId, eventId, notificationId, userId, userResponse string) {
	database.SetNewEventParticipant(groupId, eventId, notificationId, userId, userResponse)
}

func ValidateSetNewGroupRequest(groupId, messageSender, messageReceiver string) string {
	return database.SetNewGroupRequest(groupId, messageSender, messageReceiver)
}

func ValidateSetNewFollowNotification(fromId, touser string) string{
	return database.SetNewFollowNotification(fromId, touser)
}

func ValidateSetNewFollower(followSender, followReciever, userResponse string) {
	database.SetNewFollower(followSender, followReciever, userResponse)
}

func ValidateUnfollowUser(sessionId, unFollowId string) {
	database.Unfollow(sessionId, unFollowId)
}