@echo off
echo Starting FleetMind ML Service...
pip install fastapi uvicorn ortools prophet scikit-learn pandas numpy
python main.py