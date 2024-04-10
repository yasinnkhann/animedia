CREATE TABLE `User` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191),
	`email` varchar(191),
	`email_verified` datetime(3),
	`image` varchar(191),
	`password` varchar(191),
	`created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	PRIMARY KEY (`id`),
	UNIQUE KEY `User_email_key` (`email`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Account` (
	`id` varchar(191) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`type` varchar(191) NOT NULL,
	`provider` varchar(191) NOT NULL,
	`provider_account_id` varchar(191) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(191),
	`scope` varchar(191),
	`id_token` text,
	`session_state` varchar(191),
	PRIMARY KEY (`id`),
	UNIQUE KEY `Account_provider_provider_account_id_key` (`provider`, `provider_account_id`),
	KEY `Account_user_id_idx` (`user_id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Session` (
	`id` varchar(191) NOT NULL,
	`session_token` varchar(191) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`expires` datetime(3) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `Session_session_token_key` (`session_token`),
	KEY `Session_user_id_idx` (`user_id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `VerificationToken` (
	`identifier` varchar(191) NOT NULL,
	`token` varchar(191) NOT NULL,
	`expires` datetime(3) NOT NULL,
	UNIQUE KEY `VerificationToken_token_key` (`token`),
	UNIQUE KEY `VerificationToken_identifier_token_key` (`identifier`, `token`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Movies` (
`id` varchar(191) NOT NULL,
`name` varchar(191) NOT NULL,
`status` enum('NOT_WATCHING', 'WATCHING', 'PLAN_TO_WATCH', 'COMPLETED', 'ON_HOLD', 'DROPPED') NOT NULL,
`rating` int,
`user_id` varchar(191) NOT NULL,
PRIMARY KEY (`id`, `user_id`),
KEY `Movie_user_id_idx` (`user_id`)
) ENGINE InnoDB,
CHARSET utf8mb4,
COLLATE utf8mb4_unicode_ci;


CREATE TABLE `Shows` (
`id` varchar(191) NOT NULL,
`name` varchar(191) NOT NULL,
`current_episode` int NOT NULL DEFAULT '0',
`status` enum('NOT_WATCHING', 'WATCHING', 'PLAN_TO_WATCH', 'COMPLETED', 'ON_HOLD', 'DROPPED') NOT NULL,
`rating` int,
`user_id` varchar(191) NOT NULL,
PRIMARY KEY (`id`, `user_id`),
KEY `Show_user_id_idx` (`user_id`)
) ENGINE InnoDB,
CHARSET utf8mb4,
COLLATE utf8mb4_unicode_ci;
