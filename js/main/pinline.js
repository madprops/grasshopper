App.pinline_debouncer = App.create_debouncer(() => {
  App.do_check_pinline()
}, App.pinline_delay)

App.check_pinline = () => {
  if (App.active_mode === `tabs`) {
    if (App.get_setting(`show_pinline`) !== `never`) {
      App.pinline_debouncer.call()
    }
  }
}

App.do_check_pinline = () => {
  App.pinline_debouncer.cancel()

  if (App.active_mode !== `tabs`) {
    return
  }

  if (App.get_setting(`show_pinline`) === `never`) {
    return
  }

  App.debug(`Checking pinline`)
  App.remove_pinline()
  let tabs = App.divide_tabs(`visible`)

  if ((!tabs.pinned_f.length) && (!tabs.normal_f.length)) {
    return
  }

  if (App.get_setting(`show_pinline`) === `normal`) {
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
  pinline_content.title = `Pins above. Normal below`

  DOM.evs(pinline_content, [`click`, `contextmenu`], (e) => {
    App.show_custom_menu(e, `pinline`)
  })

  DOM.ev(pinline_content, `auxclick`, (e) => {
    if (e.button !== 1) {
      return
    }

    let cmd = App.get_setting(`middle_click_pinline`)

    if (cmd !== `none`) {
      App.run_command({cmd: cmd, from: `pinline`})
    }
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