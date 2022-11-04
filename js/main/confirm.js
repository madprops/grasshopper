// Setup confirm
App.setup_confirm = function () {
  App.create_window({id: "confirm", show_top: false, setup: function () {
    App.ev(App.el("#confirm_button"), "click", function () {
      App.run_confirm_action()
    })

    App.ev(App.el("#confirm_cancel_button"), "click", function () {
      App.show_last_window()
    })
  }})
}

// Show confirm window
App.show_confirm = function (title, message, action) {
  App.el("#confirm_title").textContent = title
  App.el("#confirm_message").textContent = message
  App.confirm_action = action
  App.show_window("confirm")
}

// Do confirm action
App.run_confirm_action = function () {
  App.confirm_action()
  App.show_last_window()
}