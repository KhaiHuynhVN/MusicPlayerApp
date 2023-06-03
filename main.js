const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let cd = $('.cd');
let get_cdWidth = cd.offsetWidth;

document.addEventListener('scroll', function() {
    let scroll_window = window.scrollY || document.documentElement.scrollTop;
    let new_cdWidth = get_cdWidth - scroll_window;

    if (new_cdWidth < 0) {
        cd.style.width = '0px';
        cd.style.opacity = '0';
    } else {
        cd.style.width = new_cdWidth + 'px';
        cd.style.opacity = new_cdWidth / get_cdWidth;
    };
});

// audio
let audio = $('#audio');

// Btn random
let btnRandom = $('.btn-random');

// Btn loop auido
let btnLoopAudio = $('.btn-repeat');

// Variable of function randomSong
let j;
let getI;
let handleRandom;
// -------------------------------

let h2 = $('h2');
let song = $$('.song');

let Iconpause;
let Iconplay;

let musicList = [
    './music/videoplayback.m4a',
    './music/videoplayback2.m4a',
    './music/videoplayback3.m4a',
    './music/videoplayback4.m4a',
    './music/videoplayback5.m4a',
    './music/videoplayback6.m4a',
    './music/videoplayback7.m4a',
    './music/videoplayback8.m4a',
];

// get id of music
let getID_music;

// song option
let option = $$('.song .option');
for (let i = 0; i < option.length; i++) {
    option[i].addEventListener('click', function (e) {
        e.stopPropagation();
    });
};

// CD thump rotate
let cdThump = $('.cd-thumb');
let cdThumpRotate;

// slider thump (tua nhạc)
let timeProgress = $('#progress');

// Next and Previous buttons
let control_btn_prev = $('.control .btn:nth-child(2)');
let control_btn_next = $('.control .btn:nth-child(4)');

// STORAGE
let USER_STORAGE = 'DemonVN';
let config = JSON.parse(localStorage.getItem(USER_STORAGE)) || [];

// ------------------------------------------------------------------------------
// start
function start() {
    songEvent();
    audioEvent();
    Iconpause_btn();
    Iconplay_btn();
    autoPlay();
    control_Btn();
    timeUpdate();
    nextSong();
    cdThumpRotateEvent();
    scrollSongs();
    loopAudio();
    randomSong();
    loadConfig(); // STORAGE
};
start();

// function song
function songEvent() {
    for (let i = 0; i < song.length; i++) {
        song[i].setAttribute('data-id', i)
    
        song[i].addEventListener('click', function() {
            getID_music = song[i].getAttribute('data-id')

            if ($('.song.active')) {
                $('.song.active').classList.remove('active')
            }
            song[i].classList.add('active')
    
            let getNameMusic = song[i].querySelector('.body h3').innerText
            h2.innerText = getNameMusic
    
            audio.setAttribute('src', `${musicList[getID_music]}`)
            audio.play()

            if ($('.btn-random.active')) {
                btnRandom.click()
            }
        })
    }
}

// function rotate cdThump
function cdThumpRotateEvent() {
    cdThumpRotate = cdThump.animate(
        [
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(360deg)' }
        ],
        { duration: 10000, easing: 'linear', iterations: 'Infinity' }
    );
    cdThumpRotate.pause();
};

// function audio
function audioEvent() {
    //Btn player
    let player = $('.player');

    audio.addEventListener('play', function() {
        player.classList.add('playing');
        cdThumpRotate.play();
    });

    audio.addEventListener('pause', function() {
        player.classList.remove('playing');
        cdThumpRotate.pause();
    });
};

// function Iconpause
function Iconpause_btn() {
    Iconpause = $('.icon-pause');
    
    Iconpause.addEventListener('click', function() {
        audio.pause();
    });
};

// function Iconplay
function Iconplay_btn() {
    Iconplay = $('.icon-play');
    
    Iconplay.addEventListener('click', function() {
        setTimeout(function() {
            audio.play(); 
        }, 1);
    });
};

// auto play 
function autoPlay() {    
    Iconplay.addEventListener('click', function() {
        if (h2.innerText == 'Chưa chọn bài hát') {
            song[0].classList.add('active')
            h2.innerText = song[0].querySelector('.body h3').innerText;
            getID_music = 0;
            audio.setAttribute('src', musicList[0]);
            audio.play();
        };
    });
};

// control btn
function control_Btn() {
    let control_btn = $$('.control .btn');

    for (let i = 0; i < control_btn.length; i++) {
        control_btn[i].addEventListener('click', function() {
            control_btn[i].classList.toggle('active');
        });
    };

    Next_n_Previous();
};

