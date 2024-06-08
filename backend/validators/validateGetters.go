package validators

import (
	"backend/database"
	"backend/helpers"
	"backend/structs"

	"github.com/google/uuid"
)

// check if username or email exists in users table
func ValidateUserRegistration(email, username string) (bool, bool) {
	email = helpers.StandardizeName(email)
	emailExists := database.GetEmailIfExists(email)
	if len(username) > 0 {
		username = helpers.StandardizeName(username)
		usernameExists := database.GetUsernameIfExists(username)
		return emailExists, usernameExists
	}
	return emailExists, false
}

// check if username and password match
func ValidateUserLogin(email, password string) (bool, string, string) {
	email = helpers.StandardizeName(email)
	userId, userPsw := database.GetUserIdPswByEmail(email)
	if userId != "0" {
		if helpers.CheckPassword(password, userPsw) {
			hash := uuid.New().String()
			// set user and UUID in DB
			database.SetToSessions(userId, hash)
			return true, hash, userId
		} else {
			return false, "Password error", "0"
		}
	} else {
		return false, "Email error", "0"
	}
}

// check if user has valid session
func ValidateUserSession(cookie string) string {
	return database.GetUserSession(cookie)
}

// provide user profile from db by email
func ValidateUserProfile(requestedEmail string) structs.Profile {
	var userId string
	userId = database.GetUserIdByEmail(requestedEmail)

	// get user profile by userid
	return database.GetUserProfile(userId)
}

func ValidatePosts(userId string) []structs.Posts {
	return database.GetAllPosts(userId)
}

func ValidateGroupPosts(groupId string) []structs.GroupPosts {
	return database.GetGroupPosts(groupId)
}

func ValidateNewPost() structs.Posts {
	return database.GetNewPost()
}
func ValidateUserList(hash string) ([]structs.Profile, string) {
	userId := database.GetUserSession(hash)
	return database.GetAllUsers(userId), userId
}

// provide user profile posts from db by email
func ValidateProfilePosts(requestedEmail string) []structs.ProfilePosts {
	var userId string
	userId = database.GetUserIdByEmail(requestedEmail)

	// get user profile posts by userid
	return database.GetProfilePosts(userId)
}

func ValidateComments(postID string) []structs.Comments {
	return database.GetAllComments(postID)
}

func ValidateGroupPostComments(groupPostID string) []structs.Comments {
	return database.GetGroupPostComments(groupPostID)
}

func ValidateNewComments() structs.Comments {
	return database.GetNewComment()
}
func ValidateUserMessages(hash, partnerId string) []structs.ChatMessage {
	// get userid by hash
	userId := database.GetUserSession(hash)
	// get user profile posts by userid
	return database.GetMessages(userId, partnerId)
}

func ValidateGroupMessages(groupId, hash string) []structs.GroupMessage {
	// get userid by hash
	userId := database.GetUserSession(hash)
	// get user profile posts by userid
	return database.GetGroupMessages(groupId, userId)
}

func ValidateUserPrivacyHash(hash string) string {
	// get userid by hash
	userId := database.GetUserSession(hash)
	// get user profile privacy by userid
	return database.GetUserPrivacy(userId)
}

func ValidateUserPrivacyId(userId string) string {
	// get user profile privacy by userid
	return database.GetUserPrivacy(userId)
}

func ValidateGroups() []structs.Groups {
	return database.GetAllGroups()
}

func ValidateNewGroup() structs.NewGroup {
	return database.GetNewGroup()
}

func ValidateNotifications(UserId string) []structs.GrInvNotifications {
	return database.GetNotifications(UserId)
}

func ValidateEventNotifications(UserId string) []structs.EventNotifications {
	return database.GetEventNotifications(UserId)
}

func ValidateGetGroupMembers(groupId string) []structs.GroupMember {
	return database.GetGroupMembers(groupId)
}

func ValidateUserProfileInfo(sessionId string, targetUserId string, followingUser bool) (structs.Profile, error) {
	if targetUserId == "" {
		targetUserId = sessionId
	}
	return database.GetUserProfileInfo(sessionId, targetUserId, followingUser)
}

func ValidateUserProfilePosts(sessionId string, targetUserId string, followingUser bool) ([]structs.Posts, error) {
	if targetUserId == "" {
		targetUserId = sessionId
	}
	return database.GetUserProfilePosts(sessionId, targetUserId, followingUser)
}

func ValidateGroupEvents(groupId string) []structs.Events {
	return database.GetGroupEvents(groupId)
}

func ValidateUserAvatar(userId string) string {
	return database.GetUserAvatar(userId)
}

func ValidateUserEmailFromId(userId string) string {
	return database.GetUserEmailWithId(userId)
}

func ValidateEmailFromSession(session string) string {
	// get email by sessionID
	email := database.GetEmailFromSession(session)
	return email
}

func ValidateGroupRequests(userId string) []structs.GrInvNotifications {
	return database.GetGroupRequests(userId)
}

func ValidateFollowRequests(userId string) []structs.FollowRequests {
	return database.GetFollowRequests(userId)
}

func ValidateFollowers(userId string) []structs.FollowRequests {
	return database.GetFollowers(userId)
}

func ValidateFollowing(userId string) []structs.FollowRequests {
	return database.GetFollowing(userId)
}

func ValidateQueue() []structs.GameQueue{
	return database.GetQueue()
}
