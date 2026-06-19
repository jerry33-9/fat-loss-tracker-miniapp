CREATE TABLE IF NOT EXISTS t_weight (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    openid VARCHAR(64) NOT NULL,
    weight DECIMAL(5,1) NOT NULL,
    record_date DATE NOT NULL,
    note VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_diet (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    openid VARCHAR(64) NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    record_date DATE NOT NULL,
    foods TEXT NOT NULL,
    total_calories INT NOT NULL DEFAULT 0,
    photo_urls TEXT,
    note VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_exercise (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    openid VARCHAR(64) NOT NULL,
    type VARCHAR(50) NOT NULL,
    duration INT NOT NULL,
    calories INT NOT NULL DEFAULT 0,
    record_date DATE NOT NULL,
    note VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_goal (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    openid VARCHAR(64) NOT NULL UNIQUE,
    target_weight DECIMAL(5,1) NOT NULL,
    start_weight DECIMAL(5,1) NOT NULL,
    weekly_target DECIMAL(3,2) NOT NULL DEFAULT 0.50,
    start_date DATE NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_weight_openid_date ON t_weight(openid, record_date DESC);
CREATE INDEX IF NOT EXISTS idx_diet_openid_date ON t_diet(openid, record_date DESC);
CREATE INDEX IF NOT EXISTS idx_exercise_openid_date ON t_exercise(openid, record_date DESC);

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
