from flask import Flask, render_template, jsonify
import mysql.connector
from datetime import datetime, timedelta
import json

app = Flask(__name__)

def get_db_connection():
    """Connect to MySQL database"""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            port=3306,
            user='root',
            password='raspberry',
            database='myapp'
        )
        return connection
    except mysql.connector.Error as e:
        print(f"Database connection error: {e}")
        return None

@app.route('/')
def index():
    """Main dashboard page"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>CM4 Monitoring Dashboard</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .dashboard { max-width: 1200px; margin: 0 auto; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .stat-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
            .stat-value { font-size: 2em; font-weight: bold; margin: 10px 0; }
            .stat-label { color: #666; }
            .chart-container { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
            .chart-title { margin-bottom: 15px; color: #333; }
            .temp-high { color: #e74c3c; }
            .temp-normal { color: #27ae60; }
            .usage-high { color: #e67e22; }
        </style>
    </head>
    <body>
        <div class="dashboard">
            <h1>🚀 Raspberry Pi CM4 Monitoring Dashboard</h1>
            
            <div class="stats-grid" id="currentStats">
                <!-- Current stats will be loaded here -->
            </div>
            
            <div class="chart-container">
                <h2 class="chart-title">📈 CPU Temperature Over Time</h2>
                <canvas id="tempChart"></canvas>
            </div>
            
            <div class="chart-container">
                <h2 class="chart-title">⚡ CPU Usage Over Time</h2>
                <canvas id="cpuChart"></canvas>
            </div>
            
            <div class="chart-container">
                <h2 class="chart-title">💾 Memory & Disk Usage Over Time</h2>
                <canvas id="memoryChart"></canvas>
            </div>
        </div>

        <script>
            let tempChart, cpuChart, memoryChart;
            
            // Initialize charts
            function initializeCharts() {
                const ctx1 = document.getElementById('tempChart').getContext('2d');
                tempChart = new Chart(ctx1, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: 'CPU Temperature (°C)',
                            data: [],
                            borderColor: '#e74c3c',
                            backgroundColor: 'rgba(231, 76, 60, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: false,
                                title: { display: true, text: 'Temperature (°C)' }
                            }
                        }
                    }
                });
                
                const ctx2 = document.getElementById('cpuChart').getContext('2d');
                cpuChart = new Chart(ctx2, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: 'CPU Usage (%)',
                            data: [],
                            borderColor: '#3498db',
                            backgroundColor: 'rgba(52, 152, 219, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                                title: { display: true, text: 'Usage (%)' }
                            }
                        }
                    }
                });
                
                const ctx3 = document.getElementById('memoryChart').getContext('2d');
                memoryChart = new Chart(ctx3, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [
                            {
                                label: 'Memory Usage (%)',
                                data: [],
                                borderColor: '#9b59b6',
                                backgroundColor: 'rgba(155, 89, 182, 0.1)',
                                borderWidth: 2,
                                tension: 0.4,
                                fill: true
                            },
                            {
                                label: 'Disk Usage (%)',
                                data: [],
                                borderColor: '#f39c12',
                                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                                borderWidth: 2,
                                tension: 0.4,
                                fill: true
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                                title: { display: true, text: 'Usage (%)' }
                            }
                        }
                    }
                });
            }
            
            // Update current stats
            function updateCurrentStats() {
                fetch('/api/current_stats')
                    .then(response => response.json())
                    .then(data => {
                        if (data.current) {
                            const stats = data.current;
                            const tempClass = stats.cpu_temperature > 60 ? 'temp-high' : 'temp-normal';
                            const cpuClass = stats.cpu_usage > 80 ? 'usage-high' : '';
                            
                            document.getElementById('currentStats').innerHTML = `
                                <div class="stat-card">
                                    <div class="stat-label">CPU Temperature</div>
                                    <div class="stat-value ${tempClass}">${stats.cpu_temperature.toFixed(1)}°C</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-label">CPU Usage</div>
                                    <div class="stat-value ${cpuClass}">${stats.cpu_usage.toFixed(1)}%</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-label">Memory Usage</div>
                                    <div class="stat-value">${stats.memory_usage.toFixed(1)}%</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-label">Disk Usage</div>
                                    <div class="stat-value">${stats.disk_usage.toFixed(1)}%</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-label">Last Update</div>
                                    <div class="stat-value" style="font-size:1.2em;">${new Date(stats.recorded_at).toLocaleTimeString()}</div>
                                </div>
                            `;
                        }
                    })
                    .catch(error => console.error('Error fetching stats:', error));
            }
            
            // Update charts with historical data
            function updateCharts() {
                fetch('/api/history')
                    .then(response => response.json())
                    .then(data => {
                        // Update temperature chart
                        tempChart.data.labels = data.timestamps;
                        tempChart.data.datasets[0].data = data.temperatures;
                        tempChart.update();
                        
                        // Update CPU chart
                        cpuChart.data.labels = data.timestamps;
                        cpuChart.data.datasets[0].data = data.cpu_usage;
                        cpuChart.update();
                        
                        // Update memory chart
                        memoryChart.data.labels = data.timestamps;
                        memoryChart.data.datasets[0].data = data.memory_usage;
                        memoryChart.data.datasets[1].data = data.disk_usage;
                        memoryChart.update();
                    })
                    .catch(error => console.error('Error fetching history:', error));
            }
            
            // Refresh data every 10 seconds
            function refreshData() {
                updateCurrentStats();
                updateCharts();
            }
            
            // Initialize dashboard
            document.addEventListener('DOMContentLoaded', function() {
                initializeCharts();
                refreshData();
                setInterval(refreshData, 10000); // Update every 10 seconds
            });
        </script>
    </body>
    </html>
    """
@app.route('/api/current_stats')
def get_current_stats():
    """Get current system statistics"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'})
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Get latest metrics
        cursor.execute("""
            SELECT * FROM system_metrics 
            ORDER BY recorded_at DESC 
            LIMIT 1
        """)
        current = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'current': current
        })
        
    except mysql.connector.Error as e:
        return jsonify({'error': str(e)})

@app.route('/api/history')
def get_history():
    """Get historical data for charts"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'})
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Get last 50 records for charts
        cursor.execute("""
            SELECT 
                recorded_at,
                cpu_temperature,
                cpu_usage,
                memory_usage,
                disk_usage
            FROM system_metrics 
            ORDER BY recorded_at DESC 
            LIMIT 50
        """)
        
        records = cursor.fetchall()
        records.reverse()  # Reverse to show oldest first
        
        cursor.close()
        connection.close()
        
        # Prepare data for charts
        timestamps = [r['recorded_at'].strftime('%H:%M:%S') for r in records]
        temperatures = [float(r['cpu_temperature']) for r in records]
        cpu_usage = [float(r['cpu_usage']) for r in records]
        memory_usage = [float(r['memory_usage']) for r in records]
        disk_usage = [float(r['disk_usage']) for r in records]
        
        return jsonify({
            'timestamps': timestamps,
            'temperatures': temperatures,
            'cpu_usage': cpu_usage,
            'memory_usage': memory_usage,
            'disk_usage': disk_usage
        })
        
    except mysql.connector.Error as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
