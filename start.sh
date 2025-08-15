#!/bin/bash

# AI Customer Support Chatbot Startup Script
# This script sets up and starts the chatbot

echo "🤖 AI Customer Support Chatbot - Startup Script"
echo "================================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
REQUIRED_VERSION="3.8"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Python version $PYTHON_VERSION is too old. Please install Python $REQUIRED_VERSION or higher."
    exit 1
fi

echo "✅ Python $PYTHON_VERSION detected"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment found"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check if requirements are installed
if [ ! -f "venv/lib/python*/site-packages/flask" ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        echo "⚙️  Creating .env file from template..."
        cp env.example .env
        echo "⚠️  Please edit .env file with your OpenAI API key before starting"
        echo "   You can edit it now or press Enter to continue..."
        read -r
    else
        echo "⚠️  No .env file found. Please create one with your OpenAI API key."
        echo "   Example:"
        echo "   OPENAI_API_KEY=your_api_key_here"
        echo "   FLASK_ENV=development"
        echo "   Press Enter when ready..."
        read -r
    fi
fi

# Check if OpenAI API key is set
if [ -f ".env" ]; then
    source .env
    if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your_openai_api_key_here" ]; then
        echo "⚠️  OpenAI API key not set in .env file"
        echo "   The chatbot will work with limited functionality"
        echo "   Press Enter to continue..."
        read -r
    else
        echo "✅ OpenAI API key configured"
    fi
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs data

# Start the chatbot
echo "🚀 Starting AI Customer Support Chatbot..."
echo "   Web interface will be available at: http://localhost:5000"
echo "   Press Ctrl+C to stop the server"
echo ""

# Run the application
python app.py
