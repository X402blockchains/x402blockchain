CREATE TABLE facilitator_applications (
 id TEXT PRIMARY KEY, payload TEXT NOT NULL, token_hash TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending', created_at INTEGER NOT NULL
);
