const Addlist = {}
Addlist.fill_id = 1

Addlist.check_append = () => {
  return App.get_setting(`addlist_append`)
}

Addlist.values = (id) => {
  let data = Addlist.data
  let oargs = Addlist.oargs(id)
  let values = {}

  if (data.items._id_) {
    values._id_ = data.items._id_
  }

  for (let key of oargs.keys) {
    values[key] = Addlist.get_value(key)

    if (oargs.process[key]) {
      values[key] = oargs.process[key](values[key])
    }
  }

  return values
}

Addlist.save = (args = {}) => {
  let def_args = {
    hide: true,
  }

  App.def_args(def_args, args)
  let data = Addlist.data
  let oargs = Addlist.oargs(args.id)
  let values = Addlist.values(args.id)

  if (oargs.validate) {
    if (!oargs.validate(values)) {
      Addlist.check_remove()
      return false
    }
  }
  else if (!Addlist.filled(args.id)) {
    Addlist.check_remove()
    return false
  }

  let v1 = ``

  if (data.edit && Object.keys(data.items).length) {
    v1 = data.items[oargs.pk]
  }

  if (v1) {
    Addlist.remove({id: args.id, value: v1, force: true})
  }

  let v2 = values[oargs.pk]

  if (v2 && (v1 !== v2)) {
    Addlist.remove({id: args.id, value: v2, force: true})
  }

  let lines = Addlist.get_data(args.id)

  if (!data.edit) {
    let sdate = App.now().toString().slice(-9)
    let id = sdate + `_` + App.random_string(5)
    values._id_ = id
  }

  if (data.index === undefined) {
    let method

    if (Addlist.check_append()) {
      method = `append`
    }
    else {
      method = `prepend`
    }

    if (args.e && (args.e.shiftKey || args.e.ctrlKey)) {
      method = method === `append` ? `prepend` : `append`
    }

    if (method === `append`) {
      lines.push(values)
    }
    else if (method === `prepend`) {
      lines.unshift(values)
    }
  }
  else {
    lines.splice(data.index, 0, values)
  }

  Addlist.after(args.id, lines, args.hide)

  if (data.after_done) {
    data.after_done()
  }

  return true
}

Addlist.build = (oargs) => {
  if (oargs.built) {
    return
  }

  let container = DOM.el(`#addlist_container_${oargs.id}`)
  let top = DOM.create(`div`, `addlist_top`)
  let title = DOM.create(`div`, `addlist_title`)
  title.textContent = oargs.title || `List`
  let btn_prev = DOM.create(`div`, `button`, `addlist_prev_${oargs.id}`)
  btn_prev.textContent = `<`
  let btn_next = DOM.create(`div`, `button`, `addlist_next_${oargs.id}`)
  btn_next.textContent = `>`

  DOM.ev(btn_prev, `click`, () => {
    Addlist.left()
  })

  DOM.ev(btn_next, `click`, () => {
    Addlist.right()
  })

  top.append(btn_prev)
  top.append(title)
  top.append(btn_next)
  container.append(top)

  let els = []

  function add_label (el, key) {
    if (oargs.labels[key]) {
      let label = DOM.create(`div`)
      label.textContent = oargs.labels[key]
      el.append(label)
    }
  }

  for (let key of oargs.keys) {
    let el
    let w = oargs.widgets[key]
    let id = `addlist_widget_${oargs.id}_${key}`

    if (w === `text`) {
      el = DOM.create(`input`, `text addlist_text addlist_widget`, id)
      el.type = `text`
      el.spellcheck = false
      el.autocomplete = false
      el.placeholder = oargs.labels[key]
    }
    else if (w === `number`) {
      el = DOM.create(`input`, `text addlist_text addlist_widget`, id)
      el.type = `number`
      el.placeholder = oargs.labels[key]
    }
    else if (w === `textarea`) {
      el = DOM.create(`textarea`, `text addlist_textarea addlist_widget`, id)
      el.spellcheck = false
      el.autocomplete = false
      el.placeholder = oargs.labels[key]
    }
    else if (w === `menu`) {
      el = DOM.create(`div`, `addlist_menu addlist_widget`)

      App[`addlist_menubutton_${oargs.id}_${key}`] = Menubutton.create({
        id,
        source: oargs.sources[key],
        get_value: () => {
          return Addlist.get_value(key)
        },
        after_dismiss: () => {
          let data = Addlist.data

          if (!data.edit && oargs.automenu) {
            Addlist.hide()
          }
        },
        after_action: () => {
          let data = Addlist.data

          if (!data.edit && oargs.automenu) {
            Addlist.save({id: oargs.id})
          }
        },
      })

      let mb = App[`addlist_menubutton_${oargs.id}_${key}`]
      add_label(el, key)
      el.append(mb.container)
    }
    else if (w === `key`) {
      el = DOM.create(`input`, `text addlist_text addlist_key addlist_widget`, id)
      el.type = `text`
      el.spellcheck = false
      el.autocomplete = false
      el.placeholder = oargs.labels[key]

      DOM.ev(el, `keydown`, (e) => {
        el.value = e.code
        e.preventDefault()
      })
    }
    else if (w === `checkbox`) {
      el = DOM.create(`div`, `addlist_checkbox_container addlist_widget`)
      let checkbox = DOM.create(`input`, `checkbox addlist_checkbox`, id)
      checkbox.type = `checkbox`

      if (oargs.on_check[key]) {
        DOM.ev(checkbox, `change`, () => {
          return oargs.on_check[key](checkbox.checked)
        })
      }

      add_label(el, key)
      el.append(checkbox)
    }
    else if (w === `color`) {
      el = DOM.create(`div`, `addlist_color_container addlist_widget`)
      let color = DOM.create(`div`, `addlist_color`)

      App[`addlist_color_${oargs.id}_${key}`] = AColorPicker.createPicker(color, {
        showAlpha: true,
        showHSL: false,
        showRGB: true,
        showHEX: true,
      })

      add_label(el, key)
      el.append(color)
    }

    if (el) {
      let tooltip = oargs.tooltips[key]

      if (tooltip) {
        el.title = App.tooltip(tooltip)
      }

      els.push(el)
    }
  }

  container.append(...els)
  let btns = DOM.create(`div`, `addlist_buttons`)
  let save = DOM.create(`div`, `button`, `addlist_save_${oargs.id}`)
  save.textContent = `Save`
  save.title = `Use Shift or Ctrl to reverse insert method`
  let menu = DOM.create(`div`, `button icon_button`, `addlist_menu_${oargs.id}`)
  menu.textContent = `Menu`

  DOM.ev(save, `click`, (e) => {
    Addlist.save({id: oargs.id, e})
  })

  DOM.ev(menu, `click`, () => {
    Addlist.menu()
  })

  for (let b of oargs.buttons) {
    let btn = DOM.create(`div`, `button`)
    btn.textContent = b.text
    btn.title = b.tooltip

    DOM.ev(btn, `click`, (e) => {
      b.action(e)
    })

    btns.append(btn)
  }

  btns.append(menu)
  btns.append(save)

  container.append(btns)
  oargs.built = true
}

