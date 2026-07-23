import os
import time
import whisper
from whisper.utils import get_writer

class Transcriber:
    def __init__(self, model = 'base', device='cpu'):
        # self.video = video
        self.model = whisper.load_model(model, device=device)

    def transctibeVideo(self, video):
        if not os.path.exists(video):
            return (False, 'No File Found')
        result = self.model.transcribe(video)
        return result
    
    def getSub(self, video):
        srt_write = get_writer('srt','.')
        srt_write(self.transctibeVideo(video), video)
        return f"{os.path.splitext(os.path.basename(video))[0]}.srt"
    
