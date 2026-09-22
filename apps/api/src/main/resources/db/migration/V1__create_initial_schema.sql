-- ==============================================================================
-- V1: Criação do Schema Inicial (users, positions, transactions)
-- ==============================================================================

-- 1. Tabela de Usuários (User.java)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT uk_users_email UNIQUE (email)
);

-- 2. Tabela de Posições Consolidadas (Position.java)
CREATE TABLE IF NOT EXISTS positions (
    id VARCHAR(255) PRIMARY KEY,
    ticker VARCHAR(255),
    quantity INTEGER,
    asset_type VARCHAR(255) NOT NULL,
    average_price NUMERIC(19, 2),
    user_id VARCHAR(255),
    CONSTRAINT fk_positions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_positions_user_ticker UNIQUE (user_id, ticker)
);

-- 3. Tabela de Transações de Compra e Venda (Transaction.java)
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(255) PRIMARY KEY,
    ticker VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    asset_type VARCHAR(255) NOT NULL,
    price NUMERIC(38, 2) NOT NULL,
    date DATE NOT NULL,
    user_id VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Índices para otimização de consultas frequentes da API
CREATE INDEX IF NOT EXISTS idx_positions_user_id ON positions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_ticker ON transactions(user_id, ticker, date ASC);
