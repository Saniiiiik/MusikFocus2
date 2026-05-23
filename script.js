// Данные треков
const tracks = [
    { id: 1, title: "Она танцует под шадэ", genre: "Pop", src: "https://rus.hitmoz.org/get/cuts/0b/b5/0bb5dd3081f1cd4b0bf544ab4a488a9d/81415262/Indiya_by_-_Ona_tancuet_pod_shadje_b128f0d141.mp3"},
    { id: 2, title: "Лесник", genre: "фолк-панк", src: "https://rus.hitmoz.org/get/cuts/8e/fa/8efaf32e8e754177c2d9d463117ce4bf/62571704/Korol_i_SHut_-_Lesnik_b128f0d192.mp3"},
    { id: 3, title: "Где прошла ты", genre: "хип-хоп", src: "https://rus.hitmoz.org/get/cuts/c4/40/c440c380429618861a6265351aa09dc5/75704918/Kravc_Gio_Pika_-_Gde_proshla_ty_b128f0d168.mp3"},
    { id: 4, title: "КАК MOMMY", genre: "Pop", src: "https://rus.hitmoz.org/get/cuts/26/bb/26bb81df19a82a0c513d136d08926ae4/75305573/INSTASAMKA_-_KAK_MOMMY_b128f0d130.mp3"},
    { id: 5, title: "Хищница", genre: "Pop", src: "https://rus.hitmoz.org/get/cuts/1d/9a/1d9ac738c31989d619e203e51e495d9e/76011058/Islam_Itlyashev_-_KHishhnica_b128f0d249.mp3"},
    { id: 6, title: "Black Samurai", genre: " танцевальная", src: "https://rus.hitmoz.org/get/cuts/21/90/21905d77ee306918caee2b87bc7f2c72/67944226/WYR_GEMI_-_Black_Samurai_b128f0d199.mp3"},
    { id: 7, title: "Птичка", genre: "Pop", src: "https://rus.hitmoz.org/get/cuts/42/b6/42b66c1959dd9cbde9d9d1ddf16f28e0/72965451/HammAli_Navai_-_Ptichka_b128f0d191.mp3"},
    { id: 8, title: "Пьяный туман", genre: "Pop", src: "https://rus.hitmoz.org/get/cuts/8d/82/8d825e0326ffce69423040c040f07534/62788609/GAYAZOV_BROTHER_-_Pyanyjj_tuman_b128f0d234.mp3"},
    { id: 9, title: "МАЛИНОВАЯ ЛАДА", genre: "Pop", src: "https://rus.hitmoz.org/get/cuts/a5/fd/a5fdd64413869435e28a2c2d7e31a8ab/73214200/GAYAZOV_BROTHER_-_MALINOVAYA_LADA_b128f0d213.mp3"}
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
