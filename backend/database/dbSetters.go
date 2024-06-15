package database

import (
	"backend/database/sqlite"
	"backend/helpers"
	"fmt"
	"time"
)

func SetToUsers(email, password, firstName, lastName string, date_of_birth time.Time, avatar, username, aboutuser string) {
	db := sqlite.DbConnection()
	command := "INSERT INTO users(email, password, first_name, last_name, date_of_birth, username, about_user, avatar) VALUES(?, ?, ?, ?, ?, ?, ?, ?)"
	_, err := db.Exec(command, email, password, firstName, lastName, date_of_birth, username, aboutuser, avatar)
	helpers.CheckErr("SetToUsers", err)
	defer db.Close()
}

func SetToSessions(userId, hash string) {
	db := sqlite.DbConnection()
	command := "INSERT OR REPLACE INTO session(user_fk_users, hash, date) VALUES(?, ?,datetime('now', '+2 hours'))"
	_, err := db.Exec(command, userId, hash)
	helpers.CheckErr("SetToSessions", err)
	defer db.Close()
}

func SetRemoveHash(hash string) {
	db := sqlite.DbConnection()
	command := "DELETE FROM session WHERE hash=?"
	_, err := db.Exec(command, hash)
	helpers.CheckErr("SetRemoveHash", err)
	defer db.Close()
}

func SetNewPost(user, title, postContent, image, privacy string) {
	db := sqlite.DbConnection()
	command := "INSERT INTO posts (user_fk_users, post_title, post_content, post_image, privacy_fk_posts_privacy, date) VALUES(?, ?, ?, ?, ?, datetime('now', '+3 hours'))"
	_, err := db.Exec(command, user, title, postContent, image, privacy)
	helpers.CheckErr("SetNewPost", err)
	defer db.Close()
}

func SetNewGroupPost(user, title, postContent, group, image string) {
	db := sqlite.DbConnection()
	command := "INSERT INTO group_posts (user_fk_users, post_title, post_content, post_image, guildid_fk_guilds, date) VALUES(?, ?, ?, ?, ?, datetime('now', '+2 hours'))"
	_, err := db.Exec(command, user, title, postContent, image, group)
	helpers.CheckErr("SetNewPost", err)
	defer db.Close()
}

func SetNewComment(user, commenContent, image, postID string) {
	db := sqlite.DbConnection()
	command := "INSERT INTO comments (user_fk_users, comment_content, comment_image, post_Id_fk_posts, date) VALUES(?, ?, ?, ?, datetime('now', '+2 hours'))"
	_, err := db.Exec(command, user, commenContent, image, postID)
	helpers.CheckErr("SetNewComment", err)
	defer db.Close()
}

func SetNewGroupComment(user, commenContent, image, postID string) {
	db := sqlite.DbConnection()
	command := "INSERT INTO group_post_comments (user_fk_users, comment_content, comment_image, post_Id_fk_group_posts, date) VALUES(?, ?, ?, ?, datetime('now', '+2 hours'))"
	_, err := db.Exec(command, user, commenContent, image, postID)
	helpers.CheckErr("SetNewGroupComment", err)
	defer db.Close()
}

func SetNewMessage(messageSender, message, messageReceiver string) {
	db := sqlite.DbConnection()
	command := "INSERT INTO messages (message_sender_fk_users, message, message_receiver_fk_users, date) VALUES(?, ?, ?, datetime('now', '+3 hours'))"
	_, err := db.Exec(command, messageSender, message, messageReceiver)
	helpers.CheckErr("SetNewMessage", err)
	defer db.Close()
}

func SetNewGroupMessage(messageSender, message, group string) {
	db := sqlite.DbConnection()
	command := "INSERT INTO group_messages (message_sender_fk_users, message, guild_fk_guilds, date) VALUES(?, ?, ?, datetime('now', '+3 hours'))"
	_, err := db.Exec(command, messageSender, message, group)
	helpers.CheckErr("SetNewGroupMessage", err)
	defer db.Close()
}

