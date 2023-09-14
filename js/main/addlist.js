App.addlist_values = (id) => {
  let oargs = App.addlist_oargs(id)
  let values = {}

  for (let [i, key] of oargs.keys.entries()) {
    let w = oargs.widgets[i]
    let value = App.addlist_get_value(i, w)
    values[key] = value
  }

  return values
}

App.addlist_save = (id) => {
  let data = App.addlist_data

  if (data.edit) {
    let modified = App.addlist_modified(id)

    if (!modified) {
      App.hide_addlist(false)
      return false
    }
  }

  let line = App.addlist_values(id)
  let filled = App.addlist_filled(line)

  if (!filled) {
    return false
  }

  let oargs = App.addlist_oargs(id)
  let v1 = ``

  if (data.edit && Object.keys(data.items).length) {
    v1 = data.items[oargs.pk]
  }

  if (v1) {
    App.addlist_remove(id, v1, true)
  }

  let v2 = line[oargs.pk]

  if (v2 && (v1 !== v2)) {
    App.addlist_remove(id, v2, true)
  }

  let lines = App.addlist_get_data(id)
  line._date_ = App.now()
  lines.splice(data.index, 0, line)
  App.after_addlist(id, lines)
  return true
}

App.addlist_register = (args = {}) => {
  let def_args = {
    labels: [],
    sources: [],
  }

  args = Object.assign(def_args, args)
  let container = DOM.create(`div`, `flex_column_center addlist_container`, `addlist_container_${args.id}`)
  container.tabIndex = 0
  let top = DOM.create(`div`, `flex_row_center gap_2 full_width`)
  let title = DOM.create(`div`, `addlist_title`)
  title.textContent = args.title || `List`
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
  let date = DOM.create(`div`, `addlist_date hidden`, `addlist_date_${args.id}`)
  container.append(date)
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
      let el = DOM.create(`input`, `text addlist_text addlist_key`, id)
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
    else if (w === `checkbox`) {
      let el = DOM.create(`div`, `flex_column_center gap_1`)
      let checkbox = DOM.create(`input`, `checkbox addlist_checkbox`, id)
      checkbox.type = `checkbox`
      let label = DOM.create(`div`)
      label.textContent = args.labels[i] || `Checkbox`
      el.append(label)
      el.append(checkbox)
      els.push(el)
    }
  }

  container.append(...els)
  let btns = DOM.create(`div`, `flex_row_center gap_1 addlist_buttons`)
  let use = DOM.create(`div`, `button`, `addlist_use_${args.id}`)
  use.textContent = `Use`
  let remove = DOM.create(`div`, `button`, `addlist_remove_${args.id}`)
  remove.textContent = `Rem`
  let save = DOM.create(`div`, `button`, `addlist_save_${args.id}`)
  save.textContent = `Save`
  let move = DOM.create(`div`, `button icon_button`, `addlist_move_${args.id}`)
  move.append(App.create_icon(`sun`))

  DOM.ev(save, `click`, () => {
    App.addlist_save(args.id)
  })

  DOM.ev(remove, `click`, () => {
    let data = App.addlist_data

    if (data.edit && Object.keys(data.items).length) {
      App.addlist_remove(args.id, data.items[args.pk])
    }
  })

  DOM.ev(move, `click`, (e) => {
    App.addlist_move_menu(e)
  })

  DOM.ev(use, `click`, () => {
    App.addlist_check_use()
  })

  btns.append(remove)
  btns.append(move)
  btns.append(save)
  btns.append(use)
  container.append(btns)
  App[`addlist_args_${args.id}`] = args
  return container
}

App.addlist_edit = (args = {}) => {
  let def_args = App.addlist_def_args()
  args = Object.assign(def_args, args)
  let oargs = App.addlist_oargs(args.id)
  App.show_popup(App.addlist_popup(args.id))
  App.addlist_check_buttons(args)
  let widgets = oargs.widgets

  for (let [i, key] of oargs.keys.entries()) {
    let value = args.items[key]
    let el = App.addlist_widget(args.id, i)
    let w = widgets[i]

    if (w === `text` || w === `key`) {
      if (value) {
        el.value = value
      }
      else {
        el.value = ``
      }
    }
    else if (w === `select`) {
      if (value) {
        App[`addlist_menubutton_${args.id}_${i}`].set(value)
      }
      else {
        App[`addlist_menubutton_${args.id}_${i}`].set(oargs.sources[i][0].value)
      }
    }
    else if (w === `checkbox`) {
      if (value !== undefined) {
        el.checked = value
      }
      else {
        el.checked = oargs.sources[i]
      }
    }
  }

  App.addlist_data = args
  App.addlist_check_focus(args.id)
}

App.addlist_remove = (id, value, force) => {
  if (!value) {
    return
  }

  let lines = App.addlist_get_data(id)

  if (!lines.length) {
    return
  }

  let oargs = App.addlist_oargs(id)

  App.show_confirm(`Remove item?`, () => {
    let new_lines = []

    for (let line of lines) {
      if (!Object.keys(line).length) {
        continue
      }

      if (line[oargs.pk] === value) {
        continue
      }

      new_lines.push(line)
    }

    App.after_addlist(id, new_lines)
  }, undefined, force)
}

