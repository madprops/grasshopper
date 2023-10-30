const Addlist = {}

Addlist.values = (id) => {
  let oargs = Addlist.oargs(id)
  let values = {}

  for (let key of oargs.keys) {
    values[key] = Addlist.get_value(key)

    if (oargs.process[key]) {
      values[key] = oargs.process[key](values[key])
    }
  }

  return values
}

Addlist.save = (id, hide = true) => {
  let data = Addlist.data
  let oargs = Addlist.oargs(id)
  let values = Addlist.values(id)

  if (data.edit) {
    let modified = Addlist.modified(id)

    if (!modified) {
      if (hide) {
        Addlist.hide(false)
      }

      return false
    }
  }

  if (oargs.validate) {
    if (!oargs.validate(values)) {
      return false
    }
  }
  else {
    if (!Addlist.filled(id)) {
      return false
    }
  }

  let v1 = ``

  if (data.edit && Object.keys(data.items).length) {
    v1 = data.items[oargs.pk]
  }

  if (v1) {
    Addlist.remove({id: id, value: v1, force: true})
  }

  let v2 = values[oargs.pk]

  if (v2 && (v1 !== v2)) {
    Addlist.remove({id: id, value: v2, force: true})
  }

  let lines = Addlist.get_data(id)
  values._date_ = App.now()

  if (data.index === undefined) {
    if (oargs.append) {
      lines.push(values)
    }
    else {
      lines.unshift(values)
    }
  }
  else {
    lines.splice(data.index, 0, values)
  }

  Addlist.after(id, lines, hide)
  return true
}

Addlist.register = (args = {}) => {
  let def_args = {
    labels: [],
    sources: [],
    append: false,
    process: {},
    labels: {},
    widgets: {},
    required: {},
    tooltips: {},
    lowercase: false,
    list_text: () => {
      return `Item`
    },
    get_data: () => {
      return []
    },
    set_data: () => {},
  }

  App.def_args(def_args, args)
  let container = DOM.create(`div`, `addlist_container`, `addlist_container_${args.id}`)
  container.tabIndex = 0
  let top = DOM.create(`div`, `addlist_top`)
  let title = DOM.create(`div`, `addlist_title`)
  title.textContent = args.title || `List`
  let btn_prev = DOM.create(`div`, `button`, `addlist_prev_${args.id}`)
  btn_prev.textContent = `<`
  let btn_next = DOM.create(`div`, `button`, `addlist_next_${args.id}`)
  btn_next.textContent = `>`

  DOM.ev(btn_prev, `click`, () => {
    Addlist.next(args.id, true)
  })

  DOM.ev(btn_next, `click`, () => {
    Addlist.next(args.id)
  })

  top.append(btn_prev)
  top.append(title)
  top.append(btn_next)
  container.append(top)
  let date = DOM.create(`div`, `addlist_date hidden`, `addlist_date_${args.id}`)
  container.append(date)
  let els = []

  for (let key of args.keys) {
    let el
    let w = args.widgets[key]
    let id = `addlist_widget_${args.id}_${key}`

    if (w === `text`) {
      el = DOM.create(`input`, `text addlist_text`, id)
      el.type = `text`
      el.spellcheck = false
      el.autocomplete = false
      el.placeholder = args.labels[key] || `Value`
    }
    else if (w === `textarea`) {
      el = DOM.create(`textarea`, `text addlist_textarea`, id)
      el.spellcheck = false
      el.autocomplete = false
      el.placeholder = args.labels[key] || `Value`
    }
    else if (w === `menu`) {
      el = DOM.create(`div`, `addlist_menu`)
      let label = DOM.create(`div`)
      label.textContent = args.labels[key] || `Select`

      App[`addlist_menubutton_${args.id}_${key}`] = Menubutton.create({
        id: id,
        opts: args.sources[key],
        get_value: () => {
          return Addlist.get_value(key)
        }
      })

      let mb = App[`addlist_menubutton_${args.id}_${key}`]
      el.append(label)
      el.append(mb.container)
    }
    else if (w === `key`) {
      el = DOM.create(`input`, `text addlist_text addlist_key`, id)
      el.type = `text`
      el.spellcheck = false
      el.autocomplete = false
      el.placeholder = args.labels[key] || `Key`

      DOM.ev(el, `keydown`, (e) => {
        el.value = e.code
        e.preventDefault()
      })
    }
    else if (w === `checkbox`) {
      el = DOM.create(`div`, `addlist_checkbox`)
      let checkbox = DOM.create(`input`, `checkbox addlist_checkbox`, id)
      checkbox.type = `checkbox`
      let label = DOM.create(`div`)
      label.textContent = args.labels[key] || `Checkbox`
      el.append(label)
      el.append(checkbox)
    }

    if (el) {
      let tooltip = args.tooltips[key]

      if (tooltip) {
        el.title = tooltip
      }

      els.push(el)
    }
  }

  container.append(...els)
  let btns = DOM.create(`div`, `addlist_buttons`)
  let save = DOM.create(`div`, `button`, `addlist_save_${args.id}`)
  save.textContent = `Save`
  let menu = DOM.create(`div`, `button icon_button`, `addlist_menu_${args.id}`)
  menu.textContent = `Menu`

  DOM.ev(save, `click`, () => {
    Addlist.save(args.id)
  })

  DOM.ev(menu, `click`, () => {
    Addlist.menu()
  })

  btns.append(menu)
  btns.append(save)
  container.append(btns)
  App[`addlist_args_${args.id}`] = args
  return container
}

