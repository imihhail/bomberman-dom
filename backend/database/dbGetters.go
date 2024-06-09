package database

import (
	"backend/database/sqlite"
	"backend/helpers"
	"backend/structs"
	"database/sql"
	"fmt"
)

// is email in table
func GetEmailIfExists(email string) bool {
	db := sqlite.DbConnection()
	var userId string
	command := "SELECT id FROM users WHERE email=?"
	err := db.QueryRow(command, email).Scan(&userId)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetEmailIfExists", err)
		}
		return false
	}
	defer db.Close()
	return true
}

// is username in table
func GetUsernameIfExists(username string) bool {
	db := sqlite.DbConnection()
	var userId string
	command := "SELECT id FROM users WHERE username=?"
	err := db.QueryRow(command, username).Scan(&userId)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetUsernameIfExists", err)
		}
		return false
	}
	defer db.Close()
	return true
}

// get userid and password by email
func GetUserIdPswByEmail(email string) (string, string) {
	db := sqlite.DbConnection()
	var userId string
	var userPsw string
	command := "SELECT id, password FROM users WHERE email=?"
	err := db.QueryRow(command, email).Scan(&userId, &userPsw)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetUserIdPswByEmail", err)
		}
		return "0", "Email error"
	}
	defer db.Close()
	return userId, userPsw
}

// get userid by email
func GetUserIdByEmail(email string) string {
	db := sqlite.DbConnection()
	var userId string
	command := "SELECT id FROM users WHERE email=?"
	err := db.QueryRow(command, email).Scan(&userId)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetUserIdByEmail", err)
		}
		return "0"
	}
	defer db.Close()
	return userId
}

// get userId session by hash from session table
func GetUserSession(cookie string) string {
	db := sqlite.DbConnection()
	command := "SELECT user_fk_users FROM session WHERE hash=?"
	err := db.QueryRow(command, cookie).Scan(&cookie)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetUserSession", err)
		}
		return "0"
	}
	defer db.Close()
	return cookie
}

func GetUserProfile(userId string) structs.Profile {
	db := sqlite.DbConnection()
	var userProfile structs.Profile
	command := "SELECT id, email, first_name, last_name, date_of_birth, username, about_user, avatar FROM users WHERE id=?"
	err := db.QueryRow(command, userId).Scan(&userProfile.Id,
		&userProfile.Email,
		&userProfile.FirstName,
		&userProfile.LastName,
		&userProfile.DateOfBirth,
		&userProfile.Username,
		&userProfile.AboutUser,
		&userProfile.Avatar)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("getUserProfile", err)
		}
		fmt.Println("User email not found in users table!")
	}
	defer db.Close()
	return userProfile
}

func GetProfilePosts(userId string) []structs.ProfilePosts {
	db := sqlite.DbConnection()
	var profilePosts []structs.ProfilePosts
	command := "SELECT id, user_fk_users, post_content, post_image, privacy_fk_posts_privacy, date FROM posts WHERE user_fk_users=?"
	rows, err := db.Query(command, userId)
	if err != nil {
		helpers.CheckErr("GetProfilePosts", err)
	}
	for rows.Next() {
		var profilePost structs.ProfilePosts
		err = rows.Scan(&profilePost.PostId,
			&profilePost.UserId,
			&profilePost.PostContent,
			&profilePost.Picture,
			&profilePost.PostPrivacy,
			&profilePost.Date)
		if err != nil {
			helpers.CheckErr("GetProfilePosts", err)
		}
		profilePosts = append(profilePosts, profilePost)
	}
	defer db.Close()
	fmt.Println("prof;ePosts: ", profilePosts)
	return profilePosts
}

