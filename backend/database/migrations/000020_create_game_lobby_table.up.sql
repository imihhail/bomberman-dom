CREATE TABLE gamequeue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_fk_users INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE
);