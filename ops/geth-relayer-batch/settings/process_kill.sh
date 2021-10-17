#!/bin/bash
if [[ $# -gt 0 ]]; then
    echo "kill process_monitor">>/app/log/t_supervisord.log
    ps -ef | grep process_monitor.sh | grep -v grep | awk '{print $2}'|xargs kill -9
    case "$1" in
    "geth")
        ps -ef | grep geth | grep verbosity | grep -v grep | awk '{print $2}'|xargs kill -9
        ;;
    "batch-submitter")
        ps -ef | grep run-batch-submitter.js | grep -v grep | awk '{print $2}'|xargs kill -9
        ;;
    "message-relayer")
        ps -ef | grep run-message-relayer.js | grep -v grep | awk '{print $2}'|xargs kill -9
        ;;
    *)
        echo "$* is illegal">>/app/log/t_supervisord.log
        ;;
    esac
    echo "restart process_monitor">>/app/log/t_supervisord.log
    nohup /app/process_monitor.sh >>/app/log/t_supervisord.log 2>&1 &
else
    ps -ef | grep process_monitor.sh | grep -v grep | awk '{print $2}'|xargs kill -9
    ps -ef | grep geth | grep verbosity | grep -v grep | awk '{print $2}'|xargs kill -9
    ps -ef | grep run-batch-submitter.js | grep -v grep | awk '{print $2}'|xargs kill -9
    ps -ef | grep run-message-relayer.js | grep -v grep | awk '{print $2}'|xargs kill -9
fi
