const songs = [
  {
    title: "Acoustic Breeze",
    artist: "Bensound",
    src: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
    cover: "https://picsum.photos/300/300?random=11"
  },
  {
    title: "Creative Minds",
    artist: "Bensound",
    src: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
    cover: "https://picsum.photos/300/300?random=12"
  },
  {
    title: "Ukulele",
    artist: "Bensound",
    src: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3",
    cover: "https://picsum.photos/300/300?random=13"
  }
];
const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");

const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

const volume = document.getElementById("volume");
const playlistItems = document.getElementById("playlist-items");
const fileInput = document.getElementById("file-input");

let currentSongIndex = 0;
let isPlaying = false;
function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover || "https://picsum.photos/300/300?random=99";
  audio.src = song.src;
  updatePlaylistHighlight();
}

// Play / Pause Logic
function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Previous / Next Track Controls
prevBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
});

nextBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
});

// Format Seconds into M:SS
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Progress Bar & Duration Updates
audio.addEventListener("timeupdate", () => {
  progress.value = audio.currentTime;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  progress.max = audio.duration;
  durationEl.textContent = formatTime(audio.duration);
});

progress.addEventListener("input", () => {
  audio.currentTime = progress.value;
});

// Volume Control
volume.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// Autoplay Next Song when Current Song Ends
audio.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
});

// Render Playlist
function renderPlaylist() {
  playlistItems.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;
    
    if (index === currentSongIndex) {
      li.classList.add("active");
    }

    li.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(songs[currentSongIndex]);
      playSong();
    });

    playlistItems.appendChild(li);
  });
}

function updatePlaylistHighlight() {
  const items = playlistItems.querySelectorAll("li");
  items.forEach((item, index) => {
    if (index === currentSongIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Upload Custom Audio Files
fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    const newSong = {
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local Track",
      src: URL.createObjectURL(file),
      cover: "https://picsum.photos/300/300?random=" + Math.floor(Math.random() * 100)
    };
    songs.push(newSong);
  });

  renderPlaylist();
  
  // Play the first newly added song if none is currently playing
  if (!isPlaying) {
    currentSongIndex = songs.length - files.length;
    loadSong(songs[currentSongIndex]);
    playSong();
  }
});

// App Startup
loadSong(songs[currentSongIndex]);
renderPlaylist();