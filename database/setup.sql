-- CM4 Monitoring Database Setup
CREATE DATABASE IF NOT EXISTS myapp;

USE myapp;

-- Detailed metrics table (7-day retention)
CREATE TABLE system_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cpu_temperature DECIMAL(4,2),
    cpu_usage DECIMAL(4,2),
    memory_usage DECIMAL(4,2),
    disk_usage DECIMAL(4,2),
    gpu_usage DECIMAL(4,2),
    network_rx BIGINT,
    network_tx BIGINT,
    INDEX (recorded_at)
);

-- Daily summaries (long-term retention)
CREATE TABLE system_metrics_daily (
    date DATE PRIMARY KEY,
    avg_cpu_temp DECIMAL(4,2),
    max_cpu_temp DECIMAL(4,2),
    min_cpu_temp DECIMAL(4,2),
    avg_cpu_usage DECIMAL(4,2),
    max_cpu_usage DECIMAL(4,2),
    avg_memory_usage DECIMAL(4,2),
    max_memory_usage DECIMAL(4,2),
    total_records INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System events log
CREATE TABLE system_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event_type VARCHAR(50),
    event_message TEXT,
    severity ENUM('low', 'medium', 'high', 'critical')
);

-- Stored procedure for data rotation
DELIMITER //

CREATE PROCEDURE RotateSystemMetrics()
BEGIN
    -- First, check if we have any data older than 7 days
    IF EXISTS (SELECT 1 FROM system_metrics WHERE recorded_at < NOW() - INTERVAL 7 DAY LIMIT 1) THEN
        
        -- Summarize data older than 7 days into daily table
        INSERT INTO system_metrics_daily (
            date, avg_cpu_temp, max_cpu_temp, min_cpu_temp,
            avg_cpu_usage, max_cpu_usage, avg_memory_usage, max_memory_usage, total_records
        )
        SELECT 
            DATE(recorded_at) as date,
            ROUND(AVG(cpu_temperature), 2) as avg_cpu_temp,
            ROUND(MAX(cpu_temperature), 2) as max_cpu_temp,
            ROUND(MIN(cpu_temperature), 2) as min_cpu_temp,
            ROUND(AVG(cpu_usage), 2) as avg_cpu_usage,
            ROUND(MAX(cpu_usage), 2) as max_cpu_usage,
            ROUND(AVG(memory_usage), 2) as avg_memory_usage,
            ROUND(MAX(memory_usage), 2) as max_memory_usage,
            COUNT(*) as total_records
        FROM system_metrics 
        WHERE recorded_at < NOW() - INTERVAL 7 DAY
        GROUP BY DATE(recorded_at);
        
        -- Delete detailed data older than 7 days
        DELETE FROM system_metrics 
        WHERE recorded_at < NOW() - INTERVAL 7 DAY;
        
        SELECT CONCAT('SUCCESS: Rotated ', ROW_COUNT(), ' records') as result;
        
    ELSE
        SELECT 'INFO: No data older than 7 days to rotate' as result;
    END IF;
    
END //

DELIMITER ;
