function init() {
  console.log("click");
  Tone.start();
  xxx();
  console.log("click?");
}

console.log("loaded");

synths = {};

function initSynths() {
  const kick = new Tone.MembraneSynth({
    envelope: {
      sustain: 0,
      attack: 0.02,
      decay: 0.8
    },
    octaves: 10
  }).toMaster();

  const snare = new Tone.NoiseSynth({
    volume: -5,
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0
    },
    filterEnvelope: {
      attack: 0.001,
      decay: 0.3,
      sustain: 0
    }
  }).toMaster();

  const piano = new Tone.PolySynth(Tone.Synth, {
    volume: -8,
    oscillator: {
      partials: [1, 2, 1]
    },
    portamento: 0.05
  }).toMaster();

  const bass = new Tone.MonoSynth({
    volume: -10,
    envelope: {
      attack: 0.1,
      decay: 0.3,
      release: 2
    },
    filterEnvelope: {
      attack: 0.001,
      decay: 0.01,
      sustain: 0.5,
      baseFrequency: 200,
      octaves: 2.6
    }
  }).toMaster();

  synths.kick = kick;
  synths.snare = snare;
  synths.piano = piano;
  synths.bass = bass;
}

function stop() {
  Tone.Transport.stop();
}

function start() {
  Tone.Transport.start("+1", "0:0:0");
}

function bpm(v) {
  Tone.Transport.bpm.value = v;
}

function play(evts, loopDur, loopStart) {
  let loop = new Tone.Loop((time) => {
    let [m, b, s] = Tone.Transport.position.split(":");

    evts.forEach((p) => {
      //console.log(p);
      if (p.tone) {
        synths[p.synth].triggerAttackRelease(
          p.tone,
          p.duration,
          time + Tone.Time(p.start).toSeconds(),
          p.velocity
        );
      } else {
        synths[p.synth].triggerAttackRelease(
          p.duration,
          time + Tone.Time(p.start).toSeconds(),
          p.velocity
        );
      }
    });
  }, loopDur).start(loopStart);
  return loop;
}

fourOnTheFloor = [
  { tone: "C2", duration: 0.0625, start: 0, synth: "kick", velocity: 1.0 }
];

onBeatSnare = [{ duration: 0.0625, start: 0, velocity: 1.0, synth: "snare" }];

function par(es1, es2) {
  return [es1, es2].flat();
}

kickPattern1 = [0b1000, 0b1000, 0b1000, 0b1000];
kickPattern2 = [0b1000, 0b1000, 0b1000, 0b1010];
kickPattern3 = [0b1000, 0b1000, 0b1010, 0b1011];
kickPattern4 = [0b1000, 0b1000, 0b1010, 0b1001];
kickPattern5 = [0b1000, 0b1000, 0b1010, 0b0000];

kickLoop1 = [kickPattern1, kickPattern1, kickPattern1, kickPattern1].flat();
kickLoop2 = [kickPattern1, kickPattern1, kickPattern1, kickPattern2].flat();
kickLoop3 = [kickPattern1, kickPattern2, kickPattern5, kickPattern3].flat();
kickLoop4 = [kickPattern1, kickPattern4, kickPattern1, kickPattern4].flat();
kickLoop5 = [kickPattern1, kickPattern4, kickPattern1, kickPattern5].flat();

snarePattern = [0b0000, 0b0000, 0b1000, 0b0000];

function drumBeat(kickPattern, snarePattern) {
  const res = [];
  for (let b = 0; b < 4; ++b) {
    for (let i = 0; i < 4; ++i) {
      if (((0b1000 >> i) & kickPattern[b]) != 0)
        res.push({
          tone: "C2",
          duration: "16n",
          velocity: 1.0,
          synth: "kick",
          start: 0.5 * b + 0.125 * i
        });
      if (((0b1000 >> i) & snarePattern[b]) != 0)
        res.push({
          duration: "16n",
          velocity: 1.0,
          synth: "snare",
          start: 0.5 * b + 0.125 * i
        });
    }
  }
  return res;
}

theLoop = [kickLoop1, kickLoop1, kickLoop2, kcikLoop2, kickLoop3, kickLoop3, kickLoop4, kickLoop4, kickLoop5, kickLoop5].flat()

let g_beat = drumBeat(kickLoop2, snarePattern);
let g_loop = play(g_beat, "1m", "@1m");

function xxx() {
  //Tone.start();
  initSynths();
  start();
}
