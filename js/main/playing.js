App.create_playing_icon = (mode) => {
  playing = DOM.create(`div`, `button icon_button hidden`, `playing_icon_${mode}`)
  playing.title = `Go To Playing Tab (Ctrl + Dot)`
  let playing_icon = App.create_icon(`speaker`)

  DOM.ev(playing, `click`, () => {
    App.go_to_playing_tab()
  })

  playing.append(playing_icon)
  return playing
}

App.show_playing = (mode) => {
  DOM.el(`#playing_icon_${mode}`).classList.remove(`hidden`)
}

App.hide_playing = (mode) => {
  DOM.el(`#playing_icon_${mode}`).classList.add(`hidden`)
}

App.check_playing = (mode = App.active_mode) => {
  let playing = App.get_playing_tabs()

  if (playing.length) {
    App.show_playing(mode)
  }
  else {
    App.hide_playing(mode)
  }
}

App.get_playing_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.audible)
}

App.go_to_playing_tab = async () => {
  if (App.active_mode !== `tabs`) {
    await App.do_show_mode(`tabs`)
  }
  else {
    App.show_all(`tabs`)
  }

  let items = App.get_items(`tabs`)
  let waypoint = false
  let first

  for (let item of items) {
    if (item.audible) {
      if (!first) {
        first = item
      }

      if (waypoint) {
        App.focus_tab(item, `center_smooth`, `playing`)
        return
      }
    }

    if (!waypoint && item.active) {
      waypoint = true
      continue
    }
  }

  // If none found then pick the first one
  if (first) {
    App.focus_tab(first, `center_smooth`, `playing`)
  }
}