Addlist.edit = (args = {}) => {
  let def_args = Addlist.def_args()
  App.def_args(def_args, args)
  let oargs = Addlist.oargs(args.id)
  App.show_popup(Addlist.popup(args.id))
  Addlist.check_buttons(args)
  let widgets = oargs.widgets

  for (key of oargs.keys) {
    let value = args.items[key]
    let el = Addlist.widget(args.id, key)
    let w = widgets[key]

    if (w === `text` || w === `textarea` || w === `key`) {
      if (value) {
        el.value = value
      }
      else {
        el.value = ``
      }
    }
    else if (w === `menu`) {
      if (value) {
        App[`addlist_menubutton_${args.id}_${key}`].set(value)
      }
      else {
        App[`addlist_menubutton_${args.id}_${key}`].set(oargs.sources[key][0].value)
      }
    }
    else if (w === `checkbox`) {
      if (value !== undefined) {
        el.checked = value
      }
      else {
        el.checked = oargs.sources[key]
      }
    }
  }

  Addlist.data = args
  Addlist.check_focus(args.id)
}

Addlist.remove = (args = {}) => {
  let def_args = {
    force: false,
    show_list: false,
  }

  App.def_args(def_args, args)

  if (!args.value) {
    return
  }

  let lines = Addlist.get_data(args.id)

  if (!lines.length) {
    return
  }

  let oargs = Addlist.oargs(args.id)

  App.show_confirm({
    message: `Remove item?`,
    confirm_action: () => {
      let new_lines = []

      for (let line of lines) {
        if (!Object.keys(line).length) {
          continue
        }

        if (line[oargs.pk] === args.value) {
          continue
        }

        new_lines.push(line)
      }

      Addlist.after(args.id, new_lines)

      if (args.show_list) {
        Addlist.list({id: args.id})
      }
    },
    force: args.force,
  })
}

Addlist.view = (args = {}) => {
  let items = Addlist.get_data(args.id)[args.index]

  if (!items) {
    Addlist.no_items()
    return
  }

  args.items = items
  args.edit = true
  Addlist.edit(args)
}

Addlist.enter = () => {
  if (Addlist.key()) {
    return
  }

  let data = Addlist.data

  if (data.edit) {
    let modified = Addlist.modified(data.id)

    if (modified) {
      Addlist.save(data.id)
    }
    else {
      Addlist.hide(false)
    }
  }
  else {
    Addlist.save(data.id)
  }
}

