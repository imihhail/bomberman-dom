CREATE TABLE event_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id_fk_guilds INTEGER REFERENCES guilds(id) ON DELETE CASCADE,
    event_id_fk_events INTEGER REFERENCES events(id) ON DELETE CASCADE,
    sender_fk_users INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reciever_fk_users INTEGER REFERENCES users(id) ON DELETE CASCADE
);