func GetAllPosts(userId string) []structs.Posts {
	db := sqlite.DbConnection()
	defer db.Close()

	var allPosts []structs.Posts

	command := "SELECT posts.id, users.email, users.avatar, posts.post_Title, posts.post_content, posts.post_image, posts.privacy_fk_posts_privacy, posts.date, users.email, users.id FROM posts INNER JOIN users ON posts.user_fk_users == users.id ORDER BY posts.date DESC"
	rows, err := db.Query(command)
	if err != nil {
		helpers.CheckErr("getAllPosts", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var post structs.Posts

		err := rows.Scan(&post.PostID, &post.Username, &post.Avatar, &post.Title, &post.Content, &post.Picture, &post.Privacy, &post.Date, &post.Email, &post.UserId)
		if err != nil {
			helpers.CheckErr("getAllPosts", err)
			continue
		}

		if post.Privacy == "2" && post.UserId != userId {
			followers := GetFollowers(post.UserId)
			if len(followers) == 0 {
				continue
			}

			followerFound := false
			for _, follower := range followers {
				if follower.SenderId == userId {
					followerFound = true
					break
				}
			}
			if !followerFound {
				continue
			}
		}

		if post.Privacy == "3" && post.UserId != userId {
			followers := GetFollowers(post.UserId)
			following := GetFollowers(userId)

			isFollowing := false
			for _, follower := range followers {
				if follower.SenderId == userId {
					isFollowing = true
					break
				}
			}

			isFollowed := false
			for _, follower := range following {
				if follower.SenderId == post.UserId {
					isFollowed = true
					break
				}
			}
			if !isFollowing || !isFollowed {
				continue
			}

		}
		allPosts = append(allPosts, post)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("getAllPosts", err)
	}
	return allPosts
}

func GetGroupPosts(groupId string) []structs.GroupPosts {
	db := sqlite.DbConnection()
	defer db.Close()

	var allGroupPosts []structs.GroupPosts

	command := "SELECT group_posts.id, users.email, users.avatar, group_posts.post_title, group_posts.post_content, group_posts.post_image, group_posts.date, users.email, group_posts.guildid_fk_guilds, users.id FROM group_posts INNER JOIN users ON group_posts.user_fk_users == users.id WHERE group_posts.guildid_fk_guilds = ? ORDER BY group_posts.date DESC"
	rows, err := db.Query(command, groupId)
	if err != nil {
		helpers.CheckErr("GetGroupPosts", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var groupPost structs.GroupPosts
		err = rows.Scan(&groupPost.PostID, &groupPost.Username, &groupPost.Avatar, &groupPost.Title, &groupPost.Content, &groupPost.Picture, &groupPost.Date, &groupPost.Email, &groupPost.GroupId, &groupPost.UserId)
		if err != nil {
			helpers.CheckErr("GetGroupPosts", err)
			continue
		}
		allGroupPosts = append(allGroupPosts, groupPost)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetGroupPosts", err)
	}
	return allGroupPosts
}

func GetNewPost() structs.Posts {
	db := sqlite.DbConnection()
	var lastPost structs.Posts

	command := "SELECT posts.id, users.email, users.avatar, posts.post_title, posts.post_content, posts.post_image, posts.privacy_fk_posts_privacy, posts.date FROM posts INNER JOIN users ON posts.user_fk_users == users.id ORDER BY posts.date DESC LIMIT 1"
	err := db.QueryRow(command).Scan(&lastPost.PostID, &lastPost.Username, &lastPost.Avatar, &lastPost.Title, &lastPost.Content, &lastPost.Picture, &lastPost.Privacy, &lastPost.Date)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("getNewpost", err)
		}
		fmt.Println("Error selecting last post")
	}
	defer db.Close()
	return lastPost
}

func GetAllUsers(userId string) []structs.Profile {
	db := sqlite.DbConnection()
	var allUsers []structs.Profile

	command := "SELECT id, username, email FROM users"
	rows, err := db.Query(command)
	if err != nil {
		helpers.CheckErr("getAllPosts", err)
		return nil
	}

	for rows.Next() {
		var user structs.Profile
		err = rows.Scan(&user.Id, &user.Username, &user.Email)
		if err != nil {
			helpers.CheckErr("getAllPosts", err)
			continue
		}

		follow := false
		followers := GetFollowers(userId)
		following := GetFollowing(userId)

		for _, follower := range followers {
			if follower.SenderId == user.Id {
				follow = true
				break
			}
		}

		for _, follower := range following {
			if follower.SenderId == user.Id {
				follow = true
				break
			}
		}

		if user.Id != userId && follow {
			allUsers = append(allUsers, user)
		}
	}

	defer rows.Close()

	defer db.Close()
	return allUsers
}

