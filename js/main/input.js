App.setup_input = () => {
  DOM.ev(DOM.el(`#input_submit`), `click`, () => {
    App.input_enter()
  })

  DOM.ev(DOM.el(`#input_clear`), `click`, () => {
    App.clear_input()
  })

  DOM.ev(DOM.el(`#input_close`), `click`, () => {
    App.hide_input()
  })

  DOM.ev(DOM.el(`#input_text`), `keydown`, (e) => {
    if (e.key === `Enter`) {
      if (e.ctrlKey) {
        App.input_enter()
        e.preventDefault()
      }
    }
  })
}

App.show_input = (args = {}) => {
  let def_args = {
    value: ``,
    autosave: false,
    bottom: false,
    wrap: false,
    readonly: false,
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
  let clear_btn = DOM.el(`#input_clear`)
  let submit_btn = DOM.el(`#input_submit`)

  requestAnimationFrame(() => {
    if (args.wrap) {
      textarea.classList.add(`pre_wrap`)
    }
    else {
      textarea.classList.remove(`pre_wrap`)
    }

    if (args.readonly) {
      textarea.setAttribute(`readonly`, `readonly`)
      clear_btn.classList.add(`hidden`)
      submit_btn.classList.add(`hidden`)
    }
    else {
      textarea.removeAttribute(`readonly`)
      clear_btn.classList.remove(`hidden`)
      submit_btn.classList.remove(`hidden`)
    }

    App.focus_textarea(textarea)

    if (args.bottom) {
      App.cursor_at_end(textarea)
    }
  })
}

App.input_enter = () => {
  if (App.input_args.readonly) {
    return
  }

  let ans = App.input_action(DOM.el(`#input_text`).value.trim())

  if (ans) {
    App.hide_input()
  }
}

App.on_input_dismiss = () => {
  if (App.input_args.autosave) {
    App.input_enter()
  }
}

App.clear_input = () => {
  if (App.input_args.readonly) {
    return
  }

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

App.hide_input = () => {
  App.hide_popup(`input`)
}