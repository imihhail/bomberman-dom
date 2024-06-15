CREATE TABLE activegame (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_uuid TEXT NOT NULL,
    user_fk_users INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    player_tag TEXT NOT NULL
);