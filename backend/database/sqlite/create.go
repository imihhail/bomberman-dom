package sqlite

import (
	"backend/helpers"
	"database/sql"
	"fmt"
	"os"
)

func fileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}

func DbConnection() *sql.DB {
	db, err := sql.Open("sqlite3", "./database/sqlite/social-network.db")
	helpers.CheckErr("DbConnection", err)

	_, err = db.Exec("PRAGMA foreign_keys = ON;")
	helpers.CheckErr("DbConnection", err)

	return db
}

func Create() {
	if !fileExists("./database/sqlite/social-network.db") {
		fmt.Println("Did not find the Database! Starting regeneration!")

		CreateDB()
		fmt.Println("Database Created!")
	}
	db := DbConnection()
	err := runMigrations(db)
	defer db.Close()
	helpers.CheckErr("create.go -> Migrations", err)
}
