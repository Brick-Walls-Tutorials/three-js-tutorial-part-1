import oscillators from 'web-audio-oscillators'
import * as THREE from 'three'
import{ UnrealBloomPass }from "three/examples/jsm/postprocessing//UnrealBloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js'
import {CopyShader} from 'three/examples/jsm/shaders/CopyShader.js'
import {FXAAShader} from 'three/examples/jsm/shaders/FXAAShader.js'



// === THREE.JS CODE START ===
let hemisphereLight,
  shadowLight,
  ambientLight,
  scene,
  camera,
  renderer,
  canvas,
  animationId,
  animationCancel = true,
  cubeNeedScalingUp = false,
  cubeNeedScalingDown = false,
  needNewNote = true,
  nextNoteNeeded = null,
  lastnotePlayed = null,
  nextNoteDisplay = document.getElementById("keyToPlay"),
  nextNote,
  noteTables = document.getElementsByClassName("keyChange"),
  reverseAnimation = false,
  isPaused = true,
  speedScaling = false,
  composer,
  renderPass,
  effectFXAA,
  bloomPass,
  // objects
  geometry,
  material,
  cube,
  HEIGHT,
  WIDTH;

const FullKeyTable = {
  48: "C1",
  49: "C#1",
  50: "D1",
  51: "D#1",
  52: "E1",
  53: "F1",
  54: "F#1",
  55: "G1",
  56: "G#1",
  57: "A1",
  58: "A#1",
  59: "B1",
  60: "C2",
  61: "C#2",
  62: "D2",
  63: "D#2",
  64: "E2",
  65: "F2",
  66: "F#2",
  67: "G2",
  68: "G#2",
  69: "A2",
  70: "A#2",
  71: "B2",
  72: "C3",
};

const CMajor = {
  48: "C1",
  50: "D1",
  52: "E1",
  53: "F1",
  55: "G1",
  57: "A1",
  59: "B1",
  60: "C2",
  62: "D2",
  64: "E2",
  65: "F2",
  67: "G2",
  69: "A2",
  71: "B2",
  72: "C3",
};

const GMajor = {
  48: "C1",
  50: "D1",
  52: "E1",
  54: "F#1",
  55: "G1",
  57: "A1",
  59: "B1",
  60: "C2",
  62: "D2",
  64: "E2",
  66: "F#2",
  67: "G2",
  69: "A2",
  71: "B2",
  72: "C3",
};

const DMajor = {
  49: "C#1",
  50: "D1",
  52: "E1",
  54: "F#1",
  55: "G1",
  57: "A1",
  59: "B1",
  61: "C#2",
  62: "D2",
  64: "E2",
  66: "F#2",
  67: "G2",
  69: "A2",
  71: "B2",
};

const AMajor = {
  49: "C#1",
  50: "D1",
  52: "E1",
  54: "F#1",
  56: "G#1",
  57: "A1",
  59: "B1",
  61: "C#2",
  62: "D2",
  64: "E2",
  66: "F#2",
  68: "G#1",
  69: "A2",
  71: "B2",
};

const EMajor = {
  49: "C#1",
  51: "D#1",
  52: "E1",
  54: "F#1",
  56: "G#1",
  57: "A1",
  59: "B1",
  61: "C#2",
  63: "D#2",
  64: "E2",
  66: "F#2",
  68: "G#1",
  69: "A2",
  71: "B2",
};

const FMajor = {
  48: "C1",
  50: "D1",
  52: "E1",
  53: "F1",
  55: "G1",
  57: "A1",
  58: "Bb1",
  60: "C2",
  62: "D2",
  64: "E2",
  65: "F2",
  67: "G2",
  69: "A2",
  70: "Bb2",
  72: "C3",
};

const BFlatMajor = {
  48: "C1",
  50: "D1",
  51: "Eb1",
  53: "F1",
  55: "G1",
  57: "A1",
  58: "Bb1",
  60: "C2",
  62: "D2",
  63: "Eb2",
  65: "F2",
  67: "G2",
  69: "A2",
  70: "Bb2",
  72: "C3",
};

const EFlatMajor = {
  48: "C1",
  50: "D1",
  51: "Eb1",
  53: "F1",
  55: "G1",
  56: "Ab1",
  58: "Bb1",
  60: "C2",
  62: "D2",
  63: "Eb2",
  65: "F2",
  67: "G2",
  68: "Ab1",
  70: "Bb2",
  72: "C3",
};

