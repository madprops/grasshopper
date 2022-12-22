// Create a popup
App.create_popup = function (args) {
  let p = {}
  p.setup = false

  let popup = App.create("div", "popup_main", `popup_${args.id}`)
  let container = App.create("div", "popup_container", `popup_container_${args.id}`)
  container.innerHTML = App.get_template(args.id)
  popup.append(container)

  App.ev(popup, "click", function (e) {
    if (e.target.isConnected && !e.target.closest(".popup_container")) {
      App.popups[args.id].hide()
    }
  })

  App.el("#main").append(popup)
  p.element = popup

  p.show = function () {
    if (args.setup && !p.setup) {
      args.setup()
      p.setup = true
      console.info(`${args.id} popup setup`)
    }

    p.element.style.display = "flex"
    App.popup_mode = args.id
    App.popup_open = true
  }

  p.hide = function () {
    p.element.style.display = "none"
    App.popup_open = false
  }

  App.popups[args.id] = p
}

// Show popup
App.show_popup = function (id) {
  App.popups[id].show()
}

// Hide popup
App.hide_popup = function (id) {
  App.popups[id].hide()
}

// Setup popups
App.setup_popups = function () {
  App.create_popup({
    id: "alert"
  })

  App.create_popup({
    id: "dialog"
  })

  App.create_popup({
    id: "textarea", setup: function () {
      App.ev(App.el("#textarea_copy"), "click", function () {
        App.textarea_copy()
      })
    }
  })

  App.create_popup({
    id: "input", setup: function () {
      App.ev(App.el("#input_submit"), "click", function () {
        App.input_enter()
      })
    }
  })
}

// Show alert
App.show_alert = function (message, autohide_delay = 0) {
  clearTimeout(App.alert_autohide)
  App.el("#alert_message").textContent = message
  App.show_popup("alert")

  if (autohide_delay > 0) {
    App.alert_autohide = setTimeout(function () {
      App.hide_popup("alert")
    }, autohide_delay)
  }
}

// Show a message that autohides
App.show_feedback = function (message) {
  App.show_alert(message, App.alert_autohide_delay)
}

// Show dialog with a list of buttons
App.show_dialog = function (message, buttons) {
  App.el("#dialog_message").textContent = message
  let btns = App.el("#dialog_buttons")
  btns.innerHTML = ""

  for (let button of buttons) {
    let btn = App.create("div", "button")
    btn.textContent = button[0]

    App.ev(btn, "click", function () {
      App.hide_popup("dialog")
      button[1]()
    })

    if (button[2]) {
      btn.classList.add("button_2")
    }

    btns.append(btn)
    button.element = btn
  }

  App.dialog_buttons = buttons
  App.focus_dialog_button(buttons.length - 1)
  App.show_popup("dialog")
}

// Focus dialog button
App.focus_dialog_button = function (index) {
  for (let [i, btn] of App.dialog_buttons.entries()) {
    if (i === index) {
      btn.element.classList.add("hovered")
    }
    else {
      btn.element.classList.remove("hovered")
    }
  }

  App.dialog_index = index
}

// Focus left button in dialog
App.dialog_left = function () {
  if (App.dialog_index > 0) {
    App.focus_dialog_button(App.dialog_index - 1)
  }
}

// Focus right button in dialog
App.dialog_right = function () {
  if (App.dialog_index < App.dialog_buttons.length - 1) {
    App.focus_dialog_button(App.dialog_index + 1)
  }
}

// Dialog action
App.dialog_enter = function () {
  App.hide_popup("dialog")
  App.dialog_buttons[App.dialog_index][1]()
}

// Show a confirm dialog template
App.show_confirm = function (message, confirm_action, cancel_action) {
  if (!cancel_action) {
    cancel_action = function () {}
  }

  let buttons = [
    ["Cancel", cancel_action, true],
    ["Confirm", confirm_action]
  ]

  App.show_dialog(message, buttons)
}

// Show textarea
App.show_textarea = function (message, text) {
  App.el("#textarea_message").textContent = message
  App.el("#textarea_text").value = text
  App.show_popup("textarea")
}

// Copy textarea to clipboard
App.textarea_copy = function () {
  App.hide_popup("textarea")
  App.copy_to_clipboard(App.el("#textarea_text").value.trim())
}

// Show input
App.show_input = function (message, button, action) {
  App.input_action = action
  App.el("#input_message").textContent = message
  let  input_text = App.el("#input_text")
  input_text.value = ""
  App.el("#input_submit").textContent = button
  App.show_popup("input")
  input_text.focus()
}

// On input enter
App.input_enter = function () {
  App.hide_popup("input")
  App.input_action(App.el("#input_text").value.trim())
}