Addlist.left = () => {
  let id = Addlist.data.id
  Addlist.save(id, false)
  Addlist.next(id, true)
}

Addlist.right = () => {
  let id = Addlist.data.id
  Addlist.save(id, false)
  Addlist.next(id)
}

Addlist.after = (id, lines, hide = true) => {
  Addlist.set_data(id, lines)

  if (hide) {
    Addlist.hide(false)
  }

  Addlist.update_count(id)
}

Addlist.check_buttons = (args) => {
  let menu_el = DOM.el(`#addlist_menu_${args.id}`)
  let prev_el = DOM.el(`#addlist_prev_${args.id}`)
  let next_el = DOM.el(`#addlist_next_${args.id}`)
  let date_el = DOM.el(`#addlist_date_${args.id}`)
  menu_el.classList.add(`hidden`)
  prev_el.classList.add(`hidden`)
  next_el.classList.add(`hidden`)
  date_el.classList.add(`hidden`)

  if (args.edit) {
    let num = Addlist.get_data(args.id).length
    menu_el.classList.remove(`hidden`)

    if (args.items._date_) {
      date_el.classList.remove(`hidden`)
      date_el.textContent = App.nice_date(args.items._date_)
    }

    if (num > 1) {
      prev_el.classList.remove(`hidden`)
      next_el.classList.remove(`hidden`)
    }
  }
}

Addlist.def_args = () => {
  return {
    edit: false,
    items: [],
  }
}

Addlist.widget = (id, key) => {
  return DOM.el(`#addlist_widget_${id}_${key}`)
}

Addlist.next = (id, reverse = false) => {
  let data = Addlist.data

  if (!data.edit) {
    return
  }

  let lines = Addlist.get_data(id).slice(0)

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
  Addlist.view(data)
}

Addlist.check_focus = (id) => {
  let oargs = Addlist.oargs(id)
  let data = Addlist.data

  for (let key of oargs.keys) {
    let el = Addlist.widget(id, key)

    if (data.edit) {
      DOM.el(`#addlist_container_${id}`).focus()
    }
    else {
      el.focus()
    }

    return
  }
}

Addlist.modified = (id) => {
  let data = Addlist.data

  if (!data.edit) {
    return false
  }

  if (!Object.keys(data.items).length) {
    return false
  }

  let values = Addlist.values(id)

  for (let key in values) {
    if (values[key] !== data.items[key]) {
      return true
    }
  }

  return false
}

Addlist.menu = () => {
  let data = Addlist.data
  let id = data.id
  let oargs = Addlist.oargs(id)
  let items = []

  items.push({
    text: `Remove`,
    action: () => {
      if (data.edit && Object.keys(data.items).length) {
        Addlist.remove({id: id, value: data.items[oargs.pk]})
      }
    }
  })

  items.push({
    text: `Add New`,
    action: () => {
      data.items = {}
      data.edit = false
      Addlist.edit(data)
    }
  })

  let lines = Addlist.get_data(data.id)

  if (lines.length > 1) {
    items.push({
      text: `List Items`,
      action: () => {
        data.button = `menu`
        Addlist.list(data)
      }
    })

    items.push({
      text: `Move Item`,
      items: [
        {
          text: `To Top`,
          action: () => {
            Addlist.move(`top`)
          }
        },
        {
          text: `Move Up`,
          action: () => {
            Addlist.move(`up`)
          }
        },
        {
          text: `Move Down`,
          action: () => {
            Addlist.move(`down`)
          }
        },
        {
          text: `To Bottom`,
          action: () => {
            Addlist.move(`bottom`)
          }
        },
      ],
    })
  }

  let btn = DOM.el(`#addlist_menu_${id}`)

  App.show_context({
    element: btn,
    items: items,
    expand: true,
    margin: btn.clientHeight,
  })
}

