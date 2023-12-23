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

  if ((!tabs.pinned_f.length) && (!tabs.normal_f.length)) {
    cls += ` hidden`
  }

  if (show === `auto`) {
    if ((!tabs.pinned_f.length) || (!tabs.normal_f.length)) {
      cls += ` hidden`
    }
  }

  let pinline = DOM.create(`div`, cls, `pinline`)
  let n1 = tabs.pinned_f.length
  let n2 = tabs.normal_f.length
  let s1 = App.plural(n1, `Pin`, `Pins`)
  let s2 = `Normal`
  let sep = `&nbsp;&nbsp;+&nbsp;&nbsp;`
  pinline.innerHTML = `${n1} ${s1}${sep}${n2} ${s2}`
  pinline.title = `This is the Pinline. Pinned tabs above. Normal tabs below`

  DOM.ev(pinline, `click`, (e) => {
    let cmds = [
      `new_pinned_tab`,
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
  let pinline = DOM.el(`#pinline`)

  if (pinline) {
    pinline.remove()
  }
}

App.pinline_index = () => {
  return DOM.els(`.tabs_element`).indexOf(DOM.el(`#pinline`))
}