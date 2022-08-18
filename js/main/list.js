App.setup_list = function () {
  let list = App.el("#list")

  // When list items are clicked
  list.addEventListener("click", function (e) {
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_url(App.get_items(), el.dataset.url)

      if (e.target.closest(".item_icon_container")) {
        if (App.config.max_favorites > 0) {
          if (item.favorite) {
            App.remove_favorite(item)
          } else {
            App.add_favorite(item)
          }
        }
      } else if (e.target.closest(".item_text")) {
        App.open_tab(item.url)
      }
    }
  })

  // When list items are clicked
  list.addEventListener("auxclick", function (e) {
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_url(App.get_items(), el.dataset.url)
      App.open_tab(item.url, false)
    }
  })

  // When list items get hovered
  list.addEventListener("mouseover", function (e) {
    if (e.target.closest(".item")) {
      let el = e.target.closest(".item")
      let item = App.get_item_by_url(App.get_items(), el.dataset.url)
      App.select_item(item, false)
    }
  })

  // On mousewheel event
  list.addEventListener("wheel", function (e) {
    if (e.target.closest(".item_icon_container")) {
      if (App.mode !== "favorites") {
        return
      }

      let el = e.target.closest(".item")
      let item = App.get_item_by_url(App.get_items(), el.dataset.url)
      let direction = e.deltaY > 0 ? "down" : "up"
      
      if (direction === "down") {
        App.move_item_down(item)
      } else {
        App.move_item_up(item)
      }

      e.preventDefault()
    }
  })  
}