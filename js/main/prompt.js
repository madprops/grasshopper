App.setup_prompt = () => {
  DOM.ev(DOM.el(`#prompt_submit`), `click`, () => {
    App.prompt_submit()
  })

  DOM.ev(DOM.el(`#prompt_clear`), `click`, () => {
    App.prompt_clear()
  })

  DOM.ev(DOM.el(`#prompt_list_1`), `click`, (e) => {
    App.show_prompt_list(1)
  })

  DOM.ev(DOM.el(`#prompt_list_2`), `click`, (e) => {
    App.show_prompt_list(2)
  })

  DOM.el(`#prompt_list_1`).textContent = App.smiley_icon
  DOM.el(`#prompt_list_2`).textContent = App.smiley_icon
}

App.show_prompt = (args = {}) => {
  let def_args = {
    value: ``,
    value_2: ``,
    placeholder: ``,
    placeholder_2: ``,
    suggestions: [],
    suggestions_2: [],
    focus: 1,
    show_list: 0,
    list_submit: 0,
    word_mode: false,
    ignore_words: [],
  }

  App.def_args(def_args, args)
  App.start_popups()
  App.set_prompt_suggestions(1, args.suggestions)
  App.set_prompt_suggestions(2, args.suggestions_2)
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

  let list_1 = DOM.el(`#prompt_list_1`)
  let list_2 = DOM.el(`#prompt_list_2`)

  if (args.list && args.list.length) {
    list_1.classList.remove(`hidden`)
  }
  else {
    list_1.classList.add(`hidden`)
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

  if (args.show_list !== 0) {
    App.show_prompt_list(args.show_list)
  }
}

App.prompt_submit = () => {
  let value_1 = DOM.el(`#prompt_input_1`).value
  value_1 = App.single_space(value_1).trim()
  let value_2 = DOM.el(`#prompt_input_2`).value
  value_2 = App.single_space(value_2).trim()
  App.hide_popup(`prompt`)
  App.prompt_args.on_submit(value_1, value_2)
}

App.set_prompt_suggestions = (num, suggestions) => {
  let c = DOM.el(`#prompt_suggestions_${num}`)
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

App.show_prompt_list = (num) => {
  let list
  let items = []
  let input = DOM.el(`#prompt_input_${num}`)
  let args = App.prompt_args
  let valid = []

  if (num === 1) {
    list = args.list
  }
  else if (num === 2) {
    list = args.list_2
  }

  if (args.word_mode) {
    let words = input.value.split(` `).map(x => x.trim())

    for (let item of list) {
      if (words.includes(item)) {
        continue
      }

      if (args.ignore_words.includes(item)) {
        continue
      }

      valid.push(item)
    }
  }
  else {
    for (let item of list) {
      if (input.value === item) {
        continue
      }

      valid.push(item)
    }
  }

  if (!valid.length) {
    return
  }

  for (let item of valid) {
    items.push({
      text: item,
      action: () => {
        if (args.word_mode) {
          input.value += ` ${item}`
        }
        else {
          input.value = item
        }

        input.value = App.single_space(input.value).trim()
        input.focus()

        if (args.list_submit === num) {
          App.prompt_submit()
        }
      },
    })
  }

  let btn = DOM.el(`#prompt_list_${num}`)
  App.show_context({items: items, element: btn})
}