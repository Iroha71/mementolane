CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`done` integer DEFAULT false NOT NULL
);
