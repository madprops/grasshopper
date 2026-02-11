App.speech = (text) => {
  if (!window.speechSynthesis) {
    App.error(`Speech synthesis not supported`)
    return
  }

  let utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = `en-US`
  utterance.rate = 0.5

  window.speechSynthesis.speak(utterance)
}

App.error_sound = () => {
  App.play_sound(`effect_1`)
}

App.action_sound = () => {
  App.play_sound(`effect_2`)
}

App.play_sound = (name) => {
  if (!App.get_setting(`sound_effects`)) {
    return
  }

  let pname = `audio_player_${name}`

  if (!App[pname]) {
    App[pname] = new Audio(`audio/${name}.mp3`)
  }

  let player = App[pname]
  player.pause()
  player.currentTime = 0
  player.play()
}