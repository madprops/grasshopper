App.setup_playing = () => {
  App.check_playing_debouncer = App.create_debouncer((mode) => {
    App.do_check_playing(mode)
  }, App.check_playing_delay)
}

App.create_playing_button = (mode) => {
  let btn = DOM.create(`div`, `button icon_button playing_button hidden`, `playing_button_${mode}`)
  let click = App.get_cmd_name(`jump_tabs_playing_down`)
  let rclick = App.get_cmd_name(`show_playing_tabs`)

  if (App.get_setting(`show_tooltips`)) {
    btn.title = `Click: ${click} (Ctrl + Dot)\nRight Click: ${rclick}`
    App.trigger_title(btn, `middle_click_playing`)
    App.trigger_title(btn, `click_press_playing`)
    App.trigger_title(btn, `middle_click_press_playing`)
    App.trigger_title(btn, `wheel_up_playing`)
    App.trigger_title(btn, `wheel_down_playing`)
  }

  if (!App.get_setting(`show_playing_button`)) {
    btn.classList.add(`hidden_2`)
  }

  let icon = App.get_svg_icon(`speaker`)
  btn.append(icon)
  return btn
}

App.show_playing = (mode) => {
  DOM.show(`#playing_button_${mode}`)
  App.playing = true
}

App.hide_playing = (mode) => {
  DOM.hide(`#playing_button_${mode}`)
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
  else if (App.playing) {
    App.hide_playing(mode)
  }
}

App.get_playing_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.playing)
}

App.playing_middle_click = (e) => {
  let cmd = App.get_setting(`middle_click_playing`)
  App.run_command({cmd, from: `playing_aux`, e})
}