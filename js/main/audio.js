App.play = (what) => {
  if (!App[`audio_${what}`]) {
    App[`audio_${what}`] = new Audio()
    App[`audio_${what}`].src = `audio/${what}.ogg`
  }

  App[`audio_${what}`].pause()
  App[`audio_${what}`].currentTime = 0
  App[`audio_${what}`].play()
}

App.beep = () => {
  if (App.get_setting(`beep`)) {
    App.play(`beep`)
    return true
  }

  return false
}