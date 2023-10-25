App.setup_prompt = () => {
  DOM.ev(DOM.el(`#prompt_submit`), `click`, () => {
    App.prompt_submit()
  })

  DOM.ev(DOM.el(`#prompt_clear`), `click`, () => {
    App.prompt_clear()
  })
}

App.show_prompt = (value, placeholder, on_submit) => {
  App.start_popups()
  App.show_popup(`prompt`)
  let input = DOM.el(`#prompt_input`)
  input.value = value || ``
  input.placeholder = placeholder
  App.prompt_on_submit = on_submit
  input.focus()
}

App.prompt_submit = () => {
  let value = DOM.el(`#prompt_input`).value.trim()
  App.hide_popup(`prompt`)
  App.prompt_on_submit(value)
}

App.set_prompt_list = (suggestions) => {
  let prompt_list = DOM.el(`#prompt_list`)
  prompt_list.innerHTML = ``

  for (let suggestion of suggestions) {
    let option = DOM.create(`option`)
    option.innerHTML = suggestion
    prompt_list.append(option)
  }
}

App.prompt_clear = () => {
  DOM.el(`#prompt_input`).value = ``
}