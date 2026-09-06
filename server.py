import os
import uuid
import subprocess
import torch
from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.responses import FileResponse
from transcriber import Transcriber

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def process_video(input_path: str, output_path: str) -> str:
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    
    print(f"[*] Initializing Whisper model on {device.upper()}...")
    ts = Transcriber(model="base", device=device)
    
    print(f"[*] Transcribing audio and generating subtitles for '{input_path}'...")
    sub_file = ts.getSub(input_path)
    
    print("[*] Burning subtitles into video and cropping to 9:16 (Vertical format)...")
    video_codec = 'h264_nvenc' if device == 'cuda' else 'libx264'
    
    ffmpeg_cmd = [
        'ffmpeg', 
        '-i', input_path, 
        '-y',
        '-vf', f"subtitles={sub_file}, scale=-1:1280,crop=720:1280:(iw-720)/2:0", 
        '-c:v', video_codec, 
        '-c:a', 'copy', 
        output_path
    ]
    
    subprocess.run(ffmpeg_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    return sub_file

def cleanup_files(*file_paths):
    for fp in file_paths:
        try:
            if fp and os.path.exists(fp):
                os.remove(fp)
        except Exception as e:
            print(f"Failed to remove {fp}: {e}")

@app.post("/api/v1/getVideo")
async def get_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    unique_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1] if file.filename else ".mp4"
    
    input_filename = f"input_{unique_id}{ext}"
    output_filename = f"output_{unique_id}.mp4"
    
    with open(input_filename, "wb") as f:
        f.write(await file.read())
        
    sub_file = process_video(input_filename, output_filename)
    
    background_tasks.add_task(cleanup_files, input_filename, output_filename, sub_file)
    
    return FileResponse(
        path=output_filename, 
        media_type="video/mp4", 
        filename="processed_video.mp4"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
