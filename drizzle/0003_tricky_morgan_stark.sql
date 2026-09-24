CREATE TABLE `indexer_state` (
	`id` text PRIMARY KEY NOT NULL,
	`network` text NOT NULL,
	`payload` text NOT NULL,
	`checked_at` integer NOT NULL,
	`error` text
);