// SetUserPrivacy sets user privacy settings, it currently uses posts_privacy_table values
// since the privacy settings values are the same for both users and posts
// dunno, might be a bad idea
func SetUserPrivacy(userId, privacyNmbr string) {
	db := sqlite.DbConnection()
	command := "INSERT OR REPLACE INTO user_privacy(user_fk_users, privacy_fk_users_privacy) VALUES(?, ?)"
	_, err := db.Exec(command, userId, privacyNmbr)
	helpers.CheckErr("SetUserPrivacy", err)
	defer db.Close()
}

func SetNewGroup(user, title, description string) {
	db := sqlite.DbConnection()

	command := "INSERT INTO guilds (creator_fk_users, guild_title, guild_description, date) VALUES(?, ?, ?, datetime('now', '+2 hours'))"
	_, err := db.Exec(command, user, title, description)
	helpers.CheckErr("SetNewGroup", err)

	var guildID int
	err = db.QueryRow("SELECT last_insert_rowid()").Scan(&guildID)
	helpers.CheckErr("SetNewGroup error getting inserted guildID", err)

	command = "INSERT INTO guildmembers (guild_id_fk_guilds, members_fk_users) VALUES (?, ?)"
	_, err = db.Exec(command, guildID, user)
	helpers.CheckErr("SetNewGroup error inserting guild creator into guildmembers table", err)

	defer db.Close()
}

func SetNewGroupNotification(messageSender, groupId, messageReceiver string) (string, string) {
	db := sqlite.DbConnection()
	defer db.Close()

	var notificationCount int
	var memberCount int

	err := db.QueryRow("SELECT COUNT(*) FROM guildnotifications WHERE reciever_fk_users = ? AND guildid_fk_guilds = ?", messageReceiver, groupId).Scan(&notificationCount)
	if err != nil {
		helpers.CheckErr("SetNewGroupNotification - NotificationCount: ", err)
		return "", ""
	}

	// Dont insert member or notification in table if they are already in table
	err = db.QueryRow("SELECT COUNT(*) FROM guildmembers WHERE members_fk_users = ? AND guild_id_fk_guilds = ?", messageReceiver, groupId).Scan(&memberCount)
	if err != nil {
		helpers.CheckErr("SetNewGroupNotification - MemberCount: ", err)
		return "", ""
	}

	if memberCount > 0 || notificationCount > 0 {
		return "", ""
	}

	var id string
	command := "INSERT INTO guildnotifications (sender_fk_users, reciever_fk_users, guildid_fk_guilds, date) VALUES(?, ?, ?, datetime('now', '+2 hours')) returning id"
	err = db.QueryRow(command, messageSender, messageReceiver, groupId).Scan(&id)
	helpers.CheckErr("SetNewGroupNotification - Insert: ", err)

	command = "SELECT email FROM users WHERE id = ?"
	row := db.QueryRow(command, messageSender)

	var email string
	err = row.Scan(&email)
	helpers.CheckErr("GetEmail - Scan: ", err)

	return email, id
}

func SetNewGroupMember(groupId, userId, userResponse, notfType string) {
	if userResponse == "accept" {
		db := sqlite.DbConnection()
		command := "INSERT INTO guildmembers (guild_id_fk_guilds, members_fk_users) VALUES (?, ?)"
		_, err := db.Exec(command, groupId, userId)
		helpers.CheckErr("SetNewGroupMember", err)
		defer db.Close()
	}

	if notfType == "groupInvatation" {
		db := sqlite.DbConnection()
		command := "DELETE FROM guildnotifications WHERE guildid_fk_guilds=? AND reciever_fk_users=?"
		_, err := db.Exec(command, groupId, userId)
		helpers.CheckErr("SetNewGroupMember remove groupInvatation notification", err)
		defer db.Close()
	}

	if notfType == "groupRequest" {
		db := sqlite.DbConnection()
		command := "DELETE FROM guildrequests WHERE guildid_fk_guilds=? AND sender_fk_users=?"
		_, err := db.Exec(command, groupId, userId)
		helpers.CheckErr("SetNewGroupMember remove groupRequest notification", err)
		defer db.Close()
	}
}

