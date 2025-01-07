App.show_dialog = (args = {}) => {
  App.start_popups()

  if (App.popups.dialog.open) {
    return
  }

  DOM.el(`#dialog_message`).textContent = args.message
  let btns = DOM.el(`#dialog_buttons`)
  btns.innerHTML = ``

  for (let button of args.buttons) {
    let btn = DOM.create(`div`, `button`)
    btn.textContent = button[0]

    DOM.ev(btn, `click`, () => {
      App.popups.dialog.hide()
      button[1]()

      if (args.on_any_action) {
        args.on_any_action()
      }
    })

    if (button[2]) {
      btn.classList.add(`button_2`)
    }

    btns.append(btn)
    button.element = btn
  }

  App.dialog_buttons = args.buttons

  App.dialog_on_dismiss = () => {
    if (args.on_dismiss) {
      args.on_dismiss()
    }

    if (args.on_any_action) {
      args.on_any_action()
    }
  }

  let focused_button

  if (args.focused_button !== undefined) {
    focused_button = args.focused_button
  }
  else {
    focused_button = args.buttons.length - 1
  }

  App.focus_dialog_button(focused_button)
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

App.show_confirm = (args = {}) => {
  let def_args = {
    force: false,
  }

  App.def_args(def_args, args)

  if (args.force) {
    args.confirm_action()
    return
  }

  if (!args.cancel_action) {
    args.cancel_action = () => {}
  }

  let buttons = [
    [`Cancel`, args.cancel_action, true],
    [`Confirm`, args.confirm_action],
  ]

  let on_dismiss = () => {
    if (args.cancel_action) {
      args.cancel_action()
    }
  }

  let on_any_action = () => {
    if (args.on_any_action) {
      args.on_any_action()
    }
  }

  App.show_dialog({
    message: args.message,
    buttons,
    on_dismiss,
    on_any_action,
  })

  App.play_sound(`effect_2`)
}