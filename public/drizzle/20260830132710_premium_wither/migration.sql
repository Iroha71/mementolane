CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text(30) NOT NULL,
	`start_at` text,
	`due_at` text,
	`status` text(10) DEFAULT '予定' NOT NULL,
	`detail` text(200),
	`is_done` integer DEFAULT false NOT NULL
);
