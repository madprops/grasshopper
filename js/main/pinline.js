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

  let pinline = DOM.create(`div`, `pinline glowbox`)
  let n1 = tabs.pinned_f.length
  let n2 = tabs.normal_f.length
  let s1 = App.plural(n1, `Pin`, `Pins`)
  let s2 = `Normal`
  let sep = `&nbsp;&nbsp;+&nbsp;&nbsp;`
  pinline.innerHTML = `${n1} ${s1}${sep}${n2} ${s2}`
  pinline.title = `This is the Pinline. Pins above. Normal below`

  DOM.ev(pinline, `click`, (e) => {
    let cmds = [
      `select_pinned_tabs`,
      `select_normal_tabs`,
      `select_unloaded_tabs`,
      `select_all_items`,
    ]

    let items = App.cmd_list(cmds)
    App.show_context({items: items, e: e})
  })

  DOM.ev(pinline, `auxclick`, (e) => {
    if (e.button !== 1) {
      return
    }

    let cmd = App.get_setting(`middle_click_pinline`)
    App.run_command({cmd: cmd, from: `pinline`, e: e})
  })

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