Addlist.move = (dir) => {
  let data = Addlist.data
  let lines = Addlist.get_data(data.id)
  let oargs = Addlist.oargs(data.id)
  let value = data.items[oargs.pk]

  for (let [i, line] of lines.entries()) {
    if (!Object.keys(line).length) {
      continue
    }

    if (line[oargs.pk] === value) {
      if (dir === `top`) {
        let item = lines.splice(i, 1)[0]
        lines.unshift(item)
      }
      else if (dir === `bottom`) {
        let item = lines.splice(i, 1)[0]
        lines.push(item)
      }
      else if (dir === `up`) {
        if (i > 0 && i < lines.length) {
          [lines[i], lines[i - 1]] = [lines[i - 1], lines[i]]
        }
      }
      else if (dir === `down`) {
        if (i >= 0 && i < lines.length - 1) {
          [lines[i], lines[i + 1]] = [lines[i + 1], lines[i]]
        }
      }

      Addlist.after(data.id, lines)
      break
    }
  }
}

Addlist.get_value = (key) => {
  let id = Addlist.data.id
  let oargs = Addlist.oargs(id)
  let w = oargs.widgets[key]
  let el = Addlist.widget(id, key)
  let value

  if (w === `text` || w === `textarea` || w === `key`) {
    value = el.value.trim()

    if (oargs.lowercase) {
      value = value.toLowerCase()
    }
  }
  else if (w === `menu`) {
    value = App[`addlist_menubutton_${id}_${key}`].value
  }
  else if (w === `checkbox`) {
    value = el.checked
  }

  return value
}

Addlist.oargs = (id) => {
  return App[`addlist_args_${id}`]
}

Addlist.hide = (check = true, from = `normal`) => {
  if (!Addlist.on_addlist()) {
    return
  }

  if (from === `escape`) {
    if (Addlist.key()) {
      return
    }
  }

  let data = Addlist.data
  let modified = Addlist.modified(data.id)
  let p_id = Addlist.popup(data.id)

  if (check && modified) {
    App.show_confirm({
      message: `Save changes?`,
      confirm_action: () => {
        Addlist.save(data.id)
      },
      cancel_action: () => {
        App.hide_popup(p_id, true)
      },
    })
  }
  else {
    App.hide_popup(p_id, true)
  }
}

Addlist.on_addlist = () => {
  return App.popup_is_open(`addlist_`, false)
}

Addlist.popup = (id) => {
  return `addlist_${id}`
}

Addlist.filled = (id) => {
  let oargs = Addlist.oargs(id)

  for(let key of oargs.keys) {
    let w = oargs.widgets[key]

    if (w === `checkbox`) {
      continue
    }

    let required

    if (key === oargs.pk) {
      required = true
    }
    else if (oargs.required[key]) {
      required = true
    }
    else {
      required = false
    }

    if (required) {
      if (!Addlist.get_value(key)) {
        return false
      }
    }
  }

  return true
}

Addlist.key = () => {
  return document.activeElement.classList.contains(`addlist_key`)
}

Addlist.list = (args) => {
  let lines = Addlist.get_data(args.id)

  if (!lines.length) {
    Addlist.no_items()
    return
  }

  let items = []
  let oargs = Addlist.oargs(args.id)

  for (let [i, line] of lines.entries()) {
    let title = oargs.list_text(line)
    let info = line._date_ ? App.nice_date(line._date_) : ``

    items.push({
      text: title,
      action: () => {
        args.index = i
        Addlist.view(args)
      },
      alt_action: () => {
        Addlist.remove({id: args.id, value: line[oargs.pk], show_list: true})
      },
      info: info,
    })
  }

  let btn

  if (args.button === `menu`) {
    btn = DOM.el(`#addlist_menu_${args.id}`)
  }
  else {
    btn = DOM.el(`#${args.id}`)
  }

  App.show_context({
    element: btn,
    items: items,
    expand: true,
    margin: btn.clientHeight,
    draggable: true,
    on_drag: (start, end) => {
      Addlist.move_item(args.id, start, end)
    },
    index: args.index || 0,
  })
}

