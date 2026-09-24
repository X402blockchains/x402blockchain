CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`website` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`networks` text NOT NULL,
	`endpoint` text NOT NULL,
	`docs` text NOT NULL,
	`contact` text NOT NULL,
	`payment_terms` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`review_note` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_projects_owner` ON `projects` (`owner`);--> statement-breakpoint
CREATE INDEX `idx_projects_status` ON `projects` (`status`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `receipts` (
	`network` text NOT NULL,
	`transaction` text NOT NULL,
	`event_id` text NOT NULL,
	`source` text NOT NULL,
	`payer` text,
	`pay_to` text,
	`resource` text,
	`asset` text NOT NULL,
	`amount` text NOT NULL,
	`decimals` integer NOT NULL,
	`timestamp` integer NOT NULL,
	`status` text NOT NULL,
	`received_at` integer NOT NULL,
	PRIMARY KEY(`network`, `transaction`, `event_id`)
);
--> statement-breakpoint
CREATE INDEX `idx_receipts_network_time` ON `receipts` (`network`,`timestamp`);--> statement-breakpoint
CREATE INDEX `idx_receipts_time` ON `receipts` (`timestamp`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`note` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reviews_project` ON `reviews` (`project_id`);--> statement-breakpoint
CREATE TABLE `source_cache` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`checked_at` integer NOT NULL,
	`success_at` integer,
	`error` text
);
--> statement-breakpoint
CREATE TABLE `sync_locks` (
	`id` text PRIMARY KEY NOT NULL,
	`until` integer NOT NULL
);
