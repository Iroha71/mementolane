CREATE TABLE `effort_blocks` (
	`id` integer NOT NULL,
	`card_id` integer,
	`block_number` integer NOT NULL,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE no action
);
