App.setup_prompt = () => {
  App.create_popup({
    id: `prompt`,
    setup: () => {
      DOM.ev(DOM.el(`#prompt_submit`), `click`, () => {
        App.prompt_submit()
      })
    },
  })
}

App.show_prompt = (placeholder, on_submit) => {
  App.show_popup(`prompt`)
  let input = DOM.el(`#prompt_input`)
  input.value = ``
  input.placeholder = placeholder
  App.prompt_on_submit = on_submit
  input.focus()
}

App.prompt_submit = () => {
  let value = DOM.el(`#prompt_input`).value.trim()
  App.hide_popup(`prompt`)
  App.prompt_on_submit(value)
}