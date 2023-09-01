App.create_popup = (args) => {
  let p = {}
  p.setup_done = false

  let popup = DOM.create(`div`, `popup_main hidden`, `popup_${args.id}`)
  let container = DOM.create(`div`, `popup_container`, `${args.id}_container`)
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
      App.popups[args.id].hide()
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

  p.hide = () => {
    p.element.classList.add(`hidden`)
    p.open = false
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
    id: `dialog`
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
      App.hide_popup()
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

App.show_dialog = (message, buttons) => {
  DOM.el(`#dialog_message`).textContent = message
  let btns = DOM.el(`#dialog_buttons`)
  btns.innerHTML = ``

  for (let button of buttons) {
    let btn = DOM.create(`div`, `button`)
    btn.textContent = button[0]
    DOM.ev(btn, `click`, () => {
      App.popups[`dialog`].hide()
      button[1]()
    })

    if (button[2]) {
      btn.classList.add(`button_2`)
    }

    btns.append(btn)
    button.element = btn
  }

  App.dialog_buttons = buttons
  App.focus_dialog_button(buttons.length - 1)
  App.show_popup(`dialog`)
}

App.focus_dialog_button = (index) => {
  for (let [i, btn] of App.dialog_buttons.entries()) {
    if (i === index) {
      btn.element.classList.add(`hovered`)
    }
    else {
      btn.element.classList.remove(`hovered`)
    }
  }

  App.dialog_index = index
}

App.dialog_left = () => {
  if (App.dialog_index > 0) {
    App.focus_dialog_button(App.dialog_index - 1)
  }
}

App.dialog_right = () => {
  if (App.dialog_index < App.dialog_buttons.length - 1) {
    App.focus_dialog_button(App.dialog_index + 1)
  }
}

App.dialog_enter = () => {
  App.hide_popup()
  App.dialog_buttons[App.dialog_index][1]()
}

App.show_confirm = (message, confirm_action, cancel_action, force = false) => {
  if (force) {
    confirm_action()
    return
  }

  if (!cancel_action) {
    cancel_action = () => {}
  }

  let buttons = [
    [`Cancel`, cancel_action, true],
    [`Confirm`, confirm_action]
  ]

  App.show_dialog(message, buttons)
}

App.show_textarea = (message, text) => {
  DOM.el(`#textarea_message`).textContent = message
  DOM.el(`#textarea_text`).value = text
  App.show_popup(`textarea`)
}

App.textarea_copy = () => {
  App.hide_popup()
  App.copy_to_clipboard(DOM.el(`#textarea_text`).value.trim())
}

App.show_input = (message, button, action, value = ``) => {
  App.input_action = action
  DOM.el(`#input_message`).textContent = message
  let input_text = DOM.el(`#input_text`)
  input_text.value = value
  DOM.el(`#input_submit`).textContent = button
  App.show_popup(`input`)
  input_text.focus()
}

App.input_enter = () => {
  App.hide_popup()
  App.input_action(DOM.el(`#input_text`).value.trim())
}

App.hide_popup = () => {
  clearTimeout(App.alert_autohide)

  for (let id in App.popups) {
    App.popups[id].hide()
  }
}

App.popup_open = () => {
  for (let key in App.popups) {
    if (App.popups[key].open) {
      return true
    }
  }

  return false
}

App.check_close_popup = () => {
  if (App.popup_open()) {
    App.hide_popup()
  }
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