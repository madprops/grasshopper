App.show_input = (args = {}) => {
  let def_args = {
    value: ``,
  }

  App.def_args(def_args, args)
  App.start_popups()
  App.input_action = args.action
  DOM.el(`#input_message`).textContent = args.message
  let textarea = DOM.el(`#input_text`)
  textarea.value = args.value
  DOM.el(`#input_submit`).textContent = args.button
  App.show_popup(`input`)

  requestAnimationFrame(() => {
    App.focus_textarea(textarea)
  })
}

App.input_enter = () => {
  let ans = App.input_action(DOM.el(`#input_text`).value.trim())

  if (ans) {
    App.hide_popup(`input`)
  }
}