// next and previous buttons
function Next_n_Previous() {
    // previous
    control_btn_prev.addEventListener('click', controlButtonPrevEvent);
    
    // next
    control_btn_next.addEventListener('click', controlButtonNextEvent);
};

function controlButtonNextEvent() {
    timeProgress.value = 0
    cdThumpRotateEvent();

    setTimeout(function () {
        $('.control .btn:nth-child(4).active').classList.remove('active');
    }, 100);

    getID_music++;
    if (getID_music > song.length - 1) {
        getID_music = 0;
    };
    // not choose song when click next button
    clickNextButton();
}

function controlButtonPrevEvent() {
    timeProgress.value = 0
    cdThumpRotateEvent();

    setTimeout(function () {
        $('.control .btn:nth-child(2).active').classList.remove('active');
    }, 100);

    getID_music--;
    if (getID_music < 0) {
        getID_music = song.length - 1;
    };
    // not choose song when click previous btn
    clickPreviousButton();
}
// function not choose song when click previous btn
function clickPreviousButton() {
    if (h2.innerText == 'Chưa chọn bài hát') {
        getID_music = song.length - 1;
        handleNextAndPreviousButton();
    } 
    else
    if (!$('.player.playing')) {
        handleNextAndPreviousButton();
    }
    else
    if (getID_music || getID_music == 0) {
        handleNextAndPreviousButton();
        audio.play();
    };
};

// function not choose song when click next button
function clickNextButton() {
    if (h2.innerText == 'Chưa chọn bài hát') {
        getID_music = 0;
        handleNextAndPreviousButton();
    } 
    else
    if (!$('.player.playing')) {
        handleNextAndPreviousButton();
    }
    else
    if (getID_music || getID_music == 0) {
        handleNextAndPreviousButton();
        audio.play();
    };
};

// function handle of next and previous buttons
function handleNextAndPreviousButton() {
    let getNameMusic = song[getID_music].querySelector('.body h3').innerText;
    h2.innerText = getNameMusic;

    audio.setAttribute('src', musicList[getID_music]);

    if ($('.song.active')) {
        $('.song.active').classList.remove('active');
    };
    song[getID_music].classList.add('active');
};

// function Time Update
function timeUpdate() {
    let perCentCurrentTime;

    function mouseDown() {
        audio.removeEventListener('timeupdate', timeUpdate_Event);
    };  

    function mouseUp() {
        audio.addEventListener('timeupdate', timeUpdate_Event);
        audio.currentTime = timeProgress.value * audio.duration / 100;
        // audio.currentTime = timeProgress.value
    };  

    function timeUpdate_Event() {
        if (audio.duration) {
            perCentCurrentTime = audio.currentTime / audio.duration * 100;
            timeProgress.value = perCentCurrentTime;
            // timeProgress.value = audio.currentTime
            // timeProgress.max = audio.duration
            timeProgress.addEventListener('mousedown', mouseDown);
            timeProgress.addEventListener('mouseup', mouseUp);
            timeProgress.addEventListener('touchstart', mouseDown);
            timeProgress.addEventListener('touchend', mouseUp);
        };
    };

    audio.addEventListener('timeupdate', timeUpdate_Event);
};

// function next song
function nextSong() {
    audio.addEventListener('ended', handleNextSong);
};

function handleNextSong() {
    getID_music++;
    if (getID_music > song.length - 1) {
        getID_music = 0;
    };

    let getNameMusic = song[getID_music].querySelector('.body h3').innerText;
    h2.innerText = getNameMusic;

    $('.song.active').classList.remove('active');
    song[getID_music].classList.add('active')

    audio.src = musicList[getID_music];
    audio.play();
}

