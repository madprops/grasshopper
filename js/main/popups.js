App.create_popup = (args) => {
  let p = {}
  p.setup_done = false

  let popup = DOM.create(`div`, `popup_main hidden`, `popup_${args.id}`)
  let container = DOM.create(`div`, `popup_container`, `popup_${args.id}_container`)
  container.tabIndex = 0

  if (args.element) {
    container.innerHTML = ``
    container.append(args.element)
  }
  else {
    container.innerHTML = App.get_template(args.id)
  }

  popup.append(container)

  DOM.evs(popup, [`click`, `auxclick`], (e) => {
    if (e.target.isConnected && !e.target.closest(`.popup_container`)) {
      p.dismiss()
    }
  })

  DOM.el(`#main`).append(popup)
  p.element = popup

  p.setup = () => {
    if (args.setup && !p.setup_done) {
      args.setup()
      p.setup_done = true
      App.debug(`Popup Setup: ${args.id}`)
    }
  }

  p.show = () => {
    p.setup()
    p.element.classList.remove(`hidden`)
    App.popup_mode = args.id
    container.focus()
    p.open = true
  }

  p.hide = (bypass = false) => {
    if (!p.open) {
      return
    }

    if (!bypass && args.on_hide) {
      args.on_hide(args.id)
    }
    else {
      p.element.classList.add(`hidden`)
      p.open = false

      if (args.after_hide) {
        args.after_hide(args.id)
      }
    }
  }

  p.dismiss = () => {
    App.popups[args.id].hide()

    if (args.on_dismiss) {
      args.on_dismiss()
    }
  }

  App.popups[args.id] = p
}

App.show_popup = (id) => {
  clearTimeout(App.alert_autohide)
  App.popups[id].show()
  App.popups[id].show_date = Date.now()
  let open = App.open_popups()

  open.sort((a, b) => {
    return a.show_date < b.show_date ? -1 : 1
  })

  let zindex = 999

  for (let popup of open) {
    popup.element.style.zIndex = zindex
    zindex += 1
  }
}

App.setup_popup = (id) => {
  App.popups[id].setup()
}

App.setup_popups = () => {
  App.create_popup({
    id: `alert`
  })

  App.create_popup({
    id: `textarea`, setup: () => {
      DOM.ev(DOM.el(`#textarea_copy`), `click`, () => {
        App.textarea_copy()
      })
    }
  })

  App.create_popup({
    id: `input`, setup: () => {
      DOM.ev(DOM.el(`#input_submit`), `click`, () => {
        App.input_enter()
      })
    }
  })
}

App.show_alert = (message, autohide_delay = 0, pre = true) => {
  let msg = DOM.el(`#alert_message`)

  if (pre) {
    msg.classList.add(`pre`)
  }
  else {
    msg.classList.remove(`pre`)
  }

  let text = App.make_html_safe(message)
  text = text.replace(/\n/g, `<br>`)
  msg.innerHTML = text
  App.show_popup(`alert`)

  if (autohide_delay > 0) {
    App.alert_autohide = setTimeout(() => {
      App.hide_popup(`alert`)
    }, autohide_delay)
  }
}

App.show_alert_2 = (message) => {
  App.show_alert(message, 0, false)
}

App.show_feedback = (message) => {
  App.show_alert(message, App.alert_autohide_delay)
}

App.show_feedback_2 = (message) => {
  App.show_alert(message, App.alert_autohide_delay, false)
}

App.show_textarea = (message, text) => {
  let textarea = DOM.el(`#textarea_text`)
  DOM.el(`#textarea_message`).textContent = message
  textarea.value = text
  App.show_popup(`textarea`)

  requestAnimationFrame(() => {
    App.focus_textarea(textarea)
  })
}

App.textarea_copy = () => {
  App.hide_popup(`textarea`)
  App.copy_to_clipboard(DOM.el(`#textarea_text`).value.trim())
}

App.show_input = (message, button, action, value = ``) => {
  App.input_action = action
  DOM.el(`#input_message`).textContent = message
  let textarea = DOM.el(`#input_text`)
  textarea.value = value
  DOM.el(`#input_submit`).textContent = button
  App.show_popup(`input`)

  requestAnimationFrame(() => {
    App.focus_textarea(textarea)
  })
}

App.focus_textarea = (el) => {
  el.focus()
  el.selectionStart = 0
  el.selectionEnd = 0
  App.scroll_to_top(el)
}

App.input_enter = () => {
  let ans = App.input_action(DOM.el(`#input_text`).value.trim())

  if (ans) {
    App.hide_popup(`input`)
  }
}

App.hide_all_popups = () => {
  clearTimeout(App.alert_autohide)

  for (let id of App.open_popup_list()) {
    App.popups[id].hide()
  }
}

App.hide_popup = (id, bypass = false) => {
  App.popups[id].hide(bypass)
}

App.open_popup_list = () => {
  let open = []

  for (let id in App.popups) {
    if (App.popups[id].open) {
      open.push(id)
    }
  }

  return open
}

App.popup_is_open = (id, exact = true) => {
  for (let pid of App.open_popup_list()) {
    if (exact) {
      if (pid === id) {
        return true
      }
    }
    else {
      if (pid.startsWith(id)) {
        return true
      }
    }
  }

  return false
}

App.popup_open = () => {
  for (let key in App.popups) {
    if (App.popups[key].open) {
      return true
    }
  }

  return false
}

App.open_popups = () => {
  let open = []

  for (let popup in App.popups) {
    if (App.popups[popup].open) {
      open.push(App.popups[popup])
    }
  }

  return open
}

App.dismiss_popup = (id) => {
  App.popups[id].dismiss()
}