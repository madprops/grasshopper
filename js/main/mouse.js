// Setup mouse for window
App.setup_window_mouse = function (mode) {
  let container = App.el(`#${mode}_container`)

  App.ev(container, "mousemove", function (e) {
    if (e.target.closest(`.${mode}_item`)) {
      App.last_mousemove_e = e

      if (App.select_blocked) {
        return
      }

      if (e.target.closest(".selected")) {
        return
      }

      let item = App.get_cursor_item(mode, e)
      App.select_item(item, "none")
    }
  })

  App.ev(container, "mouseover", function (e) {
    if (e.target.closest(`.${mode}_item`)) {
      if (App.selection_mouse_down) {
        let item = App.get_cursor_item(mode, e)
        App.highlight_range(item)
      }
    }
  })

  App.ev(container, "mousedown", function (e) {
    if (e.button !== 0) {
      return
    }

    if (e.shiftKey) {
      App.selection_mouse_down = true
      App.selection_moved = 0

      if (e.target.closest(`.${mode}_item`)) {
        let item = App.get_cursor_item(mode, e)
        App.highlight_range(item)
      }
    }
  })

  App.ev(container, "mouseup", function (e) {
    if (e.button !== 0) {
      return
    }

    if (e.target.closest(`.${mode}_item`)) {
      let item = App.get_cursor_item(mode, e)

      if (e.target.closest(".item_info")) {
        if (e.target.closest(".item_info_pin")) {
          App.toggle_pin(item)
        }

        return
      }

      if (e.shiftKey) {
        return
      }

      if (e.ctrlKey) {
        App.toggle_highlight(item)
        App.last_highlight = item
      }

      else if (e.shiftKey) {
        App.highlight_range(item)
      }

      else {
        App[`${mode}_action`](item)
      }
    }
  })

  App.ev(document, "mouseup", function () {
    App.selection_mouse_down = false
  })

  App.ev(container, "auxclick", function (e) {
    if (e.button === 1) {
      if (e.target.closest(`.${mode}_item`)) {
        let item = App.get_cursor_item(mode, e)
        App[`${mode}_action_alt`](item, e.shiftKey)
      }
    }
  })

  App.ev(container, "contextmenu", function (e) {
    if (e.target.closest(`.${mode}_item`)) {
      App.show_item_menu(App.get_cursor_item(mode, e), e.clientX, e.clientY)
      e.preventDefault()
    }
  })
}

// Get item under cursor
App.get_cursor_item = function (mode, e) {
  let el = e.target.closest(`.${mode}_item`)
  let item = App.get_item_by_id(mode, el.dataset.id)
  return item
}