-- Full Schema Migration (V2)

-- CreateTable
CREATE TABLE IF NOT EXISTS `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'USER',
    `level_title` VARCHAR(50) NULL DEFAULT 'Novato',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `asset_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `schema` JSON NULL,

    UNIQUE INDEX `asset_types_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `assets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_type_id` INTEGER NOT NULL,
    `hash_code` VARCHAR(50) NOT NULL,
    `geo_lat` DECIMAL(10, 8) NULL,
    `geo_lng` DECIMAL(11, 8) NULL,
    `description` TEXT NULL,
    `data` JSON NULL,

    UNIQUE INDEX `assets_hash_code_key`(`hash_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `gamification_rules` (
    `slug` VARCHAR(50) NOT NULL,
    `title` VARCHAR(100) NULL,
    `points` INTEGER NOT NULL,
    `icon` VARCHAR(50) NULL,
    `requires_location` BOOLEAN NOT NULL DEFAULT true,
    `requires_photo` BOOLEAN NOT NULL DEFAULT true,
    `ai_validation` BOOLEAN NOT NULL DEFAULT false,
    `ai_prompt` TEXT NULL,

    PRIMARY KEY (`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `user_actions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `asset_id` INTEGER NULL,
    `rule_slug` VARCHAR(50) NOT NULL,
    `evidence_url` TEXT NULL,
    `status` VARCHAR(20) NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `points_ledger` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `action_id` INTEGER NULL,
    `amount` INTEGER NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assets` ADD CONSTRAINT `assets_asset_type_id_fkey` FOREIGN KEY (`asset_type_id`) REFERENCES `asset_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_actions` ADD CONSTRAINT `user_actions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_actions` ADD CONSTRAINT `user_actions_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_actions` ADD CONSTRAINT `user_actions_rule_slug_fkey` FOREIGN KEY (`rule_slug`) REFERENCES `gamification_rules`(`slug`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `points_ledger` ADD CONSTRAINT `points_ledger_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `points_ledger` ADD CONSTRAINT `points_ledger_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `user_actions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
