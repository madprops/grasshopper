App.create_playing_icon = (mode) => {
  btn = DOM.create(`div`, `button icon_button playing_icon hidden`, `playing_icon_${mode}`)
  btn.title = `Go To Playing Tab (Ctrl + Dot) - Right Click to filter playing tabs`
  let icon = App.create_icon(`speaker`)

  DOM.ev(btn, `click`, () => {
    App.go_to_playing_tab()
  })

  DOM.ev(btn, `contextmenu`, (e) => {
    e.preventDefault()
    App.filter_playing(mode)
  })

  DOM.ev(btn, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_playing`)
      App.run_command({cmd: cmd, from: `playing_aux`, e: e})
    }
  })

  btn.append(icon)
  return btn
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
  let items = App.get_items(`tabs`)
  let waypoint = false
  let first

  for (let item of items) {
    if (item.audible) {
      if (!first) {
        first = item
      }

      if (waypoint) {
        await App.check_on_tabs()

        App.focus_tab({
          item: item,
          scroll: `center_smooth`,
          method: `playing`,
        })

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
    App.focus_tab({item: first, scroll: `center_smooth`, method: `playing`})
  }
}