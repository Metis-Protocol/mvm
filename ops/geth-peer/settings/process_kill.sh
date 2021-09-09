#!/bin/bash
ps -ef | grep process_monitor.sh | grep -v grep | awk '{print $2}'|xargs kill -9
ps -ef | grep geth | grep verbosity | grep -v grep | awk '{print $2}'|xargs kill -9