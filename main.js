
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


function connectKeysToNotes(keyArray, noteArray) {
    keyArray.forEach((key, index) => {
        key.addEventListener('mousedown', () => {
            playNewSound(noteArray[index].frequency);
        })
    
        window.addEventListener("keydown", event => {
            if (event.key == noteArray[index].letterKey && !noteArray[index].isPressed) {
                playNewSound(noteArray[index].frequency);
                noteArray[index].isPressed = true;
                key.classList.add("active-key");
            }
        });
    
        window.addEventListener("keyup", event => {
            if (event.key == noteArray[index].letterKey) {
                noteArray[index].isPressed = false;
                key.classList.remove("active-key");
            }
        })
    });
}


connectKeysToNotes(whiteKeys, whiteNotes);
connectKeysToNotes(blackKeys, blackNotes);



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