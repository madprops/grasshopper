App.show_textarea = (message, text) => {
  App.start_popups()
  let textarea = DOM.el(`#textarea_text`)
  DOM.el(`#textarea_message`).textContent = message
  textarea.value = text
  App.show_popup(`textarea`)

  requestAnimationFrame(() => {
    App.focus_textarea(textarea)
  })
}

App.textarea_copy = () => {
  App.hide_popup(`textarea`)
  App.copy_to_clipboard(DOM.el(`#textarea_text`).value.trim())
}

App.focus_textarea = (el) => {
  el.focus()
  el.selectionStart = 0
  el.selectionEnd = 0
  App.scroll_to_top(el)
}