App.setup_mouse = function () {
  let container = App.el("#tabs")

  // When the button is released
  App.ev(container, "click", function (e) {
    if (e.target.closest(".tabs_item")) {
      let el = e.target.closest(".tabs_item")
      let tab = App.get_tab_by_id(el.dataset.id)

      if (e.target.closest(".tabs_close")) {
        App.close_tab(tab)
      } else {
        App.open_tab(tab)
      }
    }
  })

  // When tabs get hovered
  App.ev(container, "mouseover", function (e) {
    if (App.mouse_over_disabled) {
      return
    }

    if (e.target.closest(".tabs_item")) {
      let el = e.target.closest(".tabs_item")
      let tab = App.get_tab_by_id(el.dataset.id)
      App.select_tab({tab: tab, scroll: false})
    }
  })

  // When tabs are middle clicked
  App.ev(container, "auxclick", function (e) {
    if (e.button === 1) {
      if (e.target.closest(".tabs_item")) {
        let el = e.target.closest(".tabs_item")
        let tab = App.get_tab_by_id(el.dataset.id)
        
        App.close_tab(tab)
      }
    }
  })

  // On context menu action
  App.ev(container, "contextmenu", function (e) {
    if (e.target.closest(".tabs_item")) {
      let el = e.target.closest(".tabs_item")
      let tab = App.get_tab_by_id(el.dataset.id)
      App.show_tab_menu(tab, e.clientX, e.clientY)
      e.preventDefault()
    }
  })

  let ctc = App.el("#closed_tabs_container")

  // On closed tabs click
  App.ev(ctc, "click", function (e) {
    if (e.target.closest(".closed_tabs_item")) {
      let el = e.target.closest(".closed_tabs_item")
      let index = el.dataset.index
      let tab = App.closed_tabs[index]

      if (e.target.closest(".closed_tabs_open")) {
        App.restore_tab(tab, false)
        App.remove_closed_tab(tab)
      } else {
        App.restore_tab(tab)
      }
    }
  })

  // On closed tabs middle click
  App.ev(ctc, "auxclick", function (e) {
    if (e.button === 1) {
      if (e.target.closest(".closed_tabs_item")) {
        let el = e.target.closest(".closed_tabs_item")
        let index = el.dataset.index
        let tab = App.closed_tabs[index]
        App.restore_tab(tab, false)
        App.remove_closed_tab(tab)
      }
    }
  })  
  
  // When closed tabs get hovered
  App.ev(ctc, "mouseover", function (e) {   
    if (App.mouse_over_disabled) {
      return
    }

    if (e.target.closest(".closed_tabs_item")) {
      let el = e.target.closest(".closed_tabs_item")
      let index = el.dataset.index
      let tab = App.closed_tabs[index]
      App.select_closed_tab(tab)
    }
  })

  // On context menu action
  App.ev(ctc, "contextmenu", function (e) {
    if (e.target.closest(".closed_tabs_item")) {
      let el = e.target.closest(".closed_tabs_item")
      let index = el.dataset.index
      let tab = App.closed_tabs[index]
      App.show_closed_tab_menu(tab, e.clientX, e.clientY)
      e.preventDefault()
    }
  })

  let hc = App.el("#history_container")

  // On history item click
  App.ev(hc, "click", function (e) {
    if (e.target.closest(".history_item")) {
      let el = e.target.closest(".history_item")
      let index = el.dataset.index
      let item = App.history_items[index]

      if (e.target.closest(".history_open")) {
        App.open_history_item(item, false)
      } else {
        App.open_history_item(item)
      }

      App.remove_history_item(item)
    }
  })

  // On history middle click
  App.ev(hc, "auxclick", function (e) {
    if (e.button === 1) {
      if (e.target.closest(".history_item")) {
        let el = e.target.closest(".history_item")
        let index = el.dataset.index
        let item = App.history_items[index]
        App.open_history_item(item, false)
        App.remove_history_item(item)
      }
    }
  })  
  
  // When history get hovered
  App.ev(hc, "mouseover", function (e) {   
    if (App.mouse_over_disabled) {
      return
    }

    if (e.target.closest(".history_item")) {
      let el = e.target.closest(".history_item")
      let index = el.dataset.index
      let item = App.history_items[index]
      console.log(item)
      App.select_history_item(item)
    }
  })

  // On context menu action
  App.ev(hc, "contextmenu", function (e) {
    if (e.target.closest(".history_item")) {
      let el = e.target.closest(".history_item")
      let index = el.dataset.index
      let item = App.history_items[index]
      App.show_history_item_menu(item, e.clientX, e.clientY)
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

// Enable and disable mouse over
App.flash_mouse_over = function () {
  App.disable_mouse_over()
  App.enable_mouse_over()
}