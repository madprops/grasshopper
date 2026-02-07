App.auto_click_action = (e) => {
  if (!App.get_setting(`auto_click_enabled`)) {
    return
  }

  clearInterval(App.auto_click_timeout)

  let el = e.target
  let mode = App.active_mode
  let [item, item_alt] = App.get_mouse_item(mode, el)

  function check(what, cls, elem) {
    let aclick = App.get_setting(`${what}_auto_click`)
    let element

    if (cls) {
      element = DOM.parent(el, cls)
    }
    else {
      element = elem
    }

    if (aclick && Boolean(element)) {
      let delay = App.get_setting(`${what}_auto_click_delay`)

      App.auto_click_timeout = setTimeout(() => {
        App.click_element(element)
      }, delay)

      return true
    }

    return false
  }

  if (item || item_alt) {
    let elem
    let name

    if (item_alt) {
      if (!App.get_setting(`tab_box_auto_click`)) {
        return
      }

      elem = item_alt
      name = `tab_box`
    }
    else {
      elem = item.element
      name = `item`
    }

    if (check(`hover_button`, [`.hover_button`])) {
      return
    }

    if (check(`close_button`, [`.close_button`])) {
      return
    }

    if (item.unloaded) {
      if (name === `tab_box`) {
        if (check(name, undefined, elem)) {
          return
        }
      }
      else if (check(`unloaded_tab`, undefined, elem)) {
        return
      }
    }
    else if (check(name, undefined, elem)) {
      return
    }

    return
  }

  if (check(`main_button`, [`.main_button`])) {
    return
  }

  if (check(`filter_button`, [`.filter_button`])) {
    return
  }

  if (check(`actions_button`, [`.actions_button`])) {
    return
  }

  if (check(`main_title`, [
    `#main_title_left_button`,
    `#main_title_right_button`,
    `#main_title`,
  ])) {
    return
  }

  if (check(`palette`, [`.palette_item`])) {
    return
  }

  if (check(`pinline`, [`#pinline`])) {
    return
  }

  if (check(`footer`, [
    `#footer_info`,
    `#footer_count`,
    `#footer_tab_box`,
    `#footer_up_tabs`,
    `#footer_down_tabs`,
  ])) {
    return
  }

  if (check(`settings`, [
    `.settings_title`,
    `.settings_arrow`,
    `.settings_actions`,
    `.settings_close`,
  ])) {
    return
  }

  if (check(`favorites`, [`.favorites_bar_item`])) {
    return
  }
}

App.toggle_auto_click = () => {
  let aclick = App.get_setting(`auto_click_enabled`)
  App.set_setting({setting: `auto_click_enabled`, value: !aclick})
  App.toggle_message(`Auto Click`, `auto_click_enabled`)
}