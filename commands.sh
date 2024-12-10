#!/bin/bash

if [ $# -eq 0 ]; then
  echo "Usage: $0 <command> [artisan-arguments]"
  exit 1
fi

FOLDER_NAME=$(basename "$PWD")
CONTAINER_NAME=$(docker ps --format "{{.Names}}" | grep "$FOLDER_NAME" | grep "php")

if [ -z "$CONTAINER_NAME" ]; then
  echo "No Docker container found matching '$FOLDER_NAME' and 'php'."
  exit 1
fi

if [ "$1" == "part" ]; then
  if [ $# -lt 2 ]; then
    echo "Usage: $0 part <artisan-command>"
    exit 1
  fi
  shift
  docker exec -it "$CONTAINER_NAME" php artisan "$@"
else
  docker exec -it "$CONTAINER_NAME" "$@"
fi
