cd /usr/local/bin/IWS
npm run start

# Service File Content --------------------------------
#
# [Unit]
# Description=IWS Dashboard service

# [Service]
# ExecStart=/usr/local/bin/IWS/scripts/start.sh

# [Install]
# WantedBy=multi-user.target
