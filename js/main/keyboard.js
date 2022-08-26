App.setup_keyboard = function () {
  App.ev(document, "keydown", function (e) {
    if (App.layout !== "main") {
      return
    }

    if (NeedContext.open) {
      return
    }

    App.focus_filter()

    if (e.key === "Enter") {
      if (e.shiftKey) {
        if (App.selected_item) {
          let item = App.selected_item
          App.select_next_item(item)
          App.toggle_favorite(item)
        }
      } else {
        if (App.selected_item) {
          App.open_tab(App.selected_item)
        }
      }

      e.preventDefault()
    } else if (e.key === "ArrowUp") {
      let item = App.get_prev_visible_item(App.selected_item)

      if (item) {
        App.select_item(item)
      }

      e.preventDefault()
    } else if (e.key === "ArrowDown") {
      let item = App.get_next_visible_item(App.selected_item)

      if (item) {
        App.select_item(item)
      }

      e.preventDefault()
    } else if (e.key === "Tab") {
      if (e.shiftKey) {
        App.show_both()
      } else {
        App.change_mode()
      }

      e.preventDefault()
    } else if (e.key === "Delete") {
      App.clear_filter()
      App.do_filter()
      e.preventDefault()
    } else if (e.key === " ") {
      if (e.shiftKey) {
        App.show_item_menu(App.selected_item)
        e.preventDefault()
      }
    }
  })
}