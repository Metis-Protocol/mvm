#!/bin/bash
ps -ef | grep process_monitor.sh | grep -v grep | awk '{print $2}'|xargs kill -9
if [[ $# -gt 0 ]]; then
    echo "safe kill start">>/app/log/t_supervisord.log
    ps -ef | grep geth | grep verbosity | grep -v grep | awk '{print $2}'|xargs kill -15
    sleep 30
    pid=$(ps -ef | grep geth | grep verbosity | grep -v grep | awk '{print $2}')
    if [[ -n "$pid" ]]; then
        kill -9 "$pid"
    fi
    echo "safe kill end">>/app/log/t_supervisord.log
else
    ps -ef | grep geth | grep verbosity | grep -v grep | awk '{print $2}'|xargs kill -9
fi
