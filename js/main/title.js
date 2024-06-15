App.create_title = (mode) => {
  let el = DOM.create(`div`, `title`)
  let inner = DOM.create(`div`, `title_inner`)
  el.append(inner)

  let title = App.get_setting(`title`)

  if (title) {
    inner.textContent = title

    DOM.ev(el, `contextmenu`, (e) => {
      let cmds = [
        `edit_main_title`,
        `copy_main_title`,
      ]

      e.preventDefault()
      let items = App.cmd_list(cmds)
      App.show_context({items: items, e: e})
    })
  }
  else {
    el.classList.add(`hidden`)
  }

  return el
}

App.edit_main_title = () => {
  console.log(1)
}

App.copy_main_title = () => {
  console.log(2)
}