App.setup_pinline = () => {
  App.pinline_debouncer = App.create_debouncer(() => {
    App.do_check_pinline()
  }, App.pinline_delay)
}

App.check_pinline = () => {
  App.pinline_debouncer.call()
}

App.do_check_pinline = () => {
  App.pinline_debouncer.cancel()
  let show = App.get_setting(`show_pinline`)
  App.debug(`Checking pinline`)
  App.remove_pinline()
  let tabs = App.divide_tabs(`visible`)
  let cls = `element tabs_element glowbox`

  if (show === `auto`) {
    if (App.get_setting(`hide_pins`)) {
      if (!App.is_filtered(`tabs`)) {
        show = `never`
      }
    }
  }

  if (!App.tabs_normal()) {
    show = `never`
  }

  App.pinline_visible = true

  if (show === `never`) {
    App.pinline_visible = false
  }
  else if (show === `auto`) {
    if (!tabs.pinned_f.length || !tabs.normal_f.length) {
      App.pinline_visible = false
    }
  }
  else if (!tabs.pinned_f.length && !tabs.normal_f.length) {
    App.pinline_visible = false
  }

  if (!App.pinline_visible) {
    cls += ` hidden`
  }

  let pinline = DOM.create(`div`, cls, `pinline`)
  let icons = App.get_setting(`pinline_icons`)
  let n1 = tabs.pinned_f.length
  let n2 = tabs.normal_f.length
  let s1 = App.check_caps(App.plural(n1, `Pin`, `Pins`))
  let s2 = App.check_caps(`Normal`)
  let left, right

  if (icons) {
    let pin_icon = App.get_setting(`pin_icon`)
    let normal_icon = App.get_setting(`normal_icon`)
    left = `${pin_icon} ${n1} ${s1}`
    right = `${normal_icon} ${n2} ${s2}`
  }
  else {
    left = `${n1} ${s1}`
    right = `${n2} ${s2}`
  }

  let sep = `&nbsp;&nbsp;+&nbsp;&nbsp;`
  pinline.innerHTML = `${left}${sep}${right}`

  if (App.get_setting(`show_tooltips`)) {
    pinline.title = `This is the Pinline.\nPinned tabs above. Normal tabs below`
    App.trigger_title(pinline, `click_pinline`)
    App.trigger_title(pinline, `middle_click_pinline`)
    App.trigger_title(pinline, `click_press_pinline`)
    App.trigger_title(pinline, `middle_click_press_pinline`)
    App.trigger_title(pinline, `wheel_up_pinline`)
    App.trigger_title(pinline, `wheel_down_pinline`)

    if (App.get_setting(`pinline_drag`)) {
      pinline.title += `\nDrag to define pin delimeter`
    }
  }

  if (App.get_setting(`pinline_drag`)) {
    pinline.draggable = true
  }

  if (tabs.pinned_f.length) {
    tabs.pinned_f.at(-1).element.after(pinline)
  }
  else if (tabs.normal_f.length) {
    tabs.normal_f.at(0).element.before(pinline)
  }
}

App.remove_pinline = () => {
  let pinline = DOM.el(`#pinline`)

  if (pinline) {
    pinline.remove()
  }
}

App.pinline_index = (only_visible = false) => {
  if (only_visible && !App.pinline_visible) {
    return -1
  }

  return DOM.els(`.tabs_element`).indexOf(DOM.el(`#pinline`))
}

App.show_pinline_menu = (e) => {
  let items = App.custom_menu_items({
    name: `pinline_menu`,
  })

  App.show_context({items, e})
}

App.pinline_click = (e) => {
  let cmd = App.get_setting(`click_pinline`)
  App.run_command({cmd, from: `pinline`, e})
}

App.pinline_double_click = (e) => {
  let cmd = App.get_setting(`double_click_pinline`)
  App.run_command({cmd, from: `pinline`, e})
}

App.pinline_middle_click = (e) => {
  let cmd = App.get_setting(`middle_click_pinline`)
  App.run_command({cmd, from: `pinline`, e})
}

App.check_pinline_change = () => {
  let pinline_index = App.pinline_index()
  let to_pin = []
  let to_unpin = []

  for (let [i, item] of App.get_items(`tabs`).entries()) {
    if (i < pinline_index) {
      if (!item.pinned) {
        to_pin.push(item)
      }
    }
    else if (item.pinned) {
      to_unpin.push(item)
    }
  }

  for (let item of to_pin) {
    App.pin_tab(item.id)
  }

  for (let item of to_unpin) {
    App.unpin_tab(item.id)
  }
}