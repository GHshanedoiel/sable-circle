#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  Sable Circle — Local Machine Setup & Verification"
echo "  Where vision meets precision"
echo "=========================================================="
echo ""

# 1. Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or newer: https://nodejs.org"
    exit 1
fi
echo "✓ Node.js detected: $(node -v)"

# 2. Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi
echo "✓ npm detected: $(npm -v)"

# 3. Check FFmpeg (Optional but recommended for local CLI video processing)
if command -v ffmpeg &> /dev/null; then
    echo "✓ FFmpeg detected: $(ffmpeg -version | head -n 1)"
else
    echo "⚠️  FFmpeg was not detected in PATH."
    echo "   To enable local terminal video rendering:"
    echo "   - macOS (Homebrew): brew install ffmpeg"
    echo "   - Ubuntu/Debian:    sudo apt update && sudo apt install ffmpeg"
    echo "   - Windows (winget): winget install Gyan.FFmpeg"
    echo "   (The web app preview runs completely without it in-browser)"
fi

echo ""
echo "📦 Installing project dependencies..."
npm install

echo ""
echo "⚙️ Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created .env from .env.example"
else
    echo "✓ .env already exists"
fi

echo ""
echo "🗄️ Initializing SQLite database migrations (Drizzle ORM)..."
npm run db:generate || true

echo ""
echo "🚀 Starting Sable Circle development server on http://localhost:3000..."
npm run dev
