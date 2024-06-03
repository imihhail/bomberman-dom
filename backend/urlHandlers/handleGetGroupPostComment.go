package urlHandlers

import (
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

func HandleGetGroupPostComments(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Group Post Comment attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		callback["login"] = "success"

		err := r.ParseMultipartForm(10 << 20)
		if err != nil {
			http.Error(w, "Avatar file too big", http.StatusInternalServerError)
			return
		}
		imageName := ""
		fileExtension := ""
		if len(r.MultipartForm.File) > 0 {
			file, fileHeader, err := r.FormFile("picture")
			if err != nil {
				fmt.Println("File upload error", err)
			}
			defer file.Close()

			fileExtension = filepath.Ext(fileHeader.Filename)
			if fileExtension != ".jpeg" && fileExtension != ".jpg" && fileExtension != ".gif" {
				http.Error(w, "Avatar picture can only be jpg or gif", http.StatusInternalServerError)
				return
			}

			imageName = uuid.New().String()
			dst, err := os.Create(fmt.Sprintf("./database/images/%s%s", imageName, filepath.Ext(fileHeader.Filename)))
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
		}
		cookie, err := r.Cookie("socialNetworkSession")
		UserID := validators.ValidateUserSession(cookie.Value)

		content := r.FormValue("content")
		selectedPost := r.FormValue("groupPost")
		fmt.Println(content, selectedPost, imageName+fileExtension)

		validators.ValidateSetNewGroupComment(UserID, content, imageName+fileExtension, selectedPost)
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandleGetGroupPostComments", err)
		w.Write(writeData)
	}
}
