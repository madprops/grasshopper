// Setup mouse for window
App.setup_window_mouse = function (mode) {
  let container = App.el(`#${mode}_container`)

  App.ev(container, "mousemove", function (e) {
    if (e.target.closest(`.${mode}_item`)) {
      if (App.select_blocked) {
        return
      }

      let item = App.get_cursor_item(mode, e  )
      App.highlight_range(item)
      App.select_item(item)
    }
  })  

  App.ev(container, "click", function (e) {
    if (e.target.closest(`.${mode}_item`)) {
      let item = App.get_cursor_item(mode, e)

      if (e.target.closest(".item_info")) {
        if (e.target.closest(".item_info_pin")) {
          App.toggle_pin(item)
        }
      } else {
        App[`${mode}_action`](item, e.shiftKey)
      }
    }
  })

  App.ev(container, "mousedown", function (e) {
    if (e.shiftKey) {
      App.selection_mouse_down = true
      App.selection_moved = 0
    }
  }) 

  App.ev(document, "mouseup", function () {
    App.selection_mouse_down = false
    App.selection_mode = undefined
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