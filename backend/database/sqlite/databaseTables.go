package sqlite

import (
	"backend/helpers"
	"database/sql"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func CreateDB() {
	if err := os.MkdirAll("./database/sqlite", os.ModeSticky|os.ModePerm); err != nil {
		helpers.CheckErr("CreateDB", err)
	}
	os.Create("./database/sqlite/social-network.db")
}

func runMigrations(db *sql.DB) error {
	driver, err := sqlite.WithInstance(db, &sqlite.Config{})
	if err != nil {
		return err
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://database/migrations",
		"sqlite3",
		driver,
	)
	if err != nil {
		return err
	}

	// Up applies all available migrations
	return m.Up()
}
