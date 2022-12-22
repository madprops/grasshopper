// Setup mouse for window
App.setup_window_mouse = function (mode) {
  let container = App.el(`#${mode}_container`)

  App.ev(container, "mousedown", function (e) {
    if (!e.target.closest(`.${mode}_item`)) {
      return
    }

    let item = App.get_cursor_item(mode, e)

    // Main click
    if (e.button === 0) {
      if (e.shiftKey) {
        App.highlight_range(item)
      }
    }
  })

  App.ev(container, "mouseup", function (e) {
    if (!e.target.closest(`.${mode}_item`)) {
      return
    }

    let item = App.get_cursor_item(mode, e)

    // Main click
    if (e.button === 0) {
      if (e.shiftKey) {
        return
      }

      if (e.ctrlKey) {
        App.toggle_highlight(item)
        App.last_highlight = item
        return
      }

      if (e.target.closest(".item_info")) {
        if (e.target.closest(".item_info_pin")) {
          App.toggle_pin(item)
        }

        return
      }

      App[`${mode}_action`](item)
    }
    // Middle click
    else if (e.button === 1) {
      if (e.ctrlKey) {
        return
      }

      App[`${mode}_action_alt`](item, e.shiftKey)
    }
  })

  App.ev(container, "contextmenu", function (e) {
    if (e.target.closest(`.${mode}_item`)) {
      App.show_item_menu(App.get_cursor_item(mode, e), e.clientX, e.clientY)
      e.preventDefault()
    }
  })

  App.ev(container, "mousemove", function (e) {
    if (e.target.closest(`.${mode}_item`)) {
      let item = App.get_cursor_item(mode, e)
      App.update_footer_info(item)
    }
  })
}

// Get item under cursor
App.get_cursor_item = function (mode, e) {
  let el = e.target.closest(`.${mode}_item`)
  let item = App.get_item_by_id(mode, el.dataset.id)
  return item
}