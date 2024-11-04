App.autoclick_action = (e) => {
  if (!App.get_setting(`autoclick_enabled`)) {
    return
  }

  clearInterval(App.autoclick_timeout)

  let el = e.target
  let mode = App.active_mode
  let [item, item_alt] = App.get_mouse_item(mode, el)

  function check(what, cls, elem) {
    let aclick = App.get_setting(`${what}_autoclick`)
    let element

    if (cls) {
      element = DOM.parent(el, cls)
    }
    else {
      element = elem
    }

    if (aclick && Boolean(element)) {
      let delay = App.get_setting(`${what}_autoclick_delay`)

      App.autoclick_timeout = setTimeout(() => {
        App.click_element(element)
      }, delay)

      return true
    }

    return false
  }

  if (item || item_alt) {
    let elem

    if (item_alt) {
      if (!App.get_setting(`tab_box_autoclick`)) {
        return
      }

      elem = item_alt
    }
    else {
      elem = item.element
    }

    if (check(`hover_button`, [`.hover_button`])) {
      return
    }

    if (check(`close_button`, [`.close_button`])) {
      return
    }

    if (item.unloaded) {
      if (check(`unloaded_tab`, undefined, elem)) {
        return
      }
    }
    else if (check(`item`, undefined, elem)) {
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

App.toggle_autoclick = () => {
  let aclick = App.get_setting(`autoclick_enabled`)
  App.set_setting({setting: `autoclick_enabled`, value: !aclick})
  App.footer_message(`Autoclick ${!aclick ? `Enabled` : `Disabled`}`)
}