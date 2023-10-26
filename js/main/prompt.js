App.setup_prompt = () => {
  DOM.ev(DOM.el(`#prompt_submit`), `click`, () => {
    App.prompt_submit()
  })

  DOM.ev(DOM.el(`#prompt_clear`), `click`, () => {
    App.prompt_clear()
  })
}

App.show_prompt = (args = {}) => {
  let def_args = {
    value: ``,
    value_2: ``,
    placeholder: ``,
    placeholder_2: ``,
    suggestions: [],
    focus: 1,
  }

  App.def_args(def_args, args)
  App.start_popups()
  App.set_prompt_list(args.suggestions)
  App.show_popup(`prompt`)
  let input = DOM.el(`#prompt_input`)
  let input_2 = DOM.el(`#prompt_input_2`)
  input.value = args.value
  input.placeholder = args.placeholder

  if (args.double) {
    input_2.classList.remove(`hidden`)
    input_2.value = args.value_2
    input_2.placeholder = args.placeholder_2
  }
  else {
    input_2.classList.add(`hidden`)
  }

  App.prompt_on_submit = args.on_submit

  if (args.focus === 1) {
    input.focus()
  }
  else if (args.focus === 2) {
    input_2.focus()
  }
}

App.prompt_submit = () => {
  let value = DOM.el(`#prompt_input`).value.trim()
  let value_2 = DOM.el(`#prompt_input_2`).value.trim()
  App.hide_popup(`prompt`)
  App.prompt_on_submit(value, value_2)
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