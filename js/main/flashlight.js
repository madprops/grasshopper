App.show_flashlight = () => {
  App.flashlight = DOM.create(`div`, ``, `flashlight`)
  document.body.appendChild(App.flashlight)
  App.flashlight_on = true

  DOM.ev(App.flashlight, `click`, () => {
    App.turn_flashlight_off()
  })
}

App.turn_flashlight_off = () => {
  App.flashlight.remove()
  App.flashlight_on = false
  App.flashlight = undefined
}