const AFlatMajor = {
  48: "C1",
  49: "Db1",
  51: "Eb1",
  53: "F1",
  55: "G1",
  56: "Ab1",
  58: "Bb1",
  60: "C2",
  61: "Db2",
  63: "Eb2",
  65: "F2",
  67: "G2",
  68: "Ab1",
  70: "Bb2",
  72: "C3",
};

const BMajor = {
  49: "C#1",
  51: "D#1",
  52: "E1",
  54: "F#1",
  56: "G#1",
  58: "A#1",
  59: "B1",
  61: "C#2",
  63: "D#2",
  64: "E2",
  66: "F#2",
  68: "G#1",
  70: "A#2",
  71: "B2",
};

const CFlatMajor = {
  49: "Db1",
  51: "Eb1",
  52: "Fb1",
  54: "Gb1",
  56: "Ab1",
  58: "Bb1",
  59: "Cb1",
  61: "Db2",
  63: "Eb2",
  64: "Fb2",
  66: "Gb2",
  68: "Ab1",
  70: "Bb2",
  71: "Cb2",
};

const FSharpMajor = {
  49: "C#1",
  51: "D#1",
  53: "E#1",
  54: "F#1",
  56: "G#1",
  58: "A#1",
  59: "B1",
  61: "C#2",
  63: "D#2",
  65: "E#2",
  66: "F#2",
  68: "G#1",
  70: "A#2",
  71: "B2",
};

const GFlatMajor = {
  49: "Db1",
  51: "Eb1",
  53: "F1",
  54: "Gb1",
  56: "Ab1",
  58: "Bb1",
  59: "Cb1",
  61: "Db2",
  63: "Eb2",
  65: "F2",
  66: "Gb2",
  68: "Ab1",
  70: "Bb2",
  71: "Cb2",
};

const CSharpMajor = {
  48: "B#1",
  49: "C#1",
  51: "D#1",
  53: "E#1",
  54: "F#1",
  56: "G#1",
  58: "A#1",
  60: "B#2",
  61: "C#2",
  63: "D#2",
  65: "E#2",
  66: "F#2",
  68: "G#1",
  70: "A#2",
  72: "B#3",
};

const DFlatMajor = {
  48: "C1",
  49: "Db1",
  51: "Eb1",
  53: "F1",
  54: "Gb1",
  56: "Ab1",
  58: "Bb1",
  60: "C2",
  61: "Db2",
  63: "Eb2",
  65: "F2",
  66: "Gb2",
  68: "Ab1",
  70: "Bb2",
  72: "C3",
};

let currentNoteTable = FullKeyTable;

const changeNoteTable = function (event) {
  const tableString = event.target.innerHTML;
  currentNoteTable = eval(tableString);
  nextNoteDisplay.removeChild(nextNote);
  updateNoteDisplay(currentNoteTable);
};

for (let button of noteTables) {
  button.addEventListener("click", (e) => changeNoteTable(e));
}

const colorTable = {
  purple: 0x541388,
  pink: 0xd90368,
  white: 0xffffff,
  yellow: 0xffd400,
  green: 0x00ff00,
  blue: 0x357ded,
  red: 0xe40000,
};

const colorNames = Object.keys(colorTable);

const getRandomColor = function () {
  const colorIdx = Math.floor(Math.random() * colorNames.length);
  const randomColorName = colorNames[colorIdx];
  const randomColorHex = colorTable[randomColorName];
  return randomColorHex;
};

const createScene = function () {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  canvas = document.getElementById("canvas");
  canvas.appendChild(renderer.domElement);
  window.addEventListener("resize", handleWindowResize, false);
};

