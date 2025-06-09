#!/bin/bash

echo "Starting Melvis Mental Health Chatbot..."

# Start backend server
echo "Starting FastAPI backend server..."
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting React frontend..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo "Backend server started (PID: $BACKEND_PID)"
echo "Frontend server started (PID: $FRONTEND_PID)"
echo ""
echo "🎉 Melvis is ready!"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup INT TERM

# Wait for both processes
wait
