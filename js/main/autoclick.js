App.autoclick_action = (e) => {
  clearInterval(App.autoclick_timeout)
  let el = e.target
  let mode = App.active_mode
  let [item, item_alt] = App.get_mouse_item(mode, el)
  let element

  function action() {
    App.click_element(element, e)
  }

  function check(what, cls) {
    element = DOM.parent(el, [cls])
    return App.get_setting(`${what}_autoclick`) && Boolean(element)
  }

  let delay

  if (item) {
    element = item.element

    if (item.unloaded) {
      if (App.get_setting(`unloaded_tab_autoclick`)) {
        delay = App.get_setting(`unloaded_tab_autoclick_delay`)
      }
    }
    else if (App.get_setting(`item_autoclick`)) {
      delay = App.get_setting(`item_autoclick_delay`)
    }
  }
  else if (item_alt) {
    element = item_alt.element

    if (App.get_setting(`unloaded_tab_autoclick`)) {
      delay = App.get_setting(`unloaded_tab_autoclick_delay`)
    }
  }
  else if (check(`hover_button`, `.hover_button`)) {
    delay = App.get_setting(`hover_button_autoclick_delay`)
  }
  else if (check(`main_button`, `.main_button`)) {
    delay = App.get_setting(`main_button_autoclick_delay`)
  }
  else if (check(`filter_button`, `.filter_button`)) {
    delay = App.get_setting(`filter_button_autoclick_delay`)
  }
  else if (check(`actions_button`, `.actions_button`)) {
    delay = App.get_setting(`actions_button_autoclick_delay`)
  }
  else if (check(`main_title_left_button`, `#main_title_left_button`)) {
    delay = App.get_setting(`main_title_left_button_autoclick_delay`)
  }
  else if (check(`main_title_right_button`, `#main_title_right_button`)) {
    delay = App.get_setting(`main_title_right_button_autoclick_delay`)
  }

  if (delay) {
    App.autoclick_timeout = setTimeout(() => {
      action()
    }, delay)
  }
}