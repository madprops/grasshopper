App.show_input = (message, button, action, value = ``) => {
  App.start_popups()
  App.input_action = action
  DOM.el(`#input_message`).textContent = message
  let textarea = DOM.el(`#input_text`)
  textarea.value = value
  DOM.el(`#input_submit`).textContent = button
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