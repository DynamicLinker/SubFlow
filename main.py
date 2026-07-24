import os
from transcriber import Transcriber
import subprocess

ts = Transcriber(model='base', device = 'cuda')

sub = ts.getSub('video.mp4')

# print(sub)

# subprocess.run(['ffmpeg', '-i', 'video.mp4', '-f', 'srt', '-i', sub,'-c', 'copy', '-c:s', 'mov_text', 'output.mp4' ] , stdout=subprocess.DEVNULL)

# subprocess.run(['ffmpeg', '-i', 'video.mp4', '-vf', f'subtitles={sub},scale=360:640', '-c:v', 'h264_nvenc', '-c:a', 'copy', 'output.mp4' ] , stdout=subprocess.DEVNULL)

# subprocess.run(['ffmpeg', '-i', 'video.mp4', '-y', '-vf', f'subtitles={sub}, scale=360:480', '-c:v','h264_nvenc', '-c:a', 'copy', 'output.mp4' ] , stdout=subprocess.DEVNULL)

subprocess.run(['ffmpeg', '-i', 'video.mp4', '-y', '-vf', f'subtitles={sub}, scale=-1:1280,crop=720:1280:(iw-720)/2:0', '-c:v','h264_nvenc', '-c:a', 'copy', 'output.mp4' ] , stdout=subprocess.DEVNULL)


# os.remove(sub)

