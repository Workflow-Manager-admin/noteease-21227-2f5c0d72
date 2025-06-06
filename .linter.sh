#!/bin/bash
cd /home/kavia/workspace/code-generation/noteease-21227-2f5c0d72/noteease_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

