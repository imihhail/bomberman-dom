package structs

type Register struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	FirstName    string `json:"firstName"`
	LastName    string `json:"lastName"`
	DateOfBirth    string `json:"dateOfBirth"`
	Username string `json:"username"`
	AboutUser string `json:"aboutUser"`
	Avatar    string `json:"avatar"`
}
