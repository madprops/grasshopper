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

  let do_action = false

  if (item) {
    element = item.element

    if (item.unloaded) {
      if (App.get_setting(`unloaded_tab_autoclick`)) {
        do_action = true
      }
    }
    else if (App.get_setting(`item_autoclick`)) {
      do_action = true
    }
  }
  else if (item_alt) {
    element = item_alt.element

    if (App.get_setting(`unloaded_tab_autoclick`)) {
      do_action = true
    }
  }
  else if (check(`hover_button`, `.hover_button`)) {
    do_action = true
  }
  else if (check(`main_button`, `.main_button`)) {
    do_action = true
  }
  else if (check(`filter_button`, `.filter_button`)) {
    do_action = true
  }
  else if (check(`actions_button`, `.actions_button`)) {
    do_action = true
  }
  else if (check(`main_title_left_button`, `#main_title_left_button`)) {
    do_action = true
  }
  else if (check(`main_title_right_button`, `#main_title_right_button`)) {
    do_action = true
  }
  else if (check(`favorites`, `.favorites_bar_item`)) {
    do_action = true
  }

  if (do_action) {
    App.autoclick_timeout = setTimeout(() => {
      action()
    }, App.get_setting(`autoclick_delay`))
  }
}