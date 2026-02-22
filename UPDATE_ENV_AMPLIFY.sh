#!/bin/bash

# Update AWS Amplify environment variables via AWS CLI

set -e

BACKEND_URL="https://api.growwiseschool.org"

echo "🔧 Updating AWS Amplify Environment Variables"
echo ""

# Try to find Amplify app
echo "Searching for Amplify apps..."
APPS=$(aws amplify list-apps --region us-west-1 --query 'apps[*].{Name:name,AppId:appId}' --output json 2>/dev/null || echo "[]")

if [ "$APPS" = "[]" ] || [ -z "$APPS" ]; then
    echo "❌ No Amplify apps found in us-west-1"
    echo ""
    echo "Trying other regions..."
    for REGION in us-east-1 us-east-2 eu-west-1; do
        APPS=$(aws amplify list-apps --region "$REGION" --query 'apps[*].{Name:name,AppId:appId}' --output json 2>/dev/null || echo "[]")
        if [ "$APPS" != "[]" ] && [ ! -z "$APPS" ]; then
            echo "✅ Found apps in $REGION"
            echo "$APPS" | jq -r '.[] | "  - \(.Name) (\(.AppId))"'
            echo ""
            read -p "Enter the App ID to update: " APP_ID
            read -p "Enter the region [$REGION]: " SELECTED_REGION
            SELECTED_REGION=${SELECTED_REGION:-$REGION}
            
            # Get branches
            BRANCHES=$(aws amplify list-branches --app-id "$APP_ID" --region "$SELECTED_REGION" --query 'branches[].branchName' --output text 2>/dev/null || echo "main")
            
            for BRANCH in $BRANCHES; do
                echo "Updating branch: $BRANCH"
                aws amplify update-branch \
                    --app-id "$APP_ID" \
                    --branch-name "$BRANCH" \
                    --region "$SELECTED_REGION" \
                    --environment-variables "NEXT_PUBLIC_BACKEND_URL=$BACKEND_URL" \
                    --output json > /dev/null 2>&1 && echo "  ✅ Updated $BRANCH" || echo "  ⚠️  Failed to update $BRANCH"
            done
            
            echo ""
            echo "✅ Environment variables updated!"
            echo "📝 Trigger a new deployment in Amplify Console for changes to take effect"
            exit 0
        fi
    done
    
    echo "❌ Could not find any Amplify apps"
    echo ""
    echo "Please update manually:"
    echo "  1. Go to AWS Amplify Console"
    echo "  2. Select your app"
    echo "  3. App Settings → Environment Variables"
    echo "  4. Add: NEXT_PUBLIC_BACKEND_URL = $BACKEND_URL"
    echo "  5. Redeploy"
    exit 1
else
    echo "Found Amplify apps:"
    echo "$APPS" | jq -r '.[] | "  - \(.Name) (\(.AppId))"'
    echo ""
    
    if [ $(echo "$APPS" | jq 'length') -eq 1 ]; then
        APP_ID=$(echo "$APPS" | jq -r '.[0].AppId')
        APP_NAME=$(echo "$APPS" | jq -r '.[0].Name')
        echo "Using app: $APP_NAME ($APP_ID)"
    else
        echo "$APPS" | jq -r '.[] | "\(.AppId) - \(.Name)"' | nl
        read -p "Select app number: " APP_NUM
        APP_ID=$(echo "$APPS" | jq -r ".[$((APP_NUM-1))].AppId")
    fi
    
    # Get branches
    BRANCHES=$(aws amplify list-branches --app-id "$APP_ID" --region us-west-1 --query 'branches[].branchName' --output text 2>/dev/null || echo "main")
    
    echo ""
    echo "Updating branches..."
    for BRANCH in $BRANCHES; do
        echo "  Updating branch: $BRANCH"
        aws amplify update-branch \
            --app-id "$APP_ID" \
            --branch-name "$BRANCH" \
            --region us-west-1 \
            --environment-variables "NEXT_PUBLIC_BACKEND_URL=$BACKEND_URL" \
            --output json > /dev/null 2>&1 && echo "    ✅ Updated" || echo "    ⚠️  Failed"
    done
    
    echo ""
    echo "✅ Environment variables updated!"
    echo "📝 Go to Amplify Console and trigger a new deployment"
fi

