CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_fk_users INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_title TEXT NOT NULL,
    post_content TEXT NOT NULL,
    post_image TEXT,
    privacy_fk_posts_privacy INTEGER REFERENCES posts_privacy(id) ON DELETE CASCADE,
    -- guildid_fk_guilds INTEGER REFERENCES guilds(id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO posts (user_fk_users, post_title, post_content, post_image, privacy_fk_posts_privacy) VALUES (1, "default post title", "default post content", "defaultPost.jpg", 1);
INSERT INTO posts (user_fk_users, post_title, post_content, post_image, privacy_fk_posts_privacy) VALUES (2, "minu kasutaja on private", "default post content1", "defaultPost.jpg", 1);
INSERT INTO posts (user_fk_users, post_title, post_content, post_image, privacy_fk_posts_privacy) VALUES (3, "aga minu kasutaja on public", "default post content2", "defaultPost.jpg", 1);
INSERT INTO posts (user_fk_users, post_title, post_content, post_image, privacy_fk_posts_privacy) VALUES (3, "Sitaks privaatne postitus", "default post content2", "defaultPost.jpg", 2);
INSERT INTO posts (user_fk_users, post_title, post_content, post_image, privacy_fk_posts_privacy) VALUES (3, "Peaagu privaatne postitus", "default post content2", "defaultPost.jpg", 3);
