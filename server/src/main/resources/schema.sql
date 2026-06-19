CREATE TABLE IF NOT EXISTS t_workout (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    openid VARCHAR(64) NOT NULL,
    record_date DATE NOT NULL,
    exercises TEXT NOT NULL,
    duration INT NOT NULL DEFAULT 0,
    calories INT NOT NULL DEFAULT 0,
    note VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workout_openid_date ON t_workout(openid, record_date DESC);
