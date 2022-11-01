App.setup_mouse = function () {
  let tabs = App.el("#tabs_container")

  // When the button is released
  App.ev(tabs, "click", function (e) {
    if (e.target.closest(".tabs_item")) {
      let el = e.target.closest(".tabs_item")
      let tab = App.get_item_by_id("tabs", el.dataset.id)
      App.open_tab(tab)
    }
  })

  // When tabs get hovered
  App.ev(tabs, "mousemove", function (e) {
    if (e.target.closest(".tabs_item")) {
      let el = e.target.closest(".tabs_item")
      let tab = App.get_item_by_id("tabs", el.dataset.id)
      App.select_item("tabs", tab)
    }
  })

  // When tabs are middle clicked
  App.ev(tabs, "auxclick", function (e) {
    if (e.button === 1) {
      if (e.target.closest(".tabs_item")) {
        let el = e.target.closest(".tabs_item")
        let tab = App.get_item_by_id("tabs", el.dataset.id)
        
        App.confirm_close_tab(tab)
      }
    }
  })

  // On context menu action
  App.ev(tabs, "contextmenu", function (e) {
    if (e.target.closest(".tabs_item")) {
      let el = e.target.closest(".tabs_item")
      let tab = App.get_item_by_id("tabs", el.dataset.id)
      App.show_item_menu("tabs", tab, e.clientX, e.clientY)
      e.preventDefault()
    }
  })

  let closed_tabs = App.el("#closed_tabs_container")

  // On closed tabs click
  App.ev(closed_tabs, "click", function (e) {
    if (e.target.closest(".closed_tabs_item")) {
      let el = e.target.closest(".closed_tabs_item")
      let id = el.dataset.id
      let tab = App.get_item_by_id("closed_tabs", id)
      App.restore_tab(tab)
    }
  })

  // On closed tabs middle click
  App.ev(closed_tabs, "auxclick", function (e) {
    if (e.button === 1) {
      if (e.target.closest(".closed_tabs_item")) {
        let el = e.target.closest(".closed_tabs_item")
        let id = el.dataset.id
        let tab = App.get_item_by_id("closed_tabs", id)
        App.restore_tab(tab, false)
        App.remove_item("closed_tabs", tab)
      }
    }
  })  
  
  // When closed tabs get hovered
  App.ev(closed_tabs, "mousemove", function (e) {   
    if (e.target.closest(".closed_tabs_item")) {
      let el = e.target.closest(".closed_tabs_item")
      let id = el.dataset.id
      let tab = App.get_item_by_id("closed_tabs", id)
      App.select_item("closed_tabs", tab)
    }
  })

  // On context menu action
  App.ev(closed_tabs, "contextmenu", function (e) {
    if (e.target.closest(".closed_tabs_item")) {
      let el = e.target.closest(".closed_tabs_item")
      let id = el.dataset.id
      let tab = App.get_item_by_id("closed_tabs", id)
      App.show_item_menu("closed_tabs", tab, e.clientX, e.clientY)
      e.preventDefault()
    }
  })

  let history = App.el("#history_container")

  // On history item click
  App.ev(history, "click", function (e) {
    if (e.target.closest(".history_item")) {
      let el = e.target.closest(".history_item")
      let id = el.dataset.id
      let item = App.get_item_by_id("history", id)
      App.open_history_item(item)
    }
  })

  // On history middle click
  App.ev(history, "auxclick", function (e) {
    if (e.button === 1) {
      if (e.target.closest(".history_item")) {
        let el = e.target.closest(".history_item")
        let id = el.dataset.id
        let item = App.get_item_by_id("history", id)
        App.open_history_item(item, false)
        App.remove_item("history", item)
      }
    }
  })  
  
  // When history get hovered
  App.ev(history, "mousemove", function (e) {   
    if (e.target.closest(".history_item")) {
      let el = e.target.closest(".history_item")
      let id = el.dataset.id
      let item = App.get_item_by_id("history", id)
      App.select_item("history", item)
    }
  })

  // On context menu action
  App.ev(history, "contextmenu", function (e) {
    if (e.target.closest(".history_item")) {
      let el = e.target.closest(".history_item")
      let id = el.dataset.id
      let item = App.get_item_by_id("history", id)
      App.show_item_menu("history", item, e.clientX, e.clientY)
      e.preventDefault()
    }
  })  

  let stars = App.el("#stars_container")

  // On stars item click
  App.ev(stars, "click", function (e) {
    if (e.target.closest(".stars_item")) {
      let el = e.target.closest(".stars_item")
      let id = el.dataset.id
      let item = App.get_item_by_id("stars", id)
      App.open_stars_item(item)
    }
  })

  // On stars middle click
  App.ev(stars, "auxclick", function (e) {
    if (e.button === 1) {
      if (e.target.closest(".stars_item")) {
        let el = e.target.closest(".stars_item")
        let id = el.dataset.id
        let item = App.get_item_by_id("stars", id)
        App.open_stars_item(item, false)
        App.remove_item("stars", item)
      }
    }
  })  
  
  // When stars get hovered
  App.ev(stars, "mousemove", function (e) {   
    if (e.target.closest(".stars_item")) {
      let el = e.target.closest(".stars_item")
      let id = el.dataset.id
      let item = App.get_item_by_id("stars", id)
      App.select_item("stars", item)
    }
  })

  // On context menu action
  App.ev(stars, "contextmenu", function (e) {
    if (e.target.closest(".stars_item")) {
      let el = e.target.closest(".stars_item")
      let id = el.dataset.id
      let item = App.get_item_by_id("stars", id)
      App.show_item_menu("stars", item, e.clientX, e.clientY)
      e.preventDefault()
    }
  })   
}