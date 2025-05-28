#!/bin/bash
cd /home/kavia/workspace/code-generation/appvote-portal-102490-ef3aad64/appvote_portal
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

