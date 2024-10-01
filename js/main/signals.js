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

  let filter = DOM.el(`#signals_filter`)

  DOM.ev(filter, `input`, () => {
    App.filter_signals()
  })

  App.filter_signals_debouncer = App.create_debouncer(() => {
    App.do_filter_signals()
  }, App.filter_delay_2)

  let filter_clear = DOM.el(`#signals_filter_clear`)

  DOM.ev(filter_clear, `click`, () => {
    App.empty_signals_filter()
    App.do_filter_signals()
    App.focus_signals_filter()
  })
}

App.show_signals = () => {
  App.start_signals()
  App.show_window(`signals`)
  App.focus_signals_filter()
}

App.fill_signals = () => {
  App.empty_signals_filter()
  let items = DOM.el(`#signals_items`)
  items.innerHTML = ``
  let signals = App.get_setting(`signals`)
  App.set_signals_info(signals.length)

  if (!signals.length) {
    items.innerHTML = `No signals registered yet`
  }

  for (let [i, signal] of signals.entries()) {
    let el = DOM.create(`div`, `signal_item filter_item`)
    el.dataset.index = i
    let icon = DOM.create(`div`, `signal_icon`)
    icon.textContent = signal.icon || App.settings_icons.signals
    let name = DOM.create(`div`, `signal_name filter_text`)
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

    if (signal.send_settings) {
      title += ` (Settings)`
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

    btn.textContent = `Run`
    el.append(icon)
    el.append(name)
    el.append(btn)
    items.append(el)

    let edbtn = DOM.create(`div`, `button signal_button`)
    edbtn.title = `Edit signal`

    DOM.ev(edbtn, `click`, () => {
      App.edit_signal(i)
    })

    edbtn.textContent = `Edit`
    el.append(edbtn)
  }
}

App.send_signal = async (signal, from = `cmd`) => {
  App.show_confirm({
    message: `Send Signal? (${signal.name})`,
    confirm_action: () => {
      App.do_send_signal(signal, from)
    },
    force: !signal.confirm,
  })
}

App.do_send_signal = async (signal, from) => {
  if (App.screen_locked) {
    return
  }

  let res, text

  try {
    let obj = {
      method: signal.method,
    }

    if (signal.arguments || signal.send_tabs || signal.send_settings) {
      obj.headers = {
        "Content-Type": `application/json`,
      }

      let args = {}

      if (signal.arguments) {
        let parsed = JSON.parse(signal.arguments)
        args = Object.assign(args, parsed)
      }

      if (signal.send_tabs) {
        args.tabs = App.get_tab_snapshot()
      }

      if (signal.send_settings) {
        args.settings = App.get_settings_snapshot()
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
          App.show_signal_text(signal, text)
        }

        if (signal.update_title) {
          text = App.add_signal_icon(signal, text)
          App.set_main_title(text)
        }

        if (signal.import_tabs) {
          if (App.is_json(text)) {
            App.import_tabs(text)
          }
          else {
            App.show_signal_text(signal, text)
          }
        }

        if (signal.import_settings) {
          if (App.is_json(text)) {
            App.import_settings(text)
          }
          else {
            App.show_signal_text(signal, text)
          }
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

App.set_signals_info = (amount) => {
  let el = DOM.el(`#signals_info`)

  if (amount) {
    el.textContent = `Signals (${amount})`
  }
  else {
    el.textContent = `Signals`
  }
}

App.edit_signal = (index) => {
  let id = `settings_signals`
  App.start_signals_addlist()
  let items = Addlist.get_data(id)[index]

  let after_done = () => {
    App.start_signal_intervals()
    App.fill_signals()
  }

  let args = {
    id,
    items,
    index,
    edit: true,
    after_done,
  }

  Addlist.edit(args)
}

App.start_signals_addlist = () => {
  if (App.signals_addlist_ready) {
    return
  }

  App.debug(`Start signals addlist`)
  let id = `settings_signals`
  let {popobj, regobj} = App.get_setting_addlist_objects()

  App.create_popup({...popobj, id: `addlist_${id}`,
    element: Addlist.register({...regobj, id,
      keys: [
        `name`,
        `url`,
        `arguments`,
        `icon`,
        `method`,
        `interval`,
        `feedback`,
        `update_title`,
        `send_tabs`,
        `import_tabs`,
        `send_settings`,
        `import_settings`,
        `startup`,
        `confirm`,
      ],
      pk: `name`,
      widgets: {
        name: `text`,
        url: `text`,
        method: `menu`,
        feedback: `checkbox`,
        icon: `text`,
        arguments: `text`,
        update_title: `checkbox`,
        send_tabs: `checkbox`,
        import_tabs: `checkbox`,
        send_settings: `checkbox`,
        import_settings: `checkbox`,
        interval: `number`,
        startup: `checkbox`,
        confirm: `checkbox`,
      },
      labels: {
        name: `Name`,
        url: `URL`,
        method: `Method`,
        feedback: `Feedback`,
        icon: `Icon`,
        arguments: `Arguments`,
        update_title: `Update Title`,
        send_tabs: `Send Tabs`,
        import_tabs: `Import Tabs`,
        interval: `Interval`,
        startup: `Startup`,
        send_settings: `Send Settings`,
        import_settings: `Import Settings`,
        confirm: `Confirm`,
      },
      list_icon: (item) => {
        return item.icon || App.settings_icons.signal
      },
      list_text: (item) => {
        return item.name
      },
      required: {
        name: true,
        url: true,
        method: true,
      },
      tooltips: {
        url: `URL to send the request to`,
        arguments: `JSON string to use as arguments for POST`,
        feedback: `Show the response in a popup`,
        update_title: `Update the Title with the response`,
        send_tabs: `Send a snapshot of the tabs as the 'tabs' argument`,
        import_tabs: `Automatically import tabs from the response`,
        send_settings: `Send a snapshot of the settings as the 'settings' argument`,
        import_settings: `Automatically import settings from the response`,
        interval: `Run this signal every x seconds`,
        startup: `Run this signal at startup`,
        icon: `Icon to show for the signal`,
        method: `HTTP method to use`,
        name: `Name of the signal`,
        confirm: `Needs confirmation before running`,
      },
      process: {
        url: (url) => {
          return App.fix_url(url)
        },
        interval: (num) => {
          num = parseInt(num)
          num = Math.max(App.signal_min_delay, num)
          return num
        },
      },
      sources: {
        method: () => {
          return [
            {text: `GET`, value: `GET`},
            {text: `POST`, value: `POST`},
            {text: `PUT`, value: `PUT`},
            {text: `DELETE`, value: `DELETE`},
          ]
        },
      },
      title: `Signals`,
    })})

  App.signals_addlist_ready = true
}

App.show_signal_text = (signal, text) => {
  let simple = text.length <= 250
  App.show_textarea(signal.name, text, simple)
}

App.filter_signals = () => {
  App.filter_signals_debouncer.call()
}

App.do_filter_signals = () => {
  App.filter_signals_debouncer.cancel()
  App.do_filter_2(`signals`)
}

App.empty_signals_filter = () => {
  DOM.el(`#signals_filter`).value = ``
}

App.focus_signals_filter = () => {
  DOM.el(`#signals_filter`).focus()
}

App.signals_filter_focused = () => {
  return document.activeElement.id === `signals_filter`
}

App.clear_signals_filter = () => {
  if (App.filter_has_value(`signals`)) {
    App.set_filter({mode: `signals`})
  }
  else {
    App.hide_window()
  }
}

App.on_signals_enter = () => {
  let items = DOM.els(`.filter_item`, `#signals_items`)

  for (let item of items) {
    if (!DOM.is_hidden(item)) {
      let index = item.dataset.index
      let signal = App.get_setting(`signals`).at(index)

      if (signal) {
        App.send_signal(signal)
      }

      break
    }
  }
}