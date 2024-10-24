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

      let container = DOM.el(`#window_content_signals`)
      App.generic_gestures(container)
    },
    after_show: () => {
      App.fill_signals()
      App.select_first_signal()
    },
    after_hide: () => {},
    colored_top: true,
  })

  let filter = DOM.el(`#signals_filter`)

  DOM.ev(filter, `input`, () => {
    App.filter_signals()
  })

  App.filter_signals_debouncer = App.create_debouncer(() => {
    App.do_filter_signals()
  }, App.filter_delay_2)

  let bottom = DOM.el(`#signals_filter_bottom`)
  bottom.textContent = App.filter_bottom_icon
  bottom.title = App.filter_bottom_title

  DOM.ev(bottom, `click`, () => {
    App.signals_bottom()
  })

  let clear = DOM.el(`#signals_filter_clear`)
  clear.textContent = App.filter_clear_icon
  clear.title = App.filter_clear_title

  DOM.ev(clear, `click`, () => {
    App.reset_generic_filter(`signals`)
  })

  let container = DOM.el(`#signals_container`)

  DOM.ev(container, `click`, (e) => {
    let item = DOM.parent(e.target, [`.signal_item`])

    if (!item) {
      return
    }

    let index = item.dataset.index
    App.select_signal(item)
    App.focus_signals_filter()

    if (DOM.class(e.target, [`signal_run`])) {
      let signal = App.signal_by_index(index)
      App.send_signal(signal)
    }
    else if (DOM.class(e.target, [`signal_edit`])) {
      App.edit_signal(index)
    }
  })

  DOM.ev(container, `dblclick`, (e) => {
    let item = DOM.parent(e.target, [`.signal_item`])

    if (!item) {
      return
    }

    let index = item.dataset.index

    if (DOM.class(e.target, [`signal_name`])) {
      let signal = App.signal_by_index(index)
      App.send_signal(signal)
    }
  })
}

App.show_signals = () => {
  let signals = App.get_setting(`signals`)

  if (!signals.length) {
    App.show_settings_category(`signals`)
    return
  }

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
    name.dataset.index = i
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
      name.textContent += ` (P)`
    }

    if (signal.send_settings) {
      title += ` (Settings)`
      name.textContent += ` (P)`
    }

    if (signal.interval) {
      title += ` (${signal.interval})`
    }

    if (signal.startup) {
      title += ` (Startup)`
    }

    name.title = title
    let btn = DOM.create(`div`, `button signal_button signal_run`)
    btn.title = `Send request`
    btn.textContent = `Run`
    el.append(icon)
    el.append(name)
    el.append(btn)
    items.append(el)

    let edbtn = DOM.create(`div`, `button signal_button signal_edit`)
    edbtn.title = `Edit signal`
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
          App.set_main_title(text, false)
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
  let icon = App.settings_icons.signals

  if (amount) {
    el.textContent = `${icon} Signals (${amount})`
  }
  else {
    el.textContent = `${icon} Signals`
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
        `startup`,
        `confirm`,
        `feedback`,
        `update_title`,
        `send_tabs`,
        `send_settings`,
        `import_tabs`,
        `import_settings`,
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
  let icon = App.settings_icons.signals
  let title = `${icon} ${signal.name}`
  App.show_textarea({title, text, simple})
}

App.filter_signals = () => {
  App.filter_signals_debouncer.call()
}

App.do_filter_signals = () => {
  App.filter_signals_debouncer.cancel()
  App.do_filter_2(`signals`)
  App.select_first_signal()
}

App.focus_signals_filter = () => {
  DOM.el(`#signals_filter`).focus()
}

App.signals_filter_focused = () => {
  return document.activeElement.id === `signals_filter`
}

App.empty_signals_filter = () => {
  DOM.el(`#signals_filter`).value = ``
}

App.clear_signals_filter = () => {
  if (App.filter_has_value(`signals`)) {
    App.reset_generic_filter(`signals`)
  }
  else {
    App.hide_window()
  }
}

App.on_signals_enter = () => {
  let selected = DOM.el(`.selected_signal`, `#signals_items`)

  if (!selected) {
    return
  }

  let index = selected.dataset.index
  let signal = App.signal_by_index(index)

  if (signal) {
    App.send_signal(signal)
  }
}

App.on_signals_arrow = (reverse = false) => {
  let items = DOM.els(`.filter_item`, `#signals_items`)

  if (items.length <= 1) {
    return
  }

  if (reverse) {
    items = items.reverse()
  }

  let waypoint = false
  let selected = false
  let visible = []

  for (let item of items) {
    if (!DOM.is_hidden(item)) {
      visible.push(DOM.el(`.signal_name`, item))
    }
  }

  if (!visible.length) {
    return
  }

  for (let item of visible) {
    if (item.classList.contains(`selected_signal`)) {
      item.classList.remove(`selected_signal`)
      waypoint = true
      continue
    }

    if (waypoint) {
      selected = true
      item.classList.add(`selected_signal`)
      break
    }
  }

  if (!selected) {
    visible[0].classList.add(`selected_signal`)
  }

  App.focus_signals_filter()
}

App.select_first_signal = () => {
  let items = DOM.els(`.filter_item`, `#signals_items`)

  if (!items.length) {
    return
  }

  let first = false

  for (let item of items) {
    let name = DOM.el(`.signal_name`, item)

    if (!DOM.is_hidden(item) && !first) {
      name.classList.add(`selected_signal`)
      first = true
    }
    else {
      name.classList.remove(`selected_signal`)
    }
  }
}

App.select_signal = (el) => {
  for (let item of DOM.els(`.signal_name`, `#signals_items`)) {
    item.classList.remove(`selected_signal`)
  }

  let name = DOM.el(`.signal_name`, el)
  name.classList.add(`selected_signal`)
}

App.signal_by_index = (index) => {
  return App.get_setting(`signals`).at(index)
}

App.signals_bottom = () => {
  let container = DOM.el(`#window_content_signals`)
  container.scrollTop = container.scrollHeight
}