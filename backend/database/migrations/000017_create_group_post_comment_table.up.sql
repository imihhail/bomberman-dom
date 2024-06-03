CREATE TABLE group_post_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_fk_users INTEGER REFERENCES users(id) ON DELETE CASCADE,
    comment_content TEXT NOT NULL,
    comment_image TEXT,
    post_Id_fk_group_posts INTEGER REFERENCES group_posts(id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
