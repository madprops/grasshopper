App.setup_prompt = () => {
  DOM.ev(`#prompt_submit`, `click`, () => {
    App.prompt_submit()
  })

  DOM.ev(`#prompt_clear`, `click`, () => {
    App.prompt_clear()
  })

  DOM.ev(`#prompt_list`, `click`, (e) => {
    App.show_prompt_list()
  })

  DOM.ev(`#prompt_fill`, `click`, (e) => {
    App.fill_prompt()
  })

  DOM.ev(`#prompt_reveal`, `click`, (e) => {
    App.reveal_prompt()
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
    unique_words: false,
    ignore_words: [],
    append: false,
    show_list: false,
    password: false,
    list: [],
    fill: ``,
  }

  App.def_args(def_args, args)
  App.start_popups()
  App.set_prompt_suggestions(args.suggestions)
  App.show_popup(`prompt`)
  let input = DOM.el(`#prompt_input`)
  input.value = args.value
  input.placeholder = args.placeholder
  let prompt_mode = App.get_setting(`prompt_mode`)
  let reveal = DOM.el(`#prompt_reveal`)

  if (args.password) {
    input.type = `password`
    DOM.show(reveal)
  }
  else {
    input.type = `text`
    DOM.hide(reveal)
  }

  let list = DOM.el(`#prompt_list`)

  if (args.list.length) {
    DOM.show(list)
  }
  else {
    DOM.hide(list)
  }

  if (args.fill) {
    DOM.show(`#prompt_fill`)
  }
  else {
    DOM.hide(`#prompt_fill`)
  }

  App.prompt_fill = args.fill
  App.prompt_args = args
  input.focus()

  if (args.show_list) {
    App.show_prompt_list(`show_list`)
  }

  if ((prompt_mode === `highlight`) && !args.show_list) {
    input.select()
  }
  else {
    App.input_deselect(input)

    if (prompt_mode === `at_start`) {
      App.input_at_start(input)
    }
    else if (prompt_mode === `at_end`) {
      App.input_at_end(input)
    }
  }
}

App.prompt_submit = () => {
  let value = DOM.el(`#prompt_input`).value
  value = App.single_space(value).trim()
  App.hide_popup(`prompt`)
  App.prompt_args.on_submit(value)
}

App.on_prompt_dismiss = () => {
  if (App.prompt_args.on_dismiss) {
    App.prompt_args.on_dismiss()
  }
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
  let input = DOM.el(`#prompt_input`)
  input.value = ``
  input.focus()
}

App.show_prompt_list = (from = `click`) => {
  let args = App.prompt_args
  let input = DOM.el(`#prompt_input`)
  let valid = []

  if (args.word_mode) {
    let words = input.value.split(` `).map(x => x.trim())

    for (let item of args.list) {
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
    for (let item of args.list) {
      if (input.value === item) {
        continue
      }

      valid.push(item)
    }
  }

  if (!valid.length) {
    if (from === `click`) {
      App.alert(`No more items to add`)
    }

    return
  }

  let items = []

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

        if (args.unique_words) {
          let words = input.value.split(` `).map(x => x.trim())
          let unique = Array.from(new Set(words))
          input.value = unique.join(` `)
        }

        if (args.list_submit) {
          App.prompt_submit()
        }
      },
    })
  }

  let btn = DOM.el(`#prompt_list`)

  App.show_context({
    items,
    element: btn,
    after_hide: () => {
      input.focus()

      if (args.highlight) {
        input.select()
      }
    },
  })
}

App.fill_prompt = () => {
  if (App.prompt_fill) {
    let input = DOM.el(`#prompt_input`)
    input.value = App.prompt_fill
    input.focus()
  }
}

App.reveal_prompt = () => {
  let input = DOM.el(`#prompt_input`)

  if (input.type === `password`) {
    input.type = `text`
  }
  else {
    input.type = `password`
  }
}