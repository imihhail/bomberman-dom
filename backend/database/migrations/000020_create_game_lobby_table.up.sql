CREATE TABLE gamequeue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_fk_users INTEGER REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO gamequeue (user_fk_users) VALUES (2);