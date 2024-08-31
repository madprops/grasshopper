// This is meant only to show information not edit it
App.show_textarea = (message, text, simple = false) => {
  App.start_popups()
  let textarea = DOM.el(`#textarea_text`)
  DOM.el(`#textarea_message`).textContent = message
  textarea.value = text

  if (simple) {
    textarea.classList.add(`textarea_simple`)
    textarea.rows = 1
  }
  else {
    textarea.classList.remove(`textarea_simple`)
    textarea.removeAttribute(`rows`)
  }

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