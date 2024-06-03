CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    username TEXT,
    about_user TEXT,
    avatar TEXT
);

INSERT INTO users (email, password, first_name, last_name, date_of_birth, username, about_user, avatar) VALUES ("User@email.com", "$2a$14$9pBHahAGnvMkrF5o7yDQl.jWU5cRzEC8Fb6SHJJnCU..kQZmhWPSe", "Asd", "Asd", "1990-03-01 00:00:00+00:00", "User", "default user", "defaultAvatar.jpg");
INSERT INTO users (email, password, first_name, last_name, date_of_birth, username, about_user, avatar) VALUES ("User1@email.com", "$2a$14$9pBHahAGnvMkrF5o7yDQl.jWU5cRzEC8Fb6SHJJnCU..kQZmhWPSe", "Asd", "Asd", "1990-03-01 00:00:00+00:00", "User1", "default user", "defaultAvatar.jpg");
INSERT INTO users (email, password, first_name, last_name, date_of_birth, username, about_user, avatar) VALUES ("User2@email.com", "$2a$14$9pBHahAGnvMkrF5o7yDQl.jWU5cRzEC8Fb6SHJJnCU..kQZmhWPSe", "Asd", "Asd", "1990-03-01 00:00:00+00:00", "User2", "default user", "defaultAvatar.jpg");
