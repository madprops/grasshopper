App.create_back_button = (mode) => {
  let back = DOM.create(`div`, `button icon_button`, `${mode}_back`)
  back.title = `Go Back (Ctrl + Backspace)`
  back.append(App.create_icon(`back`))

  DOM.ev(back, `click`, (e) => {
    App.back_action(mode, e)
  })

  DOM.ev(back, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_back_button`)

      if (cmd !== `none`) {
        App.run_command({cmd: cmd, from: `back_button`})
      }
    }
  })

  return back
}

App.back_action = (mode = App.window_mode, e) => {
  if (App.highlights(mode)) {
    App.dehighlight(mode)
  }
  else if (App.get_filter(mode)) {
    App.clear_filter(mode)
  }
  else if (App[`${mode}_filter_mode`] !== `all`) {
    App.show_all()
  }
  else if (mode === `tabs`) {
    if (e.shiftKey) {
      App.do_empty_previous_tabs()
    }

    App.go_to_previous_tab()
  }
  else if (mode !== App.item_order[0]) {
    App.show_main_item_window()
  }
}