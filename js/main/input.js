App.setup_input = () => {
  DOM.ev(DOM.el(`#input_submit`), `click`, () => {
    App.input_enter()
  })

  DOM.ev(DOM.el(`#input_clear`), `click`, () => {
    App.clear_input()
  })
}

App.show_input = (args = {}) => {
  let def_args = {
    value: ``,
    autosave: false,
    bottom: false,
    wrap: false,
  }

  App.def_args(def_args, args)
  App.start_popups()
  App.input_action = args.action
  DOM.el(`#input_message`).textContent = args.message
  let textarea = DOM.el(`#input_text`)
  textarea.value = args.value
  DOM.el(`#input_submit`).textContent = args.button
  App.input_args = args
  App.show_popup(`input`)

  requestAnimationFrame(() => {
    if (args.wrap) {
      textarea.classList.add(`pre_wrap`)
    }
    else {
      textarea.classList.remove(`pre_wrap`)
    }

    if (args.readonly) {
      textarea.setAttribute(`readonly`, `readonly`)
    }
    else {
      textarea.removeAttribute(`readonly`)
    }

    App.focus_textarea(textarea)

    if (args.bottom) {
      App.cursor_at_end(textarea)
    }
  })
}

App.input_enter = () => {
  let ans = App.input_action(DOM.el(`#input_text`).value.trim())

  if (ans) {
    App.hide_popup(`input`)
  }
}

App.on_input_dismiss = () => {
  if (App.input_args.autosave) {
    App.input_enter()
  }
}

App.clear_input = () => {
  let textarea = DOM.el(`#input_text`)

  if (!textarea.value) {
    return
  }

  App.show_confirm({
    message: `Clear text?`,
    confirm_action: () => {
      textarea.value = ``
      App.focus_textarea(textarea)
    },
  })
}