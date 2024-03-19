#!/bin/bash


# commands
cd /root/

# Create a new tmux session named "iws-main-session"
tmux new-session -d -s iws-main-session

# Split the window into four panes
tmux split-window -t iws-main-session:0 -h
tmux split-window -t iws-main-session:0 -v
tmux split-window -t iws-main-session:0 -h
tmux split-window -t iws-main-session:0 -v

# Select the layout for equal vertical and horizontal panes
tmux select-layout -t iws-main-session:0 tiled

# Send commands to each pane
tmux send-keys -t iws-main-session:0.0 "systemctl start mosquitto" C-m
tmux send-keys -t iws-main-session:0.0 "systemctl status mosquitto" C-m
tmux send-keys -t iws-main-session:0.0 "source /root/.iws/bin/activate && cd /root/.iws/IWS-main/ && python3 handle_incoming.py" C-m

tmux send-keys -t iws-main-session:0.1 "source /root/.iws/bin/activate && cd /root/.iws/IWS-main/ && python3 device_queuing.py" C-m

tmux send-keys -t iws-main-session:0.2 "source /root/.iws/bin/activate && cd /root/.iws/IWS-main/ && python3 database_insertion.py" C-m

tmux send-keys -t iws-main-session:0.3 "cd /root/.iws/IWS-main/localserver" C-m
tmux send-keys -t iws-main-session:0.3 "node server.js" C-m

# Attach to the session to view the window
tmux attach-session -t iws-main-session
