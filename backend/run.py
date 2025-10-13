import os
import subprocess
import sys
import uvicorn

if __name__ == "__main__":
  subprocess.run([sys.executable, "-m", "src.chroma.seed_songs", "--reset"])


  uvicorn.run(
    "src.main:app",
    host="0.0.0.0",
    port=int(os.getenv("PORT", 8000)),
    reload=False
  )