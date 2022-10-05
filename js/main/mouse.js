App.setup_mouse = function () {
  let container = App.el("#tabs")

  // When the button is pressed
  App.ev(App.el("#main"), "mousedown", function (e) {
    App.first_mousedown = true
  })  

  // When the button is released
  App.ev(container, "mouseup", function (e) {
    if (e.button !== 0 || !App.first_mousedown) {
      return
    }

    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_id(el.dataset.id)

      if (e.target.closest(".item_close")) {
        App.close_tab(item)
      } else {
        App.open_tab(item)
      }
    }
  })

  // When items get hovered
  App.ev(container, "mouseover", function (e) {
    if (App.mouse_over_disabled) {
      return
    }
    
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_id(el.dataset.id)
      App.select_item({item: item, scroll: false})
    }
  })

  // When items are middle clicked
  App.ev(container, "auxclick", function (e) {
    if (e.button === 1) {
      if (e.target.closest(".item")) {
        let el = e.target.closest(".item")
        let item = App.get_item_by_id(el.dataset.id)
        
        App.close_tab(item)
      }
    }
  })

  App.ev(container, "contextmenu", function (e) {
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_id(el.dataset.id)
      App.show_item_menu(item, e.clientX, e.clientY)
      e.preventDefault()
    } else if (e.target.closest("#tabs")) {
      App.show_tabs_menu(e.clientX, e.clientY)
      e.preventDefault()
    }
  })
}

// Disable mouse over
App.disable_mouse_over = function () {
  App.mouse_over_disabled = true
}

// Enable mouse over with a timeout
App.enable_mouse_over = function () {
  clearTimeout(App.enable_mouse_over_timeout)

  App.enable_mouse_over_timeout = setTimeout(function () {
    App.mouse_over_disabled = false
  }, App.disable_mouse_delay)
}