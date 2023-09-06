App.setup_dialog = () => {
  App.create_popup({
    id: `dialog`,
    on_dismiss: () => {
      if (App.dialog_on_dismiss) {
        App.dialog_on_dismiss()
      }
    }
  })
}

App.show_dialog = (message, buttons, on_dismiss) => {
  if (App.popups[`dialog`].open) {
    return
  }

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
  App.dialog_on_dismiss = on_dismiss
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
  App.hide_popup(`dialog`)
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

  let on_dismiss = () => {
    if (cancel_action) {
      cancel_action()
    }
  }

  App.show_dialog(message, buttons, on_dismiss)
}