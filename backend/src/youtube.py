import requests
from src.config import settings

def youtube_api(song_name: str): 
    search_query = song_name + " guitar tutorial"
    max_results = 1  

    endpoint = (
        "https://www.googleapis.com/youtube/v3/search"
        f"?part=snippet&maxResults={max_results}&q={search_query}&key={settings.yt_api_key}"
    )

    response = requests.get(endpoint)

    if response.status_code == 200:
        data = response.json()
        
        if data['items']:
            video_id = data['items'][0]['id']['videoId']
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            title = data['items'][0]['snippet']['title']
            
            print(f"Title: {title}")
            print(f"Video URL: {video_url}")
            
            return {
                "video_id": video_id,
                "video_url": video_url,
                "title": title,
                "thumbnail": data['items'][0]['snippet']['thumbnails']['high']['url']
            }
        else:
            print("No results found")
            return None
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return None

if __name__ == "__main__":
    result = youtube_api("Wonderwall")
    print(result)