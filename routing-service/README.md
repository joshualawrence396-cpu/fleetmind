# FleetMind Routing Service

## Setup
1. Install Python 3.11+
2. Run: `pip install -r requirements.txt`
3. Run: `python main.py`
4. Service runs at http://localhost:8000
5. Test: http://localhost:8000/health

## OR-Tools VRP
Full Vehicle Routing Problem optimization with:
- Time windows
- Vehicle capacity constraints
- Distance limits
- Guided local search
- Fallback greedy if OR-Tools unavailable