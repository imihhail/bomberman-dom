package structs

type ChatMessage struct {
	ChatMessageId   string
	MessageSender   string
	Message         string
	MessageReceiver string
	Date            string
	SenderAvatar    string
	LoggedInUser    bool
}

type GroupMessage struct {
	GroupChatMessageId     string
	GroupChatMessageSender string
	GroupChatMessage       string
	GroupChatId            string
	Date                   string
	SenderEmail            string
	SenderAvatar           string
	LoggedInUser           bool
}
