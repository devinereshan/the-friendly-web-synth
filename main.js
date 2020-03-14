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
                active: false
            }
        }

        return waves;
    }


    playSound(freq) {
        let tempGroup = new Pizzicato.Group([]);
        for (let wave in this.waves) {
            if (this.waves[wave].active) {
                this.waves[wave].settings.options.frequency = freq;
                tempGroup.addSound(new Pizzicato.Sound(this.waves[wave].settings));
            }
        };

        tempGroup.volume = this.masterVolume;
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
const toggleControlView = document.querySelector(".toggle-settings-view");
const waveSettingsBoxes = document.querySelectorAll(".wave-controls");
const masterVolumeSlider = document.querySelector(".master-volume-slider");

function makeSettingsExpandable() {
    toggleControlView.addEventListener('click', () => {
        console.log("clicked");
        waveSettingsBoxes.forEach((wave) => {
            if (wave.classList.contains("wave-open")) {
                wave.classList.remove("wave-open");
            } else {
                wave.classList.add("wave-open")
            }
        })
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

function connectMasterVolume() {
    waveHandler.masterVolume = parseFloat(masterVolumeSlider.value);

    masterVolumeSlider.addEventListener('input', function() {
        waveHandler.updateMasterVolume(this.value);
    });
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
        key.addEventListener('mousedown', () => {
            waveHandler.playSound(noteArray[index].frequency);
        });
    
        window.addEventListener("keydown", event => {
            if (event.key == noteArray[index].letterKey && !noteArray[index].isPressed) {
                waveHandler.playSound(noteArray[index].frequency);
                noteArray[index].isPressed = true;
                key.classList.add("active-key");
            }
        });
    
        window.addEventListener("keyup", event => {
            if (event.key == noteArray[index].letterKey) {
                noteArray[index].isPressed = false;
                key.classList.remove("active-key");
            }
        });
    });
}




connectVolumeSliders();
connectMasterVolume();
connectToggleButtons();
connectKeysToNotes(whiteKeys, whiteNotes);
connectKeysToNotes(blackKeys, blackNotes);
makeSettingsExpandable();

