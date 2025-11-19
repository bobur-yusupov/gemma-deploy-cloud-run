import requests

url = "https://gemma-service-530483421367.europe-west4.run.app/infer-stream"
data = {"prompt": "Write a short poem about clouds."}

# Use stream=True to get chunks as they arrive
with requests.post(url, json=data, stream=True) as r:
    for chunk in r.iter_lines(decode_unicode=True):
        if chunk:
            print(chunk)