func SetNewEventParticipant(groupId, eventId, notificationId, userId, userResponse string) {
	if userResponse == "accept" {
		db := sqlite.DbConnection()
		command := "INSERT INTO event_participants (guild_id_fk_guilds, event_id_fk_events, participant_fk_users) VALUES (?, ?, ?)"
		_, err := db.Exec(command, groupId, eventId, userId)
		helpers.CheckErr("SetNewEventParticipant insert: ", err)
		defer db.Close()
	}

	db := sqlite.DbConnection()
	command := "DELETE FROM event_notifications WHERE id = ?"
	_, err := db.Exec(command, notificationId)
	helpers.CheckErr("SetNewEventParticipant remove notification: ", err)
	defer db.Close()
}

func SetNewEvent(groupId, eventCreatorId, title, description, eventTime, participation string) (string, string) {
	fmt.Println("TIME!!!", eventTime)
	t, err := time.Parse(time.RFC3339, eventTime)
	if err != nil {
		fmt.Println("Error parsing time:", err)
	}
	newTime := t.Add(3 * time.Hour).Format(time.RFC3339)
	fmt.Println("NEWTIME", newTime)

	db := sqlite.DbConnection()
	defer db.Close()

	var id, email string
	command := "INSERT INTO events (guildid_fk_guilds, creator_fk_users, event_title, event_description, event_time) VALUES (?, ?, ?, ?, ?) returning id"
	err = db.QueryRow(command, groupId, eventCreatorId, title, description, newTime).Scan(&id)
	if err != nil {
		helpers.CheckErr("SetNewEvent", err)
	}

	// Add eventcreator to eventparticipationlist if he chose 'Going'
	if participation == "1" {
		db := sqlite.DbConnection()
		command := "INSERT INTO event_participants (guild_id_fk_guilds, event_id_fk_events, participant_fk_users) VALUES (?, ?, ?)"
		_, err := db.Exec(command, groupId, id, eventCreatorId)
		helpers.CheckErr("SetNewEvent creator to event_participants insert: ", err)
		defer db.Close()
	}

	command = "SELECT email FROM users WHERE id = ?"
	row := db.QueryRow(command, eventCreatorId)

	err = row.Scan(&email)
	helpers.CheckErr("GetEmail - Scan: ", err)
	return id, email
}

func SetNewEventNotification(fromId, groupId, eventID, eventReciever string) string {
	db := sqlite.DbConnection()
	defer db.Close()

	var id string
	command := "INSERT INTO event_notifications (sender_fk_users, guild_id_fk_guilds, event_id_fk_events, reciever_fk_users) VALUES(?, ?, ?, ?) returning id"
	err := db.QueryRow(command, fromId, groupId, eventID, eventReciever).Scan(&id)
	helpers.CheckErr("SetNewGroupNotification - Insert: ", err)

	return id
}

func SetNewGroupRequest(groupId, messageSender, messageReceiver string) string {
	db := sqlite.DbConnection()
	defer db.Close()

	var notificationCount int

	err := db.QueryRow("SELECT COUNT(*) FROM guildrequests WHERE sender_fk_users = ? AND guildid_fk_guilds = ?", messageSender, groupId).Scan(&notificationCount)
	if err != nil {
		helpers.CheckErr("SetNewGroupRequest - NotificationCount: ", err)
		return ""
	}

	if notificationCount > 0 {
		return ""
	}

	var id string
	command := "INSERT INTO guildrequests (guildid_fk_guilds, sender_fk_users, reciever_fk_users) VALUES(?, ?, ?) returning id"
	err = db.QueryRow(command, groupId, messageSender, messageReceiver).Scan(&id)
	helpers.CheckErr("SetNewGroupRequest - Insert: ", err)

	return id
}

