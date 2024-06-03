CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_fk_users INTEGER REFERENCES users(id) ON DELETE CASCADE,
    guildid_fk_guilds INTEGER REFERENCES guilds(id) ON DELETE CASCADE,
    event_title TEXT NOT NULL,
    event_description TEXT NOT NULL,
    event_time TEXT NOT NULL  
);