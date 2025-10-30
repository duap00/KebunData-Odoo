# Raspberry Pi CM4 Monitoring Dashboard

A comprehensive system monitoring solution for Raspberry Pi CM4 with real-time web dashboard.

## Features

- 📊 Real-time system metrics monitoring (CPU, Memory, Disk, Temperature)
- 🗄️ MySQL database storage with automatic data rotation
- 🌐 Web dashboard with interactive charts
- 🔄 Automated data cleanup and optimization
- 📈 Historical data analysis

## Architecture

- **Data Collection**: Python script collecting system metrics every 5 minutes
- **Database**: MySQL with automated retention policies
- **Web Interface**: Flask dashboard with Chart.js visualizations
- **Storage Optimization**: Automatic data summarization and cleanup

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cm4-monitoring-dashboard.git
