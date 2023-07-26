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
  let [pinned, normal, pinned_v, normal_v] = App.divide_tabs(`visible`)

  if ((pinned_v.length < App.min_pinline_items) || (normal_v.length < App.min_pinline_items)) {
    return
  }

  let pinline = DOM.create(`div`, `pinline action`)
  let n1 = App.get_pinned_tabs().length
  let n2 = App.get_normal_tabs().length
  let s1 = App.plural(n1, `Pin`, `Pins`)
  let s2 = `Normal`
  let sep = `&nbsp;&nbsp;+&nbsp;&nbsp;`
  pinline.innerHTML = `${n1} ${s1}${sep}${n2} ${s2}`
  pinline.title = `Pinned tabs above. Normal tabs below`

  DOM.ev(pinline, `click`, (e) => {
    App.toggle_tabs()
  })

  DOM.ev(pinline, `mouseup`, (e) => {
    if (e.button !== 1) {
      return
    }

    let cmd = App.get_setting(`middle_click_pinline`)

    if (cmd !== `none`) {
      App.run_command({cmd: cmd, item: item, from: `pinline`})
    }
  })

  pinned_v.at(-1).element.after(pinline)
}

App.remove_pinline = () => {
  for (let el of DOM.els(`.pinline`, DOM.el(`#tabs_container`))) {
    el.remove()
  }
}