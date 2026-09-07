CREATE TABLE `cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(30) NOT NULL,
	`status` text(20) DEFAULT 'plan' NOT NULL,
	`start_at` text,
	`due_at` text,
	`detail` text(200),
	`is_done` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
DROP TABLE `memos`;