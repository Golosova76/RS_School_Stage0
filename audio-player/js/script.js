"use strict"
const audio = document.querySelector('.audio-element');
const playPauseButton = document.querySelector('.play-pause-button img');
const prevButton = document.querySelector('.prev-button img');
const nextButton = document.querySelector('.next-button img');
const repeatButton = document.querySelector('.repeat-button img');
const volumeButton = document.querySelector('.volume-button img');
const progressBar = document.querySelector('.progress');
const currentTimeSpan = document.querySelector('.current-time');
const durationSpan = document.querySelector('.duration');
const trackTitleSpan = document.querySelector('.track-title');
const trackArtistSpan = document.querySelector('.track-artist');

const tracks = [
  {
    title: 'Gods & Monsters',
    artist: 'Lana Del Rey',
    duration: 236,
    cover: 'img/cover/LanaDelRay.jpg',
    audioSrc: 'songs/GodsMonsters.mp3'
  },
  {
    title: 'The Show Must Go On',
    artist: 'Queen',
    duration: 276,
    cover: 'img/cover/Queen.jpg',
    audioSrc: 'songs/TheShowMustGoOn.mp3'
  },
  {
    title: 'Living Next Door to Alice',
    artist: 'Smokie',
    duration: 205,
    cover: 'img/cover/Smokie.jpg',
    audioSrc: 'songs/Smokie.mp3'
  },
];

let currentTrackIndex = 0;

function loadTrack(trackIndex) {
  const track = tracks[trackIndex];
  audio.src = track.audioSrc;
  trackTitleSpan.innerText = track.title;
  trackArtistSpan.innerText = track.artist;
  durationSpan.innerText = formatTime(track.duration);
  document.querySelector('.cover img').src = track.cover;
}

function playPause() {
  if (audio.paused) {
    audio.play();
    playPauseButton.src = 'img/icon/pause.svg'; // Update to pause icon
  } else {
    audio.pause();
    playPauseButton.src = 'img/icon/play.svg'; // Update to play icon
  }
}

function playNextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
  playPause();
}

function playPrevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrackIndex);
  playPause();
}

function updateProgressBar() {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${progress}%`;
  currentTimeSpan.innerText = formatTime(audio.currentTime);
}


function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

let isRepeatEnabled = false;  // Флаг для повторения
let isMuted = false;  // Флаг для управления звуком

function toggleMute() {
  isMuted = !isMuted;
  // Включение/выключение звука в зависимости от флага isMuted
  if (isMuted) {
    audio.volume = 0; // Устанавливаем громкость на минимальное значение (выключаем звук)
    volumeButton.src = 'img/icon/volume_off.svg';
  } else {
    audio.volume = 1; // Устанавливаем громкость на максимальное значение (включаем звук)
    volumeButton.src = 'img/icon/volume.svg';
  }
}

function toggleRepeat() {
  isRepeatEnabled = !isRepeatEnabled;
  // Если повторение включено, добавьте атрибут loop к аудиоэлементу
  // Это позволит аудиофайлу проигрываться зацикленно
  if (isRepeatEnabled) {
    audio.setAttribute('loop', 'true');
    console.log('Repeat is enabled');
  } else {
    audio.removeAttribute('loop');
    console.log('Repeat is disabled');
  }
}

//слушатели событий
audio.addEventListener('timeupdate', updateProgressBar);
audio.addEventListener('ended', playNextTrack);
playPauseButton.addEventListener('click', playPause);
nextButton.addEventListener('click', playNextTrack);
prevButton.addEventListener('click', playPrevTrack);
repeatButton.addEventListener('click', toggleRepeat);
volumeButton.addEventListener('click', toggleMute);

loadTrack(currentTrackIndex);