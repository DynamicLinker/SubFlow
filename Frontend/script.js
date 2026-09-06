document.addEventListener("DOMContentLoaded", function () {
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

    let selectedVideo = null;

    chooseBtn.addEventListener("click", function () {
        videoInput.click();
    });

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

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return (
            String(minutes).padStart(2, "0") +
            ":" +
            String(remainingSeconds).padStart(2, "0")
        );
    }

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

    function generateThumbnails() {
        thumbnailStrip.innerHTML = "";

        const duration = videoPreview.duration;
        const numberOfThumbnails = 8;

        for (let i = 0; i < numberOfThumbnails; i++) {
            const time = (duration / (numberOfThumbnails - 1)) * i;
            createThumbnail(time);
        }
    }

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
            formatTime(to) +
            " (Processing video...)";

        processBtn.disabled = true;

        try {
            const formData = new FormData();
            formData.append("file", selectedVideo);

            const response = await fetch('http://localhost:8000/api/v1/getVideo', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error("Server error: " + response.status);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            resultVideo.src = url;
            downloadBtn.href = url;
            
            resultSection.style.display = "block";
            status.textContent = "Processing complete!";
            
            resultSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error("Error connecting to backend:", error);
            status.textContent = "An error occurred while processing.";
        } finally {
            processBtn.disabled = false;
        }
    });

});