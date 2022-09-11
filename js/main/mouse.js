App.setup_mouse = function () {
  let list = App.el("#lists")

  // When list items are clicked
  App.ev(list, "click", function (e) {
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_id(el.dataset.id)

      if (e.target.closest(".item_close")) {
        App.close_tab(item)
      } else {
        if (e.target.closest(".item_icon_container")) {
          App.show_item_menu(item)
        } else if (e.target.closest(".item_text")) {
          App.open_tab(item)
        }      
      }
    }
  })

  // When list items get hovered
  App.ev(list, "mouseover", function (e) {
    if (App.mouse_over_disabled) {
      return
    }
    
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_id(el.dataset.id)
      App.select_item(item, false)
    }
  })

  // When list items are middle clicked
  App.ev(list, "auxclick", function (e) {
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
}