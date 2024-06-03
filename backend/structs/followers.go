package structs

type FollowRequests struct {
	NotificationId string
	SenderId       string `json:"fromuserId"`
	SenderEmail    string
	RecieverId     string
}
