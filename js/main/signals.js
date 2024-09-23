App.start_signals = () => {
  if (App.check_ready(`signals`)) {
    return
  }

  App.create_window({
    id: `signals`,
    setup: () => {
      let edit = DOM.el(`#signals_edit`)

      DOM.ev(edit, `click`, () => {
        App.show_settings_category(`signals`)
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
    icon.textContent = signal.icon || App.settings_icons.signals
    let name = DOM.create(`div`, `signal_name`)
    name.textContent = signal.name

    if (signal.interval) {
      name.textContent += ` (${signal.interval})`
    }

    let title = `${signal.url} (${signal.method})`

    if (signal.arguments) {
      title += ` (Arguments)`
    }

    if (signal.feedback) {
      title += ` (Feedback)`
    }

    if (signal.update_title) {
      title += ` (Title)`
    }

    if (signal.send_tabs) {
      title += ` (Tabs)`
    }

    if (signal.interval) {
      title += ` (${signal.interval})`
    }

    if (signal.startup) {
      title += ` (Startup)`
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

App.send_signal = async (signal, from = `cmd`) => {
  if (App.screen_locked) {
    return
  }

  let res, text

  try {
    let obj = {
      method: signal.method,
    }

    if (signal.arguments || signal.send_tabs) {
      obj.headers = {
        "Content-Type": `application/json`,
      }

      let args = {}

      if (signal.arguments) {
        let parsed = JSON.parse(signal.arguments)
        args = Object.assign(args, parsed)
      }

      if (signal.send_tabs) {
        args.tabs = App.get_url_list()
      }

      obj.body = JSON.stringify(args)
    }

    res = await fetch(signal.url, obj)
  }
  catch (err) {
    App.error(err)

    if (App.get_setting(`show_signal_errors`)) {
      App.alert(`Signal Error: ${signal.name}`)
    }

    return
  }

  if (res) {
    text = await res.text()
    text = text.trim()

    if (text) {
      if (from === `cmd`) {
        if (signal.feedback) {
          App.show_textarea(signal.name, text, true)
        }

        if (signal.update_title) {
          text = App.add_signal_icon(signal, text)
          App.set_main_title(text)
        }
      }
    }
  }

  return text
}

App.add_signal_icon = (signal, text) => {
  if (signal.icon && App.get_setting(`signal_title_icon`)) {
    text = `${signal.icon} ${text}`
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

App.start_signal_intervals = () => {
  for (let interval of App.signal_intervals) {
    clearInterval(interval)
  }

  App.signal_intervals = []
  let signals = App.get_setting(`signals`)

  for (let signal of signals) {
    if (signal.interval && (signal.interval >= App.signal_min_delay)) {
      App.log(`Signal: ${signal.name} Interval: ${signal.interval}`)

      let id = setInterval(() => {
        App.send_signal(signal)
      }, signal.interval * 1000)

      App.signal_intervals.push(id)
    }
  }

  for (let signal of signals) {
    if (signal.startup) {
      App.send_signal(signal)
    }
  }
}