Addlist.register = (args = {}) => {
  let def_args = {
    pk: `_id_`,
    sources: {},
    process: {},
    labels: {},
    widgets: {},
    required: {},
    tooltips: {},
    on_check: {},
    lowercase: false,
    automenu: false,
    editable: true,
    buttons: [],
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
  args.built = false
  App[`addlist_args_${args.id}`] = args
  return container
}

Addlist.edit = (args = {}) => {
  let def_args = Addlist.def_args()
  App.def_args(def_args, args)
  let oargs = Addlist.oargs(args.id)

  if (!oargs.built) {
    Addlist.build(oargs)
  }

  App.show_popup(Addlist.popup(args.id))
  Addlist.check_buttons(args)
  let widgets = oargs.widgets
  let first_menu

  for (let key of oargs.keys) {
    let value = args.items[key]
    let el = Addlist.widget(args.id, key)
    let w = widgets[key]

    if (w === `text` || w === `textarea` || w === `key` || w === `number`) {
      if (value) {
        el.value = value
      }
      else if (oargs.sources[key]) {
        el.value = oargs.sources[key]()
      }
      else {
        el.value = ``
      }
    }
    else if (w === `menu`) {
      let mb = App[`addlist_menubutton_${args.id}_${key}`]
      mb.refresh_button()

      if (value) {
        mb.set(value)
      }
      else if (oargs.sources[key]) {
        mb.set(oargs.sources[key]()[0].value)
      }

      first_menu = key
    }
    else if (w === `checkbox`) {
      if (value !== undefined) {
        el.checked = value
      }
      else if (oargs.sources[key]) {
        el.checked = oargs.sources[key]()
      }
      else {
        el.checked = false
      }
    }
    else if (w === `color`) {
      let picker = App[`addlist_color_${args.id}_${key}`]

      if (value) {
        picker.setColor(value)
      }
      else if (oargs.sources[key]) {
        picker.setColor(oargs.sources[key]())
      }
    }
  }

  Addlist.data = args
  Addlist.check_focus(args.id)

  if (!args.edit && oargs.automenu && first_menu) {
    App[`addlist_menubutton_${args.id}_${first_menu}`].show()
  }
}

Addlist.remove = (args = {}) => {
  let def_args = {
    force: false,
    show_list: false,
    index: 0,
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
        Addlist.list({id: args.id, feedback: false, index: args.index})
      }

      Addlist.hide()

      if (args.after) {
        args.after()
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
  Addlist.save({id: data.id})
}

Addlist.left = () => {
  let id = Addlist.data.id
  Addlist.next(id, true)
}

Addlist.right = () => {
  let id = Addlist.data.id
  Addlist.next(id)
}

Addlist.after = (id, lines, hide = true) => {
  Addlist.set_data(id, lines)

  if (hide) {
    Addlist.hide()
  }

  Addlist.update_count(id)
}

Addlist.check_buttons = (args) => {
  let menu_el = DOM.el(`#addlist_menu_${args.id}`)
  let prev_el = DOM.el(`#addlist_prev_${args.id}`)
  let next_el = DOM.el(`#addlist_next_${args.id}`)

  DOM.hide(menu_el)
  DOM.hide(prev_el)
  DOM.hide(next_el)

  if (args.edit) {
    let num = Addlist.get_data(args.id).length
    DOM.show(menu_el)

    if (num > 1) {
      DOM.show(prev_el)
      DOM.show(next_el)
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
  else if (data.index === undefined) {
    index = 0
  }
  else if (data.index >= (lines.length - 1)) {
    index = 0
  }
  else {
    index = data.index + 1
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

Addlist.menu = () => {
  let data = Addlist.data
  let id = data.id
  let oargs = Addlist.oargs(id)
  let items = []

  items.push({
    text: `Remove`,
    action: () => {
      if (data.edit && Object.keys(data.items).length) {
        Addlist.remove({
          id,
          value: data.items[oargs.pk],
          after: () => {
            if (data.after_done) {
              data.after_done()
            }
          },
        })
      }
    },
  })

  items.push({
    text: `Add New`,
    action: () => {
      data.items = {}
      data.edit = false
      Addlist.edit(data)
    },
  })

  let lines = Addlist.get_data(data.id)

  if (lines.length > 1) {
    items.push({
      text: `List Items`,
      action: () => {
        data.button = `menu`
        Addlist.list(data)
      },
    })

    items.push({
      text: `Move Item`,
      items: [
        {
          text: `To Top`,
          action: () => {
            Addlist.move(`top`)
          },
        },
        {
          text: `Move Up`,
          action: () => {
            Addlist.move(`up`)
          },
        },
        {
          text: `Move Down`,
          action: () => {
            Addlist.move(`down`)
          },
        },
        {
          text: `To Bottom`,
          action: () => {
            Addlist.move(`bottom`)
          },
        },
      ],
    })
  }

  let btn = DOM.el(`#addlist_menu_${id}`)

  App.show_context({
    element: btn,
    items,
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

  if (w === `text` || w === `textarea` || w === `key` || w === `number`) {
    value = el.value.trim()

    if (oargs.lowercase) {
      value = value.toLowerCase()
    }
  }
  else if (w === `menu`) {
    value = App[`addlist_menubutton_${id}_${key}`].value

    if (value === `none`) {
      value = undefined
    }

    return value
  }
  else if (w === `checkbox`) {
    value = el.checked
  }
  else if (w === `color`) {
    let picker = App[`addlist_color_${id}_${key}`]
    value = AColorPicker.parseColor(picker.color, `rgbacss`)
  }

  return value
}

Addlist.oargs = (id) => {
  return App[`addlist_args_${id}`]
}

Addlist.hide = (from = `normal`) => {
  if (!Addlist.on_addlist()) {
    return
  }

  if (from === `escape`) {
    if (Addlist.key()) {
      return
    }
  }

  let data = Addlist.data
  let p_id = Addlist.popup(data.id)
  App.hide_popup(p_id, true)
}

Addlist.on_addlist = () => {
  return App.popup_is_open(`addlist_`, false)
}

Addlist.popup = (id) => {
  return `addlist_${id}`
}

Addlist.filled = (id) => {
  let oargs = Addlist.oargs(id)

  for (let key of oargs.keys) {
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
  return DOM.class(document.activeElement, [`addlist_key`])
}

Addlist.list = (args) => {
  let def_args = {
    feedback: true,
  }

  App.def_args(def_args, args)
  let lines = Addlist.get_data(args.id)

  if (!lines.length) {
    if (args.feedback) {
      Addlist.no_items()
    }

    return
  }

  let items = []
  let oargs = Addlist.oargs(args.id)

  for (let [i, line] of lines.entries()) {
    let icon

    if (oargs.list_icon) {
      icon = oargs.list_icon(line)
    }

    let title = oargs.list_text(line)

    items.push({
      icon,
      text: title,
      action: () => {
        args.index = i
        Addlist.view(args)
      },
      middle_action: () => {
        Addlist.remove({
          id: args.id,
          value: line[oargs.pk],
          show_list: true,
          force: true,
          index: i,
        })
      },
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
    items,
    expand: true,
    margin: btn.clientHeight,
    draggable: true,
    index: args.index || 0,
    on_drag: (start, end) => {
      Addlist.move_item(args.id, start, end)
    },
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
    force,
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
  let oargs = Addlist.oargs(id)
  let el = DOM.el(`#${id}`)
  let cls = `doubleline`
  let count = DOM.create(`div`, `action`, `addlist_button_${id}_count`)
  count.textContent = ``
  el.append(count)
  let add = DOM.create(`div`, cls, `addlist_button_${id}_add`)
  add.textContent = `Add`

  if (!oargs.editable) {
    add.classList.add(`hidden`)
  }

  el.append(add)
  let edit = DOM.create(`div`, cls, `addlist_button_${id}_edit`)
  edit.textContent = `Edit`

  if (!oargs.editable) {
    edit.classList.add(`hidden`)
  }

  el.append(edit)
  let list = DOM.create(`div`, cls, `addlist_button_${id}_list`)
  list.textContent = `List`
  el.append(list)
  let data = DOM.create(`div`, cls, `addlist_button_${id}_data`)
  data.textContent = `Data`

  if (!oargs.editable) {
    data.classList.add(`hidden`)
  }

  el.append(data)

  DOM.ev(`#addlist_button_${id}_count`, `click`, () => {
    Addlist.list({id})
  })

  DOM.ev(`#addlist_button_${id}_add`, `click`, (e) => {
    if (e.shiftKey && e.ctrlKey) {
      let oargs = Addlist.oargs(id)

      if (oargs.special_add) {
        let items = oargs.special_add()
        let data = Addlist.get_data(id)
        data.unshift(...items)
        Addlist.set_data(id, data)
        Addlist.update_count(id)
      }

      return
    }

    Addlist.edit({id, items: {}})
  })

  DOM.ev(`#addlist_button_${id}_list`, `click`, () => {
    Addlist.list({id})
  })

  DOM.ev(`#addlist_button_${id}_edit`, `click`, () => {
    Addlist.edit_first(id)
  })

  DOM.ev(`#addlist_button_${id}_data`, `click`, () => {
    Addlist.data_menu(id)
  })

  Addlist.update_count(id)
}

Addlist.get_data = (id) => {
  let oargs = Addlist.oargs(id)
  let lines = App.clone(oargs.get_data(id))

  // Check for empty _id_ and fill it
  for (let item of lines) {
    if (!item._id_) {
      item._id_ = `autoid_${Addlist.fill_id}`
      Addlist.fill_id += 1
    }
  }

  return lines
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
    title: id,
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
    value,
  })
}

Addlist.update_count = (id) => {
  let lines = Addlist.get_data(id)

  if (!lines) {
    return
  }

  let count = DOM.el(`#addlist_button_${id}_count`)

  if (count) {
    count.textContent = `(${lines.length})`
  }
}

Addlist.edit_first = (id) => {
  let args = {
    id,
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
    },
  })

  items.push({
    text: `Clear`,
    action: () => {
      Addlist.clear(id)
    },
  })

  let btn = DOM.el(`#addlist_button_${id}_data`)

  App.show_context({
    element: btn,
    items,
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

  Addlist.list({id, index: end, button})
}

Addlist.check_remove = () => {
  let data = Addlist.data

  if (!data.edit) {
    return
  }

  let oargs = Addlist.oargs(data.id)

  App.show_confirm({
    message: `Remove item?`,
    confirm_action: () => {
      Addlist.remove({
        id: data.id,
        value: data.items[oargs.pk],
        hide: true,
        force: true,
      })

      if (data.after_done) {
        data.after_done()
      }
    },
  })
}

Addlist.edit_object = (id, obj, edit, after_done) => {
  Addlist.edit({id, items: obj, edit, after_done})
}

Addlist.swap_menus = (id_1, id_2) => {
  let btn_1 = App[`addlist_menubutton_settings_${id_1}`]
  let btn_2 = App[`addlist_menubutton_settings_${id_2}`]

  if (!btn_1 || !btn_2) {
    return
  }

  let value_1 = btn_1.value
  let value_2 = btn_2.value

  if (value_1 === value_2) {
    return
  }

  let ok_1 = false
  let ok_2 = false

  for (let opt of btn_1.opts) {
    if (opt.value === value_2) {
      ok_1 = true
      break
    }
  }

  for (let opt of btn_2.opts) {
    if (opt.value === value_1) {
      ok_2 = true
      break
    }
  }

  if (!ok_1 || !ok_2) {
    return
  }

  btn_1.set(value_2)
  btn_2.set(value_1)
}