function handleWindowResize() {
  // Update height and width of renderer and camera
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  renderer.setSize(WIDTH, HEIGHT);

  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

const createLights = function () {
  // Hemisphere light with color gradient, first param = sky, second param = ground, third param = intensity
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

  // Directional Light shines from specific direction and acts like the sun (all rays are parallel)
  shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

  // an ambient light modifies the global color of a scene and makes the shadows softer
  ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
  scene.add(ambientLight);

  // Set direction of light
  shadowLight.position.set(150, 350, 350);

  // Allow shadow casting
  shadowLight.castShadow = true;

  // Define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  // Define the resolution of the shadow; higher is better but more costly
  shadowLight.shadow.mapSize.width = 1024;
  shadowLight.shadow.mapSize.height = 1024;

  // Add light to the scene
  scene.add(hemisphereLight);
  scene.add(shadowLight);
};

const createObject = function () {
  const color = getRandomColor();
  geometry = new THREE.BoxGeometry(1, 1, 1);
  material = new THREE.MeshLambertMaterial({ color: colorTable.white });
  cube = new THREE.Mesh(geometry, material);
  cube.position.y += 1.5;
  scene.add(cube);
  camera.position.z = 5;
};

const animate = function () {
  if (!isPaused) {
    animationId = requestAnimationFrame(animate);

    composer.render(scene, camera);

    if (!reverseAnimation) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    } else {
      cube.rotation.x -= 0.01;
      cube.rotation.y -= 0.01;
    }
    if (cubeNeedScalingUp) {
      if (cube.scale.x < 2.2) {
        scaleUpCube();
      } else {
        cubeNeedScalingUp = false;
      }
    }
    if (cubeNeedScalingDown && !speedScaling) {
      if (cube.scale.x > 0) {
        scaleDownCube();
      } else {
        cubeNeedScalingDown = false;
      }
    } else if (cubeNeedScalingDown && speedScaling) {
      if (cube.scale.x > 0) {
        speedScaleDown();
      } else {
        cubeNeedScalingDown = false;
        speedScaling = false;
      }
    }
    if (!nextNoteNeeded) {
      updateNoteDisplay(currentNoteTable);
    }
    if (animationCancel) {
      cancelAnimationFrame(animationId);
    }
  }
};

const toggleAnimation = function () {
  animationCancel = !animationCancel;

  if (!animationCancel) {
    animate();
  }
};

const stopAnimation = function () {
  animationCancel = true;
};

const startAnimation = function () {
  animationCancel = false;

  animate();
};

const setCubeColor = function () {
  let color = getRandomColor();

  cube.material.color.setHex(color);
};

const setCubeRed = function () {
  cube.material.color.setHex(colorTable.red);
};

const setCubeGreen = function () {
  cube.material.color.setHex(colorTable.green);
};

const resetCubeColor = function () {
  cube.material.color.setHex(colorTable.white);
};

const scaleUpCube = function () {
  cube.scale.x += 0.003;
  cube.scale.y += 0.003;
  cube.scale.z += 0.003;
};

const scaleDownCube = function () {
  cube.scale.x -= 0.00075;
  cube.scale.y -= 0.00075;
  cube.scale.z -= 0.00075;
};

const speedScaleDown = function () {
  cube.scale.x -= 0.005;
  cube.scale.y -= 0.005;
  cube.scale.z -= 0.005;
};

const getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let random = Math.floor(Math.random() * (max - min + 1)) + min;
  return random;
};

const getNewNoteToPlay = function (keyTable) {
  let possibleNotes = Object.keys(currentNoteTable);
  let noteIdx = getRandomInt(0, possibleNotes.length - 1);
  let noteNumber = possibleNotes[noteIdx];
  let noteName = keyTable[noteNumber];
  return [noteNumber, noteName];
};

const updateNoteDisplay = function (keyTable) {
  nextNoteNeeded = getNewNoteToPlay(keyTable);

  nextNote = document.createElement("h1");
  nextNote.setAttribute("id", "nextNote");
  nextNote.innerHTML = nextNoteNeeded[1];

  nextNoteDisplay.appendChild(nextNote);
};

const checkNote = function (note) {
  let target = nextNoteNeeded[0];
  console.log(nextNoteNeeded);
  if (note == target) {
    canvas.className = "canvas-right"
    rightNoteSound();
    console.log("CORRECT NOTE!");
    if (cubeNeedScalingUp === false) cubeNeedScalingUp = true;
    if (cubeNeedScalingDown === true) cubeNeedScalingDown = false;
    setCubeGreen();
    if (animationCancel) {
      startAnimation();
    }
    if (reverseAnimation) reverseAnimation = false;
  } else {
    canvas.className = "canvas-wrong"
    if (!speedScaling) speedScaling = true;
    wrongNoteSound();
    console.log("INCORRECT NOTE", note, target);
    if (cubeNeedScalingDown === false) cubeNeedScalingDown = true;
    if (cubeNeedScalingUp === true) cubeNeedScalingUp = false;
    setCubeRed();
    if (!reverseAnimation) reverseAnimation = true;
  }
  nextNoteDisplay.removeChild(nextNote);
  nextNoteNeeded = null;
};

const postProcess = function () {
  composer = new EffectComposer(renderer);
  renderPass = new RenderPass(scene, camera);
  effectFXAA = new ShaderPass(FXAAShader);
  effectFXAA.uniforms.resolution.value.set(
    1 / window.innerWidth,
    1 / window.innerHeight
  );

  bloomPass = new UnrealBloomPass();
  bloomPass.threshold = 0;
  bloomPass.strength = 1;
  bloomPass.radius = 10;
  // bloomPass.renderToScreen = true;

  composer.addPass(renderPass)
  composer.addPass(effectFXAA)
  composer.addPass(bloomPass)

  renderPass.renderToScreen = true;
};

