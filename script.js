// Данные треков
const tracks = [
    { id: 1, title: "Me gustas tu", genre: "electronic", src: "Me gustas tu.mp3" },
    { id: 2, title: "Dzanum", genre: "Pop", src: "Dzanum.mp3" },
    { id: 3, title: "Не вспоминай", genre: "Pop", src: "Не вспоминай.mp3" },
];

// Элементы DOM
const audioPlayer = document.getElementById('audio-player');
const trackList = document.getElementById('track-list');
const genreButtons = document.querySelectorAll('.genre-btn');
const visualizer = document.getElementById('visualizer');
const themeToggle = document.getElementById('theme-toggle');
const playAllBtn = document.getElementById('play-all');
const Btn1 = document.getElementById('genres');
const Btn2 = document.getElementById('playlist');
const HeroAudio = document.getElementById('player');


// Переменные состояния
let currentTrackIndex = -1;
let isPlaying = false;

// Инициализация приложения
function init() {
    renderPlaylist('all');
    setupEventListeners();
    setupVisualizer();
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Переключение жанров
    genreButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            genreButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const genre = btn.getAttribute('data-genre');
            renderPlaylist(genre);
        });
    });

    // Воспроизведение всех треков
    playAllBtn.addEventListener('click', () => {
        if (tracks.length > 0) {
            playTrack(tracks[0]);
        }
    });

    // Переключение темы
    themeToggle.addEventListener('click', toggleTheme);

    // События аудиоплеера
    audioPlayer.addEventListener('ended', playNextTrack);
    audioPlayer.addEventListener('play', () => isPlaying = true);
    audioPlayer.addEventListener('pause', () => isPlaying = false);
}

// Отрисовка плейлиста
function renderPlaylist(genre = 'all') {
    trackList.innerHTML = '';
    const filteredTracks = genre === 'all' ? tracks : tracks.filter(t => t.genre === genre);

    filteredTracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.className = 'track';
        li.textContent = track.title;
        li.dataset.index = index;
        li.addEventListener('click', () => playTrack(track, index));
        trackList.appendChild(li);
    });
}

// Воспроизведение трека
function playTrack(track, index = null) {
    currentTrackIndex = index !== null ? index : tracks.indexOf(track);
    audioPlayer.src = track.src;
    audioPlayer.play();
    updateTrackHighlight();
    startVisualizer();
}

// Переход к следующему треку
function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    if (currentTrackIndex < tracks.length) {
        playTrack(tracks[currentTrackIndex], currentTrackIndex);
    }
}

// Подсветка текущего трека
function updateTrackHighlight() {
    document.querySelectorAll('.track').forEach((trackEl, index) => {
        if (index === currentTrackIndex) {
            trackEl.style.backgroundColor = '#2D3748';
            trackEl.style.color = '#48BB78';
        } else {
            trackEl.style.backgroundColor = '';
            trackEl.style.color = '';
        }
    });
}

// Визуализатор звука (упрощённая версия)
function setupVisualizer() {
    const canvas = document.createElement('canvas');
    canvas.width = visualizer.clientWidth;
    canvas.height = visualizer.clientHeight;
    visualizer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const barWidth = 3;
    let barHeight;
    let x = 0;

    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < canvas.width / barWidth; i++) {
            barHeight = Math.floor(Math.random() * canvas.height);
            ctx.fillStyle = `rgb(${barHeight}, ${barHeight * 0.5}, ${barHeight * 0.2})`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        canvas.width = visualizer.clientWidth;
        canvas.height = visualizer.clientHeight;
    });

    return animate;
}

let startVisualizer = setupVisualizer();

// Остановка визуализатора
function stopVisualizer() {
    visualizer.innerHTML = '';
}




function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.checked = (theme === 'light');
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

themeToggle.addEventListener('change', toggleTheme);

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('dark');
    }
});


document.addEventListener('DOMContentLoaded', function() {
  const phoneInput = document.getElementById('phone-number');
  const submitButton = document.getElementById('submit-phone');

  submitButton.addEventListener('click', function() {
    const phoneValue = phoneInput.value.trim();

    if (phoneValue) {
      console.log('Введённый номер телефона:', phoneValue);
      alert('Номер успешно отправлен!');
      phoneInput.value = '';
    } else {
      alert('Пожалуйста, введите номер телефона.');
    }
  });

  phoneInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      submitButton.click();
    }
  });
});

init();
