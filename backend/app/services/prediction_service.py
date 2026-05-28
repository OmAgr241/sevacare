from dataclasses import dataclass


@dataclass
class PredictionInput:
    active_queue: int
    avg_consultation_mins: int
    avg_wait_mins: int
    hour: int
    weekday: int


def predict_wait_time(inp: PredictionInput) -> tuple[int, str, str]:
    # Lightweight heuristic baseline. Swap with LightGBM model file in production.
    base = max(inp.avg_wait_mins, inp.active_queue * max(4, inp.avg_consultation_mins // 2))
    rush_factor = 1.15 if 10 <= inp.hour <= 13 else 1.0
    weekday_factor = 1.1 if inp.weekday in (0, 1, 5) else 1.0
    estimate = int(base * rush_factor * weekday_factor)

    if estimate <= 15:
        crowd = "Low"
        best_time = "Now"
    elif estimate <= 35:
        crowd = "Medium"
        best_time = "After 2:00 PM"
    else:
        crowd = "High"
        best_time = "Early morning (8:00-10:00 AM)"

    return estimate, crowd, best_time