const init = function () {
  createLights();
  createObject();
  postProcess();
  animate();
};

createScene();
init();
// === THREE.JS EXAMPLE CODE END ===

var context = null; // the Web Audio "context" object
var midiAccess = null; // the MIDIAccess object.
var oscillator = null; // the single oscillator
var envelope = null; // the envelope for the single oscillator
var attack = 0.05; // attack speed
var release = 0.05; // release speed
var portamento = 0.05; // portamento/glide speed
var activeNotes = []; // the stack of actively-pressed keys

window.addEventListener("load", function () {
  // patch up prefixes
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  context = new AudioContext();
  if (navigator.requestMIDIAccess)
    navigator.requestMIDIAccess().then(onMIDIInit, onMIDIReject);
  else
    alert(
      "No MIDI support present in your browser.  You're gonna have a bad time."
    );

  // set up the basic oscillator chain, muted to begin with.
  oscillator = context.createOscillator();
  oscillator.frequency.setValueAtTime(110, 0);
  envelope = context.createGain();
  oscillator.connect(envelope);
  envelope.connect(context.destination);
  envelope.gain.value = 0.0; // Mute the sound
  oscillator.start(0); // Go ahead and start up the oscillator
});

function rightNoteSound() {
  oscillator.type = "sine";
}

function wrongNoteSound() {
  oscillator.type = "sawtooth";
}

function onMIDIInit(midi) {
  midiAccess = midi;
  console.log(midiAccess);
  // Hook the message handler for all MIDI inputs
  for (let input of midiAccess.inputs.values()) {
    input.onmidimessage = MIDIMessageEventHandler;
  }
}

function onMIDIReject(err) {
  if (err)
    console.log(
      "The MIDI system failed to start.  You're gonna have a bad time."
    );
}

function MIDIMessageEventHandler(event) {
  // Mask off the lower nibble (MIDI channel, which we don't care about)
  switch (event.data[0] & 0xf0) {
    case 0x90:
      if (event.data[2] != 0) {
        // if velocity != 0, this is a note-on message
        noteOn(event.data[1]);
        return;
      }
    // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, ya'll.
    case 0x80:
      noteOff(event.data[1]);
  }
}

function frequencyFromNoteNumber(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function noteOn(noteNumber) {
  // toggleAnimation();
  // setCubeColor();
  if (animationCancel) startAnimation();
  checkNote(noteNumber);
  activeNotes.push(noteNumber);
  oscillator.frequency.cancelScheduledValues(0);
  oscillator.frequency.setTargetAtTime(
    frequencyFromNoteNumber(noteNumber),
    0,
    portamento
  );
  envelope.gain.cancelScheduledValues(0);
  envelope.gain.setTargetAtTime(1.0, 0, attack);

  console.log(noteNumber);
  lastnotePlayed = currentNoteTable[noteNumber];
}

function noteOff(noteNumber) {
  canvas.className = "canvas-default"
  if (speedScaling) speedScaling = false;
  resetCubeColor();
  if (!reverseAnimation) reverseAnimation = true;
  var position = activeNotes.indexOf(noteNumber);
  if (position !== -1) {
    activeNotes.splice(position, 1);
  }

  if (cubeNeedScalingUp === true) cubeNeedScalingUp = false;
  if (cubeNeedScalingDown === false) cubeNeedScalingDown = true;
  if (activeNotes.length === 0) {
    // shut off the envelope
    envelope.gain.cancelScheduledValues(0);
    envelope.gain.setTargetAtTime(0.0, 0, release);
  } else {
    oscillator.frequency.cancelScheduledValues(0);
    oscillator.frequency.setTargetAtTime(
      frequencyFromNoteNumber(activeNotes[activeNotes.length - 1]),
      0,
      portamento
    );
  }
}

const startButton = document.getElementById("start");

startButton.addEventListener("click", () =>
  context
    .resume()
    .then(() => console.log("Audio Context Resumed"))
    .then(() => (isPaused = false))
    .then(() => startAnimation())
);

const pauseButton = document.getElementById("pause");

pauseButton.addEventListener("click", () =>
  context
    .suspend()
    .then(() => console.log("Audio Context Suspended"))
    .then(() => stopAnimation())
    .then(() => (isPaused = true))
);
