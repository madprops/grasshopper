App.pinline_debouncer = App.create_debouncer(() => {
  App.do_check_pinline()
}, App.pinline_debouncer_delay)

App.check_pinline = () => {
  if (App.get_setting(`show_pinline`)) {
    App.pinline_debouncer.call()
  }
}

App.do_check_pinline = () => {
  App.pinline_debouncer.cancel()

  if (App.window_mode !== `tabs`) {
    return
  }

  if (!App.get_setting(`show_pinline`)) {
    return
  }

  App.log(`Checking pinline`)
  App.remove_pinline()
  let last_pinned

  for (let item of App.get_items(`tabs`)) {
    if (!item.visible) {
      continue
    }

    if (item.pinned) {
      last_pinned = item
    }
    else {
      if (!last_pinned) {
        return
      }
      else {
        let pinline = DOM.create(`div`, `pinline`)
        last_pinned.element.after(pinline)
        return
      }
    }
  }
}

App.remove_pinline = () => {
  for (let el of DOM.els(`.pinline`, DOM.el(`#tabs_container`))) {
    el.classList.remove(`pinline`)
  }
}