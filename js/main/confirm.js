// Setup confirm
App.setup_confirm = function () {
  App.create_popup({
    id: "confirm",
    setup: function () {
      App.ev(App.el("#confirm_yes"), "click", function () {
        App.confirm_yes()
      })
    
      App.ev(App.el("#confirm_no"), "click", function () {
        App.confirm_no()
      })
    }
  })
}

// Show confirm window
App.show_confirm = function (message, action) {
  App.confirm_action = action
  App.el("#confirm_message").textContent = message
  App.show_popup("confirm")
}

// Confirm yes
App.confirm_yes = function () {
  App.confirm_action()
  App.popups.confirm.hide()
}

// Confirm no
App.confirm_no = function () {
  App.popups.confirm.hide()
}