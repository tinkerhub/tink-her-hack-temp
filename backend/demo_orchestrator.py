import asyncio
import json
from backend.quest_types import QuestContext
from backend.quest_orchestrator import QuestOrchestrator

async def main():
    # 1. Setup Context
    ctx = QuestContext(
        user_id="user_123",
        location={"lat": 40.7128, "lon": -74.0060}, # NYC
        time_available=120,
        weather_condition="Rain",
        vibe_preference="Chill",
        budget_tier="Budget"
    )

    print(f"--- Input Context ---\n{ctx.model_dump_json(indent=2)}\n")

    # 2. Run Orchestrator
    orchestrator = QuestOrchestrator()
    print("--- Generating Quest... ---")
    quest = await orchestrator.generate_quest(ctx)

    # 3. Output Result
    print(f"\n--- Generated Quest ---\n{quest.model_dump_json(indent=2)}")

if __name__ == "__main__":
    asyncio.run(main())
