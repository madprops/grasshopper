App.setup_addlist = () => {
  App.addlist_commands = App.settings_commands()

  App.create_popup({
    id: `addlist_pool`, element: App.addlist_register({id: `pool`, setting: `background_pool`,
    widgets: [`text`, `select`, `select`], labels: [`Image URL`, `Effect`, `Tiles`], title: `BG Pool`, image: 0,
    sources: [undefined, App.background_effects, App.background_tiles]})
  })

  App.create_popup({
    id: `addlist_custom_filters`, element: App.addlist_register({id: `custom_filters`, setting: `custom_filters`,
    widgets: [`text`], labels: [`Filter`], title: `Custom Filters`})
  })

  App.create_popup({
    id: `addlist_aliases`, element: App.addlist_register({id: `aliases`, setting: `aliases`,
    widgets: [`text`, `text`], labels: [`Term 1`, `Term 2`], title: `Aliases`})
  })

  App.create_popup({
    id: `addlist_extra_menu`, element: App.addlist_register({id: `extra_menu`, setting: `extra_menu`,
    widgets: [`text`, `select`], labels: [`Name`, `Command`], title: `Extra Menu`,
    sources: [undefined, App.addlist_commands.slice(0)]})
  })

  App.create_popup({
    id: `addlist_empty_menu`, element: App.addlist_register({id: `empty_menu`, setting: `empty_menu`,
    widgets: [`text`, `select`], labels: [`Name`, `Command`], title: `Empty Menu`,
    sources: [undefined, App.addlist_commands.slice(0)]})
  })

  App.create_popup({
    id: `addlist_footer_menu`, element: App.addlist_register({id: `footer_menu`, setting: `footer_menu`,
    widgets: [`text`, `select`], labels: [`Name`, `Command`], title: `Footer Menu`,
    sources: [undefined, App.addlist_commands.slice(0)]})
  })

  App.create_popup({
    id: `addlist_keyboard_shortcuts`, element: App.addlist_register({id: `keyboard_shortcuts`, setting: `keyboard_shortcuts`,
    widgets: [`key`, `select`], labels: [`Key`, `Command`], title: `Keyboard Shortcuts`,
    sources: [undefined, App.addlist_commands.slice(0)]})
  })
}

App.addlist_values = (id) => {
  let oargs = App.addlist_oargs(id)
  let values = []

  for (let [i, w] of oargs.widgets.entries()) {
    let value = App.addlist_get_value(i, w)

    if (value) {
      values.push(value)
    }
  }

  return values
}

App.do_addlist = (id) => {
  let oargs = App.addlist_oargs(id)
  let values = App.addlist_values(id)

  if (values.length !== oargs.widgets.length) {
    return
  }

  let data = App.addlist_data
  let v1 = ``

  if (data.update && data.items.length) {
    v1 = data.items[0]
  }

  if (v1) {
    App.addlist_remove(id, v1, true)
  }

  let v2 = values[0]

  if (v2 && (v1 !== v2)) {
    App.addlist_remove(id, v2, true)
  }

  let new_line = values.join(` ; `)

  if (new_line) {
    let lines = App.get_setting(oargs.setting)
    lines.splice(data.index, 0, new_line)
    App.after_addlist(oargs.id, lines)
    App.addlist_use(false)
  }
}

