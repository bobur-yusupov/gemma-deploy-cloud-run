from websockets.sync.client import connect

def hello():
    with connect("wss://gemma-service-530483421367.europe-west4.run.app/ws/infer") as websocket:
        websocket.send("Hello world to Gemma 3!")
        message = websocket.recv()
        print(f"Received: {message}")

hello()
