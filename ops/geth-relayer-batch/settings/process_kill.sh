#!/bin/bash
if [[ $# -gt 1 ]]; then
    echo "kill process_monitor">>/app/log/t_supervisord.log
    ps -ef | grep process_monitor.sh | grep -v grep | awk '{print $2}'|xargs kill -9
    case "$1" in
    "geth")
        ps -ef | grep geth | grep verbosity | grep -v grep | awk '{print $2}'|xargs kill -15
        sleep 30
        ppid=$(ps -ef | grep geth | grep verbosity | grep -v grep | awk '{print $2}')
        if [[ -n "$ppid" ]]; then
            kill -9 "$ppid"
        fi
        ;;
    "batch-submitter")
        ps -ef | grep run-batch-submitter.js | grep -v grep | awk '{print $2}'|xargs kill -15
        sleep 30
        ppid=$(ps -ef | grep run-batch-submitter.js | grep -v grep | awk '{print $2}')
        if [[ -n "$ppid" ]]; then
            kill -9 "$ppid"
        fi
        ;;
    "message-relayer")
        ps -ef | grep run-message-relayer.js | grep -v grep | awk '{print $2}'|xargs kill -15
        sleep 30
        ppid=$(ps -ef | grep run-message-relayer.js | grep -v grep | awk '{print $2}')
        if [[ -n "$ppid" ]]; then
            kill -9 "$ppid"
        fi
        ;;
    *)
        echo "$* is illegal">>/app/log/t_supervisord.log
        ;;
    esac
    echo "restart process_monitor">>/app/log/t_supervisord.log
    nohup /app/process_monitor.sh >>/app/log/t_supervisord.log 2>&1 &
elif [[ $# -gt 0 ]]; then
    echo "safe kill start">>/app/log/t_supervisord.log
    ps -ef | grep process_monitor.sh | grep -v grep | awk '{print $2}'|xargs kill -9
    ps -ef | grep geth | grep verbosity | grep -v grep | awk '{print $2}'|xargs kill -15
    ps -ef | grep run-batch-submitter.js | grep -v grep | awk '{print $2}'|xargs kill -15
    ps -ef | grep run-message-relayer.js | grep -v grep | awk '{print $2}'|xargs kill -15
    sleep 30
    pid=$(ps -ef | grep geth | grep verbosity | grep -v grep | awk '{print $2}')
    if [[ -n "$pid" ]]; then
        kill -9 "$pid"
    fi
    pid=$(ps -ef | grep run-batch-submitter.js | grep -v grep | awk '{print $2}')
    if [[ -n "$pid" ]]; then
        kill -9 "$pid"
    fi
    pid=$(ps -ef | grep run-message-relayer.js | grep -v grep | awk '{print $2}')
    if [[ -n "$pid" ]]; then
        kill -9 "$pid"
    fi
    echo "safe kill end">>/app/log/t_supervisord.log
else
    ps -ef | grep process_monitor.sh | grep -v grep | awk '{print $2}'|xargs kill -9
    ps -ef | grep geth | grep verbosity | grep -v grep | awk '{print $2}'|xargs kill -9
    ps -ef | grep run-batch-submitter.js | grep -v grep | awk '{print $2}'|xargs kill -9
    ps -ef | grep run-message-relayer.js | grep -v grep | awk '{print $2}'|xargs kill -9
fi
