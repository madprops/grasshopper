App.start_signals = () => {
  if (App.check_ready(`signals`)) {
    return
  }

  App.create_window({
    id: `signals`,
    setup: () => {
      let info = DOM.el(`#signals_info`)

      DOM.ev(info, `click`, () => {
        App.signal_info()
      })

      let add = DOM.el(`#signals_add`)

      DOM.ev(add, `click`, () => {
        App.show_settings_category(`triggers`)
      })

      let close = DOM.el(`#signals_close`)

      DOM.ev(close, `click`, () => {
        App.hide_window()
      })
    },
    after_show: () => {
      App.fill_signals()
    },
    after_hide: () => { },
    colored_top: true,
  })
}

App.show_signals = () => {
  App.start_signals()
  App.show_window(`signals`)
}

App.fill_signals = () => {
  let container = DOM.el(`#signals_container`)
  container.innerHTML = ``
  let signals = App.get_setting(`signals`)

  for (let signal of signals) {
    let el = DOM.create(`div`, `signal_item`)
    let name = DOM.create(`div`, `signal_name`)
    name.textContent = signal.name
    name.title = `${signal.url} (${signal.method})`
    let btn = DOM.create(`button`, `signal_button`)
    btn.title = `Send request`

    DOM.ev(btn, `click`, () => {
      App.freeze_signal(el)
      App.send_signal(signal)
    })

    btn.textContent = `Go`
    el.append(name)
    el.append(btn)
    container.append(el)
  }
}

App.freeze_signal = (el) => {
  let cls = `disabled`
  el.classList.add(cls)

  setTimeout(() => {
    el.classList.remove(cls)
  }, App.signal_freeze_delay)
}

App.signal_info = () => {
  let s = `Here you can send signals
  First you have to add some in Triggers Settings
  You can use these with a webserver to trigger actions`
  App.alert(App.periods(s))
}

App.send_signal = async (signal) => {
  let res

  try {
    res = await fetch(signal.url, {method: signal.method})
  }
  catch (err) {
    App.alert(`Signal Error: ${signal.name}`)
    return
  }

  if (res && signal.feedback) {
    let text = await res.text()
    text = text.trim()

    if (text) {
      App.alert(text)
    }
  }
}