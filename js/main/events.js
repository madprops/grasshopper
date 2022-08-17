App.setup_events = function () {
  document.addEventListener("keydown", function (e) {
    App.focus_filter()

    if (e.key === "Enter") {
      if (App.selected_item) {
        App.open_tab(App.selected_item.url)
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
    }
  })
}