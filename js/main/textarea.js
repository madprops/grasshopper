App.show_textarea = (args = {}) => {
  let def_args = {
    simple: false,
    buttons: [],
    align: `center`,
    readonly: true,
    bottom: false,
    wrap: false,
    monospace: false,
  }

  App.def_args(def_args, args)
  args.text = args.text.trim()
  App.start_popups()
  let textarea = DOM.el(`#textarea_text`)
  let simplearea = DOM.el(`#textarea_simple`)
  let title = DOM.el(`#textarea_title`)

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
    simplearea.textContent = args.text

    if (args.monospace) {
      simplearea.classList.add(`monospace`)
    }
    else {
      simplearea.classList.remove(`monospace`)
    }
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
  }

  let img = DOM.el(`#textarea_image`)

  if (args.image) {
    DOM.show(img)
    img.src = args.image
  }
  else {
    DOM.hide(img)
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
        btn.action()
      })

      c.append(b)
    }
  }
  else {
    DOM.hide(`#textarea_custom_buttons`)
    DOM.show(`#textarea_buttons`)
  }

  if (args.align === `center`) {
    DOM.el(`#textarea_simple`).classList.add(`center`)
    DOM.el(`#textarea_simple`).classList.remove(`left`)
  }
  else if (args.align === `left`) {
    DOM.el(`#textarea_simple`).classList.add(`left`)
    DOM.el(`#textarea_simple`).classList.remove(`center`)
  }

  App.textarea_args = args
  App.textarea_text = args.text
  App.show_popup(`textarea`)

  requestAnimationFrame(() => {
    App.focus_textarea(textarea)

    if (args.bottom) {
      App.cursor_at_end(textarea)
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

App.textarea_enter = () => {
  if (App.textarea_args.on_enter) {
    App.textarea_args.on_enter()
  }
}