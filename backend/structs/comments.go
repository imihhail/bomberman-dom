package structs

type Comments struct {
	PostID    string
	Username  string
	Avatar    string
	PostTitle string
	Content   string
	Picture   string
	Date      string
}

type NewComment struct {
	Content string `json:"content"`
	Picture string `json:"image"`
}
