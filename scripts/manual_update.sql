-- Atualização Manual do Banco de Dados
-- Execute este script no seu cliente MySQL (Workbench, DBeaver, etc)

-- 1. Adicionar Role em Users
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'USER';

-- 2. Criar tabela Asset Types
CREATE TABLE IF NOT EXISTS asset_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    `schema` JSON
);

-- 3. Atualizar tabela Assets
-- Primeiro, vamos criar um tipo 'Genérico' para migrar os ativos existentes
INSERT IGNORE INTO asset_types (id, name, `schema`) VALUES (1, 'Patrimônio', '{}');

-- Adicionar colunas novas
ALTER TABLE assets ADD COLUMN asset_type_id INT DEFAULT 1;
ALTER TABLE assets ADD COLUMN data JSON;

-- Adicionar Foreign Key
ALTER TABLE assets ADD CONSTRAINT fk_asset_type FOREIGN KEY (asset_type_id) REFERENCES asset_types(id);

-- (Opcional) Migrar dados antigos para a nova estrutura se necessário
-- UPDATE assets SET data = JSON_OBJECT('historicalPhotoUrl', historical_photo_url);

-- Remover colunas antigas (SE desejar limpar)
-- ALTER TABLE assets DROP COLUMN type;
-- ALTER TABLE assets DROP COLUMN historical_photo_url;


-- 4. Atualizar Gamification Rules (Quests)
ALTER TABLE gamification_rules ADD COLUMN title VARCHAR(100);
ALTER TABLE gamification_rules ADD COLUMN requires_location TINYINT(1) DEFAULT 1;
ALTER TABLE gamification_rules ADD COLUMN requires_photo TINYINT(1) DEFAULT 1;
ALTER TABLE gamification_rules ADD COLUMN ai_validation TINYINT(1) DEFAULT 0;
ALTER TABLE gamification_rules ADD COLUMN ai_prompt TEXT;

-- Remover coluna antiga
-- ALTER TABLE gamification_rules DROP COLUMN requires_approval;

-- 5. Atualizar User Actions
-- Permitir asset_id nulo (para missões gerais como Dengue)
ALTER TABLE user_actions MODIFY COLUMN asset_id INT NULL;
