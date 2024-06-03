package structs

type Posts struct {
	PostID   string
	Username string
	Avatar   string
	Title    string
	Content  string
	Picture  string
	Privacy  string
	Date     string
	Email    string
	UserId   string
}

type GroupPosts struct {
	PostID   string
	Username string
	Avatar   string
	Title    string
	Content  string
	Picture  string
	Date     string
	Email    string
	GroupId  string
	UserId   string
}

type NewPost struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Picture string `json:"picture"`
	Privacy string `json:"privacy"`
}