func GetAllComments(postID string) []structs.Comments {
	db := sqlite.DbConnection()
	defer db.Close()

	var allComments []structs.Comments

	command := "SELECT users.username, users.avatar, comments.comment_content, comments.comment_image, comments.date FROM comments INNER JOIN users ON user_fk_users == users.id where post_Id_fk_posts = ? ORDER BY comments.date DESC"
	rows, err := db.Query(command, postID)
	if err != nil {
		helpers.CheckErr("getAllComments", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var comment structs.Comments
		err = rows.Scan(&comment.Username, &comment.Avatar, &comment.Content, &comment.Picture, &comment.Date)
		if err != nil {
			helpers.CheckErr("getAllComments loop: ", err)
			continue
		}
		allComments = append(allComments, comment)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("getAllComments rows: ", err)
	}
	return allComments
}

func GetGroupPostComments(postID string) []structs.Comments {
	db := sqlite.DbConnection()
	defer db.Close()

	var allComments []structs.Comments

	command := "SELECT users.username, users.avatar, group_post_comments.comment_content, group_post_comments.comment_image, group_post_comments.date FROM group_post_comments INNER JOIN users ON user_fk_users == users.id where post_Id_fk_group_posts = ? ORDER BY group_post_comments.date DESC"
	rows, err := db.Query(command, postID)
	if err != nil {
		helpers.CheckErr("GetGroupPostComments", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var comment structs.Comments
		err = rows.Scan(&comment.Username, &comment.Avatar, &comment.Content, &comment.Picture, &comment.Date)
		if err != nil {
			helpers.CheckErr("GetGroupPostComments loop: ", err)
			continue
		}
		allComments = append(allComments, comment)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetGroupPostComments rows: ", err)
	}
	return allComments
}

func GetNewComment() structs.Comments {
	db := sqlite.DbConnection()
	var newComment structs.Comments

	command := "SELECT users.username, users.avatar, comments.comment_content, comments.comment_image, comments.date FROM comments INNER JOIN users ON user_fk_users == users.id ORDER BY comments.date DESC LIMIT 1"
	err := db.QueryRow(command).Scan(&newComment.Username, &newComment.Avatar, &newComment.Content, &newComment.Picture, &newComment.Date)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("getNewComment", err)
		}
		fmt.Println("Error selecting new comment")
	}
	defer db.Close()
	return newComment
}

// Get user privacy setting
func GetUserPrivacy(userId string) string {
	db := sqlite.DbConnection()
	var privacy string
	command := "SELECT privacy_fk_users_privacy FROM user_privacy WHERE user_fk_users=?"
	err := db.QueryRow(command, userId).Scan(&privacy)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetUserPrivacy", err)
		}
		return "0"
	}
	defer db.Close()
	return privacy
	// 1 = public, 2 = private, (3 = almost private)???
}

// get userid if email in table
func GetUserIdIfEmailExists(email string) string {
	db := sqlite.DbConnection()
	var userId string
	command := "SELECT id FROM users WHERE email=?"
	err := db.QueryRow(command, email).Scan(&userId)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetEmailIfExists", err)
		}
		return "no such email"
	}
	defer db.Close()
	return userId
}

func GetMessages(fromuser, touser string) []structs.ChatMessage {
	db := sqlite.DbConnection()
	var UserMessages []structs.ChatMessage
	command := `SELECT messages.*, users.avatar
				FROM messages
				INNER JOIN users ON messages.message_sender_fk_users = users.id
				WHERE (message_sender_fk_users = ? AND message_receiver_fk_users = ?) OR (message_receiver_fk_users = ? AND message_sender_fk_users = ?) 
				ORDER BY id`
	rows, err := db.Query(command, touser, fromuser, touser, fromuser)
	if err != sql.ErrNoRows {
		helpers.CheckErr("GetMessages", err)
	}
	defer db.Close()
	helpers.CheckErr("GetMessage", err)
	for rows.Next() {
		var message structs.ChatMessage
		rows.Scan(&message.ChatMessageId, &message.MessageSender, &message.Message, &message.MessageReceiver, &message.Date, &message.SenderAvatar)
		// Check if the logged in user is fetching own messages
		if touser == message.MessageReceiver {
			message.LoggedInUser = true
		} else {
			message.LoggedInUser = false
		}
		UserMessages = append(UserMessages, message)
	}
	defer rows.Close()
	return UserMessages
}

