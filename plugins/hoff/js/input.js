// Setup mouse events
App.setup_mouse = () => {
  let add_button = DOM.el(`#add_button`)

  DOM.ev(add_button, `click`, () => {
    App.add_task()
  })

  DOM.ev(DOM.el(`#remove_button`), `click`, () => {
    App.remove_tasks_dialog()
  })

  DOM.ev(DOM.el(`#info_button`), `click`, () => {
    App.show_info()
  })

  let container = DOM.el(`#tasks`)

  DOM.ev(container, `click`, (e) => {
    if (e.target.closest(`.task`)) {
      let el = e.target.closest(`.task`)
      let id = el.dataset.id

      if (e.target.closest(`.task_check`)) {
        App.toggle_check(e, id)
      }
      else if (e.target.closest(`.task_remove`)) {
        App.remove_task(el)
        App.check_first()
      }
    }
  })

  let main = DOM.el(`#main`)

  DOM.ev(main, `dragover`, (e) => {
    if (e.dataTransfer.types.includes(`Files`)) {
      e.preventDefault()
      return false
    }

    App.on_dragover(e)
    e.preventDefault()
    return false
  })

  DOM.ev(main, `dragend`, (e) => {
    if (e.dataTransfer.types.includes(`Files`)) {
      e.preventDefault()
      return false
    }

    App.on_dragend(e)
  })
}

// Setup keyboard events
App.setup_keyboard = () => {
  App.filter = App.create_debouncer(() => {
    App.do_filter()
  }, 250)

  App.on_input = App.create_debouncer((input) => {
    App.do_on_input(input)
  }, 500)

  DOM.ev(document, `keydown`, (e) => {
    App.check_focus()

    if (e.key === `Enter`) {
      App.add_task()
      e.preventDefault()
    }
    else if (e.key === `Escape`) {
      if (App.popup_open) {
        App.hide_all_popups()
      }
      else if (App.filter_focused()) {
        App.clear_filter()
      }
      else if (App.input_focused()) {
        App.clear_input()
      }

      e.preventDefault()
    }

    else if (e.key === `ArrowUp`) {
      App.move_input(`up`)
      e.preventDefault()
    }
    else if (e.key === `ArrowDown`) {
      App.move_input(`down`)
      e.preventDefault()
    }
    else if (e.key === `Tab`) {
      if (e.shiftKey) {
        App.move_input(`up`)
      }
      else {
        App.move_input(`down`)
      }

      e.preventDefault()
    }
    else {
      if (App.filter_focused()) {
        App.filter()
      }
    }
  })
}