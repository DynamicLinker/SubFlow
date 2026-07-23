import os
from transcriber import Transcriber
import subprocess

ts = Transcriber(model='base', device = 'cuda')

sub = ts.getSub('video.mp4')

# print(sub)

# subprocess.run(['ffmpeg', '-i', 'video.mp4', '-f', 'srt', '-i', sub,'-c', 'copy', '-c:s', 'mov_text', 'output.mp4' ] , stdout=subprocess.DEVNULL)

subprocess.run(['ffmpeg', '-i', 'video.mp4', '-vf', f'subtitles={sub}', 'output.mp4' ] , stdout=subprocess.DEVNULL)


os.remove(sub)
