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
  if (App[`${mode}_back_action`]) {
    App[`${mode}_back_action`](e)
  }
  else {
    if (App.highlights(mode)) {
      App.dehighlight(mode)
      return
    }

    let item = App.get_selected(mode)
    let visible

    if (item) {
      visible = App.element_is_visible(item.element)
    }

    if (visible || !item) {
      App.clear_or_all(mode)
    }
    else {
      App.select_item(item, `center_smooth`)
    }
  }
}