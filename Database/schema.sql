CREATE TABLE users(
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    isVerified BOOLEAN default false,
    verification_token TEXT,
    token_expires_at TIMESTAMP,
    password_reset_token TEXT,
    password_reset_expires_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);