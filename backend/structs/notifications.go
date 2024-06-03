package structs

type GrInvNotifications struct {
	NotificationResponse string `json:"decision"`
	GroupId              string `json:"GroupId"`
	GroupTitle           string `json:"message"`
	RecieverId           string `json:"touser"`
	NotificationType     string `json:"type"`
	SenderId             string `json:"fromuserid"`
	SenderEmail          string
	NotificationId       string
	EventId              string `json:"EventId"`
}

type EventNotifications struct {
	NotificationId   string `json:"NotificationId"`
	SenderId         string `json:"fromuserid"`
	RecieverId       string
	SenderEmail      string `json:"SenderEmail"`
	EventTitle       string `json:"EventTitle"`
	EventDescription string
	EventTime        string `json:"EventTime"`
	EventId          string `json:"EventId"`
	GroupId          string `json:"GroupId"`
	GroupTitle       string `json:"GroupTitle"`
}