Addlist.clear = (id, force = false) => {
  let data = Addlist.get_data(id)

  if (!data) {
    return
  }

  if (!Addlist.get_data(id).length) {
    return
  }

  App.show_confirm({
    message: `Clear this list?`,
    confirm_action: () => {
      Addlist.after(id, [])
    },
    force: force,
  })
}

Addlist.get_line = (id, items) => {
  let lines = Addlist.get_data(id)

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

Addlist.no_items = () => {
  App.alert(`No items yet`)
}

Addlist.add_buttons = (id) => {
  let el = DOM.el(`#${id}`)
  let cls = `action underline`
  let count = DOM.create(`div`, `action`, `addlist_button_${id}_count`)
  count.textContent = ``
  el.append(count)
  let add = DOM.create(`div`, cls, `addlist_button_${id}_add`)
  add.textContent = `Add`
  el.append(add)
  let edit = DOM.create(`div`, cls, `addlist_button_${id}_edit`)
  edit.textContent = `Edit`
  el.append(edit)
  let list = DOM.create(`div`, cls, `addlist_button_${id}_list`)
  list.textContent = `List`
  el.append(list)
  let data = DOM.create(`div`, cls, `addlist_button_${id}_data`)
  data.textContent = `Data`
  el.append(data)

  DOM.ev(DOM.el(`#addlist_button_${id}_count`), `click`, () => {
    Addlist.list({id: id})
  })

  DOM.ev(DOM.el(`#addlist_button_${id}_add`), `click`, () => {
    Addlist.edit({id: id, items: {}})
  })

  DOM.ev(DOM.el(`#addlist_button_${id}_list`), `click`, () => {
    Addlist.list({id: id})
  })

  DOM.ev(DOM.el(`#addlist_button_${id}_edit`), `click`, () => {
    Addlist.edit_first(id)
  })

  DOM.ev(DOM.el(`#addlist_button_${id}_data`), `click`, () => {
    Addlist.data_menu(id)
  })

  Addlist.update_count(id)
}

Addlist.get_data = (id) => {
  let oargs = Addlist.oargs(id)
  return App.clone(oargs.get_data(id))
}

Addlist.set_data = (id, value) => {
  let oargs = Addlist.oargs(id)
  let data = Addlist.data
  oargs.set_data(id, App.clone(value))

  if (data && data.on_set) {
    data.on_set()
  }
}

Addlist.edit_all = (id) => {
  let sett = Addlist.get_data(id)
  let value = App.str(sett, true)

  App.show_input({
    message: id,
    button: `Save`,
    action: (text) => {
      try {
        Addlist.after(id, App.obj(text))
        return true
      }
      catch (err) {
        App.alert(`${err}`)
        return false
      }
    },
    value: value,
  })
}

Addlist.update_count = (id) => {
  let lines = Addlist.get_data(id)

  if (!lines) {
    return
  }

  DOM.el(`#addlist_button_${id}_count`).textContent = `(${lines.length})`
}

Addlist.edit_first = (id) => {
  let args = {
    id: id,
    index: 0,
  }

  Addlist.view(args)
}

Addlist.data_menu = (id) => {
  let items = []

  items.push({
    text: `Edit`,
    action: () => {
      Addlist.edit_all(id)
    }
  })

  items.push({
    text: `Clear`,
    action: () => {
      Addlist.clear(id)
    }
  })

  let btn = DOM.el(`#addlist_button_${id}_data`)

  App.show_context({
    element: btn,
    items: items,
    expand: true,
    margin: btn.clientHeight,
  })
}

Addlist.move_item = (id, start, end) => {
  let lines = Addlist.get_data(id)
  let item = lines[start]
  lines.splice(start, 1)
  lines.splice(end, 0, item)
  Addlist.set_data(id, lines)
  let button

  if (Addlist.data) {
    button = Addlist.data.button
  }

  Addlist.list({id: id, index: end, button: button})
}