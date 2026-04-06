#!/bin/bash

# Script to update NEXT_PUBLIC_BACKEND_URL in frontend deployment
# Works for AWS Amplify, Vercel, or other platforms

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$FRONTEND_ROOT"

BACKEND_URL="https://api.growwiseschool.org"

echo "🔧 Updating frontend backend URL to: $BACKEND_URL"
echo ""

# Check if Amplify app exists
echo "Checking for AWS Amplify deployment..."
AMPLIFY_APP=$(aws amplify list-apps --region us-west-1 --query 'apps[0].appId' --output text 2>/dev/null || echo "")

if [ ! -z "$AMPLIFY_APP" ] && [ "$AMPLIFY_APP" != "None" ]; then
    echo "✅ Found Amplify app: $AMPLIFY_APP"
    echo ""
    echo "Updating environment variables in Amplify..."
    
    # Get all branches
    BRANCHES=$(aws amplify list-branches --app-id "$AMPLIFY_APP" --region us-west-1 --query 'branches[].branchName' --output text 2>/dev/null || echo "main")
    
    for BRANCH in $BRANCHES; do
        echo "  Updating branch: $BRANCH"
        aws amplify update-branch \
            --app-id "$AMPLIFY_APP" \
            --branch-name "$BRANCH" \
            --region us-west-1 \
            --environment-variables "NEXT_PUBLIC_BACKEND_URL=$BACKEND_URL" \
            --output json > /dev/null 2>&1 || echo "    ⚠️  Could not update branch $BRANCH (may need manual update)"
    done
    
    echo ""
    echo "✅ Amplify environment variables updated!"
    echo "📝 Note: You may need to trigger a new deployment for changes to take effect"
    echo "   Go to: AWS Amplify Console → Your App → Redeploy this version"
    
else
    echo "⚠️  No Amplify app found or AWS CLI not configured"
    echo ""
    echo "Please update environment variables manually:"
    echo ""
    echo "For AWS Amplify:"
    echo "  1. Go to AWS Amplify Console"
    echo "  2. Select your app"
    echo "  3. Go to App Settings → Environment Variables"
    echo "  4. Add/Update: NEXT_PUBLIC_BACKEND_URL = $BACKEND_URL"
    echo "  5. Redeploy"
    echo ""
    echo "For Vercel:"
    echo "  1. Go to Vercel Dashboard"
    echo "  2. Select your project"
    echo "  3. Go to Settings → Environment Variables"
    echo "  4. Add/Update: NEXT_PUBLIC_BACKEND_URL = $BACKEND_URL"
    echo "  5. Redeploy"
    echo ""
    echo "For other platforms:"
    echo "  Set environment variable: NEXT_PUBLIC_BACKEND_URL=$BACKEND_URL"
    echo "  Then rebuild and redeploy"
fi

echo ""
echo "📋 Backend URL to use: $BACKEND_URL"

