package urlHandlers

import (
	"backend/database"
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

func HandleRegistration(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Registration attempt!")

	err := r.ParseMultipartForm(10 << 20) // 10 MB limit
	if err != nil {
		http.Error(w, "Avatar file too big", http.StatusInternalServerError)
		return
	}

	email := r.PostFormValue("email")
	password := r.PostFormValue("password")
	firstName := r.PostFormValue("firstName")
	lastName := r.PostFormValue("lastName")
	date := r.PostFormValue("date")
	username := r.PostFormValue("username")
	aboutUser := r.PostFormValue("aboutUser")

	var callback = make(map[string]string)

	checkEmail, checkUsername := validators.ValidateUserRegistration(email, username)

	if checkEmail {
		callback["email"] = "Email already exists!"
	}
	if checkUsername {
		callback["username"] = "Username already exists!"
	}

	if !checkEmail && !checkUsername {
		if len(r.MultipartForm.File) > 0 {
			file, fileHeader, err := r.FormFile("avatar")
			if err != nil {
				fmt.Println("File upload error", err)
			}
			defer file.Close()

			fileExtension := filepath.Ext(fileHeader.Filename)
			if fileExtension != ".jpeg" && fileExtension != ".jpg" && fileExtension != ".gif" {
				http.Error(w, "Avatar picture can only be jpg or gif", http.StatusInternalServerError)
				return
			}

			imageName := uuid.New()
			dst, err := os.Create(fmt.Sprintf("./database/images/%s%s", imageName.String(), filepath.Ext(fileHeader.Filename)))
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			defer dst.Close()
			_, err = io.Copy(dst, file)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			validators.ValidateSetToUsers(email, password, firstName, lastName, date, imageName.String()+fileExtension, username, aboutUser)

			callback["newUser"] = "created"
		} else {
			validators.ValidateSetToUsers(email, password, firstName, lastName, date, "defaultAvatar.jpg", username, aboutUser)
			callback["newUser"] = "created"
		}
		// set user default privacy (public), use standardize name function to get database email.
		// don't move this plz	-Oliver
		fmt.Println("email reg: ", email)
		validators.ValidateSetUserPrivacy(database.GetUserIdIfEmailExists(helpers.StandardizeName(email)), "1")
	}
	writeData, err := json.Marshal(callback)
	w.Write(writeData)
}
