#!/bin/bash

# Script to update Stripe publishable key in frontend (if needed)
# Note: Your frontend uses backend API, so this may not be necessary
# But it's good to have it set in case you add Stripe Elements later

set -e

echo "🔄 Updating Stripe Publishable Key for Frontend"
echo ""

if [ -z "$STRIPE_PUBLISHABLE_KEY" ]; then
    echo "Please provide your production Stripe publishable key:"
    read -p "Enter Stripe Production Publishable Key (pk_live_...): " STRIPE_PUBLISHABLE_KEY
    echo ""
fi

# Validate key
if [[ ! "$STRIPE_PUBLISHABLE_KEY" =~ ^pk_live_ ]]; then
    echo "❌ Error: Publishable key should start with 'pk_live_'"
    echo "   You provided: ${STRIPE_PUBLISHABLE_KEY:0:10}..."
    exit 1
fi

echo "📋 Configuration:"
echo "   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${STRIPE_PUBLISHABLE_KEY:0:15}..."
echo ""
echo "⚠️  Note: Your frontend currently uses backend API for Stripe"
echo "   This key is optional but recommended for future Stripe Elements integration"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

# Try to update via Amplify
echo ""
echo "Checking for AWS Amplify deployment..."
AMPLIFY_APP=$(aws amplify list-apps --region us-west-1 --query 'apps[0].appId' --output text 2>/dev/null || echo "")

if [ ! -z "$AMPLIFY_APP" ] && [ "$AMPLIFY_APP" != "None" ]; then
    echo "✅ Found Amplify app: $AMPLIFY_APP"
    
    BRANCHES=$(aws amplify list-branches --app-id "$AMPLIFY_APP" --region us-west-1 --query 'branches[].branchName' --output text 2>/dev/null || echo "main")
    
    for BRANCH in $BRANCHES; do
        echo "  Updating branch: $BRANCH"
        aws amplify update-branch \
            --app-id "$AMPLIFY_APP" \
            --branch-name "$BRANCH" \
            --region us-west-1 \
            --environment-variables "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY" \
            --output json > /dev/null 2>&1 && echo "    ✅ Updated" || echo "    ⚠️  Failed"
    done
    
    echo ""
    echo "✅ Environment variable updated in Amplify!"
    echo "📝 Trigger a new deployment for changes to take effect"
else
    echo "⚠️  No Amplify app found"
    echo ""
    echo "Please update manually in your hosting platform:"
    echo "  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY"
fi