func GetGroupMessages(groupId, userId string) []structs.GroupMessage {
	db := sqlite.DbConnection()
	var UserMessages []structs.GroupMessage
	command := `SELECT group_messages.*, users.email, users.avatar
				FROM group_messages
				INNER JOIN users ON group_messages.message_sender_fk_users = users.id
				WHERE guild_fk_guilds = ?
				ORDER BY id`
	rows, err := db.Query(command, groupId)
	if err != sql.ErrNoRows {
		helpers.CheckErr("GetMessages", err)
	}
	defer db.Close()
	helpers.CheckErr("GetMessage", err)
	for rows.Next() {
		var groupMessage structs.GroupMessage
		rows.Scan(&groupMessage.GroupChatMessageId, &groupMessage.GroupChatMessageSender, &groupMessage.GroupChatMessage, &groupMessage.GroupChatId, &groupMessage.Date, &groupMessage.SenderEmail, &groupMessage.SenderAvatar)
		// Check if the logged in user is fetching own messages
		if userId == groupMessage.GroupChatMessageSender {
			groupMessage.LoggedInUser = true
		} else {
			groupMessage.LoggedInUser = false
		}
		UserMessages = append(UserMessages, groupMessage)
	}
	defer rows.Close()
	return UserMessages
}

func GetAllGroups() []structs.Groups {
	db := sqlite.DbConnection()
	defer db.Close()

	var allGroups []structs.Groups

	command := `SELECT guilds.id, guilds.creator_fk_users, users.email, guilds.guild_title, guilds.guild_description, guilds.date
				FROM guilds 
				INNER JOIN users ON guilds.creator_fk_users == users.id 
				GROUP BY guilds.id
				ORDER BY guilds.date DESC`

	rows, err := db.Query(command)
	if err != nil {
		helpers.CheckErr("Selecting getAllGroups", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var group structs.Groups
		err = rows.Scan(&group.Id, &group.CreatorId, &group.Creator, &group.Title, &group.Description, &group.Date)
		if err != nil {
			helpers.CheckErr("Iterating GetAllGroups", err)
			continue
		}
		allGroups = append(allGroups, group)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetAllGroups rows", err)
	}
	return allGroups
}

func GetNewGroup() structs.NewGroup {
	db := sqlite.DbConnection()
	var newGroup structs.NewGroup

	command := "SELECT guilds.id, guilds.creator_fk_users, users.username, users.id, guilds.guild_title, guilds.guild_description, guilds.date FROM guilds INNER JOIN users ON guilds.creator_fk_users == users.id ORDER BY guilds.date DESC LIMIT 1"
	err := db.QueryRow(command).Scan(&newGroup.Id, &newGroup.CreatorId, &newGroup.Creator, &newGroup.Members, &newGroup.Title, &newGroup.Description, &newGroup.Date)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("getNewGroup", err)
		}
		fmt.Println("Error selecting new group")
	}
	defer db.Close()
	return newGroup
}

