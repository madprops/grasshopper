App.pinline_debouncer = App.create_debouncer(() => {
  App.do_check_pinline()
}, App.pinline_delay)

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
  let tabs = App.divide_tabs(`visible`)

  if ((tabs.pinned_f.length === 0) || (tabs.normal_f.length === 0)) {
    return
  }

  let pinline = DOM.create(`div`, `pinline action`)
  let n1 = tabs.pinned_f.length
  let n2 = tabs.normal_f.length
  let s1 = App.plural(n1, `Pin`, `Pins`)
  let s2 = `Normal`
  let sep = `&nbsp;&nbsp;+&nbsp;&nbsp;`
  pinline.innerHTML = `${n1} ${s1}${sep}${n2} ${s2}`
  pinline.title = `Pinned tabs above. Normal tabs below`

  DOM.ev(pinline, `click`, (e) => {
    App.toggle_tabs()
  })

  DOM.ev(pinline, `auxclick`, (e) => {
    if (e.button !== 1) {
      return
    }

    let cmd = App.get_setting(`middle_click_pinline`)

    if (cmd !== `none`) {
      App.run_command({cmd: cmd, from: `pinline`})
    }
  })

  tabs.pinned_f.at(-1).element.after(pinline)
}

App.remove_pinline = () => {
  for (let el of DOM.els(`.pinline`, DOM.el(`#tabs_container`))) {
    el.remove()
  }
}