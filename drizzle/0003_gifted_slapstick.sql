PRAGMA foreign_keys=OFF;--> statement-breakpoint
DROP TABLE `effort_blocks`;--> statement-breakpoint
CREATE TABLE `effort_blocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`targetDate` integer NOT NULL,
	`card_id` integer NOT NULL,
	`block_number` integer NOT NULL,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=ON;