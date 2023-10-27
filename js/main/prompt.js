App.setup_prompt = () => {
  DOM.ev(DOM.el(`#prompt_submit`), `click`, () => {
    App.prompt_submit()
  })

  DOM.ev(DOM.el(`#prompt_clear`), `click`, () => {
    App.prompt_clear()
  })

  DOM.ev(DOM.el(`#prompt_list`), `click`, (e) => {
    App.show_prompt_list()
  })

  DOM.el(`#prompt_list`).textContent = App.smiley_icon
}

App.show_prompt = (args = {}) => {
  let def_args = {
    value: ``,
    placeholder: ``,
    suggestions: [],
    list_submit: false,
    word_mode: false,
    ignore_words: [],
    highlight: false,
    append: false,
  }

  App.def_args(def_args, args)
  App.start_popups()
  App.set_prompt_suggestions(args.suggestions)
  App.show_popup(`prompt`)
  let input = DOM.el(`#prompt_input`)
  input.value = args.value
  input.placeholder = args.placeholder
  let list = DOM.el(`#prompt_list`)

  if (args.list && args.list.length) {
    list.classList.remove(`hidden`)
  }
  else {
    list.classList.add(`hidden`)
  }

  App.prompt_args = args
  input.focus()

  if (args.show_list !== 0) {
    App.show_prompt_list()
  }

  if (args.highlight) {
    input.select()
  }
}

App.prompt_submit = () => {
  let value = DOM.el(`#prompt_input`).value
  value = App.single_space(value).trim()
  App.hide_popup(`prompt`)
  App.prompt_args.on_submit(value)
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
  DOM.el(`#prompt_input`).value = ``
}

App.show_prompt_list = () => {
  let items = []
  let input = DOM.el(`#prompt_input`)
  let args = App.prompt_args
  let valid = []
  let list = args.list

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
        if (args.append) {
          input.value += ` ${item}`
        }
        else {
          input.value = item
        }

        input.value = App.single_space(input.value).trim()
        input.focus()

        if (args.list_submit) {
          App.prompt_submit()
        }
      },
    })
  }

  let btn = DOM.el(`#prompt_list`)
  App.show_context({items: items, element: btn})
}