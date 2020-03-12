
const whiteNoteFrequencies = [
    {name: "c4", frequency: 261.63},
    {name: "d4", frequency: 293.66},
    {name: "e4", frequency: 329.63},
    {name: "f4", frequency: 349.23},
    {name: "g4", frequency: 392.00},
    {name: "a4", frequency: 440.00},
    {name: "b4", frequency: 493.88},
    {name: "c5", frequency: 523.25},
    {name: "d5", frequency: 587.33},
    {name: "e5", frequency: 659.25},
]

const blackNoteFrequencies = [
    {name: "cs4", frequency: 277.18},
    {name: "ds4", frequency: 311.13},
    {name: "fs4", frequency: 369.99},
    {name: "gs4", frequency: 415.30},
    {name: "as4", frequency: 466.16},
    {name: "cs4", frequency: 554.37},
    {name: "ds4", frequency: 622.25}
]

const whiteKeys = document.querySelectorAll('.white-key');
const blackKeys = document.querySelectorAll('.black-key');


whiteKeys.forEach((key, index) => {
    key.addEventListener('mousedown', () => {
        playNewSound(whiteNoteFrequencies[index].frequency);
    })
});


blackKeys.forEach((key, index) => {
    key.addEventListener('mousedown', () => {
        playNewSound(blackNoteFrequencies[index].frequency);
    })
});


function playNewSound(freq) {
    let tempSound = new Pizzicato.Sound({
        source: "wave",
        options: {
            type: "sine",
            attack: 0.1,
            release: 1,
            volume: 0.5,
            frequency: freq
        }
    });

    tempSound.play();
    setTimeout(() => {
        tempSound.pause();
    }, 200);
}