func GetNotifications(currentUser string) []structs.GrInvNotifications {
	db := sqlite.DbConnection()
	defer db.Close()

	var allNotif []structs.GrInvNotifications

	command := `SELECT sender_fk_users, reciever_fk_users, email, guild_title, guildnotifications.id, guilds.id FROM guildnotifications
				INNER JOIN guilds ON guildnotifications.guildid_fk_guilds = guilds.id
				INNER JOIN users ON guildnotifications.sender_fk_users = users.id
				WHERE reciever_fk_users = ?`

	rows, err := db.Query(command, currentUser)
	if err != nil {
		helpers.CheckErr("GetNotifications selecting error: ", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var notif structs.GrInvNotifications

		err = rows.Scan(&notif.SenderId, &notif.RecieverId, &notif.SenderEmail, &notif.GroupTitle, &notif.NotificationId, &notif.GroupId)
		if err != nil {
			helpers.CheckErr("GetNotifications Next error: ", err)
			continue
		}
		allNotif = append(allNotif, notif)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetNotifications", err)
	}
	return allNotif
}

func GetEventNotifications(currentUser string) []structs.EventNotifications {
	db := sqlite.DbConnection()
	defer db.Close()

	var allNotif []structs.EventNotifications

	command := `SELECT event_notifications.id, sender_fk_users, reciever_fk_users, email, event_title, event_description, event_time, events.id, guild_id_fk_guilds, guild_title 
				FROM event_notifications
				INNER JOIN events ON event_notifications.event_id_fk_events = events.id
				INNER JOIN users ON event_notifications.sender_fk_users = users.id
				INNER JOIN guilds ON event_notifications.guild_id_fk_guilds = guilds.id
				WHERE reciever_fk_users = ?`

	rows, err := db.Query(command, currentUser)
	if err != nil {
		helpers.CheckErr("GetEventNotifications selecting error: ", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var notif structs.EventNotifications

		err = rows.Scan(&notif.NotificationId, &notif.SenderId, &notif.RecieverId, &notif.SenderEmail, &notif.EventTitle, &notif.EventDescription, &notif.EventTime, &notif.EventId, &notif.GroupId, &notif.GroupTitle)
		if err != nil {
			helpers.CheckErr("GetEventNotifications Next error: ", err)
			continue
		}
		allNotif = append(allNotif, notif)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetEventNotifications", err)
	}
	return allNotif
}

func GetGroupMembers(groupId string) []structs.GroupMember {
	db := sqlite.DbConnection()
	defer db.Close()

	var groupMembers []structs.GroupMember

	command := "SELECT members_fk_users, users.email FROM guildmembers INNER JOIN users ON members_fk_users  = users.id  WHERE guild_id_fk_guilds = ?"
	rows, err := db.Query(command, groupId)
	if err != nil {
		helpers.CheckErr("GetGroupMembers selecting error: ", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var member structs.GroupMember

		err = rows.Scan(&member.Id, &member.Email)
		if err != nil {
			helpers.CheckErr("GetGroupMembers Next error: ", err)
			continue
		}
		groupMembers = append(groupMembers, member)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetGroupMembers", err)
	}
	return groupMembers
}

func GetGroupEvents(groupId string) []structs.Events {
	db := sqlite.DbConnection()
	defer db.Close()

	var groupEvents []structs.Events

	command := `SELECT events.*, users.email 
				FROM events 
				INNER JOIN users ON events.creator_fk_users = users.id  
				WHERE guildid_fk_guilds = ?`

	rows, err := db.Query(command, groupId)
	if err != nil {
		helpers.CheckErr("GetGroupEvents select: ", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var event structs.Events

		err = rows.Scan(&event.EventId, &event.EventCreatorId, &event.GroupId, &event.EventTitle, &event.EventDescription, &event.EventTime, &event.CreatorEmail)
		if err != nil {
			helpers.CheckErr("GetGroupEvents loop: ", err)
			continue
		}

		command := `SELECT participant_fk_users, users.email FROM event_participants INNER JOIN users ON event_participants.participant_fk_users = users.id WHERE event_participants.event_id_fk_events = ?`
		rows, err := db.Query(command, event.EventId)
		if err != nil {
			helpers.CheckErr("GetGroupEvents selecting participants: ", err)
			return nil
		}
		defer rows.Close()

		for rows.Next() {
			var participant structs.EventParticipant

			err = rows.Scan(&participant.ParticipantId, &participant.ParticipantEmail)
			if err != nil {
				helpers.CheckErr("GetGroupEvents participants loop: ", err)
				continue
			}
			event.Participants = append(event.Participants, participant)
		}
		groupEvents = append(groupEvents, event)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetGroupEvents rows: ", err)
	}
	return groupEvents
}

func GetUserProfileInfo(currentUserId string, targetUserId string, followingUser bool) (structs.Profile, error) {
	db := sqlite.DbConnection()
	var userProfile structs.Profile
	var email string
	var avatar string

	command := ""
	if !followingUser {
		command = `
    SELECT u.id, u.email, u.first_name, u.last_name, u.date_of_birth, u.username, u.about_user, u.avatar, up.privacy_fk_users_privacy
    FROM users u
    INNER JOIN user_privacy up ON u.id = up.user_fk_users
    WHERE (up.privacy_fk_users_privacy = 1 AND u.id = ?)
        OR (u.id = ? AND u.id = ?)`

		err := db.QueryRow("SELECT email, avatar FROM users WHERE id = ?", targetUserId).Scan(&email, &avatar)
		if err != nil {
			helpers.CheckErr("GetUserProfileInfo - email scan", err)
		}

	} else {
		command = `
	SELECT u.id, u.email, u.first_name, u.last_name, u.date_of_birth, u.username, u.about_user, u.avatar, up.privacy_fk_users_privacy
	FROM users u
	INNER JOIN user_privacy up ON u.id = up.user_fk_users
	WHERE (u.id = ?)
		OR (u.id = ? AND u.id = ?)`
	}

	err := db.QueryRow(command, targetUserId, currentUserId, targetUserId).Scan(
		&userProfile.Id,
		&userProfile.Email,
		&userProfile.FirstName,
		&userProfile.LastName,
		&userProfile.DateOfBirth,
		&userProfile.Username,
		&userProfile.AboutUser,
		&userProfile.Avatar,
		&userProfile.Privacy)
	if err != nil {
		if err == sql.ErrNoRows {
			// No user with the given ID was found, or their privacy settings do not allow the current user to view their profile
			return structs.Profile{Privacy: "-1", Email: email, Avatar: avatar}, nil
		}
		helpers.CheckErr("GetUserProfileInfo: ", err)
		return structs.Profile{}, err
	}
	defer db.Close()
	return userProfile, nil
}

func GetUserProfilePosts(currentUserId string, targetUserId string, followingUser bool) ([]structs.Posts, error) {
	db := sqlite.DbConnection()
	var posts []structs.Posts

	isFollowed := false
	followers := GetFollowers(currentUserId)

	for _, follower := range followers {
		if follower.SenderId == targetUserId {
			isFollowed = true
			break
		}
	}

	command := ""
	if !followingUser {
		command = `
		SELECT p.id, p.post_title, p.post_content, p.post_image, p.privacy_fk_posts_privacy, p.date
		FROM posts p
		INNER JOIN users u ON p.user_fk_users = u.id
		INNER JOIN user_privacy up ON u.id = up.user_fk_users
		WHERE ((up.privacy_fk_users_privacy = 1 AND p.privacy_fk_posts_privacy = 1 AND u.id = ?)
			OR (u.id = ? AND u.id = ?))
	`
	} else if followingUser && isFollowed {
		command = `
		SELECT p.id, p.post_title, p.post_content, p.post_image, p.privacy_fk_posts_privacy, p.date
		FROM posts p
		INNER JOIN users u ON p.user_fk_users = u.id
		INNER JOIN user_privacy up ON u.id = up.user_fk_users
		WHERE u.id = ?
	`
	} else {
		command = `
		SELECT p.id, p.post_title, p.post_content, p.post_image, p.privacy_fk_posts_privacy, p.date
		FROM posts p
		INNER JOIN users u ON p.user_fk_users = u.id
		INNER JOIN user_privacy up ON u.id = up.user_fk_users
		WHERE u.id = ? AND p.privacy_fk_posts_privacy != 3`
	}

	rows, err := db.Query(command, targetUserId, currentUserId, targetUserId)
	if err != nil {
		helpers.CheckErr("GetUserProfilePosts Query error: ", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var post structs.Posts
		err = rows.Scan(&post.PostID, &post.Title, &post.Content, &post.Picture, &post.Privacy, &post.Date)
		if err != nil {
			helpers.CheckErr("GetUserProfilePosts Next error: ", err)
			continue
		}
		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetUserProfilePosts", err)
	}
	defer db.Close()
	return posts, nil
}

func GetUserAvatar(userId string) string {
	db := sqlite.DbConnection()
	defer db.Close()
	var avatar string
	command := "SELECT avatar FROM users WHERE id=?"
	err := db.QueryRow(command, userId).Scan(&avatar)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetUserSession", err)
		}
		return "0"
	}
	return avatar
}

func GetEmailFromSession(session string) string {
	db := sqlite.DbConnection()
	defer db.Close()

	var email string
	err := db.QueryRow("SELECT users.email FROM session INNER JOIN users ON session.user_fk_users = users.id WHERE session.hash = ?", session).Scan(&email)
	if err != nil {
		helpers.CheckErr("GetEmailFromSession", err)
		return ""
	}

	return email
}

func GetUserEmailWithId(userId string) string {
	db := sqlite.DbConnection()
	defer db.Close()

	var scanId string
	err := db.QueryRow("SELECT email FROM users WHERE id = ?", userId).Scan(&scanId)
	if err != nil {
		helpers.CheckErr("GetEmailFromSession", err)
		return ""
	}

	return scanId
}

func GetGroupRequests(currentUser string) []structs.GrInvNotifications {
	db := sqlite.DbConnection()
	defer db.Close()

	var groupRequests []structs.GrInvNotifications

	command := `SELECT sender_fk_users, reciever_fk_users, email, guild_title, guildrequests.id, guilds.id FROM guildrequests
				INNER JOIN guilds ON guildrequests.guildid_fk_guilds = guilds.id
				INNER JOIN users ON guildrequests.sender_fk_users = users.id
				WHERE reciever_fk_users = ?`

	rows, err := db.Query(command, currentUser)
	if err != nil {
		helpers.CheckErr("GetGroupRequests selecting error: ", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var notif structs.GrInvNotifications

		err = rows.Scan(&notif.SenderId, &notif.RecieverId, &notif.SenderEmail, &notif.GroupTitle, &notif.NotificationId, &notif.GroupId)
		if err != nil {
			helpers.CheckErr("GetGroupRequests Next error: ", err)
			continue
		}
		groupRequests = append(groupRequests, notif)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetGroupRequests", err)
	}
	return groupRequests
}

func GetFollowRequests(userId string) []structs.FollowRequests {
	db := sqlite.DbConnection()
	defer db.Close()

	var followRequests []structs.FollowRequests
	command := `SELECT followrequests.id, from_user_fk_users, to_user_fk_users, users.email FROM followrequests 
				INNER JOIN users ON followrequests.from_user_fk_users = users.id
				WHERE followrequests.to_user_fk_users = ?`

	rows, err := db.Query(command, userId)
	if err != nil {
		helpers.CheckErr("GetFollowRequests selecting error: ", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var request structs.FollowRequests
		err = rows.Scan(&request.NotificationId, &request.SenderId, &request.RecieverId, &request.SenderEmail)
		if err != nil {
			helpers.CheckErr("GetFollowRequests Next error: ", err)
			continue
		}
		followRequests = append(followRequests, request)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetFollowRequests", err)
	}
	return followRequests
}

func GetFollowers(userId string) []structs.FollowRequests {
	db := sqlite.DbConnection()
	defer db.Close()

	var followers []structs.FollowRequests

	command := "SELECT followers.id, followers.from_user_fk_users, users.email FROM followers INNER JOIN users ON followers.from_user_fk_users = users.id  WHERE to_user_fk_users = ?"
	rows, err := db.Query(command, userId)
	if err != nil {
		helpers.CheckErr("GetFollowers selecting error: ", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var follower structs.FollowRequests

		err = rows.Scan(&follower.NotificationId, &follower.SenderId, &follower.SenderEmail)
		if err != nil {
			helpers.CheckErr("GetFollowers Next error: ", err)
			continue
		}
		followers = append(followers, follower)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetFollowers", err)
	}
	return followers
}

func GetFollowing(userId string) []structs.FollowRequests {
	db := sqlite.DbConnection()
	defer db.Close()

	var followers []structs.FollowRequests

	command := "SELECT followers.id, followers.to_user_fk_users, users.email FROM followers INNER JOIN users ON followers.to_user_fk_users = users.id  WHERE from_user_fk_users = ?"
	rows, err := db.Query(command, userId)
	if err != nil {
		helpers.CheckErr("GetFollowing selecting error: ", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var follower structs.FollowRequests

		err = rows.Scan(&follower.NotificationId, &follower.SenderId, &follower.SenderEmail)
		if err != nil {
			helpers.CheckErr("GetFollowing Next error: ", err)
			continue
		}
		followers = append(followers, follower)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetFollowing", err)
	}
	return followers
}

func GetQueue() []structs.GameQueue {
	db := sqlite.DbConnection()
	defer db.Close()

	var lobbies []structs.GameQueue

	command := "SELECT gamequeue.id, users.email FROM gamequeue INNER JOIN users ON gamequeue.user_fk_users = users.id"
	rows, err := db.Query(command)
	if err != nil {
		helpers.CheckErr("GetQueue selecting error: ", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var lobby structs.GameQueue

		err = rows.Scan(&lobby.LobbyId, &lobby.LobbyUser)
		if err != nil {
			helpers.CheckErr("GetQueue Next error: ", err)
			continue
		}
		lobbies = append(lobbies, lobby)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetQueue", err)
	}
	return lobbies
}
