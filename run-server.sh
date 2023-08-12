#!/bin/bash -e

# Define a function to handle stop signals
terminate() {
    kill -s SIGTERM $$
    exit 0
}

# Trap stop signals and call the 'terminate' function
trap terminate SIGTERM SIGHUP SIGINT

while true; do
    python /app/src/main.py
    if [ $? -ne 0 ]; then
        # An error occurred. Wait for a bit before attempting to run the script again.
        echo "Error detected. Restarting in 2 seconds..."
        sleep 2
    fi
done
