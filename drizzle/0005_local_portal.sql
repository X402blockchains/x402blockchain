CREATE TABLE IF NOT EXISTS portal_applications (
 id TEXT PRIMARY KEY, payload TEXT NOT NULL, token_hash TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','needs_information','approved','rejected')),
 note TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS collector_runs (
 task TEXT PRIMARY KEY, started_at INTEGER, completed_at INTEGER, error TEXT, result TEXT
);
