# SubFlow

SubFlow is an automated command-line tool built in Python that takes standard horizontal videos, transcribes the audio using OpenAI's Whisper model, and automatically crops the video into a vertical format (9:16) while burning in word-by-word highlighted captions. 

It is designed to instantly convert standard videos into formats suitable for TikTok, YouTube Shorts, and Instagram Reels.

## Features
- **Accurate Transcriptions:** Powered by OpenAI's Whisper model with word-level timestamps.
- **Dynamic Highlights:** Automatically highlights the current spoken word in the subtitle file.
- **Auto-Cropping:** Uses FFmpeg to center-crop videos to a 9:16 vertical resolution (720x1280).
- **GPU Acceleration:** Automatically detects and utilizes CUDA for faster transcription and NVENC for blazing-fast hardware video encoding if available.

## Prerequisites
Before running the script, ensure you have the following installed:
1. **Python 3.11+**
2. **FFmpeg**: Required for burning subtitles and cropping the video.
   - *Windows:* `winget install ffmpeg --source winget`
   - *Mac:* `brew install ffmpeg`
   - *Linux:* `sudo apt install ffmpeg` (replace apt with your package manager: `pacman`, `dnf`,  `zypper` etc.)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/DynamicLinker/SubFlow.git
cd SubFlow
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install the required Python packages:
```bash
pip install -r requirements.txt
```
*(Note: If you want to use GPU acceleration, make sure you install the PyTorch version that corresponds to your CUDA version from [pytorch.org](https://pytorch.org/get-started/locally/)).*

## Usage

Run the script from the command line using the following arguments:

```bash
python main.py -i my_video.mp4 -o final_short.mp4
```

### Arguments:
- `-i, --input`: (Required) The path to your input video file.
- `-o, --output`: (Optional) The path to save the final video. Defaults to `output.mp4`.
- `-m, --model`: (Optional) The Whisper model to use (`tiny`, `base`, `small`, `medium`, `large`). Defaults to `base`.

### Example:
```bash
python main.py --input video.mp4 --output out.mp4 --model base
```

---

*Created by Ajitesh Chaurasia*
