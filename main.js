class WaveHandler {
    constructor() {
        this.waves = this.buildWaveDefaults();
        this.noteDuration = 200;
        this.masterVolume = 0.5;
    }


    buildWaveDefaults() {
        let waves = {
            sine: {
                settings: {
                    source: "wave",
                    options: {
                        type: "sine",
                        attack: 0.01,
                        release: 0.2,
                        volume: 0.2
                    }    
                },
                detune: 0,
                active: true
            },

            square: {
                settings: {
                    source: "wave",
                    options: {
                        type: "square",
                        attack: 0.01,
                        release: 0.2,
                        volume: 0.2
                    }    
                },
                detune: 0,
                active: false
            },

            triangle: {
                settings: {
                    source: "wave",
                    options: {
                        type: "triangle",
                        attack: 0.01,
                        release: 0.2,
                        volume: 0.2
                    }    
                },
                detune: 0,
                active: false
            },

            sawtooth: { 
                settings: {
                    source: "wave",
                    options: {
                        type: "sawtooth",
                        attack: 0.01,
                        release: 0.2,
                        volume: 0.2
                    }    
                },
                detune: 0,
                active: false
            }
        }

        return waves;
    }


    playSound(freq) {
        let tempGroup = new Pizzicato.Group([]);
        for (let wave in this.waves) {
            if (this.waves[wave].active) {
                this.waves[wave].settings.options.frequency = freq + this.waves[wave].detune;
                tempGroup.addSound(new Pizzicato.Sound(this.waves[wave].settings));
            }
        };

        tempGroup.volume = this.masterVolume;
        tempGroup.connect(analyser);
        tempGroup.play();
        
        setTimeout(() => {
            tempGroup.pause();
        }, this.noteDuration);
    }


    toggleWaveActive(wave, state) {
        this.waves[wave].active = state;
    }


    updateWaveVolume(wave, volume) {
        this.waves[wave].settings.options.volume = parseFloat(volume);
    }

    updateMasterVolume(volume) {
        this.masterVolume = parseFloat(volume);
    }

    setWaveAttack(wave, attack) {
        this.waves[wave].settings.options.attack = parseFloat(attack);
    }

    setWaveRelease(wave, release) {
        this.waves[wave].settings.options.release = parseFloat(release);
    }

    setWaveDetune(wave, detune) {
        this.waves[wave].detune = parseFloat(detune);
    }

    setNoteDuration(duration) {
        this.noteDuration = parseFloat(duration);
    }
}


const whiteNotes = [
    {name: "c4", frequency: 261.63, letterKey: "a", isPressed: false},
    {name: "d4", frequency: 293.66, letterKey: "s", isPressed: false},
    {name: "e4", frequency: 329.63, letterKey: "d", isPressed: false},
    {name: "f4", frequency: 349.23, letterKey: "f", isPressed: false},
    {name: "g4", frequency: 392.00, letterKey: "g", isPressed: false},
    {name: "a4", frequency: 440.00, letterKey: "h", isPressed: false},
    {name: "b4", frequency: 493.88, letterKey: "j", isPressed: false},
    {name: "c5", frequency: 523.25, letterKey: "k", isPressed: false},
    {name: "d5", frequency: 587.33, letterKey: "l", isPressed: false},
    {name: "e5", frequency: 659.25, letterKey: ";", isPressed: false}
]


const blackNotes = [
    {name: "cs4", frequency: 277.18, letterKey: "w", isPressed: false},
    {name: "ds4", frequency: 311.13, letterKey: "e", isPressed: false},
    {name: "fs4", frequency: 369.99, letterKey: "t", isPressed: false},
    {name: "gs4", frequency: 415.30, letterKey: "y", isPressed: false},
    {name: "as4", frequency: 466.16, letterKey: "u", isPressed: false},
    {name: "cs4", frequency: 554.37, letterKey: "o", isPressed: false},
    {name: "ds4", frequency: 622.25, letterKey: "p", isPressed: false}
]


const whiteKeys = document.querySelectorAll('.white-key');
const blackKeys = document.querySelectorAll('.black-key');
const waveHandler = new WaveHandler();
const toggleButtons = document.querySelectorAll('.toggle-active');
const waveVolumeSliders = document.querySelectorAll('.wave-volume');
const waveAttackSliders = document.querySelectorAll(".wave-attack");
const waveReleaseSliders = document.querySelectorAll(".wave-release");
const waveDetuneSliders = document.querySelectorAll(".wave-detune");
const toggleControlView = document.querySelector(".toggle-settings-view");
const controlView = document.querySelector(".wave-controls-parent");
const waveSettingsBoxes = document.querySelectorAll(".wave-controls");
const masterVolumeSlider = document.querySelector(".master-volume-slider");
const noteDurationSlider = document.querySelector(".note-duration-slider");
const mobileSettingsViewToggle = document.querySelectorAll(".mobile-settings-toggle");

const analyser = Pizzicato.context.createAnalyser();
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const canvas = document.getElementById("animations");
const canvasCtx = canvas.getContext("2d");


