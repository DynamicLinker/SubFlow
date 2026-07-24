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
        result = self.model.transcribe(video, word_timestamps=True)
        return result
    
    def getSub(self, video):
        srt_write = get_writer('srt','.')
        opt = {
            "max_words_per_line": 3,
            "highlight_words": True,
        }
        srt_write(self.transctibeVideo(video), video, opt)
        # srt_write(self.transctibeVideo(video), video, {"font_color": "#ff0000"})
        return f"{os.path.splitext(os.path.basename(video))[0]}.srt"
    
