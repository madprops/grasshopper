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
    App.popup_open = true
    App.popup_mode = args.id
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
    id: "confirm",
    setup: function () {
      App.ev(App.el("#confirm_yes"), "click", function () {
        App.confirm_yes()
      })
    
      App.ev(App.el("#confirm_no"), "click", function () {
        App.confirm_no()
      })

      App.ev(App.el("#confirm_yes"), "mouseenter", function () {
        App.focus_confirm_yes()
      })
    
      App.ev(App.el("#confirm_no"), "mouseenter", function () {
        App.focus_confirm_no()
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
  App.focus_confirm_yes()
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

// Focus the no button
App.focus_confirm_no = function () {
  App.el("#confirm_no").classList.add("colored")
  App.el("#confirm_yes").classList.remove("colored")
  App.confirm_mode = "no"
}

// Focus the yes button
App.focus_confirm_yes = function () {
  App.el("#confirm_no").classList.remove("colored")
  App.el("#confirm_yes").classList.add("colored")
  App.confirm_mode = "yes"
}

// Confirm action yes or no
App.confirm_enter = function () {
  if (App.confirm_mode === "yes") {
    App.confirm_yes()
  } else {
    App.confirm_no()
  }
}