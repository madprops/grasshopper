// Setup mouse for window
App.setup_window_mouse = function (mode) {
  let container = App.el(`#${mode}_container`)

  App.ev(container, "click", function (e) {
    if (e.target.closest(`.${mode}_item`)) {
      let el = e.target.closest(`.${mode}_item`)
      let item = App.get_item_by_id(mode, el.dataset.id)
      App[`${mode}_action`](item)
    }
  })

  App.ev(container, "mousemove", function (e) {
    if (e.target.closest(`.${mode}_item`)) {
      let el = e.target.closest(`.${mode}_item`)
      let item = App.get_item_by_id(mode, el.dataset.id)
      App.select_item(mode, item)
    }
  })

  App.ev(container, "contextmenu", function (e) {
    if (e.target.closest(`.${mode}_item`)) {
      let el = e.target.closest(`.${mode}_item`)
      let item = App.get_item_by_id(mode, el.dataset.id)
      App.show_item_menu(mode, item, e.clientX, e.clientY)
      e.preventDefault()
    }
  })  

  if (mode === "tabs") {
    App.ev(container, "auxclick", function (e) {
      if (e.button === 1) {
        if (e.target.closest(`.${mode}_item`)) {
          let el = e.target.closest(`.${mode}_item`)
          let item = App.get_item_by_id(mode, el.dataset.id)
          App.close_tab(item)
        }
      }
    })
  }  
}

// Setup mouse for each window
App.setup_mouse = function () {
  App.setup_window_mouse("tabs")
  App.setup_window_mouse("stars")
  App.setup_window_mouse("closed")
  App.setup_window_mouse("history") 
}