App.addlist_register = (args = {}) => {
  let def_args = {
    labels: [],
    sources: [],
  }

  args = Object.assign(def_args, args)
  let container = DOM.create(`div`, `flex_column_center addlist_container`, `addlist_container_${args.id}`)
  container.tabIndex = 0
  let top = DOM.create(`div`, `flex_row_center gap_3 full_width`)
  let title = DOM.create(`div`, `addlist_title`)
  title.textContent = args.title
  let btn_prev = DOM.create(`div`, `button`, `addlist_prev_${args.id}`)
  btn_prev.textContent = `<`
  let btn_next = DOM.create(`div`, `button`, `addlist_next_${args.id}`)
  btn_next.textContent = `>`

  DOM.ev(btn_prev, `click`, () => {
    App.addlist_next(args.id, true)
  })

  DOM.ev(btn_next, `click`, () => {
    App.addlist_next(args.id)
  })

  top.append(btn_prev)
  top.append(title)
  top.append(btn_next)
  container.append(top)
  let els = []

  for (let [i, w] of args.widgets.entries()) {
    let id = `addlist_widget_${args.id}_${i}`

    if (w === `text`) {
      let el = DOM.create(`input`, `text addlist_text`, id)
      el.type = `text`
      el.spellcheck = false
      el.autocomplete = false
      el.placeholder = args.labels[i] || `Value`
      els.push(el)
    }
    else if (w === `select`) {
      let el = DOM.create(`div`, `flex_column_center gap_1`)
      let label = DOM.create(`div`)
      label.textContent = args.labels[i] || `Select`

      App[`addlist_menubutton_${args.id}_${i}`] = App.create_menubutton({
        id: id, opts: args.sources[i],
      })

      let mb = App[`addlist_menubutton_${args.id}_${i}`]
      el.append(label)
      el.append(mb.container)
      els.push(el)
    }
    else if (w === `key`) {
      let el = DOM.create(`input`, `text addlist_text`, id)
      el.type = `text`
      el.spellcheck = false
      el.autocomplete = false
      el.placeholder = args.labels[i] || `Key`

      DOM.ev(el, `keydown`, (e) => {
        el.value = e.code
        e.preventDefault()
      })

      els.push(el)
    }
  }

  if (args.image !== undefined) {
    DOM.ev(els[args.image], `input`, () => {
      App.update_image(args.id)
    })

    let img = DOM.create(`img`, `small_image hidden`, `addlist_image_${args.id}`)

    DOM.ev(img, `load`, (e) => {
      e.target.classList.remove(`hidden`)
    })

    DOM.ev(img, `error`, (e) => {
      e.target.classList.add(`hidden`)
    })

    container.append(img)
  }

  container.append(...els)
  let btns = DOM.create(`div`, `flex_row_center gap_1 addlist_buttons`)
  let use = DOM.create(`div`, `button`, `addlist_use_${args.id}`)
  use.textContent = `Use`
  let remove = DOM.create(`div`, `button`, `addlist_remove_${args.id}`)
  remove.textContent = `Remove`
  let add = DOM.create(`div`, `button`, `addlist_add_${args.id}`)
  add.textContent = `Add`
  let move = DOM.create(`div`, `button`, `addlist_move_${args.id}`)
  move.textContent = `Move`

  DOM.ev(add, `click`, () => {
    App.do_addlist(args.id)
  })

  DOM.ev(remove, `click`, () => {
    let data = App.addlist_data

    if (data.update && data.items.length) {
      App.addlist_remove(args.id, data.items[0])
    }
  })

  DOM.ev(move, `click`, (e) => {
    App.addlist_move_menu(e)
  })

  DOM.ev(use, `click`, () => {
    App.hide_popup()
    App.addlist_use()
  })

  btns.append(use)
  btns.append(remove)
  btns.append(move)
  btns.append(add)
  container.append(btns)
  App[`addlist_args_${args.id}`] = args
  return container
}

App.addlist_items = (full) => {
  let items = []

  if (full.includes(`;`)) {
    let split = full.split(`;`)

    for (let item of split) {
      items.push(item.trim())
    }
  }
  else {
    items.push(full)
  }

  return items
}

App.addlist = (args = {}) => {
  let def_args = App.addlist_def_args()
  args = Object.assign(def_args, args)
  App.show_popup(`addlist_${args.id}`)
  App.check_addlist_buttons(args)
  let oargs = App.addlist_oargs(args.id)

  for (let [i, w] of oargs.widgets.entries()) {
    let value = args.items[i] || ``
    let el = App.addlist_widget(args.id, i)

    if (w === `image`) {
      el.src = value
    }
    else {
      if (w === `text` || w === `key`) {
        el.value = value
      }
      else if (w === `select`) {
        if (value) {
          App[`addlist_menubutton_${args.id}_${i}`].set(value)
        }
        else {
          App[`addlist_menubutton_${args.id}_${i}`].set(oargs.sources[i][0].value)
        }
      }
    }
  }

  if (oargs.image !== undefined) {
    App.update_image(args.id)
  }

  App.addlist_data = args
  App.addlist_check_focus(args.id)
}

App.addlist_remove = (id, value, force) => {
  if (!value) {
    return
  }

  let oargs = App.addlist_oargs(id)
  let lines = App.get_setting(oargs.setting)

  if (!lines.length) {
    return
  }

  App.show_confirm(`Remove item?`, () => {
    let new_lines = []

    for (let line of lines) {
      let items = App.addlist_items(line)

      if (!items.length) {
        continue
      }

      if (items[0] === value) {
        continue
      }

      new_lines.push(line)
    }

    App.after_addlist(oargs.id, new_lines)
  }, undefined, force)
}

App.addlist_click = (args = {}) => {
  if (!args.line) {
    if (!args.e.target.value.trim()) {
      App.addlist({id: args.id})
      return
    }

    args.line = App.get_line_under_caret(args.e.target)
  }

  if (!args.line) {
    return
  }

  if (args.index === undefined) {
    let lines = args.e.target.value.split(`\n`)
    args.index = lines.indexOf(args.line)
  }

  let items = App.addlist_items(args.line)

  if (!items) {
    return
  }

  let obj = {
    id: args.id,
    items: items,
    use: args.use,
    line: args.line,
    index: args.index,
    update: true,
  }

  App.addlist(obj)
}

App.addlist_enter = () => {
  let data = App.addlist_data
  let modified = App.addlist_modified(data.id)

  if (data.use && !modified) {
    App.hide_popup()
    App.addlist_use()
  }
  else {
    App.do_addlist(data.id)
  }
}

App.addlist_left = () => {
  App.addlist_next(App.addlist_data.id, true)
}

App.addlist_right = () => {
  App.addlist_next(App.addlist_data.id)
}

