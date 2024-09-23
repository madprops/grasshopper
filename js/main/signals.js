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
  App.set_signals_info(signals.length)

  if (!signals.length) {
    container.innerHTML = `No signals registered yet`
  }

  for (let [i, signal] of signals.entries()) {
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

    btn.textContent = `Run`
    el.append(icon)
    el.append(name)
    el.append(btn)
    container.append(el)

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
  let sett = `settings_signals`
  App.start_signals_addlist()
  let items = Addlist.get_data(sett)[index]

  let after_done = () => {
    App.start_signal_intervals()
    App.fill_signals()
  }

  let args = {
    id: sett,
    items: items,
    index: index,
    edit: true,
    after_done: after_done,
  }

  Addlist.edit(args)
}

App.start_signals_addlist = () => {
  if (App.signals_addlist_ready) {
    return
  }

  App.debug(`Start signals addlist`)
  let id = `settings_signals`
  let objs = App.get_setting_addlist_objects()
  let popobj = objs[0]
  let regobj = objs[1]

  App.create_popup(Object.assign({}, popobj, {
    id: `addlist_${id}`,
    element: Addlist.register(Object.assign({}, regobj, {
      id: id,
      keys: [`name`, `url`, `arguments`, `icon`, `method`, `interval`, `feedback`, `update_title`, `send_tabs`, `startup`],
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
        interval: `number`,
        startup: `checkbox`,
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
        interval: `Interval`,
        startup: `Startup`,
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
        arguments: `JSON string to use as arguments for POST`,
        feedback: `Show the response in a popup`,
        update_title: `Update the Title with the response`,
        send_tabs: `Send all open tab URLs as the 'tabs' argument`,
        interval: `Run this signal every x seconds`,
        startup: `Run this signal at startup`,
      },
      process: {
        url: (url) => {
          return App.fix_url(url)
        },
        interval: (num) => {
          num = parseInt(num)
          num = Math.max(App.signal_min_delay, num)
          return num
        }
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
    }))
  }))

  App.signals_addlist_ready = true
}