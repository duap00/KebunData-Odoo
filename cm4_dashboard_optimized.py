import mysql.connector
import psutil
import time
from datetime import datetime
import subprocess

# Configuration
CONFIG = {
    'collection_interval': 300,  # 5 minutes instead of 30 seconds
    'retention_days': 7,
    'high_temp_threshold': 70,
    'low_disk_threshold': 85
}

def get_system_metrics():
    """Get optimized system metrics"""
    try:
        return {
            'cpu_temperature': get_cpu_temperature(),
            'cpu_usage': psutil.cpu_percent(interval=1),
            'memory_usage': psutil.virtual_memory().percent,
            'disk_usage': psutil.disk_usage('/').percent,
            'gpu_usage': 0.0,
            'network_rx': psutil.net_io_counters().bytes_recv,
            'network_tx': psutil.net_io_counters().bytes_sent
        }
    except Exception as e:
        print(f"Error getting metrics: {e}")
        return None

def get_cpu_temperature():
    """Get CPU temperature"""
    try:
        with open('/sys/class/thermal/thermal_zone0/temp', 'r') as f:
            return float(f.read()) / 1000.0
    except:
        return 0.0

def connect_to_mysql():
    """Connect to MySQL"""
    try:
        return mysql.connector.connect(
            host='localhost', port=3306,
            user='root', password='raspberry',
            database='myapp'
        )
    except mysql.connector.Error as e:
        print(f"MySQL connection error: {e}")
        return None

def insert_metrics(connection, metrics):
    """Insert metrics with validation"""
    try:
        cursor = connection.cursor()
        query = """
        INSERT INTO system_metrics 
        (cpu_temperature, cpu_usage, memory_usage, disk_usage, gpu_usage, network_rx, network_tx)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            min(metrics['cpu_temperature'], 125),  # Cap at reasonable max
            min(metrics['cpu_usage'], 100),
            min(metrics['memory_usage'], 100),
            min(metrics['disk_usage'], 100),
            metrics['gpu_usage'],
            metrics['network_rx'],
            metrics['network_tx']
        )
        cursor.execute(query, values)
        connection.commit()
        cursor.close()
        return True
    except mysql.connector.Error as e:
        print(f"Insert error: {e}")
        return False

def run_data_rotation(connection):
    """Run data rotation procedure"""
    try:
        cursor = connection.cursor()
        cursor.callproc('RotateSystemMetrics')
        connection.commit()
        cursor.close()
        print("✅ Data rotation completed")
        return True
    except mysql.connector.Error as e:
        print(f"Rotation error: {e}")
        return False

def check_disk_space():
    """Check if disk space is low"""
    usage = psutil.disk_usage('/').percent
    if usage > CONFIG['low_disk_threshold']:
        print(f"⚠️  Warning: Disk usage at {usage}%")
        return False
    return True

def main():
    """Optimized main loop"""
    print("🚀 CM4 Dashboard - Optimized Monitoring Started")
    print(f"📊 Collection interval: {CONFIG['collection_interval']} seconds")
    
    db_connection = connect_to_mysql()
    if not db_connection:
        return
    
    rotation_counter = 0
    
    try:
        while True:
            # Check disk space
            if not check_disk_space():
                print("🛑 Low disk space, stopping...")
                break
            
            # Get and insert metrics
            metrics = get_system_metrics()
            if metrics and insert_metrics(db_connection, metrics):
                print(f"📈 Metrics inserted at {datetime.now().strftime('%H:%M:%S')}")
            
            # Run data rotation every 24 hours (after 288 collections at 5-min intervals)
            rotation_counter += 1
            if rotation_counter >= 288:  # 24 hours
                if run_data_rotation(db_connection):
                    rotation_counter = 0
            
            time.sleep(CONFIG['collection_interval'])
            
    except KeyboardInterrupt:
        print("\n⏹️  Monitoring stopped")
    finally:
        db_connection.close()

if __name__ == "__main__":
    main()
