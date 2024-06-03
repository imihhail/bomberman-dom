CREATE TABLE guildmembers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id_fk_guilds INTEGER REFERENCES guilds(id) ON DELETE CASCADE,
    members_fk_users INTEGER REFERENCES users(id) ON DELETE CASCADE
);