App.addlist_view = (args = {}) => {
  let items = App.addlist_get_data(args.id)[args.index]

  if (!items) {
    App.addlist_no_items()
    return
  }

  let obj = {
    id: args.id,
    items: items,
    use: args.use,
    index: args.index,
    edit: true,
  }

  App.addlist_edit(obj)
}

App.addlist_enter = () => {
  if (App.addlist_key()) {
    return
  }

  let data = App.addlist_data

  if (data.edit) {
    let modified = App.addlist_modified(data.id)

    if (modified) {
      App.addlist_save(data.id)
    }
    else if (data.use) {
      App.addlist_use()
    }
  }
  else {
    App.addlist_save(data.id)
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
  App.addlist_set_data(id, lines)
  App.hide_addlist(false)

  if (oargs.on_modified) {
    oargs.on_modified()
  }

  App.addlist_update_count(id)
}

App.addlist_check_buttons = (args) => {
  let remove_el = DOM.el(`#addlist_remove_${args.id}`)
  let move_el = DOM.el(`#addlist_move_${args.id}`)
  let prev_el = DOM.el(`#addlist_prev_${args.id}`)
  let next_el = DOM.el(`#addlist_next_${args.id}`)
  let use_el = DOM.el(`#addlist_use_${args.id}`)
  let date_el = DOM.el(`#addlist_date_${args.id}`)
  remove_el.classList.add(`hidden`)
  move_el.classList.add(`hidden`)
  prev_el.classList.add(`hidden`)
  next_el.classList.add(`hidden`)
  use_el.classList.add(`hidden`)

  if (args.edit) {
    let num = App.addlist_get_data(args.id).length
    remove_el.classList.remove(`hidden`)
    move_el.classList.remove(`hidden`)
    date_el.classList.remove(`hidden`)

    if (args.items._date_) {
      date_el.classList.remove(`hidden`)
      date_el.textContent = App.nice_date(args.items._date_)
    }

    if (num > 1) {
      prev_el.classList.remove(`hidden`)
      next_el.classList.remove(`hidden`)
    }

    if (args.use) {
      use_el.classList.remove(`hidden`)
    }
  }
}

App.addlist_def_args = () => {
  return {
    edit: false,
    items: [],
  }
}

App.addlist_widget = (id, i = 0) => {
  return DOM.el(`#addlist_widget_${id}_${i}`)
}

App.addlist_use = (force = true) => {
  let data = App.addlist_data
  let line = App.addlist_values(data.id)
  let filled = App.addlist_filled(line)

  if (!filled) {
    return false
  }

  if (data.use) {
    App.show_confirm(`Use this now?`, () => {
      data.use(line)
      App.hide_addlist(true)
    }, undefined, force)
  }
}

App.addlist_check_use = () => {
  let data = App.addlist_data

  if (!data.use) {
    return
  }

  let modified = App.addlist_modified(data.id)
  let ans = true

  if (modified) {
    ans = App.addlist_save(data.id)
  }

  if (ans) {
    App.addlist_use()
  }
}

App.addlist_next = (id, reverse = false) => {
  let data = App.addlist_data

  if (!data.edit) {
    return
  }

  let lines = App.addlist_get_data(id).slice(0)

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
  App.addlist_view(data)
}

App.addlist_check_focus = (id) => {
  let oargs = App.addlist_oargs(id)
  let data = App.addlist_data

  for (let [i, w] of oargs.widgets.entries()) {
    let el = App.addlist_widget(id, i)

    if (data.edit) {
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

  if (!data.edit) {
    return false
  }

  if (!Object.keys(data.items).length) {
    return false
  }

  let values = App.addlist_values(id)

  for (let key in values) {
    if (values[key] !== data.items[key]) {
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
  let lines = App.addlist_get_data(data.id)
  let oargs = App.addlist_oargs(data.id)
  let value = data.items[oargs.pk]

  for (let [i, line] of lines.entries()) {
    if (!Object.keys(line).length) {
      continue
    }

    if (line[oargs.pk] === value) {
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

      App.after_addlist(data.id, lines)
      break
    }
  }
}

App.addlist_get_value = (i, w) => {
  let id = App.addlist_data.id
  let oargs = App.addlist_oargs(id)
  let el = App.addlist_widget(id, i)
  let value

  if (w === `text` || w === `key`) {
    value = el.value.trim()

    if (oargs.lowercase) {
      value = value.toLowerCase()
    }
  }
  else if (w === `select`) {
    value = App[`addlist_menubutton_${id}_${i}`].value
  }
  else if (w === `checkbox`) {
    value = el.checked
  }

  return value
}

App.addlist_oargs = (id) => {
  return App[`addlist_args_${id}`]
}

App.hide_addlist = (check = true, from = `normal`) => {
  if (!App.on_addlist()) {
    return
  }

  if (from === `escape`) {
    if (App.addlist_key()) {
      return
    }
  }

  let data = App.addlist_data
  let modified = App.addlist_modified(data.id)
  let p_id = App.addlist_popup(data.id)

  if (check && modified) {
    App.show_confirm(`Save changes?`, () => {
      App.addlist_save(data.id)
    }, () => {
      App.hide_popup(p_id, true)
    })
  }
  else {
    App.hide_popup(p_id, true)
  }
}

App.on_addlist = () => {
  return App.popup_is_open(`addlist_`, false)
}

App.addlist_popup = (id) => {
  return `addlist_${id}`
}

App.addlist_filled = (values) => {
  for (let key in values) {
    if (values[key] === ``) {
      return false
    }
  }

  return true
}

App.addlist_key = () => {
  return document.activeElement.classList.contains(`addlist_key`)
}

App.addlist_list = (args) => {
  let lines = App.addlist_get_data(args.id)

  if (!lines.length) {
    App.addlist_no_items()
    return
  }

  let items = []
  let oargs = App.addlist_oargs(args.id)

  for (let [i, line] of lines.entries()) {
    let title = oargs.list_text(line)
    let info = line._date_ ? App.nice_date(line._date_) : ``

    items.push({
      text: title,
      action: () => {
        App.addlist_view({id: args.id, index: i, use: args.use})
      },
      info: info,
    })
  }

  let area = DOM.el(`#${args.id}`)
  NeedContext.show_on_element(area, items, true, area.clientHeight)
}

App.addlist_clear = (id, force = false) => {
  let data = App.addlist_get_data(id)

  if (!data) {
    return
  }

  if (!App.addlist_get_data(id).length) {
    return
  }

  App.show_confirm(`Clear this list?`, () => {
    App.after_addlist(id, [])
  }, undefined, force)
}

App.addlist_get_line = (id, items) => {
  let lines = App.addlist_get_data(id)

  for (let [i, line] of lines.entries()) {
    let matched = true

    for (let key in line) {
      if (line[key] !== items[key]) {
        matched = false
        break
      }
    }

    if (matched) {
      return [true, i]
    }
  }

  return [false, 0]
}

App.addlist_check = (args) => {
  let [edit, index] = App.addlist_get_line(args.id, args.items)
  args.edit = edit
  args.index = index
  App.addlist_edit(args)
}

App.addlist_no_items = () => {
  App.show_feedback(`No items yet`, true)
}

App.addlist_add_buttons = (id) => {
  let el = DOM.el(`#${id}`)
  let oargs = App.addlist_oargs(id)
  let cls = `action underline`
  let count = DOM.create(`div`, `action`, `addlist_button_${id}_count`)
  count.textContent = ``
  el.append(count)
  let add = DOM.create(`div`, cls, `addlist_button_${id}_add`)
  add.textContent = `Add`
  el.append(add)
  let list = DOM.create(`div`, cls, `addlist_button_${id}_list`)
  list.textContent = `List`
  el.append(list)
  let edit = DOM.create(`div`, cls, `addlist_button_${id}_edit`)
  edit.textContent = `Edit`
  el.append(edit)
  let clear = DOM.create(`div`, cls, `addlist_button_${id}_clear`)
  clear.textContent = `Clear`
  el.append(clear)

  DOM.ev(DOM.el(`#addlist_button_${id}_count`), `click`, () => {
    App.addlist_list({id: id, use: oargs.use})
  })

  DOM.ev(DOM.el(`#addlist_button_${id}_add`), `click`, () => {
    App.addlist_edit({id: id, items: {}})
  })

  DOM.ev(DOM.el(`#addlist_button_${id}_list`), `click`, () => {
    App.addlist_list({id: id, use: oargs.use})
  })

  DOM.ev(DOM.el(`#addlist_button_${id}_edit`), `click`, () => {
    App.addlist_edit_all(id)
  })

  DOM.ev(DOM.el(`#addlist_button_${id}_clear`), `click`, () => {
    App.addlist_clear(id)
  })

  App.addlist_update_count(id)
}

App.addlist_get_data = (id) => {
  let oargs = App.addlist_oargs(id)
  return oargs.get_value(id)
}

App.addlist_set_data = (id, value) => {
  let oargs = App.addlist_oargs(id)
  oargs.set_value(id, value)
}

App.addlist_edit_all = (id) => {
  let sett = App.addlist_get_data(id)
  let value = App.str(sett)

  App.show_input(`Edit: ${id}`, `Save`, (text) => {
    try {
      App.after_addlist(id, App.obj(text))
      return true
    }
    catch (err) {
      App.show_alert_2(`${err}`)
      return false
    }
  }, value)
}

App.addlist_update_count = (id) => {
  let lines = App.addlist_get_data(id)

  if (!lines) {
    return
  }

  DOM.el(`#addlist_button_${id}_count`).textContent = `(${lines.length})`
}