func SetNewFollowNotification(fromId, touser string) string {
	db := sqlite.DbConnection()
	defer db.Close()

	privacy := GetUserPrivacy(touser)

	var followerCount int
	err := db.QueryRow("SELECT COUNT(*) FROM followers WHERE from_user_fk_users = ? AND to_user_fk_users = ?", fromId, touser).Scan(&followerCount)
	if err != nil {
		helpers.CheckErr("SetNewFollowNotification - Followercount: ", err)
		return ""
	}

	if followerCount > 0 {
		return ""
	}

	if privacy == "1" {
		command := "INSERT INTO followers (from_user_fk_users, to_user_fk_users) VALUES (?, ?)"
		_, err = db.Exec(command, fromId, touser)
		helpers.CheckErr("SetNewFollowet insert: ", err)
		defer db.Close()
		return ""
	}

	var notificationCount int
	err = db.QueryRow("SELECT COUNT(*) FROM followrequests WHERE from_user_fk_users = ? AND to_user_fk_users = ?", fromId, touser).Scan(&notificationCount)
	if err != nil {
		helpers.CheckErr("SetNewFollowNotification - NotificationCount: ", err)
		return ""
	}

	if notificationCount > 0 {
		return ""
	}

	command := "INSERT INTO followrequests (from_user_fk_users, to_user_fk_users) VALUES(?, ?)"
	_, err = db.Exec(command, fromId, touser)
	helpers.CheckErr("SetNewFollowNotification - Insert: ", err)

	var email string
	command = "SELECT email FROM users WHERE id = ?"
	row := db.QueryRow(command, fromId)

	err = row.Scan(&email)
	helpers.CheckErr("SetNewFollowNotification GetEmail - Scan: ", err)

	return email
}

func SetNewFollower(followSender, followReciever, userResponse string) {
	if userResponse == "accept" {
		db := sqlite.DbConnection()
		command := "INSERT INTO followers (from_user_fk_users, to_user_fk_users) VALUES (?, ?)"
		_, err := db.Exec(command, followSender, followReciever)
		helpers.CheckErr("SetNewFollowet insert: ", err)
		defer db.Close()
	}

	db := sqlite.DbConnection()
	command := "DELETE FROM followrequests WHERE from_user_fk_users = ? AND to_user_fk_users = ?"
	_, err := db.Exec(command, followSender, followReciever)
	helpers.CheckErr("SetNewFollowe remove notification: ", err)
	defer db.Close()
}

func Unfollow(userId, unfollowId string) {
	db := sqlite.DbConnection()
	command := "DELETE FROM followers WHERE from_user_fk_users = ? AND to_user_fk_users = ?"
	_, err := db.Exec(command, userId, unfollowId)
	helpers.CheckErr("SetNewFollowet insert: ", err)
	defer db.Close()
}

func JoinQueue(userId string) bool {
	db := sqlite.DbConnection()
	defer db.Close()
	var id string
	command := "INSERT INTO gamequeue (user_fk_users) VALUES (?) returning id"
	err := db.QueryRow(command, userId).Scan(&id)
	helpers.CheckErr("JoinQueue", err)
	if id != "0" {
		return true
	} else {
		return false
	}
}

func EmptyUserFromQueue(userId string) {
	db := sqlite.DbConnection()
	defer db.Close()
	command := "DELETE FROM gamequeue WHERE user_fk_users = ?"
	_, err := db.Exec(command, userId)
	helpers.CheckErr("EmptyQueue - Insert: ", err)

}

func EnterUserToActiveGame(uuid, userId, playerTag string) {
	db := sqlite.DbConnection()
	defer db.Close()
	command := "INSERT OR REPLACE INTO activegame (group_uuid, user_fk_users, player_tag) VALUES (?, ?, ?)"
	db.Exec(command, uuid, userId, playerTag)
}
