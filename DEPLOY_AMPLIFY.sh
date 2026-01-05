#!/bin/bash

# AWS Amplify Deployment Script for GrowWise Frontend

set -e

echo "🚀 Starting AWS Amplify Deployment..."

# Check if Amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    echo "❌ Amplify CLI not found. Installing..."
    npm install -g @aws-amplify/cli
    echo "📝 Please run 'amplify configure' to set up AWS credentials"
    exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured. Please run: aws configure"
    exit 1
fi

# Initialize if not already done
if [ ! -d "amplify" ]; then
    echo "📝 Initializing Amplify..."
    amplify init
fi

# Add hosting if not already added
if ! amplify status | grep -q "hosting"; then
    echo "🌐 Adding hosting..."
    amplify add hosting
fi

# Set environment variables
echo "🔧 Setting environment variables..."
read -p "Set environment variables now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Please set these in Amplify Console:"
    echo "- NEXT_PUBLIC_BACKEND_URL"
    echo "- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    echo "- Any other NEXT_PUBLIC_* variables"
    echo ""
    echo "Or use: amplify env add"
fi

# Deploy
echo "🚀 Deploying to AWS Amplify..."
amplify publish

echo "✅ Deployment complete!"
echo "🌐 Your app is live at the URL shown above"


