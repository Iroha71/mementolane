CREATE TABLE `cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(30) NOT NULL,
	`status` text(20) DEFAULT 'plan' NOT NULL,
	`start_at` text,
	`due_at` text,
	`detail` text(200),
	`theme_color` text DEFAULT '#FFFFFF' NOT NULL,
	`is_done` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `effort_blocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`target_date` integer NOT NULL,
	`card_id` integer NOT NULL,
	`block_number` integer NOT NULL,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE no action
);
