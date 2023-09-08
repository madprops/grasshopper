App.setup_addlist = () => {
  App.addlist_commands = App.settings_commands()

  function on_hide () {
    App.hide_addlist()
  }

  function after_hide () {
    App.addlist_clear_image()
  }

  function cmd_name (cmd) {
    let c = App.get_command(cmd)

    if (c) {
      return c.name
    }
    else {
      return `None`
    }
  }

  let args = {
    on_hide: on_hide,
    after_hide: after_hide,
  }

  let id = `aliases`

  App.create_popup(Object.assign({}, args, {
    id: `addlist_${id}`, element: App.addlist_register({id: id, pk: `a`,
    widgets: [`text`, `text`], labels: [`Term A`, `Term B`], title: `Aliases`,
    keys: [`a`, `b`], list_text: (items) => {
      return `${items.a} = ${items.b}`
    }})
  }))

  id = `custom_filters`

  App.create_popup(Object.assign({}, args, {
    id: `addlist_${id}`, element: App.addlist_register({id: id, pk: `filter`,
    widgets: [`text`], labels: [`Filter`], title: `Custom Filters`,
    keys: [`filter`], list_text: (items) => {
      return items.filter
    }})
  }))

  id = `mode_order`

  App.create_popup(Object.assign({}, args, {
    id: `addlist_${id}`, element: App.addlist_register({id: id, pk: `a`,
    widgets: [`select`], labels: [`Mode`], title: `Mode Order`, sources: [App.modes_obj],
    keys: [`mode`], list_text: (items) => {
      return `${items.a} = ${items.b}`
    }})
  }))

  id = `background_pool`

  App.create_popup(Object.assign({}, args, {
    id: `addlist_${id}`, element: App.addlist_register({id: id, pk: `url`,
    widgets: [`text`, `select`, `select`], labels: [`Image URL`, `Effect`, `Tiles`], title: `BG Pool`, image: 0,
    sources: [undefined, App.background_effects, App.background_tiles],
    keys: [`url`, `effect`, `tiles`], list_text: (items) => {
      let s = App.remove_protocol(items.url)

      if (items.effect !== `none`) {
        let eff = App.get_background_effect(items.effect)

        if (eff) {
          s += ` (${eff.text})`
        }
      }

      if (items.tiles !== `none`) {
        s += ` (Tiled)`
      }

      return s
    }})
  }))

  id = `keyboard_shortcuts`

  App.create_popup(Object.assign({}, args, {
    id: `addlist_${id}`, element: App.addlist_register({id: id, pk: `key`,
    widgets: [`key`, `select`, `checkbox`, `checkbox`, `checkbox`],
    labels: [`Key`, `Command`, `Require Ctrl`, `Require Shift`, `Require Alt`], title: `Keyboard Shortcuts`,
    sources: [undefined, App.addlist_commands.slice(0), true, false, false],
    keys: [`key`, `cmd`, `ctrl`, `shift`, `alt`], list_text: (items) => {
      let cmd = cmd_name(items.cmd)
      return `${items.key} = ${cmd}`
    }})
  }))

  for (let id in App.default_settings) {
    let cmd = App.default_settings[id]

    if (cmd.category === `menus`) {
      App.create_popup(Object.assign({}, args, {
        id: `addlist_${id}`, element: App.addlist_register({id: id, pk: `cmd`,
        widgets: [`select`], labels: [`Command`], title: cmd.name,
        sources: [App.addlist_commands.slice(0)],
        keys: [`cmd`], list_text: (items) => {
          return cmd_name(items.cmd)
        }})
      }))
    }
  }
}

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

  let lines = App.get_setting(id)
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

App.addlist = (args = {}) => {
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

    if (w === `image`) {
      el.src = value
    }
    else {
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

  let lines = App.get_setting(id)

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
  let items = App.get_setting(args.id)[args.index]

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

  App.addlist(obj)
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
  App.set_setting(id, lines)
  App.hide_addlist(false)
}

App.addlist_check_buttons = (args) => {
  let remove_el = DOM.el(`#addlist_remove_${args.id}`)
  let move_el = DOM.el(`#addlist_move_${args.id}`)
  let prev_el = DOM.el(`#addlist_prev_${args.id}`)
  let next_el = DOM.el(`#addlist_next_${args.id}`)
  let use_el = DOM.el(`#addlist_use_${args.id}`)
  remove_el.classList.add(`hidden`)
  move_el.classList.add(`hidden`)
  prev_el.classList.add(`hidden`)
  next_el.classList.add(`hidden`)
  use_el.classList.add(`hidden`)

  if (args.edit) {
    let num = App.get_setting(args.id).length
    remove_el.classList.remove(`hidden`)
    move_el.classList.remove(`hidden`)

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

  let lines = App.get_setting(id).slice(0)

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
  let lines = App.get_setting(data.id)
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
  let el = App.addlist_widget(id, i)
  let value

  if (w === `text` || w === `key`) {
    value = el.value.trim()
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

App.addlist_buttons = (args) => {
  DOM.ev(DOM.el(`#settings_${args.id}_add`), `click`, () => {
    App.addlist({id: args.id, items: {}})
  })

  DOM.ev(DOM.el(`#settings_${args.id}_list`), `click`, () => {
    App.addlist_list({id: args.id, use: args.use})
  })

  DOM.ev(DOM.el(`#settings_${args.id}_edit`), `click`, () => {
    App.edit_setting(args.id)
  })

  DOM.ev(DOM.el(`#settings_${args.id}_clear`), `click`, () => {
    App.addlist_clear(args.id)
  })
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
  let lines = App.get_setting(args.id)

  if (!lines.length) {
    App.addlist_no_items()
    return
  }

  let items = []
  let oargs = App.addlist_oargs(args.id)

  for (let [i, line] of lines.entries()) {
    let title = oargs.list_text(line)

    items.push({
      text: title,
      action: () => {
        App.addlist_view({id: args.id, index: i, use: args.use})
      }
    })
  }

  let area = DOM.el(`#settings_${args.id}`)
  NeedContext.show_on_element(area, items, true, area.clientHeight)
}

App.addlist_clear = (id) => {
  if (!App.get_setting(id).length) {
    return
  }

  App.show_confirm(`Clear setting?`, () => {
    App.set_setting(id, [])
  })
}

App.addlist_get_line = (id, items) => {
  let lines = App.get_setting(id)

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
  App.addlist(args)
}

App.addlist_clear_image = () => {
  let data = App.addlist_data
  let img = DOM.el(`#addlist_image_${data.id}`)

  if (img) {
    img.src = ``
  }
}

App.addlist_no_items = () => {
  App.show_feedback(`No items yet`, true)
}