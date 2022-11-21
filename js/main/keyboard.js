// Setup bindings for window
App.check_window_keyboard = function (e) {
  let mode = App.window_mode
  App.focus_filter(mode)

  if (e.key === "Enter") {
    let item = App[`selected_${mode}_item`]

    if (e.shiftKey) {
      let rect = item.element.getBoundingClientRect()
      App.show_item_menu(item, rect.left, rect.top)
    } else {
      let filter = App.el(`#${mode}_filter`).value.trim()

      if (filter.startsWith("?")) {
        App.search(filter)
      } else {
        App[`${mode}_action`](item)
      }
    }

    e.preventDefault()
  } else if (e.key === "ArrowUp") {
    App.select_item_above(mode)
    e.preventDefault()
  } else if (e.key === "ArrowDown") {
    App.select_item_below(mode)
    e.preventDefault()
  }
}

// Setup keybindings
App.setup_keyboard = function () {
  App.ev(document, "keydown", function (e) {
    if (NeedContext.open) {
      if (e.shiftKey && e.key === "Enter") {
        NeedContext.hide()
      }

      return
    }

    if (App.window_mode === "star_editor") {
      if (e.key === "Enter") {
        App.star_editor_save()
        e.preventDefault()
      }

      return
    }

    if (e.key === "Tab") {
      if (!e.ctrlKey) {
        App.cycle_item_windows(e.shiftKey)
        e.preventDefault()
        return
      }
    }

    if (App.item_order.includes(App.window_mode)) {
      App.check_window_keyboard(e)
    }
  })
}

// Perform a search
App.search = function (s) {
  let q = encodeURIComponent(s.replace(/^\?+/, "").trim())
  App.new_tab(App.settings.search_engine + q)
}