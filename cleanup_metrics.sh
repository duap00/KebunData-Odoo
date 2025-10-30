#!/bin/bash
# cleanup_metrics.sh - Automated data rotation for CM4 monitoring

echo "=========================================="
echo "$(date): Starting metrics cleanup and rotation"
echo "=========================================="

# Connect to MySQL and run the rotation procedure
echo "Running data rotation procedure..."
result=$(docker exec my-mysql mysql -u root -praspberry myapp -N -e "CALL RotateSystemMetrics();")

echo "Result: $result"

# Check if successful (success message contains "SUCCESS" or "INFO")
if [[ $result == *"SUCCESS"* ]] || [[ $result == *"INFO"* ]]; then
    echo "✅ $result"
    
    # Get some stats
    echo "Current database status:"
    docker exec my-mysql mysql -u root -praspberry myapp -e "
        SELECT 
            (SELECT COUNT(*) FROM system_metrics) as detailed_records,
            (SELECT COUNT(*) FROM system_metrics_daily) as daily_summaries;
    "
else
    echo "❌ Data rotation failed: $result"
    exit 1
fi

echo "=========================================="
echo "$(date): Cleanup completed"
echo "=========================================="
