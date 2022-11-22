// Create a popup
App.create_popup = function (args) {
  let p = {}
  p.setup = false
  
  let popup = App.create("div", "popup_main", `popup_${args.id}`)
  let container = App.create("div", "popup_container", `popup_container_${args.id}`)
  container.innerHTML = App.get_template(args.id)
  popup.append(container)
  
  App.ev(popup, "click", function (e) {
    if (!e.target.closest(".popup_container")) {
      App.popups[args.id].hide()
    }
  })

  App.el("#main").append(popup)
  p.element = popup

  p.show = function () {
    if (args.setup && !App.popups[args.id].setup) {
      args.setup()
    }
    
    p.element.style.display = "flex"
  }
  
  p.hide = function () {
    p.element.style.display = "none"
  }
  
  App.popups[args.id] = p
}

// Show popup
App.show_popup = function (id) {
  App.popups[id].show()
}

// Setup popups
App.setup_popups = function () {
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

  App.create_popup({
    id: "alert"
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

// Show alert
App.show_alert = function (message) {
  App.el("#alert_message").textContent = message
  App.show_popup("alert")
}