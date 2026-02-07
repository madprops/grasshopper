App.show_textarea = (args = {}) => {
  let def_args = {
    text: ``,
    simple: false,
    buttons: [],
    align: `center`,
    readonly: true,
    left: false,
    bottom: false,
    wrap: false,
    monospace: false,
    single_line: false,
    only_image: false,
    image_size: `normal`,
    enter_action: false,
    shift_enter: false,
    format: true,
    fluid: false,
  }

  App.def_args(def_args, args)
  args.text = args.text.trim()
  App.start_popups()
  let textarea = DOM.el(`#textarea_text`)
  let simplearea = DOM.el(`#textarea_simple`)
  let title = DOM.el(`#textarea_title`)
  let image = DOM.el(`#textarea_image`)

  if (args.title) {
    DOM.show(title)
    let text = args.title

    if (args.title_icon) {
      text = `${args.title_icon} ${text}`
    }

    title.textContent = text
  }
  else {
    DOM.hide(title)
  }

  if (args.simple) {
    DOM.hide(textarea)
    DOM.show(simplearea)
    let text = args.text.toString()

    function action(regex, func, full = false) {
      text = text.replace(regex, (match, g1) => {
        if (full) {
          return func(match)
        }

        return func(g1)
      })
    }

    if (args.format) {
      text = text.replace(/<\/ ?blockquote>/g, ``)
    }

    text = App.make_html_safe(text)

    if (args.format) {
      action(App.char_regex_3(`\``), App.to_bold)
      action(App.char_regex_3(`"`), App.to_bold, true)
      action(App.char_regex_1(`*`, 2), App.to_bold)
      action(App.char_regex_1(`*`), App.to_bold)
      action(App.char_regex_2(`_`, 2), App.to_bold)
      action(App.char_regex_2(`_`), App.to_bold)
    }

    text = text.replace(/\n/g, `<br>`)

    simplearea.innerHTML = text

    if (args.monospace) {
      simplearea.classList.add(`monospace`)
    }
    else {
      simplearea.classList.remove(`monospace`)
    }

    if (args.wrap) {
      simplearea.classList.add(`pre_wrap`)
    }
    else {
      simplearea.classList.remove(`pre_wrap`)
    }
  }
  else if (args.only_image) {
    DOM.hide(textarea)
    DOM.hide(simplearea)
  }
  else {
    DOM.hide(simplearea)
    DOM.show(textarea)
    textarea.value = args.text

    if (args.readonly) {
      textarea.readOnly = true
    }
    else {
      textarea.readOnly = false
    }

    if (args.wrap) {
      textarea.classList.add(`pre_wrap`)
    }
    else {
      textarea.classList.remove(`pre_wrap`)
    }

    if (args.single_line) {
      textarea.classList.add(`single_line`)
      textarea.rows = 1
    }
    else {
      textarea.classList.remove(`single_line`)
      textarea.rows = undefined
    }
  }

  if (args.image_size === `normal`) {
    image.classList.add(`normal`)
    image.classList.remove(`big`)
  }
  else if (args.image_size === `big`) {
    image.classList.add(`big`)
    image.classList.remove(`normal`)
  }

  if (args.fluid) {
    textarea.classList.add(`fluid`)
  }
  else {
    textarea.classList.remove(`fluid`)
  }

  if (args.image) {
    DOM.show(image)
    image.src = args.image
  }
  else {
    DOM.hide(image)
  }

  if (args.buttons.length) {
    DOM.hide(`#textarea_buttons`)
    DOM.show(`#textarea_custom_buttons`)
    let c = DOM.el(`#textarea_custom_buttons`)
    c.innerHTML = ``

    for (let btn of args.buttons) {
      let b = DOM.create(`div`, `button`)
      b.textContent = btn.text

      DOM.ev(b, `click`, () => {
        btn.action(textarea.value)
      })

      c.append(b)
    }
  }
  else {
    DOM.hide(`#textarea_custom_buttons`)
    DOM.show(`#textarea_buttons`)
  }

  textarea.classList.remove(`center`)

  if (args.align === `center`) {
    simplearea.classList.add(`center`)
    simplearea.classList.remove(`left`)

    if (args.single_line) {
      textarea.classList.add(`center`)
    }
  }
  else if (args.align === `left`) {
    simplearea.classList.add(`left`)
    simplearea.classList.remove(`center`)
  }

  App.textarea_args = args
  App.textarea_text = args.text
  App.show_popup(`textarea`)

  if (args.after_show) {
    args.after_show()
  }

  requestAnimationFrame(() => {
    App.focus_textarea(textarea)

    if (args.bottom) {
      App.cursor_at_end(textarea)
    }

    if (args.left) {
      App.scroll_to_left(textarea)
    }
  })
}

App.textarea_copy = () => {
  App.close_textarea()
  App.copy_to_clipboard(App.textarea_text)
}

App.focus_textarea = (el) => {
  el.focus()
  el.selectionStart = 0
  el.selectionEnd = 0
  App.scroll_to_top(el)
}

App.close_textarea = () => {
  App.hide_popup(`textarea`)
}

App.clear_textarea = () => {
  let textarea = DOM.el(`#textarea_text`)
  textarea.value = ``
  App.focus_textarea(textarea)
}

App.on_textarea_dismiss = () => {
  if (App.textarea_args.on_dismiss) {
    App.textarea_args.on_dismiss()
  }
}

App.check_textarea_focus = () => {
  if (App.popup_is_open(`textarea`)) {
    DOM.el(`#textarea_text`).focus()
  }
}

App.textarea_enter = (e, force = false) => {
  if (!App.textarea_args.on_enter) {
    return false
  }

  if (!force && !App.textarea_args.enter_action) {
    return false
  }

  if (App.textarea_args.shift_enter) {
    if (!e.shiftKey) {
      return false
    }
  }
  else if (e.shiftKey) {
    return false
  }

  if (App.textarea_args.ctrl_enter) {
    if (!e.ctrlKey) {
      return false
    }
  }
  else if (e.ctrlKey) {
    return false
  }

  let text = App.get_textarea_text()
  App.textarea_args.on_enter(text)
  return true
}

App.get_textarea_text = () => {
  return DOM.el(`#textarea_text`).value
}