App.after_addlist = (id, lines) => {
  let oargs = App.addlist_oargs(id)
  App.set_setting(oargs.setting, lines)
  let area = DOM.el(`#settings_${oargs.setting}`)
  area.value = App.get_textarea_setting_value(oargs.setting)
  App.check_theme_refresh()
  App.hide_popup()
}

App.check_addlist_buttons = (args) => {
  let use_el = DOM.el(`#addlist_use_${args.id}`)
  let remove_el = DOM.el(`#addlist_remove_${args.id}`)
  let move_el = DOM.el(`#addlist_move_${args.id}`)
  let add_el = DOM.el(`#addlist_add_${args.id}`)
  let prev_el = DOM.el(`#addlist_prev_${args.id}`)
  let next_el = DOM.el(`#addlist_next_${args.id}`)

  if (args.update) {
    remove_el.classList.remove(`hidden`)
    move_el.classList.remove(`hidden`)
    prev_el.classList.remove(`hidden`)
    next_el.classList.remove(`hidden`)
    add_el.textContent = `Update`
  }
  else {
    remove_el.classList.add(`hidden`)
    move_el.classList.add(`hidden`)
    prev_el.classList.add(`hidden`)
    next_el.classList.add(`hidden`)
    add_el.textContent = `Add`
  }

  if (args.use) {
    use_el.classList.remove(`hidden`)
  }
  else {
    use_el.classList.add(`hidden`)
  }
}

App.addlist_def_args = () => {
  return {
    update: false,
    items: [],
  }
}

App.addlist_widget = (id, i = 0) => {
  return DOM.el(`#addlist_widget_${id}_${i}`)
}

App.update_image = (id) => {
  let oargs = App.addlist_oargs(id)
  let img = DOM.el(`#addlist_image_${oargs.id}`)
  let el = App.addlist_widget(id, oargs.image)
  let url = el.value.trim()

  if (!App.is_url(url)) {
    url = `/img/${url}`
  }

  img.src = url
}

App.addlist_use = (force = true) => {
  let data = App.addlist_data

  if (data.use) {
    App.show_confirm(`Use this now?`, () => {
      let values = App.addlist_values(data.id)
      data.use(values)
    }, undefined, force)
  }
}

App.addlist_next = (id, reverse = false) => {
  let data = App.addlist_data
  let oargs = App.addlist_oargs(id)
  let lines = App.get_setting(oargs.setting).slice(0)

  if (lines.length <= 1) {
    return
  }

  let index

  if (reverse) {
    if (data.index === undefined) {
      index = 0
    }
    else if (data.index <= 0) {
      index = lines.length - 1
    }
    else {
      index = data.index - 1
    }
  }
  else {
    if (data.index === undefined) {
      index = 0
    }
    else if (data.index >= (lines.length - 1)) {
      index = 0
    }
    else {
      index = data.index + 1
    }
  }

  data.index = index
  data.line = lines[index]
  App.addlist_click(data)
}

App.addlist_check_focus = (id) => {
  let oargs = App.addlist_oargs(id)
  let data = App.addlist_data

  for (let [i, w] of oargs.widgets.entries()) {
    let el = App.addlist_widget(id, i)

    if (data.update) {
      DOM.el(`#addlist_container_${id}`).focus()
    }
    else {
      el.focus()
    }

    return
  }
}

App.addlist_modified = (id) => {
  let data = App.addlist_data

  if (!data.items.length) {
    return
  }

  let oargs = App.addlist_oargs(id)

  for (let [i, w] of oargs.widgets.entries()) {
    let value = App.addlist_get_value(i, w)

    if (data.items[i] !== value) {
      return true
    }
  }

  return false
}

App.addlist_move_menu = (e) => {
  let items = []

  items.push({
    text: `Move Up`,
    action: () => {
      App.addlist_move(`up`)
    }
  })

  items.push({
    text: `Move Down`,
    action: () => {
      App.addlist_move(`down`)
    }
  })

  e.preventDefault()
  NeedContext.show(e.clientX, e.clientY, items)
}

App.addlist_move = (dir) => {
  let data = App.addlist_data
  let oargs = App.addlist_oargs(data.id)
  let lines = App.get_setting(oargs.setting)
  let value = data.items[0]

  for (let [i, line] of lines.entries()) {
    let items = App.addlist_items(line)

    if (!items.length) {
      continue
    }

    if (items[0] === value) {
      if (dir === `up`) {
        if (i > 0 && i < lines.length) {
          [lines[i], lines[i - 1]] = [lines[i - 1], lines[i]]
        }
      }
      else if (dir === `down`) {
        if (i >= 0 && i < lines.length - 1) {
          [lines[i], lines[i + 1]] = [lines[i + 1], lines[i]]
        }
      }

      App.after_addlist(oargs.id, lines)
      break
    }
  }
}

App.addlist_get_value = (i, w) => {
  let id = App.addlist_data.id
  let el = App.addlist_widget(id, i)
  let value

  if (w === `text` || w === `key`) {
    value = el.value.trim()
  }
  else if (w === `select`) {
    value = App[`addlist_menubutton_${id}_${i}`].value
  }

  return value
}

App.addlist_oargs = (id) => {
  return App[`addlist_args_${id}`]
}