// function random Song
function randomSong() {    
    btnRandom.addEventListener('click', function () {
        if ($('.btn-random.active')) {
            setConfig('Random', true, 0)
            setConfig('Loop', false, 1)

            handleRandom = []
            j = 0;
            audio.removeEventListener('ended', handleNextSong)
            control_btn_next.removeEventListener('click', controlButtonNextEvent)
            control_btn_prev.removeEventListener('click', controlButtonPrevEvent)

            if ($('.btn-repeat.active')) {
                $('.btn-repeat.active').classList.remove('active')
                audio.loop = false
            }
    
            if (audio.getAttribute('src') != undefined) {
                musicList.forEach(function (music, index) {
                    if (music == audio.getAttribute('src')) {
                        console.log(song[index])
                        getI = index
                    }
                })
            } else {
                getI = NaN
            }
    
            ranDom()        
    
            getID_music = handleRandom[j]
            
            if ($('.player.playing')) {
                handleNextAndPreviousButton()
                audio.play()
            } else {
                handleNextAndPreviousButton()
            }
        
            audio.addEventListener('ended', randomSongsWhenEnded)

            control_btn_next.addEventListener('click', btnNextRandomSong)
            control_btn_prev.addEventListener('click', btnPrevRandomSong)
        } else {
            setConfig('Random', false, 0)
            // add
            audio.addEventListener('ended', handleNextSong)
            control_btn_next.addEventListener('click', controlButtonNextEvent)
            control_btn_prev.addEventListener('click', controlButtonPrevEvent)
            // remove
            audio.removeEventListener('ended', randomSongsWhenEnded)
            control_btn_next.removeEventListener('click', btnNextRandomSong)
            control_btn_prev.removeEventListener('click', btnPrevRandomSong)
        }
    })
}

function ranDom() {
    for (let i = 0; i < song.length; i++) {
        handleRandom.push(i);
    };

    handleRandom.sort(function () {
        return Math.random() - 0.5;
    });
};

function randomSongsWhenEnded() {
    j++;

    if (getI == handleRandom[j]) {
        console.log('Bài hát này đã phát rồi nên chuyển sang bài kế tiếp');
        j++;
    };

    if (j > song.length - 1) {
        j = 0;
        getI = NaN;
    };

    getID_music = handleRandom[j]

    handleNextAndPreviousButton()
    audio.play()

    console.log(j + ':' + handleRandom[j])
};

function btnNextRandomSong() {
    timeProgress.value = 0;
    setTimeout(function () {
        $('.control .btn:nth-child(4).active').classList.remove('active')
    }, 10)

    if ($('.player.playing')) {
        randomSongsWhenEnded()
    } else {
        j++;
        if (getI == handleRandom[j]) {
            console.log('Bài hát này đã phát rồi nên chuyển sang bài kế tiếp');
            j++;
        };
        if (j > song.length - 1) {
            j = 0;
            getI = NaN;
        };
        getID_music = handleRandom[j]
        handleNextAndPreviousButton()
    }
}

function btnPrevRandomSong() {
    timeProgress.value = 0;
    setTimeout(function () {
        $('.control .btn:nth-child(2).active').classList.remove('active')
    }, 10)

    if ($('.player.playing')) {
        j--;
        if (getI == handleRandom[j]) {
            console.log('Bài hát này đã phát rồi nên chuyển sang bài kế tiếp');
            j--;
        };
        if (j < 0) {
            j = song.length - 1;
            getI = NaN;
        };
        getID_music = handleRandom[j]
        handleNextAndPreviousButton()
        audio.play()
        console.log(j + ':' + handleRandom[j])
    } else {
        j--;
        if (getI == handleRandom[j]) {
            console.log('Bài hát này đã phát rồi nên chuyển sang bài kế tiếp');
            j--;
        };
        if (j < 0) {
            j = song.length - 1;
            getI = NaN;
        };
        getID_music = handleRandom[j]
        handleNextAndPreviousButton()
    }
}
// scroll when playing song
function scrollSongs() {
    audio.addEventListener('play', function() {
        if ($('.song.active')) {
            // document.documentElement.scrollTop = $('.song.active').offsetTop - 200
            $('.song.active').scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    })   
}

// audio playing loop
function loopAudio() {
    btnLoopAudio.addEventListener('click', function() {
        if ($('.btn-repeat.active')) {
            setConfig('Loop', true, 1)
            setConfig('Random', false, 0)

            if ($('.btn-random.active')) {
                $('.btn-random.active').classList.remove('active')
                audio.removeEventListener('ended', randomSongsWhenEnded)
            }
            audio.removeEventListener('ended', handleNextSong)
            audio.loop = true
        } else {
            setConfig('Loop', false, 1)

            audio.addEventListener('ended', handleNextSong)
            audio.loop = false
        }
    })
}

// function STORAGE
function setConfig(key, value, i) {
    config[i] = [
        {
            key: key,
            value: value
        }
    ]
    localStorage.setItem(USER_STORAGE, JSON.stringify(config))
}

// function loadConfig
function loadConfig() {
    // console.log(config)
    if (config) {
        if (config[1][0].key === 'Loop' && config[1][0].value === true) {
            btnLoopAudio.click()
        }
        if (config[0][0].key === 'Random' && config[0][0].value === true) {
            btnRandom.click()
        }
    }
}
