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
  let n1 = tabs.pinned_f.length
  let n2 = tabs.normal_f.length
  let s1 = App.plural(n1, `Pin`, `Pins`)
  let s2 = `Normal`
  let sep = `&nbsp;&nbsp;+&nbsp;&nbsp;`
  pinline.innerHTML = `${n1} ${s1}${sep}${n2} ${s2}`

  if (App.get_setting(`show_tooltips`)) {
    pinline.title = `This is the Pinline.\nPinned tabs above. Normal tabs below`
    App.trigger_title(pinline, `middle_click_pinline`)
    App.trigger_title(pinline, `left_click_press_pinline`)
    App.trigger_title(pinline, `middle_click_press_pinline`)
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

App.pinline_index = () => {
  if (!App.pinline_visible) {
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