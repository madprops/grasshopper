App.setup_playing = () => {
  App.check_playing_debouncer = App.create_debouncer((mode) => {
    App.do_check_playing(mode)
  }, App.check_playing_delay)
}

App.create_playing_icon = (mode) => {
  let btn = DOM.create(`div`, `button icon_button playing_icon hidden`, `playing_icon_${mode}`)
  btn.title = `Go To Playing Tab (Ctrl + Dot)\nRight Click: Show Playing Tabs`
  App.trigger_title(btn, `middle_click_playing`)
  let icon = App.get_svg_icon(`speaker`)

  DOM.ev(btn, `click`, () => {
    App.go_to_playing_tab()
  })

  DOM.ev(btn, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_tab_list(`playing`, e)
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
  App.playing = true
}

App.hide_playing = (mode) => {
  DOM.el(`#playing_icon_${mode}`).classList.add(`hidden`)
  App.playing = false
}

App.check_playing = () => {
  App.check_playing_debouncer.call(App.active_mode)
}

App.do_check_playing = (mode = App.active_mode, force = false) => {
  let playing = App.get_playing_tabs()

  if (playing.length) {
    if (!App.playing || force) {
      App.show_playing(mode)

      if (mode === `tabs`) {
        App.check_tab_box_playing()
      }
    }
  }
  else {
    if (App.playing) {
      App.hide_playing(mode)
    }
  }
}

App.get_playing_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.playing)
}

App.go_to_playing_tab = () => {
  let items = App.get_items(`tabs`)
  let waypoint = false
  let first

  async function proc (item) {
    await App.check_on_tabs()
    App.tabs_action(item, `playing`)
  }

  for (let item of items) {
    if (item.playing) {
      if (!first) {
        first = item
      }

      if (waypoint) {
        proc(item)
        return
      }
    }

    if (!waypoint && item.active) {
      waypoint = true
      continue
    }
  }

  if (first) {
    proc(first)
  }
}

App.filter_playing = async () => {
  await App.check_on_tabs()
  App.filter_cmd(`tabs`, `filter_playing_tabs`)
}