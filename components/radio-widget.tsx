"use client"

// The radio: a glassy little player. Play starts a quiet generative synth
// (pads, a soft pluck, vinyl dust); skip changes the station.

import * as React from "react"

const STATIONS = [
  { name: "candlelight hum", by: "slow burn radio", root: 57, chords: [[0, 3, 7, 10], [-4, 0, 3, 7], [-7, -3, 0, 5], [-2, 2, 5, 9]], bpm: 72, hue: 20 },
  { name: "rain on the window", by: "wick sessions", root: 53, chords: [[0, 4, 7, 11], [-3, 0, 4, 9], [2, 5, 9, 12], [-5, -1, 2, 7]], bpm: 64, hue: 42 },
  { name: "quiet hours", by: "after dark", root: 60, chords: [[0, 2, 7, 11], [-5, 2, 4, 7], [-3, 0, 4, 7], [-8, -1, 3, 7]], bpm: 80, hue: 352 },
]

export default function RadioWidget() {
  const [playing, setPlaying] = React.useState(false)
  const [st, setSt] = React.useState(0)
  const [liked, setLiked] = React.useState(false)
  const audio = React.useRef(null as null | { ctx: AudioContext; master: GainNode; timer: number; step: number })

  const stopSound = () => {
    const a = audio.current
    if (!a) return
    window.clearInterval(a.timer)
    a.master.gain.setTargetAtTime(0, a.ctx.currentTime, 0.25)
    const ctx = a.ctx
    window.setTimeout(() => ctx.close(), 900)
    audio.current = null
  }

  const startSound = (index: number) => {
    stopSound()
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    const master = ctx.createGain()
    master.gain.value = 0
    master.gain.setTargetAtTime(0.16, ctx.currentTime, 0.6)
    const lp = ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.frequency.value = 1500
    master.connect(lp).connect(ctx.destination)
    // vinyl dust
    const len = ctx.sampleRate * 2
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const ch = buf.getChannelData(0)
    for (let i = 0; i < len; i++) ch[i] = Math.random() < 0.0009 ? (Math.random() - 0.5) * 0.9 : (Math.random() - 0.5) * 0.012
    const dust = ctx.createBufferSource()
    dust.buffer = buf
    dust.loop = true
    const dg = ctx.createGain()
    dg.gain.value = 0.5
    dust.connect(dg).connect(master)
    dust.start()

    const s = STATIONS[index]
    const beat = 60 / s.bpm
    const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12)
    const voice = (freq: number, t: number, dur: number, type: OscillatorType, peak: number, attack: number) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = type
      o.frequency.value = freq
      o.detune.value = (Math.random() - 0.5) * 8
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(peak, t + attack)
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      o.connect(g).connect(master)
      o.start(t)
      o.stop(t + dur + 0.05)
    }
    const a = { ctx, master, timer: 0, step: 0 }
    const tick = () => {
      const t = ctx.currentTime + 0.05
      const bar = Math.floor(a.step / 8) % s.chords.length
      const chord = s.chords[bar]
      if (a.step % 8 === 0) for (const n of chord) voice(hz(s.root + n - 12), t, beat * 8.4, "sine", 0.11, beat * 2)
      if (a.step % 8 === 0) voice(hz(s.root + chord[0] - 24), t, beat * 8, "triangle", 0.14, 0.3)
      if (Math.random() < 0.62) {
        const n = chord[(a.step * 3 + (Math.random() < 0.3 ? 1 : 0)) % chord.length] + (a.step % 4 === 3 ? 12 : 0)
        voice(hz(s.root + n), t, beat * 1.6, "triangle", 0.07, 0.008)
      }
      a.step++
    }
    tick()
    a.timer = window.setInterval(tick, beat * 1000)
    audio.current = a
  }

  React.useEffect(() => stopSound, [])

  const toggle = () => {
    if (playing) stopSound()
    else startSound(st)
    setPlaying(!playing)
  }
  const skip = (dir: number) => {
    const n = (st + dir + STATIONS.length) % STATIONS.length
    setSt(n)
    if (playing) startSound(n)
  }
  const s = STATIONS[st]

  return (
    <div className="ssd-radio" data-silk-anchor>
      <div className="ssd-radio-top">
        <div className="ssd-art" style={{ background: "radial-gradient(circle at 70% 30%, hsl(" + (s.hue + 30) + " 95% 75%) 0 14%, transparent 15%), linear-gradient(150deg, hsl(" + s.hue + " 90% 60%), hsl(" + (s.hue + 40) + " 70% 22%))" }} />
        <div className="ssd-radio-meta">
          <b>radio for slow nights</b>
          <span>
            {s.name} · {s.by}
          </span>
        </div>
        <button type="button" className={"ssd-heart" + (liked ? " on" : "")} aria-label={liked ? "Unlike" : "Like"} aria-pressed={liked} onClick={() => setLiked(!liked)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-7.5-4.6-9.5-9.2C1 8.2 3.4 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.6 0 6 3.7 4.5 7.3C19.5 16.4 12 21 12 21z" />
          </svg>
        </button>
      </div>
      <div className="ssd-bar">
        <span className={"ssd-fill" + (playing ? " run" : "")} key={st} />
      </div>
      <div className="ssd-radio-row">
        <span className={"ssd-live" + (playing ? " on" : "")}>
          <i />
          live
        </span>
        <span className="ssd-station">{st + 1} / {STATIONS.length}</span>
      </div>
      <div className="ssd-controls">
        <button type="button" aria-label="Previous station" onClick={() => skip(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 5 9 12l9 7V5zM6 5v14" /></svg>
        </button>
        <button type="button" className="ssd-play" aria-label={playing ? "Pause" : "Play"} onClick={toggle}>
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
          )}
        </button>
        <button type="button" aria-label="Next station" onClick={() => skip(1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m6 5 9 7-9 7V5zM18 5v14" /></svg>
        </button>
      </div>
    </div>
  )
}
