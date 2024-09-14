// This is meant only to show information not edit it
App.show_textarea = (message, text, simple = false) => {
  text = text.trim()
  App.start_popups()
  let textarea = DOM.el(`#textarea_text`)
  let simplearea = DOM.el(`#textarea_simple`)
  DOM.el(`#textarea_message`).textContent = message

  if (simple) {
    DOM.hide(textarea)
    DOM.show(simplearea)
    simplearea.textContent = text
  }
  else {
    DOM.hide(simplearea)
    DOM.show(textarea)
    textarea.value = text
  }

  App.textarea_text = text
  App.show_popup(`textarea`)

  requestAnimationFrame(() => {
    App.focus_textarea(textarea)
  })
}

App.textarea_copy = () => {
  App.hide_popup(`textarea`)
  App.copy_to_clipboard(App.textarea_text)
}

App.focus_textarea = (el) => {
  el.focus()
  el.selectionStart = 0
  el.selectionEnd = 0
  App.scroll_to_top(el)
}