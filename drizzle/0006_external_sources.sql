CREATE TABLE external_sellers(source TEXT NOT NULL,origin TEXT NOT NULL,payload TEXT NOT NULL,seen_sweep INTEGER NOT NULL,PRIMARY KEY(source,origin));
CREATE TABLE external_snapshots(source TEXT PRIMARY KEY,payload TEXT NOT NULL,checked_at INTEGER NOT NULL);
