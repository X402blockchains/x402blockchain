CREATE TABLE `service_cache` (
	`source` text NOT NULL,
	`url` text NOT NULL,
	`method` text NOT NULL,
	`payload` text NOT NULL,
	`seen_sweep` integer NOT NULL,
	PRIMARY KEY(`source`, `url`, `method`)
);
