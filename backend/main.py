import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from simulators import simulate_cad_dispatch, simulate_power_grid, simulate_gtfs_transit, fetch_real_weather

app = FastAPI(title="CityPulse Data Fusion API - Jaipur Edition")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

event_queue = asyncio.Queue()
active_connections = []

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(simulate_cad_dispatch(event_queue))
    asyncio.create_task(simulate_power_grid(event_queue))
    asyncio.create_task(simulate_gtfs_transit(event_queue))
    asyncio.create_task(fetch_real_weather(event_queue))
    asyncio.create_task(broadcast_events())

async def broadcast_events():
    while True:
        event = await event_queue.get()
        if active_connections:
            message = event.model_dump_json()
            for connection in active_connections:
                try:
                    await connection.send_text(message)
                except Exception:
                    pass

@app.websocket("/ws/pulse")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "active_streams": 4, "city": "Jaipur"}
