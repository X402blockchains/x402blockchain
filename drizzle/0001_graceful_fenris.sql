CREATE TABLE `chain_cursors` (
	`id` text PRIMARY KEY NOT NULL,
	`start_block` integer NOT NULL,
	`next_block` integer NOT NULL,
	`last_block_hash` text,
	`head` integer,
	`checked_at` integer NOT NULL,
	`error` text
);
--> statement-breakpoint
CREATE TABLE `chain_evidence` (
	`network` text NOT NULL,
	`transaction` text NOT NULL,
	`event_id` text NOT NULL,
	`block_number` integer NOT NULL,
	`block_hash` text NOT NULL,
	`contract` text NOT NULL,
	`context_key` text NOT NULL,
	PRIMARY KEY(`network`, `transaction`, `event_id`)
);
