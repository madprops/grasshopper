App.setup_list = function () {
  let list = App.el("#list")

  // When list items are clicked
  App.ev(list, "click", function (e) {
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_url(App.get_items(), el.dataset.url)

      if (e.target.closest(".item_icon_container")) {
        App.selected_item = undefined
        App.toggle_favorite(item)
      } else if (e.target.closest(".item_text")) {
        App.open_tab(item)
      }
    }
  })

  // When list items are clicked
  App.ev(list, "auxclick", function (e) {
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_url(App.get_items(), el.dataset.url)
      App.open_tab(item, false)
    }
  })

  // When list items get hovered
  App.ev(list, "mouseover", function (e) {
    if (App.mouse_over_disabled) {
      return
    }
    
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_url(App.get_items(), el.dataset.url)
      App.select_item(item, false)
    }
  })
}