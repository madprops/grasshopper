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
    let icon = DOM.create(`div`, `signal_icon`)
    icon.textContent = signal.icon || App.signal_icon
    let name = DOM.create(`div`, `signal_name`)
    name.textContent = signal.name
    let title = `${signal.url} (${signal.method})`

    if (signal.feedback) {
      title += ` (Feedback)`
    }

    name.title = title
    let btn = DOM.create(`div`, `button signal_button`)
    btn.title = `Send request`

    DOM.ev(btn, `click`, () => {
      App.send_signal(signal)
    })

    btn.textContent = `Go`
    el.append(icon)
    el.append(name)
    el.append(btn)
    container.append(el)
  }
}

App.signal_info = () => {
  let s = `Here you can send signals
  First you have to add some in Trigger Settings
  You can use them on webservers to trigger actions or get information`
  App.alert(App.periods(s))
}

App.send_signal = async (signal, popup = true) => {
  let res, text

  try {
    let obj = {
      method: signal.method,
    }

    if (signal.arguments) {
      obj.headers = {
        "Content-Type": `application/json`,
      }

      obj.body = signal.arguments
    }

    res = await fetch(signal.url, obj)
  }
  catch (err) {
    App.error(err)
    App.alert(`Signal Error: ${signal.name}`)
    return
  }

  if (res && signal.feedback) {
    text = await res.text()
    text = text.trim()

    if (text) {
      if (popup) {
        App.show_textarea(signal.name, text, true)
      }
    }
  }

  return text
}

App.get_signal = (cmd) => {
  let id = cmd.replace(`send_signal_`, ``)
  let signals = App.get_setting(`signals`)

  for (let signal of signals) {
    if (signal._id_ === id) {
      return signal
    }
  }
}