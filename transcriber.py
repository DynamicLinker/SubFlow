import os
import time
import whisper

class Transcriber:
    def __init__(self, model = 'base', device='cpu'):
        # self.video = video
        self.model = whisper.load_model(model, device=device)

    def transctibeVideo(self, video):
        if not os.path.exists(video):
            return (False, 'No File Found')
        result = self.model.transcribe(video)
        return result
    
