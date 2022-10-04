App.setup_mouse = function () {
  let lists = App.el("#lists")

  // When the button is pressed
  App.ev(App.el("#main"), "mousedown", function (e) {
    App.first_mousedown = true
  })  

  // When the button is released
  App.ev(lists, "mouseup", function (e) {
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

  // When list items get hovered
  App.ev(lists, "mouseover", function (e) {
    if (App.mouse_over_disabled) {
      return
    }
    
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_id(el.dataset.id)
      App.select_item({item: item, scroll: false})
    }
  })

  // When list items are middle clicked
  App.ev(lists, "auxclick", function (e) {
    if (e.button === 1) {
      if (e.target.closest(".item")) {
        let el = e.target.closest(".item")
        let item = App.get_item_by_id(el.dataset.id)
        
        if (item.list === "tabs") {
          App.close_tab(item)
        } else {
          App.open_tab(item, false)
        }
      }
    }
  })

  App.ev(lists, "contextmenu", function (e) {
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