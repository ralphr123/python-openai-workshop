#!/bin/bash -e

done=0
trap 'done=1' TERM INT

while [ $done = 0 ]; do
    python /app/src/main.py
    if [ $? -ne 0 ]; then
        # An error occurred. Wait for a bit before attempting to run the script again.
        echo "Error detected. Restarting in 2 seconds..."
        sleep 2
    fi
done
