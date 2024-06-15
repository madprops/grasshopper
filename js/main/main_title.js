App.create_main_title = (mode) => {
  let el = DOM.create(`div`, `main_title`)
  let inner = DOM.create(`div`, `main_title_inner`)
  el.append(inner)

  let title = App.get_setting(`main_title`)
  inner.textContent = title

  DOM.ev(el, `contextmenu`, (e) => {
    let cmds = [
      `edit_main_title`,
      `copy_main_title`,
    ]

    e.preventDefault()
    let items = App.cmd_list(cmds, true)
    App.show_context({items: items, e: e})
  })

  return el
}

App.check_main_titles = () => {
  let els = DOM.els(`.main_title_inner`)
  let title = App.get_setting(`main_title`)

  for (let el of els) {
    el.textContent = title

    if (title) {
      el.classList.remove(`hidden`)
    }
    else {
      el.classList.add(`hidden`)
    }
  }
}

App.edit_main_title = () => {
  App.show_prompt({
    value: App.get_setting(`main_title`),
    placeholder: `Title`,
    on_submit: (ans) => {
      let title = ans.trim()
      App.set_setting(`main_title`, title)
      App.check_main_titles()
    },
  })
}

App.copy_main_title = () => {
  App.copy_to_clipboard(App.get_setting(`main_title`), `title`)
}