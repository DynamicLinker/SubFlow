document.addEventListener("DOMContentLoaded", function () {
    // Get HTML elements
    const videoInput = document.getElementById("videoInput");
    const chooseBtn = document.getElementById("chooseBtn");
    const fileName = document.getElementById("fileName");
    const videoPreview = document.getElementById("videoPreview");
    const editorSection = document.getElementById("editorSection");
    const fromRange = document.getElementById("fromRange");
    const toRange = document.getElementById("toRange");
    const fromTime = document.getElementById("fromTime");
    const toTime = document.getElementById("toTime");
    const processBtn = document.getElementById("processBtn");
    const status = document.getElementById("status");
    const resultSection = document.getElementById("resultSection");
    const resultVideo = document.getElementById("resultVideo");
    const downloadBtn = document.getElementById("downloadBtn");
    const thumbnailStrip = document.getElementById("thumbnailStrip");

    // Store selected video
    let selectedVideo = null;

    // Choose Video button
    chooseBtn.addEventListener("click", function () {
        videoInput.click();
    });

    // Video selected
    videoInput.addEventListener("change", function () {
        const videoFile = videoInput.files[0];

        if (!videoFile) {
            return;
        }

        selectedVideo = videoFile;
        fileName.textContent = videoFile.name;

        const videoURL = URL.createObjectURL(videoFile);
        videoPreview.src = videoURL;
        videoPreview.load();
    });

    // Load video metadata
    videoPreview.addEventListener("loadedmetadata", function () {
        const duration = videoPreview.duration;

        fromRange.max = duration;
        toRange.max = duration;

        fromRange.value = 0;
        toRange.value = duration;

        fromTime.textContent = formatTime(0);
        toTime.textContent = formatTime(duration);

        editorSection.style.display = "flex";

        generateThumbnails();
    });

    // Format seconds as MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return (
            String(minutes).padStart(2, "0") +
            ":" +
            String(remainingSeconds).padStart(2, "0")
        );
    }

    // From slider
    fromRange.addEventListener("input", function () {
        let from = Number(fromRange.value);
        const to = Number(toRange.value);

        if (from > to) {
            from = to;
            fromRange.value = to;
        }

        fromTime.textContent = formatTime(from);
        videoPreview.currentTime = from;
    });

    // To slider
    toRange.addEventListener("input", function () {
        let to = Number(toRange.value);
        const from = Number(fromRange.value);

        if (to < from) {
            to = from;
            toRange.value = from;
        }

        toTime.textContent = formatTime(to);
        videoPreview.currentTime = to;
    });

    // Generate video thumbnails
    function generateThumbnails() {
        thumbnailStrip.innerHTML = "";

        const duration = videoPreview.duration;
        const numberOfThumbnails = 8;

        for (let i = 0; i < numberOfThumbnails; i++) {
            const time = (duration / (numberOfThumbnails - 1)) * i;
            createThumbnail(time);
        }
    }

    // Create a single thumbnail
    function createThumbnail(time) {
        const canvas = document.createElement("canvas");

        canvas.width = 320;
        canvas.height = 180;

        const ctx = canvas.getContext("2d");
        const thumbnailVideo = document.createElement("video");

        thumbnailVideo.src = videoPreview.src;
        thumbnailVideo.muted = true;
        thumbnailVideo.preload = "metadata";

        thumbnailVideo.addEventListener("loadedmetadata", function () {
            thumbnailVideo.currentTime = time;
        });

        thumbnailVideo.addEventListener("seeked", function () {
            ctx.drawImage(
                thumbnailVideo,
                0,
                0,
                canvas.width,
                canvas.height
            );

            const image = document.createElement("img");

            image.src = canvas.toDataURL("image/jpeg");
            image.classList.add("thumbnail");

            thumbnailStrip.appendChild(image);

            thumbnailVideo.remove();
        });
    }

    // Process video
    processBtn.addEventListener("click", async function () {
        if (!selectedVideo) {
            status.textContent = "Please select a video first.";
            return;
        }

        const from = Number(fromRange.value);
        const to = Number(toRange.value);

        console.log("Video:", selectedVideo);
        console.log("From:", from);
        console.log("To:", to);

        status.textContent =
            "Selected: " +
            formatTime(from) +
            " → " +
            formatTime(to);
    });

});