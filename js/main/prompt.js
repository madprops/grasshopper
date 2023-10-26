App.setup_prompt = () => {
  DOM.ev(DOM.el(`#prompt_submit`), `click`, () => {
    App.prompt_submit()
  })

  DOM.ev(DOM.el(`#prompt_clear`), `click`, () => {
    App.prompt_clear()
  })

  DOM.ev(DOM.el(`#prompt_list`), `click`, (e) => {
    App.show_prompt_list(1, e)
  })

  DOM.ev(DOM.el(`#prompt_list_2`), `click`, (e) => {
    App.show_prompt_list(2, e)
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
  App.set_prompt_suggestions(args.suggestions)
  App.show_popup(`prompt`)
  let input = DOM.el(`#prompt_input_1`)
  let input_2 = DOM.el(`#prompt_input_2`)
  input.value = args.value
  input.placeholder = args.placeholder
  let container_2 = DOM.el(`#prompt_container_2`)

  if (args.double) {
    input_2.classList.remove(`hidden`)
    input_2.value = args.value_2
    input_2.placeholder = args.placeholder_2
    container_2.classList.remove(`hidden`)
  }
  else {
    input_2.classList.add(`hidden`)
    container_2.classList.add(`hidden`)
  }

  let list = DOM.el(`#prompt_list`)
  let list_2 = DOM.el(`#prompt_list_2`)

  if (args.list && args.list.length) {
    list.classList.remove(`hidden`)
  }
  else {
    list.classList.add(`hidden`)
  }

  if (args.list_2 && args.list_2.length) {
    list_2.classList.remove(`hidden`)
  }
  else {
    list_2.classList.add(`hidden`)
  }

  App.prompt_args = args

  if (args.focus === 1) {
    input.focus()
  }
  else if (args.focus === 2) {
    input_2.focus()
  }
}

App.prompt_submit = () => {
  let value = DOM.el(`#prompt_input_1`).value.trim()
  let value_2 = DOM.el(`#prompt_input_2`).value.trim()
  App.hide_popup(`prompt`)
  App.prompt_args.on_submit(value, value_2)
}

App.set_prompt_suggestions = (suggestions) => {
  let c = DOM.el(`#prompt_suggestions`)
  c.innerHTML = ``

  for (let suggestion of suggestions) {
    let option = DOM.create(`option`)
    option.innerHTML = suggestion
    c.append(option)
  }
}

App.prompt_clear = () => {
  DOM.el(`#prompt_input_1`).value = ``
  DOM.el(`#prompt_input_2`).value = ``
}

App.show_prompt_list = (num, e) => {
  let list
  let items = []

  if (num === 1) {
    list = App.prompt_args.list
  }
  else if (num === 2) {
    list = App.prompt_args.list_2
  }

  for (let item of list) {
    items.push({
      text: item,
      action: () => {
        let input = DOM.el(`#prompt_input_${num}`)
        input.value += ` ${item}`
        input.value = input.value.trim()
      },
    })
  }

  App.show_center_context(items, e)
}