App.create_result = (mode) => {
  return DOM.create(`div`, `result action`, `${mode}_result`)
}

App.show_result = (mode, text) => {
  let item = DOM.el(`#${mode}_result`)
  item.textContent = text
  item.classList.add(`result_active`)
}

App.hide_result = (mode) => {
  DOM.el(`#${mode}_result`).classList.remove(`result_active`)
}

App.result_copy = (mode) => {
  let value = DOM.el(`#${mode}_result`).textContent.trim()
  App.copy_to_clipboard(value, `Result`)
}