#!/bin/sh
# Simple script to run the site in the local network.

cmd_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Obtaining the IP with `ip`, or in case it's not installed, `ifconfig`.
if cmd_exists ip; then
    MY_IP=$(ip route get 1 | awk '{print $(NF-2);exit}')
else
    MY_IP=$(ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')
fi
URL="http://$MY_IP:1313"

# Opening a tab in the browser with the URL
if cmd_exists xdg-open; then
    xdg-open "$URL"
elif cmd_exists open; then
    open "$URL"
fi

# Starting the server at the end
hugo server --bind "$MY_IP" --baseURL "$URL"