function makeSettingsExpandable() {
    toggleControlView.addEventListener('click', () => {
        if (controlView.classList.contains("settings-open")) {
            controlView.classList.remove("settings-open");
            toggleControlView.firstElementChild.style.display = "block";
            toggleControlView.lastElementChild.style.display = "none";
        } else {
            controlView.classList.add("settings-open");
            toggleControlView.firstElementChild.style.display = "none";
            toggleControlView.lastElementChild.style.display = "block";
        }
    })
}

function makeMobileSettingsExpandable() {
    mobileSettingsViewToggle.forEach((toggleButton) => {
        toggleButton.addEventListener('click', () => {
            if (toggleButton.parentElement.classList.contains("mobile-open")) {
                toggleButton.parentElement.classList.remove("mobile-open");
                toggleButton.parentElement.classList.add("mobile-closed")
            } else {
                toggleButton.parentElement.classList.add("mobile-open");
                toggleButton.parentElement.classList.remove("mobile-closed");
            }
        });
    });
}


function connectVolumeSliders() {
    waveVolumeSliders.forEach((slider) => {
        waveHandler.waves[slider.name].settings.options.volume = parseFloat(slider.value);

        slider.addEventListener('input', () => {
            waveHandler.updateWaveVolume(slider.name, slider.value);
        });
    });
}


function connectAttackSliders() {
    waveAttackSliders.forEach((slider) => {
        waveHandler.waves[slider.name].settings.options.attack = parseFloat(slider.value);

        slider.addEventListener('input', () => {
            waveHandler.setWaveAttack(slider.name, slider.value);
        });
    });
}


function connectReleaseSliders() {
    waveReleaseSliders.forEach((slider) => {
        waveHandler.waves[slider.name].settings.options.release = parseFloat(slider.value);

        slider.addEventListener('input', () => {
            waveHandler.setWaveRelease(slider.name, slider.value);
        });
    });
}


function connectDetuneSliders() {
    waveDetuneSliders.forEach((slider) => {
        waveHandler.waves[slider.name].detune = parseFloat(slider.value);

        slider.addEventListener('input', () => {
            waveHandler.setWaveDetune(slider.name, slider.value);
        });
    });
}


function connectMasterVolume() {
    waveHandler.masterVolume = parseFloat(masterVolumeSlider.value);

    masterVolumeSlider.addEventListener('input', function() {
        waveHandler.updateMasterVolume(this.value);
    });
}


function connectNoteDurationSlider() {
    waveHandler.noteDuration = parseFloat(noteDurationSlider.value);

    noteDurationSlider.addEventListener('input', function() {
        waveHandler.setNoteDuration(this.value);
    })
}


function connectToggleButtons() {
    toggleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.classList.contains('active')) {
                waveHandler.toggleWaveActive(button.name, false);
                button.classList.remove('active');
                button.innerHTML = "Off";
            } else {
                waveHandler.toggleWaveActive(button.name, true);
                button.classList.add('active');
                button.innerHTML = "On";
            }
        });
    });
}


function connectKeysToNotes(keyArray, noteArray) {
    keyArray.forEach((key, index) => {
        key.addEventListener("touchstart", event => {
            if (event.cancelable) {
                event.preventDefault();
            }
            waveHandler.playSound(noteArray[index].frequency);
            key.classList.add("active-key");
        });

        key.addEventListener("touchend", event => {
            key.classList.remove("active-key");
        })

        key.addEventListener('mousedown', () => {
            waveHandler.playSound(noteArray[index].frequency);
        });
    
        window.addEventListener("keydown", event => {
            if (event.key.toLowerCase() == noteArray[index].letterKey && !noteArray[index].isPressed) {
                waveHandler.playSound(noteArray[index].frequency);
                noteArray[index].isPressed = true;
                key.classList.add("active-key");
            }
        });
    
        window.addEventListener("keyup", event => {
            if (event.key.toLowerCase() == noteArray[index].letterKey) {
                noteArray[index].isPressed = false;
                key.classList.remove("active-key");
            }
        });
    });
}


function draw() {
    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = "rgb(255, 255, 255)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 5;
    canvasCtx.strokeStyle = "rgb(255, 69, 130)";

    canvasCtx.beginPath();

    let sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {

        let v = dataArray[i] / 128.0;
        let y = v * canvas.height / 2;

        if (i == 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

}

function load() {
    analyser.fftSize = 2048;
    analyser.getByteTimeDomainData(dataArray);

    connectVolumeSliders();
    connectMasterVolume();
    connectToggleButtons();
    connectAttackSliders();
    connectReleaseSliders();
    connectDetuneSliders();
    connectNoteDurationSlider();
    connectKeysToNotes(whiteKeys, whiteNotes);
    connectKeysToNotes(blackKeys, blackNotes);
    makeSettingsExpandable();
    makeMobileSettingsExpandable();
    draw();
}

window.addEventListener("load", load, false);
