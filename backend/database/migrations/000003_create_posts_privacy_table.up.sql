CREATE TABLE posts_privacy (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    privacy TEXT UNIQUE
);

INSERT INTO posts_privacy (privacy) VALUES ("public");
INSERT INTO posts_privacy (privacy) VALUES ("private");
INSERT INTO posts_privacy (privacy) VALUES ("almost private");