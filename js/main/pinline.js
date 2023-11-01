App.setup_pinline = () => {
  App.pinline_debouncer = App.create_debouncer(() => {
    App.do_check_pinline()
  }, App.pinline_delay)
}

App.pinline_enabled = () => {
  if (App.get_setting(`show_pinline`) === `never`) {
    return false
  }

  if (!App.tabs_normal()) {
    return false
  }

  return true
}

App.check_pinline = () => {
  if (App.pinline_enabled()) {
    App.pinline_debouncer.call()
  }
}

App.do_check_pinline = () => {
  App.pinline_debouncer.cancel()

  if (!App.pinline_enabled()) {
    return
  }

  let show = App.get_setting(`show_pinline`)
  App.debug(`Checking pinline`)
  App.remove_pinline()
  let tabs = App.divide_tabs(`visible`)

  if ((!tabs.pinned_f.length) && (!tabs.normal_f.length)) {
    return
  }

  if (show === `auto`) {
    if ((!tabs.pinned_f.length) || (!tabs.normal_f.length)) {
      return
    }
  }

  let pinline = DOM.create(`div`, `pinline`)
  let pinline_content = DOM.create(`div`, `pinline_content action`)
  let n1 = tabs.pinned_f.length
  let n2 = tabs.normal_f.length
  let s1 = App.plural(n1, `Pin`, `Pins`)
  let s2 = `Normal`
  let sep = `&nbsp;&nbsp;+&nbsp;&nbsp;`
  pinline_content.innerHTML = `${n1} ${s1}${sep}${n2} ${s2}`
  pinline_content.title = `Pins above. Normal below. This is the Pinline`

  DOM.ev(pinline_content, `click`, (e) => {
    App.show_custom_menu(e, `pinline`)
  })

  DOM.ev(pinline_content, `auxclick`, (e) => {
    if (e.button !== 1) {
      return
    }

    let cmd = App.get_setting(`middle_click_pinline`)
    App.run_command({cmd: cmd, from: `pinline`, e: e})
  })

  pinline.append(pinline_content)

  if (tabs.pinned_f.length) {
    tabs.pinned_f.at(-1).element.after(pinline)
  }
  else {
    tabs.normal_f.at(0).element.before(pinline)
  }
}

App.remove_pinline = () => {
  for (let el of DOM.els(`.pinline`, DOM.el(`#tabs_container`))) {
    el.remove()
  }
}