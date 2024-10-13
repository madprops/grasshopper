// This is meant only to show information not edit it
App.show_textarea = (args = {}) => {
  let def_args = {
    simple: false,
    buttons: [],
    align: `center`,
  }

  App.def_args(def_args, args)
  args.text = args.text.trim()
  App.start_popups()
  let textarea = DOM.el(`#textarea_text`)
  let simplearea = DOM.el(`#textarea_simple`)
  let title = DOM.el(`#textarea_title`)

  if (args.title) {
    DOM.show(title)
    title.textContent = args.title
  }
  else {
    DOM.hide(title)
  }

  if (args.simple) {
    DOM.hide(textarea)
    DOM.show(simplearea)
    simplearea.textContent = args.text
  }
  else {
    DOM.hide(simplearea)
    DOM.show(textarea)
    textarea.value = args.text
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
        App.close_textarea()
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

  App.textarea_text = args.text
  App.show_popup(`textarea`)

  requestAnimationFrame(() => {
    App.focus_textarea(textarea)
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