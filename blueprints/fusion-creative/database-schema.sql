-- Fusion Creative Database Schema
-- Run this to set up PostgreSQL tables

-- Prospects table
CREATE TABLE prospects (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(200),
    title VARCHAR(150),
    linkedin_url VARCHAR(500),
    vertical VARCHAR(50),
    source VARCHAR(50) DEFAULT 'apollo',
    status VARCHAR(50) DEFAULT 'new',
    ai_score INTEGER,
    qualification_reason TEXT,
    ghl_contact_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sequences table
CREATE TABLE sequences (
    id SERIAL PRIMARY KEY,
    prospect_email VARCHAR(255) REFERENCES prospects(email),
    sequence_id VARCHAR(100) UNIQUE,
    touch_count INTEGER DEFAULT 0,
    next_touch_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Touch events table
CREATE TABLE touch_events (
    id SERIAL PRIMARY KEY,
    sequence_id VARCHAR(100) REFERENCES sequences(sequence_id),
    touch_number INTEGER,
    channel VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    sent_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    replied_at TIMESTAMP
);

-- Content posts table
CREATE TABLE content_posts (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50),
    content_type VARCHAR(50),
    caption TEXT,
    scheduled_at TIMESTAMP,
    posted_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'draft',
    views INTEGER,
    likes INTEGER,
    shares INTEGER,
    comments INTEGER
);

-- Audit logs table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100),
    record_id INTEGER,
    action VARCHAR(50),
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_prospects_score ON prospects(ai_score DESC);
CREATE INDEX idx_prospects_vertical ON prospects(vertical);
CREATE INDEX idx_sequences_status ON sequences(status);
CREATE INDEX idx_touch_events_sequence ON touch_events(sequence_id);
