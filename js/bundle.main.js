App.start_about = () => {
  if (App.check_ready(`about`)) {
    return
  }

  App.create_window({
    id: `about`,
    setup: () => {
      App.about_info_items = [
        `Up, Down, and Enter keys navigate and pick items`,
        `Type to filter or search depending on mode`,
        `Cycle modes with the top-left menu or (Shift) Tab`,
        `Cycle with Left and Right if filter is not focused`,
        `Middle Click on tabs closes them`,
        `Esc does Step Back and closes windows`,
        `Shift + Up/Down selects multiple items`,
        `Shift + Home/End selects towards edges`,
        `Ctrl + Click selects multiple items`,
        `Shift + Click selects an item range`,
        `Right Click on items shows the context menu`,
        `Shift + Enter on items shows the context menu`,
        `Ctrl + Home goes to the top`,
        `Ctrl + End goes to the bottom`,
        `Ctrl + Left toggles the Main Menu`,
        `Ctrl + Right toggles Actions`,
        `Ctrl + Up moves tabs to the top`,
        `Ctrl + Down moves tabs to the bottom`,
        `Ctrl + F shows the filters`,
        `Ctrl + Dot goes to the playing tab`,
        `Ctrl + Comma goes to the previous tab`,
        `Delete closes selected tabs`,
        `Ctrl + Delete closes visible tabs when filtered`,
        `Double click on empty tabs space opens a new tab`,
        `Double tap Ctrl to show the command palette`,
        `Command palette commands take into account selected items`,
        `To filter by title start with title:`,
        `To filter by URL start with url:`,
        `To filter with regex start with re:`,
        `To filter with regex by title start with re_title:`,
        `To filter with regex by URL start with re_url:`,
        `Alt + Click selects items without triggering actions`,
        `Right Click on the Main Menu button to show the palette`,
        `Right Click on the Filter button to show filter commands`,
        `Right Click on the Go To Playing button to filter by playing`,
        `Right Click on the Step Back button to show Recent Tabs`,
        `Right Click on the Actions button to show the Browser Menu`,
        `Right Click on the Filter to show recent filters used`,
        `In the filter, $day resolves to the current week day`,
        `In the filter, $month resolves to the current month name`,
        `In the filter, $year resolves to the year number`,
        `Data like settings and profiles can be exported and imported`,
      ]

      let close = DOM.el(`#about_close`)

      DOM.ev(close, `click`, () => {
        App.hide_window()
      })

      close.textContent = App.close_text

      let image = DOM.el(`#about_image`)

      DOM.ev(image, `click`, () => {
        if (image.classList.contains(`rotate_1`)) {
          image.classList.remove(`rotate_1`)
          image.classList.add(`invert`)
        }
        else if (image.classList.contains(`invert`)) {
          image.classList.remove(`invert`)

          if (image.classList.contains(`flipped`)) {
            image.classList.remove(`flipped`)
          }
          else {
            image.classList.add(`flipped`)
          }
        }
        else {
          image.classList.add(`rotate_1`)
        }
      })

      let info = DOM.el(`#about_info`)

      for (let item of App.about_info_items) {
        let el = DOM.create(`div`, `about_info_item filter_item filter_text`)
        el.textContent = item
        info.append(el)
      }

      let s = `${App.manifest.name} v${App.manifest.version}`
      DOM.el(`#about_name`).textContent = s
    },
    after_show: () => {
      let filter = DOM.el(`#about_filter`)

      if (filter.value) {
        App.clear_about_filter()
      }

      DOM.el(`#about_started`).textContent = `Started: ${App.timeago(App.start_date)}`
      DOM.el(`#about_installed`).textContent = `Installed: ${App.timeago(App.first_time.date)}`
      let image = DOM.el(`#about_image`)
      image.classList.remove(`rotate_1`)
      image.classList.remove(`invert`)
      image.classList.remove(`flipped`)
      filter.focus()
    },
    colored_top: true,
  })

  App.filter_about_debouncer = App.create_debouncer(() => {
    App.do_filter_about()
  }, App.filter_delay_2)
}

App.about_filter_focused = () => {
  return document.activeElement.id === `about_filter`
}

App.clear_about_filter = () => {
  if (App.filter_has_value(`about`)) {
    App.set_filter({mode: `about`})
  }
  else {
    App.hide_window()
  }
}

App.filter_about = () => {
  App.filter_about_debouncer.call()
}

App.do_filter_about = () => {
  App.filter_about_debouncer.cancel()
  App.do_filter_2(`about`)
}

App.show_about = () => {
  App.start_about()
  App.show_window(`about`)
}
App.create_actions_menu = (mode) => {
  App[`${mode}_actions`] = App[`${mode}_actions`] || []
  let btn = DOM.create(`div`, `button icon_button`, `${mode}_actions`)
  btn.append(App.create_icon(`sun`))
  btn.title = `Actions (Ctrl + Right) - Right Click to show the Browser Menu`

  DOM.ev(btn, `click`, () => {
    App.show_actions_menu(mode)
  })

  DOM.ev(btn, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_browser_menu(e)
  })

  DOM.ev(btn, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_actions_menu`)
      App.run_command({cmd: cmd, from: `actions_menu`})
    }
  })

  return btn
}

App.show_actions_menu = (mode) => {
  let items = App.custom_menu_items(`${mode}_actions`)
  let btn = DOM.el(`#${mode}_actions`)
  NeedContext.show_on_element(btn, items, true, btn.clientHeight)
}
const Addlist = {}

Addlist.values = (id) => {
  let oargs = Addlist.oargs(id)
  let values = {}

  for (let [i, key] of oargs.keys.entries()) {
    let w = oargs.widgets[i]
    let value = Addlist.get_value(i, w)
    values[key] = value
  }

  return values
}

Addlist.save = (id) => {
  let data = Addlist.data

  if (data.edit) {
    let modified = Addlist.modified(id)

    if (!modified) {
      Addlist.hide(false)
      return false
    }
  }

  let line = Addlist.values(id)
  let filled = Addlist.filled(line)

  if (!filled) {
    return false
  }

  let oargs = Addlist.oargs(id)
  let v1 = ``

  if (data.edit && Object.keys(data.items).length) {
    v1 = data.items[oargs.pk]
  }

  if (v1) {
    Addlist.remove(id, v1, true)
  }

  let v2 = line[oargs.pk]

  if (v2 && (v1 !== v2)) {
    Addlist.remove(id, v2, true)
  }

  let lines = Addlist.get_data(id)
  line._date_ = App.now()
  lines.splice(data.index, 0, line)
  Addlist.after(id, lines)
  return true
}

Addlist.register = (args = {}) => {
  let def_args = {
    labels: [],
    sources: [],
  }

  args = Object.assign(def_args, args)
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
    else if (w === `textarea`) {
      let el = DOM.create(`textarea`, `text addlist_textarea`, id)
      el.spellcheck = false
      el.autocomplete = false
      el.placeholder = args.labels[i] || `Value`
      els.push(el)
    }
    else if (w === `menu`) {
      let el = DOM.create(`div`, `addlist_menu`)
      let label = DOM.create(`div`)
      label.textContent = args.labels[i] || `Select`

      App[`addlist_menubutton_${args.id}_${i}`] = Menubutton.create({
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
      let el = DOM.create(`div`, `addlist_checkbox`)
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
  let btns = DOM.create(`div`, `addlist_buttons`)
  let remove = DOM.create(`div`, `button`, `addlist_remove_${args.id}`)
  remove.textContent = `Rem`
  let save = DOM.create(`div`, `button`, `addlist_save_${args.id}`)
  save.textContent = `Save`
  let menu = DOM.create(`div`, `button icon_button`, `addlist_menu_${args.id}`)
  menu.append(App.create_icon(`sun`))

  DOM.ev(save, `click`, () => {
    Addlist.save(args.id)
  })

  DOM.ev(remove, `click`, () => {
    let data = Addlist.data

    if (data.edit && Object.keys(data.items).length) {
      Addlist.remove(args.id, data.items[args.pk])
    }
  })

  DOM.ev(menu, `click`, () => {
    Addlist.menu()
  })

  btns.append(remove)
  btns.append(menu)
  btns.append(save)
  container.append(btns)
  App[`addlist_args_${args.id}`] = args
  return container
}

Addlist.edit = (args = {}) => {
  let def_args = Addlist.def_args()
  args = Object.assign(def_args, args)
  let oargs = Addlist.oargs(args.id)
  App.show_popup(Addlist.popup(args.id))
  Addlist.check_buttons(args)
  let widgets = oargs.widgets

  for (let [i, key] of oargs.keys.entries()) {
    let value = args.items[key]
    let el = Addlist.widget(args.id, i)
    let w = widgets[i]

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

  Addlist.data = args
  Addlist.check_focus(args.id)
}

Addlist.remove = (id, value, force) => {
  if (!value) {
    return
  }

  let lines = Addlist.get_data(id)

  if (!lines.length) {
    return
  }

  let oargs = Addlist.oargs(id)

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

    Addlist.after(id, new_lines)
  }, undefined, force)
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
  Addlist.next(Addlist.data.id, true)
}

Addlist.right = () => {
  Addlist.next(Addlist.data.id)
}

Addlist.after = (id, lines) => {
  Addlist.set_data(id, lines)
  Addlist.hide(false)
  Addlist.update_count(id)
}

Addlist.check_buttons = (args) => {
  let remove_el = DOM.el(`#addlist_remove_${args.id}`)
  let menu_el = DOM.el(`#addlist_menu_${args.id}`)
  let prev_el = DOM.el(`#addlist_prev_${args.id}`)
  let next_el = DOM.el(`#addlist_next_${args.id}`)
  let date_el = DOM.el(`#addlist_date_${args.id}`)
  remove_el.classList.add(`hidden`)
  menu_el.classList.add(`hidden`)
  prev_el.classList.add(`hidden`)
  next_el.classList.add(`hidden`)
  date_el.classList.add(`hidden`)

  if (args.edit) {
    let num = Addlist.get_data(args.id).length
    remove_el.classList.remove(`hidden`)
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

Addlist.widget = (id, i = 0) => {
  return DOM.el(`#addlist_widget_${id}_${i}`)
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

  for (let [i, w] of oargs.widgets.entries()) {
    let el = Addlist.widget(id, i)

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

Addlist.menu = (e) => {
  let id = Addlist.data.id
  let data = Addlist.data
  let items = []

  items.push({
    text: `New Item`,
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
  NeedContext.show_on_element(btn, items, true, btn.clientHeight)
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

Addlist.get_value = (i, w) => {
  let id = Addlist.data.id
  let oargs = Addlist.oargs(id)
  let el = Addlist.widget(id, i)
  let value

  if (w === `text` || w === `textarea` || w === `key`) {
    value = el.value.trim()

    if (oargs.lowercase) {
      value = value.toLowerCase()
    }
  }
  else if (w === `menu`) {
    value = App[`addlist_menubutton_${id}_${i}`].value
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
    App.show_confirm(`Save changes?`, () => {
      Addlist.save(data.id)
    }, () => {
      App.hide_popup(p_id, true)
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

Addlist.filled = (values) => {
  for (let key in values) {
    if (values[key] === ``) {
      return false
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

  NeedContext.show_on_element(btn, items, true, btn.clientHeight)
}

Addlist.clear = (id, force = false) => {
  let data = Addlist.get_data(id)

  if (!data) {
    return
  }

  if (!Addlist.get_data(id).length) {
    return
  }

  App.show_confirm(`Clear this list?`, () => {
    Addlist.after(id, [])
  }, undefined, force)
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
    Addlist.list({id: id})
  })

  DOM.ev(DOM.el(`#addlist_button_${id}_add`), `click`, () => {
    Addlist.edit({id: id, items: {}})
  })

  DOM.ev(DOM.el(`#addlist_button_${id}_list`), `click`, () => {
    Addlist.list({id: id})
  })

  DOM.ev(DOM.el(`#addlist_button_${id}_edit`), `click`, () => {
    Addlist.edit_all(id)
  })

  DOM.ev(DOM.el(`#addlist_button_${id}_clear`), `click`, () => {
    Addlist.clear(id)
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

  App.show_input(id, `Save`, (text) => {
    try {
      Addlist.after(id, App.obj(text))
      return true
    }
    catch (err) {
      App.alert(`${err}`)
      return false
    }
  }, value)
}

Addlist.update_count = (id) => {
  let lines = Addlist.get_data(id)

  if (!lines) {
    return
  }

  DOM.el(`#addlist_button_${id}_count`).textContent = `(${lines.length})`
}
App.alert = (message, autohide_delay = 0) => {
  App.start_popups()
  let msg = DOM.el(`#alert_message`)
  let text = App.make_html_safe(message)
  text = text.replace(/\n/g, `<br>`)
  msg.innerHTML = text
  App.show_popup(`alert`)

  if (autohide_delay > 0) {
    App.alert_timeout = setTimeout(() => {
      App.hide_popup(`alert`)
    }, autohide_delay)
  }
}

App.alert_autohide = (message, force = false) => {
  if (!force) {
    if (!App.get_setting(`show_feedback`)) {
      return
    }
  }

  App.alert(message, App.alert_autohide_delay)
}
App.setup_bookmarks = () => {
  browser.bookmarks.onCreated.addListener((id, info) => {
    App.debug(`Bookmark Created: ID: ${id}`)

    if (App.active_mode === `bookmarks`) {
      App.insert_item(`bookmarks`, info)
    }
  })

  browser.bookmarks.onRemoved.addListener((id, info) => {
    App.debug(`Bookmark Removed: ID: ${id}`)

    if (App.active_mode === `bookmarks`) {
      let item = App.get_item_by_id(`bookmarks`, id)

      if (item) {
        App.remove_item(item)
      }
    }
  })

  browser.bookmarks.onChanged.addListener((id, info) => {
    App.debug(`Bookmark Changed: ID: ${id}`)

    if (App.active_mode === `bookmarks`) {
      let item = App.get_item_by_id(`bookmarks`, id)

      if (item) {
        App.update_item(`bookmarks`, item.id, info)
      }
    }
  })
}

App.get_bookmarks = async (query = ``, deep = false) => {
  App.getting(`bookmarks`)
  let results = []

  try {
    results = await browser.bookmarks.search({query: query})
  }
  catch (err) {
    App.error(err)
    return []
  }

  results = results.filter(x => x.type === `bookmark`)
  let folder = await App.get_bookmarks_folder()
  let b1 = results.filter(x => x.parentId === folder.id)
  b1.sort((a, b) => b.index - a.index)
  let b2 = []

  if (App.get_setting(`all_bookmarks`)) {
    b2 = results.filter(x => x.parentId !== folder.id)
    b2.sort((a, b) => b.index - a.index)
  }

  let bookmarks = [...b1, ...b2]
  App.last_bookmarks_query = query
  let max_items = App.get_setting(`max_search_items`)

  if (deep) {
    max_items = App.get_setting(`deep_max_search_items`)
  }

  return bookmarks.slice(0, max_items)
}

App.bookmarks_action = (item) => {
  App.on_action(`bookmarks`)
  App.focus_or_open_item(item)
}

App.get_bookmarks_folder = async () => {
  let bookmarks_folder = App.get_setting(`bookmarks_folder`)

  if (!bookmarks_folder) {
    bookmarks_folder = App.get_default_setting(`bookmarks_folder`)
  }

  let results = await browser.bookmarks.search({title: bookmarks_folder})
  let folder

  for (let res of results) {
    if (res.title === bookmarks_folder && res.type === `folder`) {
      folder = res
      break
    }
  }

  if (!folder) {
    folder = await browser.bookmarks.create({title: bookmarks_folder})
  }

  return folder
}

App.bookmark_items = async (item, active, feedback = true) => {
  if (!active) {
    active = App.get_active_items(item.mode, item)
  }

  let folder = await App.get_bookmarks_folder()
  let bookmarks = await browser.bookmarks.getChildren(folder.id)

  for (let b of bookmarks) {
    b.url = App.format_url(b.url || ``)
  }

  let add = []
  let bump = []

  for (let item of active) {
    let bumped = false

    for (let b of bookmarks) {
      if (item.url === b.url) {
        bump.push(b.id)
        bumped = true
        break
      }
    }

    if (!bumped) {
      let ok = true

      for (let a of add) {
        if (a.url === item.url) {
          ok = false
          break
        }
      }

      if (ok) {
        add.push(item)
      }
    }
  }

  if (!add.length && !bump.length) {
    return
  }

  let items = [...add, ...bump]

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_bookmark`, items)

  App.show_confirm(`Bookmark these items? (${items.length})`, async () => {
    for (let item of add) {
      let title = App.get_title(item)
      await browser.bookmarks.create({parentId: folder.id, title: title, url: item.url})
    }

    for (let id of bump) {
      await browser.bookmarks.move(id, {index: bookmarks.length - 1})
    }

    if (feedback) {
      App.alert_autohide(`Bookmarked`)
    }
  }, undefined, force)
}

App.bookmark_active = async () => {
  let tab = await App.get_active_tab()

  let item = {
    title: tab.title,
    url: App.format_url(tab.url || ``),
  }

  App.bookmark_items(undefined, [item])
}
App.create_box = (mode) => {
  let box = DOM.create(`div`, `box`, `box_${mode}`)
  return box
}

App.update_tab_box = (new_active) => {
  let c = DOM.el(`#box_tabs`)
  c.innerHTML = ``

  for (let item of App.active_history) {
    if (item === new_active) {
      continue
    }

    let clone = DOM.create(`div`, `box_item action`)
    let icon = DOM.create(`div`, `box_item_icon`)
    let o_icon = DOM.el(`.item_icon`, item.element).cloneNode(true)

    if (o_icon.tagName === `IMG`) {
      icon.append(o_icon)
    }
    else if (o_icon.tagName === `CANVAS`) {
      icon.append(App.get_jdenticon(item.hostname))
    }

    let text = DOM.create(`div`, `box_item_text`)
    text.textContent = item.title
    clone.append(icon)
    clone.append(text)
    clone.title = item.url

    DOM.ev(clone, `click`, () => {
      App.tabs_action(item)
    })

    c.append(clone)
    App.scroll_to_top(c)
  }
}
App.start_close_tabs = () => {
  if (App.check_ready(`close_tabs`)) {
    return
  }

  App.create_popup({
    id: `close_tabs`,
    setup: () => {
      App.close_tabs_types = [`normal`, `playing`, `unloaded`, `duplicate`, `visible`]

      DOM.ev(DOM.el(`#close_tabs_include_pins`), `change`, () => {
        App.update_close_tabs_popup_button(App.close_tabs_type)
      })

      DOM.ev(DOM.el(`#close_tabs_include_unloaded`), `change`, () => {
        App.update_close_tabs_popup_button(App.close_tabs_type)
      })

      DOM.ev(DOM.el(`#close_tabs_button`), `click`, () => {
        App.close_tabs_action()
      })

      DOM.ev(DOM.el(`#close_tabs_prev`), `click`, () => {
        App.close_tabs_next(true)
      })

      DOM.ev(DOM.el(`#close_tabs_next`), `click`, () => {
        App.close_tabs_next()
      })

      DOM.ev(DOM.el(`#close_tabs_title`), `click`, (e) => {
        App.show_close_tabs_menu(e)
      })
    },
  })
}

App.close_tab_or_tabs = async (id_or_ids) => {
  try {
    await browser.tabs.remove(id_or_ids)
  }
  catch (err) {
    App.error(err)
  }
}

App.close_tabs_method = (items, force) => {
  let ids = items.map(x => x.id)

  if (!ids.length) {
    return
  }

  App.show_confirm(`Close tabs? (${ids.length})`, () => {
    App.close_tab_or_tabs(ids)
    App.hide_all_popups()
  }, undefined, force)
}

App.close_tabs = (item, multiple = true) => {
  let items = App.get_active_items(`tabs`, item, multiple)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  let force = App.check_force(`warn_on_close_tabs`, items)
  App.close_tabs_method(items, force)
}

App.close_tabs_popup = (type) => {
  App.start_close_tabs()
  App.close_tabs_type = type
  App.show_popup(`close_tabs`)
  let title = App.capitalize_words(`Close ${type}`)
  DOM.el(`#close_tabs_title`).textContent = title
  DOM.el(`#close_tabs_include_pins`).checked = false
  DOM.el(`#close_tabs_include_unloaded`).checked = false
  let pins_c = DOM.el(`#close_tabs_include_pins_container`)
  let unloaded_c = DOM.el(`#close_tabs_include_unloaded_container`)
  pins_c.classList.remove(`disabled`)
  unloaded_c.classList.remove(`disabled`)

  if (type === `normal`) {
    pins_c.classList.add(`disabled`)
  }
  else if (type === `unloaded` || type === `playing`) {
    unloaded_c.classList.add(`disabled`)
  }

  App.update_close_tabs_popup_button(type)
}

App.close_tabs_args = () => {
  let pins = DOM.el(`#close_tabs_include_pins`).checked
  let unloaded = DOM.el(`#close_tabs_include_unloaded`).checked
  return [pins, unloaded]
}

App.update_close_tabs_popup_button = (type) => {
  let args = App.close_tabs_args()
  let items = App[`get_${type}_tabs_items`](...args)
  DOM.el(`#close_tabs_button`).textContent = `Close (${items.length})`
}

App.close_tabs_action = () => {
  let args = App.close_tabs_args()
  App[`close_${App.close_tabs_type}_tabs`](...args)
}

App.get_normal_tabs_items = (pins, unloaded) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (it.pinned) {
      continue
    }

    if (it.audible) {
      continue
    }

    if (!unloaded) {
      if (it.discarded) {
        continue
      }
    }

    items.push(it)
  }

  return items
}

App.close_normal_tabs = (pins, unloaded) => {
  let items = App.get_normal_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  let force = App.check_force(`warn_on_close_normal_tabs`, items)
  App.close_tabs_method(items, force)
}

App.get_playing_tabs_items = (pins, unloaded) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (!it.audible) {
      continue
    }

    if (!pins) {
      if (it.pinned) {
        continue
      }
    }

    items.push(it)
  }

  return items
}

App.close_playing_tabs = (pins, unloaded) => {
  let items = App.get_playing_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  let force = App.check_force(`warn_on_close_playing_tabs`, items)
  App.close_tabs_method(items, force)
}

App.get_unloaded_tabs_items = (pins, unloaded) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (!it.discarded) {
      continue
    }

    if (!pins) {
      if (it.pinned) {
        continue
      }
    }

    items.push(it)
  }

  return items
}

App.close_unloaded_tabs = (pins, unloaded) => {
  let items = App.get_unloaded_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  let force = App.check_force(`warn_on_close_unloaded_tabs`, items)
  App.close_tabs_method(items, force)
}

App.get_duplicate_tabs_items = (pins, unloaded) => {
  let tabs = App.get_items(`tabs`)
  let duplicates = App.find_duplicates(tabs, `url`)
  let items = App.get_excess(duplicates, `url`)
  items = items.filter(x => !x.audible)

  if (!pins) {
    items = items.filter(x => !x.pinned)
  }

  if (!unloaded) {
    items = items.filter(x => !x.discarded)
  }

  return items
}

App.close_duplicate_tabs = (pins, unloaded) => {
  let items = App.get_duplicate_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  let force = App.check_force(`warn_on_close_duplicate_tabs`, items)
  App.close_tabs_method(items, force)
}

App.get_visible_tabs_items = (pins, unloaded) => {
  let items = App.get_visible(`tabs`)
  items = items.filter(x => !x.audible)

  if (!pins) {
    items = items.filter(x => !x.pinned)
  }

  if (!unloaded) {
    items = items.filter(x => !x.discarded)
  }

  return items
}

App.close_visible_tabs = (pins, unloaded) => {
  let items = App.get_visible_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  let force = App.check_force(`warn_on_close_visible_tabs`, items)
  App.close_tabs_method(items, force)
}

App.close_other_new_tabs = (id) => {
  let items = App.get_items(`tabs`)
  let ids = []

  for (let item of items) {
    if (App.is_new_tab(item.url)) {
      if (item.id !== id) {
        ids.push(item.id)
      }
    }
  }

  if (ids.length) {
    App.close_tab_or_tabs(ids)
  }
}

App.show_close_tabs_menu = (e) => {
  let items = []

  items.push({
    text: `Close Normal`,
    action: () => {
      App.close_tabs_popup(`normal`)
    }
  })

  items.push({
    text: `Close Playing`,
    action: () => {
      App.close_tabs_popup(`playing`)
    }
  })

  items.push({
    text: `Close Unloaded`,
    action: () => {
      App.close_tabs_popup(`unloaded`)
    }
  })

  items.push({
    text: `Close Duplicate`,
    action: () => {
      App.close_tabs_popup(`duplicate`)
    }
  })

  items.push({
    text: `Close Visible`,
    action: () => {
      App.close_tabs_popup(`visible`)
    }
  })

  App.show_center_context(items, e)
}

App.close_tabs_next = (reverse = false) => {
  let types = App.close_tabs_types.slice(0)

  if (reverse) {
    types.reverse()
  }

  let waypoint = false

  for (let type of types) {
    if (waypoint) {
      App.close_tabs_popup(type)
      return
    }

    if (App.close_tabs_type === type) {
      waypoint = true
    }
  }

  App.close_tabs_popup(types[0])
}

App.nothing_to_close = () => {
  App.alert(`Nothing to close`)
}
App.setup_closed = () => {
  browser.sessions.onChanged.addListener(() => {
    if (App.active_mode === `closed`) {
      App.closed_changed = true
    }
  })
}

App.get_closed = async () => {
  App.getting(`closed`)
  let results

  try {
    results = await browser.sessions.getRecentlyClosed({
      maxResults: App.max_closed
    })
  }
  catch (err) {
    App.error(err)
    return []
  }

  results = results.filter(x => x.tab)
  return results.map(x => x.tab)
}

App.closed_action = (item) => {
  App.on_action(`closed`)
  App.focus_or_open_item(item)
}

App.reopen_tab = async () => {
  let closed = await App.get_closed()

  if (closed && closed.length) {
    browser.sessions.restore(closed[0].sessionId)
  }
}

App.forget_closed = () => {
  let items = App.get_items(`closed`)

  App.show_confirm(`Forget closed tabs? (${items.length})`, async () => {
    for (let item of items) {
      await browser.sessions.forgetClosedTab(item.window_id, item.session_id)
    }

    App.after_forget()
  })
}

App.forget_closed_item = (item) => {
  let active = App.get_active_items(`closed`, item)

  App.show_confirm(`Forget closed tabs? (${active.length})`, async () => {
    for (let item of active) {
      await browser.sessions.forgetClosedTab(item.window_id, item.session_id)
    }

    App.after_forget()
  }, undefined, active.length <= 1)
}

App.after_forget = () => {
  App.show_mode({mode: `closed`, force: true})
}
App.setup_commands = () => {
  let command_icon = App.command_icon
  let pin_icon = App.get_setting(`pin_icon`) || command_icon
  let normal_icon = App.get_setting(`normal_icon`) || command_icon
  let playing_icon = App.get_setting(`playing_icon`) || command_icon
  let unloaded_icon = App.get_setting(`unloaded_icon`) || command_icon
  let notes_icon = App.get_setting(`notes_icon`) || command_icon
  let settings_icon = App.settings_icons.general
  let theme_icon = App.settings_icons.theme
  let filter_icon = App.settings_icons.filter
  let media_icon = App.settings_icons.media
  let tabs_icon =  App.mode_icons.tabs
  let bookmarks_icon = App.mode_icons.bookmarks
  let closed_icon = App.mode_icons.closed
  let browser_icon = App.browser_icon
  let clipboard_icon = App.clipboard_icon
  let profile_icon = App.profile_icon
  let tag_icon = App.tag_icon
  let bot_icon = App.bot_icon
  let color_filters = []
  let color_changers = []

  color_filters.push({
    name: `Filter All Colors`,
    cmd: `filter_color_all`,
    mode: `items`,
    icon: theme_icon,
    action: (args) => {
      App.filter_color(args.mode, `all`)
    },
    info: `Filter: Show all colors`
  })

  for (let color of App.colors) {
    let icon = App.color_icon(color)
    let name = `Filter ${App.capitalize(color)}`

    color_filters.push({
      name: name,
      cmd: `filter_color_${color}`,
      mode: `items`,
      icon: icon,
      action: (args) => {
        App.filter_color(args.mode, color)
      },
      info: `Filter: Show color (${color})`
    })

    icon = App.color_icon(color)
    name = `Color ${App.capitalize(color)}`

    color_changers.push({
      name: name,
      cmd: `change_color_${color}`,
      mode: `items`,
      item: true,
      icon: icon,
      action: (args) => {
        App.change_color(args.item, color)
      },
      info: `Change color of profile: ${color}`
    })

    icon = App.color_icon(color)
    name = `Toggle ${App.capitalize(color)}`

    color_changers.push({
      name: name,
      cmd: `toggle_color_${color}`,
      mode: `items`,
      item: true,
      icon: icon,
      action: (args) => {
        App.change_color(args.item, color, true)
      },
      info: `Toggle color on or off: ${color}`
    })
  }

  color_changers.push({
    name: `Remove Color`,
    cmd: `remove_color`,
    mode: `items`,
    item: true,
    icon: theme_icon,
    action: (args) => {
      App.change_color(args.item, `none`)
    },
    info: `Remove the current color of items`
  })

  color_changers.push({
    name: `Color Menu`,
    cmd: `show_color_menu`,
    mode: `items`,
    item: true,
    icon: theme_icon,
    action: (args) => {
      App.show_color_menu(args.item, args.e)
    }, info: `Show the colors menu`
  })

  color_changers.push({
    name: `Filter Color Menu`,
    cmd: `show_filter_color_menu`,
    mode: `items`,
    item: true,
    icon: theme_icon,
    action: (args) => {
      App.show_filter_color_menu(args.mode, args.e)
    }, info: `Show the filter color menu`
  })

  let media_filters = []

  for (let media of App.media_types) {
    let icon = App.get_setting(`${media}_icon`) || command_icon
    let name = `Filter ${App.capitalize(media)}`.trim()

    media_filters.push({
      name: name,
      cmd: `filter_media_${media}`,
      mode: `items`,
      icon: icon,
      action: (args) => {
        App.set_filter_mode({mode: args.mode, type: media})
      },
      info: `Filter: Show media items (${media})`
    })
  }

  let show_modes = []

  for (let mode of App.modes) {
    let icon = App.mode_icons[mode]
    let name = `Show ${App.get_mode_name(mode)}`

    show_modes.push({
      name: name,
      cmd: `show_mode_${mode}`,
      icon: icon,
      action: (args) => {
        App.show_mode({mode: mode})
      },
      info: `Show mode: ${mode}`
    })
  }

  App.commands = [
    {
      name: `Go To Top`,
      cmd: `go_to_top`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.goto_top()
      },
      info: `Go to the top of the list`
    },
    {
      name: `Go To Bottom`,
      cmd: `go_to_bottom`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.goto_bottom()
      },
      info: `Go to the bottom of the list`
    },
    {
      name: `Step Back`,
      cmd: `step_back`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.step_back()
      },
      info: `Trigger the back button`
    },
    {
      name: `Recent Tabs`,
      cmd: `show_recent_tabs`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.show_recent_tabs()
      },
      info: `Show the recent previous tabs`
    },
    {
      name: `Select All`,
      cmd: `select_all_items`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.select_all(args.mode, true)
      },
      info: `Select all items`
    },
    {
      name: App.separator_string
    },
    {
      name: `Previous Mode`,
      cmd: `show_previous_mode`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.cycle_modes(true)
      },
      info: `Go to the previous mode`
    },
    {
      name: `Next Mode`,
      cmd: `show_next_mode`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.cycle_modes()
      },
      info: `Go to the next mode`
    },

    ...show_modes,

    {
      name: `Show Primary`,
      cmd: `show_primary_mode`,
      icon: command_icon,
      action: (args) => {
        App.show_primary_mode()
      },
      info: `Show the primary mode`
    },
    {
      name: `Show Settings`,
      cmd: `show_settings`,
      icon: settings_icon,
      action: (args) => {
        App.show_settings()
      },
      info: `Show the settings`
    },
    {
      name: `Show About`,
      cmd: `show_about`,
      icon: bot_icon,
      action: (args) => {
        App.show_about()
      },
      info: `Show the about window`
    },
    {
      name: `Show Palette`,
      cmd: `show_palette`,
      icon: command_icon,
      action: (args) => {
        App.show_palette()
      },
      info: `Show the palette`
    },
    {
      name: `Item Menu`,
      cmd: `show_item_menu`,
      mode: `items`,
      item: true,
      icon: command_icon,
      action: (args) => {
        App.show_item_menu_2(args.item)
      },
      info: `Show the item menu`
    },
    {
      name: `Filter All`,
      cmd: `filter_all`,
      mode: `items`,
      icon: command_icon,
      action: (args) => {
        App.filter_all(args.mode)
      },
      info: `Filter: Show all items`
    },
    {
      name: App.separator_string
    },
    {
      name: `Item Action`,
      cmd: `item_action`,
      mode: `items`,
      item: true,
      icon: command_icon,
      action: (args) => {
        App[`${args.mode}_action`](args.item)
      },
      info: `Trigger the action for the selected item`
    },
    {
      name: `Open`,
      cmd: `open_items`,
      mode: `items`,
      item: true,
      icon: command_icon,
      action: (args) => {
        App.open_items(args.item, true)
      },
      info: `Open items`
    },
    {
      name: `Bookmark`,
      cmd: `bookmark_items`,
      mode: `items`,
      item: true,
      icon: bookmarks_icon,
      action: (args) => {
        App.bookmark_items(args.item)
      },
      info: `Bookmark this item`
    },
    {
      name: `Bookmark Page`,
      cmd: `bookmark_page`,
      item: true,
      icon: bookmarks_icon,
      action: (args) => {
        App.bookmark_active(args.item)
      },
      info: `Bookmark the current page`
    },
    {
      name: `Copy URL`,
      cmd: `copy_item_url`,
      mode: `items`,
      item: true,
      icon: clipboard_icon,
      action: (args) => {
        App.copy_url(args.item)
      },
      info: `Copy the URL of an item`
    },
    {
      name: `Copy Title`,
      cmd: `copy_item_title`,
      mode: `items`,
      item: true,
      icon: clipboard_icon,
      action: (args) => {
        App.copy_title(args.item)
      },
      info: `Copy the title of an item`
    },
    {
      name: App.separator_string
    },
    {
      name: `Go Back`,
      cmd: `browser_back`,
      icon: browser_icon,
      action: (args) => {
        App.browser_back()
      },
      info: `Go back in browser history`
    },
    {
      name: `Go Forward`,
      cmd: `browser_forward`,
      icon: browser_icon,
      action: (args) => {
        App.browser_forward()
      },
      info: `Go forward in browser history`
    },
    {
      name: `Reload Page`,
      cmd: `browser_reload`,
      icon: browser_icon,
      action: (args) => {
        App.browser_reload()
      },
      info: `Reload the current page`
    },
    {
      name: `Browser Menu`,
      cmd: `show_browser_menu`,
      icon: browser_icon,
      action: (args) => {
        App.show_browser_menu(args.e)
      },
      info: `Show the browser menu`
    },
    {
      name: App.separator_string
    },
    {
      name: `New`,
      cmd: `open_new_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.new_tab()
      },
      info: `Open a new tab`
    },
    {
      name: `Unload`,
      cmd: `unload_tabs`,
      mode: `tabs`,
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.unload_tabs(args.item)
      },
      info: `Unload tabs`
    },
    {
      name: `Load`,
      cmd: `load_tabs`,
      mode: `tabs`,
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.load_tabs(args.item)
      },
      info: `Load tabs that are unloaded`
    },
    {
      name: `Duplicate`,
      cmd: `duplicate_tabs`,
      mode: `tabs`,
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.duplicate_tabs(args.item)
      },
      info: `Duplicate tabs`
    },
    {
      name: `Detach`,
      cmd: `detach_tabs`,
      mode: `tabs`,
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.detach_tabs(args.item)
      },
      info: `Detach tabs to another window`
    },
    {
      name: `To Window`,
      cmd: `show_windows_menu`,
      mode: `tabs`,
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.to_window(args.item)
      },
      info: `Detach tabs to another window`
    },
    {
      name: `Move To Top`,
      cmd: `move_tabs_to_top`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.move_tabs_vertically(`top`)
      },
      info: ``
    },
    {
      name: `Move To Bottom`,
      cmd: `move_tabs_to_bottom`,
      mode: `tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.move_tabs_vertically(`bottom`)
      },
      info: `Move tabs to the top`
    },
    {
      name: `Pin`,
      cmd: `pin_tabs`,
      mode: `tabs`,
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.pin_tabs(args.item)
      },
      info: `Pin tabs`
    },
    {
      name: `Unpin`,
      cmd: `unpin_tabs`,
      mode: `tabs`,
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.unpin_tabs(args.item)
      },
      info: `Unpin tabs`
    },
    {
      name: `Toggle Pin`,
      cmd: `toggle_pin_tabs`,
      mode: `tabs`,
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.toggle_pin_tabs(args.item)
      },
      info: `Pin or unpin tabs`
    },
    {
      name: `Mute`,
      cmd: `mute_tabs`,
      mode: `tabs`,
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.mute_tabs(args.item)
      },
      info: `Mute tabs`
    },
    {
      name: `Unmute`,
      cmd: `unmute_tabs`,
      mode: `tabs`,
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.unmute_tabs(args.item)
      },
      info: `Unmite tabs`
    },
    {
      name: `Toggle Mute`,
      cmd: `toggle_mute_tabs`,
      mode: `tabs`,
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.toggle_mute_tabs(args.item)
      },
      info: `Mute or unmute tabs`
    },
    {
      name: `Close`,
      cmd: `close_tabs`,
      mode: `tabs`,
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.close_tabs(args.item)
      },
      info: `Close tabs`
    },
    {
      name: `Close Menu`,
      cmd: `show_close_tabs_menu`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.show_close_tabs_menu(args.e)
      },
      info: `Open the menu with some tab closing options`
    },
    {
      name: `Close Normal`,
      cmd: `close_normal_tabs`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.close_tabs_popup(`normal`)
      },
      info: `Close normal tabs`
    },
    {
      name: `Close Playing`,
      cmd: `close_playing_tabs`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.close_tabs_popup(`playing`)
      },
      info: `Close playing tabs`
    },
    {
      name: `Close Unloaded`,
      cmd: `close_unloaded_tabs`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.close_tabs_popup(`unloaded`)
      },
      info: `Close unloaded tabs`
    },
    {
      name: `Close Duplicate`,
      cmd: `close_duplicate_tabs`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.close_tabs_popup(`duplicate`)
      },
      info: `Close duplicate tabs`
    },
    {
      name: `Close Visible`,
      cmd: `close_visible_tabs`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.close_tabs_popup(`visible`)
      },
      info: `Close visible tabs`
    },
    {
      name: `Go To Playing`,
      cmd: `go_to_playing_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.go_to_playing_tab()
      },
      info: `Go the tab emitting sound`
    },
    {
      name: `Sort`,
      cmd: `sort_tabs`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.sort_tabs()
      },
      info: `Open the sort tabs window`
    },
    {
      name: `Show Info`,
      cmd: `show_tabs_info`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.show_tabs_info()
      },
      info: `Show some tab info`
    },
    {
      name: `Show URLs`,
      cmd: `show_tab_urls`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.show_tab_urls()
      },
      info: `Show a list of open URLs`
    },
    {
      name: `Open URLs`,
      cmd: `open_tab_urls`,
      mode: `items`,
      icon: tabs_icon,
      action: (args) => {
        App.open_tab_urls()
      },
      info: `Open a list of URLs`
    },
    {
      name: `Reopen`,
      cmd: `reopen_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.reopen_tab()
      },
      info: `Reopen the latest closed tab`
    },
    {
      name: `Select Pins`,
      cmd: `select_pinned_tabs`,
      mode: `tabs`,
      icon: pin_icon,
      action: (args) => {
        App.select_tabs(`pins`)
      },
      info: `Select all pinned tabs`
    },
    {
      name: `Select Normal`,
      cmd: `select_normal_tabs`,
      mode: `tabs`,
      icon: normal_icon,
      action: (args) => {
        App.select_tabs(`normal`)
      },
      info: `Select all normal tabs`
    },
    {
      name: App.separator_string
    },
    {
      name: `Filter History`,
      cmd: `show_filter_history`,
      mode: `items`,
      icon: filter_icon,
      action: (args) => {
        App.show_filter_history(args.mode, args.e)
      },
      info: `Show the filter history`
    },
    {
      name: `Deep Search`,
      cmd: `deep_search`,
      mode: `search`,
      icon: filter_icon,
      action: (args) => {
        App.deep_search(args.mode)
      },
      info: `Do a deep search`
    },
    {
      name: `Search Media`,
      cmd: `show_search_media_menu`,
      mode: `items`,
      icon: media_icon,
      action: (args) => {
        App.search_media(args.mode, args.e)
      },
      info: `Search for media`
    },
    {
      name: `Forget Closed`,
      cmd: `forget_closed`,
      mode: `closed`,
      icon: closed_icon,
      action: (args) => {
        App.forget_closed()
      },
      info: `Forget closed items`
    },
    {
      name: App.separator_string
    },
    {
      name: `Edit Profile`,
      cmd: `edit_profile`,
      mode: `items`,
      item: true,
      icon: profile_icon,
      action: (args) => {
        App.edit_profiles(args.item)
      },
      info: `Edit the profile of a URL`
    },
    {
      name: `Add Note`,
      cmd: `profiles_add_note`,
      mode: `items`,
      item: true,
      icon: notes_icon,
      item: true,
      action: (args) => {
        App.add_note(args.item)
      },
      info: `Add notes to a profile`
    },
    {
      name: `Add Tag`,
      cmd: `profiles_add_tag`,
      mode: `items`,
      item: true,
      icon: tag_icon,
      action: (args) => {
        App.add_tag(args.item)
      },
      info: `Add tags to a profile`
    },
    {
      name: `Edit Title`,
      cmd: `profiles_edit_title`,
      mode: `items`,
      item: true,
      icon: profile_icon,
      action: (args) => {
        App.edit_title(args.item)
      },
      info: `Edit a profile's title`
    },
    {
      name: `Edit Icon`,
      cmd: `profiles_edit_icon`,
      mode: `items`,
      item: true,
      icon: profile_icon,
      action: (args) => {
        App.edit_icon(args.item)
      },
      info: `Edit a profile's icon`
    },
    {
      name: App.separator_string
    },

    ...color_changers,

    {
      name: App.separator_string
    },

    ...media_filters,
    ...color_filters,

    {
      name: `Filter Domain`,
      cmd: `filter_domain`,
      mode: `items`,
      item: true,
      icon: filter_icon,
      action: (args) => {
        App.filter_domain(args.item)
      },
      info: `Filter: Show same domain`
    },
    {
      name: `Filter Color`,
      cmd: `filter_color`,
      mode: `items`,
      item: true,
      icon: theme_icon,
      color: true,
      action: (args) => {
        App.filter_color(args.mode, args.item.color)
      },
      info: `Filter: Show same color`
    },
    {
      name: `Filter Pins`,
      cmd: `filter_pinned`,
      mode: `tabs`,
      icon: pin_icon,
      action: (args) => {
        App.filter_pinned(args.mode)
      },
      info: `Filter: Show pinned tabs`
    },
    {
      name: `Filter Normal`,
      cmd: `filter_normal`,
      mode: `tabs`,
      icon: normal_icon,
      action: (args) => {
        App.filter_normal(args.mode)
      },
      info: `Filter: Show normal tabs`
    },
    {
      name: `Filter Playing`,
      cmd: `filter_playing`,
      mode: `tabs`,
      icon: playing_icon,
      action: (args) => {
        App.filter_playing(args.mode)
      },
      info: `Filter: Show playing tabs`
    },
    {
      name: `Filter Unloaded`,
      cmd: `filter_unloaded`,
      mode: `tabs`,
      icon: unloaded_icon,
      action: (args) => {
        App.filter_unloaded(args.mode)
      },
      info: `Filter: Show unloaded tabs`
    },
    {
      name: `Filter Duplicate`,
      cmd: `filter_duplicate`,
      mode: `tabs`,
      icon: command_icon,
      action: (args) => {
        App.filter_duplicate(args.mode)
      },
      info: `Filter: Show duplicate tabs`
    },
    {
      name: `Filter Loaded`,
      cmd: `filter_loaded`,
      mode: `tabs`,
      icon: command_icon,
      action: (args) => {
        App.filter_loaded(args.mode)
      },
      info: `Filter: Show loaded tabs`
    },
    {
      name: `Filter Tag Menu`,
      cmd: `show_filter_tag_menu`,
      mode: `items`,
      icon: tag_icon,
      action: (args) => {
        App.show_filter_tag_menu(args.mode, args.e)
      },
      info: `Show the filter tags menu`
    },
    {
      name: `Filter All Tags`,
      cmd: `filter_tag_all`,
      mode: `items`,
      icon: tag_icon,
      action: (args) => {
        App.filter_tag(args.mode, `all`)
      },
      info: `Filter: Show all tags`
    },
    {
      name: `Filter Edited`,
      cmd: `filter_edited`,
      mode: `items`,
      icon: profile_icon,
      action: (args) => {
        App.set_filter_mode({mode: args.mode, type: `edited`})
      },
      info: `Filter: Show items with an edited profile`
    },
    {
      name: App.separator_string
    },
    {
      name: `Dark Colors`,
      cmd: `set_dark_colors`,
      icon: theme_icon,
      action: (args) => {
        App.set_dark_colors()
      },
      info: `Change to the dark color theme`
    },
    {
      name: `Light Colors`,
      cmd: `set_light_colors`,
      icon: theme_icon,
      action: (args) => {
        App.set_light_colors()
      },
      info: `Change to the light color theme`
    },
    {
      name: `Random Dark`,
      cmd: `set_random_dark_colors`,
      icon: theme_icon,
      action: (args) => {
        App.random_colors(`dark`)
      },
      info: `Change to the dark color theme`
    },
    {
      name: `Random Light`,
      cmd: `set_random_light_colors`,
      icon: theme_icon,
      action: (args) => {
        App.random_colors(`light`)
      },
      info: `Change to the light color theme`
    },
    {
      name: `Background`,
      cmd: `set_background_image`,
      media: `image`,
      item: true,
      icon: theme_icon,
      action: (args) => {
        App.change_background(args.item.url)
      },
      info: `Change the background to the selected image`
    },
    {
      name: App.separator_string
    },
    {
      name: `Restart`,
      cmd: `restart_extension`,
      icon: bot_icon,
      action: (args) => {
        App.restart_extension()
      },
      info: `Restart the extension (For debugging)`
    }
  ]

  App.sort_commands()
}

App.update_command_history = (cmd) => {
  App.command_history = App.command_history.filter(x => x !== cmd)

  // Remove non-existent commands
  App.command_history = App.command_history.filter(x => {
    return App.commands.some(y => y.cmd === x)
  })

  App.command_history.unshift(cmd)
  App.stor_save_command_history()
  App.sort_commands()
}

App.sort_commands = () => {
  App.sorted_commands = App.commands.filter(x => !x.name.startsWith(`--`)).slice(0)

  if (!App.get_setting(`sort_commands`)) {
    return
  }

  App.sorted_commands.sort((a, b) => {
    let ia = App.command_history.indexOf(a.cmd)
    let ib = App.command_history.indexOf(b.cmd)

    if (ia !== -1 && ib !== -1) {
      return ia - ib
    }

    if (ia !== -1) {
      return -1
    }

    if (ib !== -1) {
      return 1
    }
  })
}

App.get_command = (cmd) => {
  for (let c of App.commands) {
    if (c.cmd === cmd) {
      return c
    }
  }
}

App.run_command = (args) => {
  if (!args.cmd || args.cmd === `none`) {
    return
  }

  let command = App.get_command(args.cmd)

  if (command) {
    if (!App.check_command(command, args)) {
      return
    }

    command.action(args)
  }
}

App.check_command = (command, args) => {
  args.mode = App.window_mode
  args.on_items = App.on_items()
  args.on_media = App.on_media()

  if (!args.item) {
    if (args.on_items) {
      args.item = App.get_selected()
    }
    else if (args.on_media) {
      args.item = App.current_media_item()
    }
  }

  if (args.item) {
    for (let media of App.media_types) {
      if (args.item[media]) {
        args.media = media
        break
      }
    }

    if (args.item.color) {
      args.color = args.item.color
    }
  }

  let valid = true

  if (command) {
    if (valid) {
      if (command.item) {
        if (!args.item) {
          valid = false
        }
      }
    }

    if (valid) {
      if (command.media) {
        if (command.media !== args.media) {
          valid = false
        }
      }
    }

    if (valid) {
      if (command.color) {
        if (!args.color) {
          valid = false
        }
      }
    }

    if (valid) {
      if (command.mode) {
        if (command.mode === `items`) {
          if (!args.on_items) {
            valid = false
          }
        }
        else if (command.mode === `search`) {
          if (!App.search_modes.includes(args.mode)) {
            valid = false
          }
        }
        else if (command.mode !== args.mode) {
          valid = false
        }
      }
    }
  }

  return valid
}

// For devs to check once in a while
App.check_dead_commands = () => {
  function check (cmd, key) {
    if (cmd === `none`) {
      return
    }

    if (!App.get_command(cmd)) {
      App.error(`Dead command: ${cmd} in ${key}`)
    }
  }

  for (let key in App.setting_props) {
    let value = App.setting_props[key].value

    if (Array.isArray(value)) {
      for (let item of value) {
        if (typeof item === `object`) {
          for (let key2 in item) {
            if (key2 === `cmd`) {
              check(item[key2], key)
            }
          }
        }
      }
    }
    else {
      let value = App.setting_props[key].value

      if (key === `double_click_command`) {
        check(value, key)
      }
      else if (key.startsWith(`middle_click_`)) {
        check(value, key)
      }
      else if (key.startsWith(`gesture_`)) {
        check(value, key)
      }
    }
  }
}
App.export_data = (obj) => {
  App.show_textarea(`Copy this to import later`, App.str(obj, true))
}

App.import_data = (action) => {
  App.show_input(`Paste data text here`, `Import`, (text) => {
    if (!text.trim()) {
      return true
    }

    let json

    try {
      json = App.obj(text)
    }
    catch (err) {
      App.alert(`${err}`)
      return false
    }

    if (json) {
      App.show_confirm(`Use this data?`, () => {
        action(json)
      })
    }

    return true
  })
}
App.show_dialog = (message, buttons, on_dismiss) => {
  App.start_popups()

  if (App.popups[`dialog`].open) {
    return
  }

  DOM.el(`#dialog_message`).textContent = message
  let btns = DOM.el(`#dialog_buttons`)
  btns.innerHTML = ``

  for (let button of buttons) {
    let btn = DOM.create(`div`, `button`)
    btn.textContent = button[0]
    DOM.ev(btn, `click`, () => {
      App.popups[`dialog`].hide()
      button[1]()
    })

    if (button[2]) {
      btn.classList.add(`button_2`)
    }

    btns.append(btn)
    button.element = btn
  }

  App.dialog_buttons = buttons
  App.dialog_on_dismiss = on_dismiss
  App.focus_dialog_button(buttons.length - 1)
  App.show_popup(`dialog`)
}

App.focus_dialog_button = (index) => {
  for (let [i, btn] of App.dialog_buttons.entries()) {
    if (i === index) {
      btn.element.classList.add(`hovered`)
    }
    else {
      btn.element.classList.remove(`hovered`)
    }
  }

  App.dialog_index = index
}

App.dialog_left = () => {
  if (App.dialog_index > 0) {
    App.focus_dialog_button(App.dialog_index - 1)
  }
}

App.dialog_right = () => {
  if (App.dialog_index < App.dialog_buttons.length - 1) {
    App.focus_dialog_button(App.dialog_index + 1)
  }
}

App.dialog_enter = () => {
  App.hide_popup(`dialog`)
  App.dialog_buttons[App.dialog_index][1]()
}

App.show_confirm = (message, confirm_action, cancel_action, force = false) => {
  if (force) {
    confirm_action()
    return
  }

  if (!cancel_action) {
    cancel_action = () => {}
  }

  let buttons = [
    [`Cancel`, cancel_action, true],
    [`Confirm`, confirm_action]
  ]

  let on_dismiss = () => {
    if (cancel_action) {
      cancel_action()
    }
  }

  App.show_dialog(message, buttons, on_dismiss)
}
App.setup_drag = (mode) => {
  let container = DOM.el(`#${mode}_container`)

  DOM.ev(container, `dragstart`, (e) => {
    App.dragstart_action(mode, e)
  })

  DOM.ev(container, `dragenter`, (e) => {
    App.dragenter_action(mode, e)
  })

  DOM.ev(container, `dragend`, (e) => {
    App.dragend_action(mode, e)
  })
}

App.dragstart_action = (mode, e) => {
  if (e.shiftKey) {
    e.preventDefault()
    return false
  }

  if (mode !== `tabs`) {
    e.preventDefault()
    return false
  }

  if (App.get_setting(`lock_drag`) && !e.ctrlKey) {
    e.preventDefault()
    return false
  }

  App.drag_element = e.target.closest(`.grasshopper_item`)

  if (!App.drag_element) {
    e.preventDefault()
    return false
  }

  App.dragging = true
  App.hide_scroller(mode)
  App.drag_y = e.clientY
  let id = App.drag_element.dataset.id
  App.drag_item = App.get_item_by_id(mode, id)
  App.drag_start_index = App.get_item_element_index(mode, App.drag_element)
  e.dataTransfer.setDragImage(new Image(), 0, 0)
  e.dataTransfer.setData(`text/plain`, App.drag_item.url)
  App.drag_items = []

  if (App.drag_item.selected) {
    for (let item of App.get_items(mode)) {
      if (item.selected) {
        App.drag_items.push(item)
      }
    }
  }
  else {
    App.drag_items.push(App.drag_item)
  }

  App.drag_els = []

  for (let item of App.drag_items) {
    App.drag_els.push(item.element)
  }

  let leader_top_id = App.drag_els[0].dataset.id
  let leader_bottom_id = App.drag_els.at(-1).dataset.id
  App.drag_leader_top = App.get_item_by_id(mode, leader_top_id)
  App.drag_leader_bottom = App.get_item_by_id(mode, leader_bottom_id)
  App.drag_moved = false
}

App.dragenter_action = (mode, e) => {
  if (!App.drag_element) {
    e.preventDefault()
    return false
  }

  let el = e.target.closest(`.grasshopper_item`)

  if (el === App.drag_element) {
    e.preventDefault()
    return false
  }

  let direction = e.clientY > App.drag_y ? `down` : `up`
  App.drag_y = e.clientY

  if (App.cursor_on_item(e, mode)) {
    if (App.drag_els.includes(el)) {
      e.preventDefault()
      return false
    }

    let target = App.get_item_by_id(mode, el.dataset.id)

    for (let item of App.drag_items) {
      if ((target.pinned && !item.pinned) || (!target.pinned && item.pinned)) {
        e.preventDefault()
        return false
      }
    }

    let leader

    if (direction === `down`) {
      leader = `bottom`
      el.after(...App.drag_els)
    }
    else {
      leader = `top`
      el.before(...App.drag_els)
    }

    App.scroll_to_item(App[`drag_leader_${leader}`], `nearest`)
    App.drag_moved = true
  }

  e.preventDefault()
  return false
}

App.dragend_action = (mode, e) => {
  App.dragging = false
  App.do_check_scroller(mode)

  if (!App.drag_element) {
    App.drag_element = undefined
    e.preventDefault()
    return false
  }

  App.drag_element = undefined

  if (!App.drag_moved) {
    e.preventDefault()
    return false
  }

  App.update_tabs_index(App.drag_items)
}
App.setup_filter = () => {
  App.stor_get_filter_history()
  App.start_filter_debouncers()
}

App.start_filter_debouncers = () => {
  App.filter_debouncer_cycle = App.create_debouncer((args) => {
    App.do_filter(args)
  }, App.filter_cycle_delay)

  App.filter_debouncer = App.create_debouncer((args) => {
    App.do_filter(args)
  }, App.get_setting(`filter_delay`))

  App.filter_debouncer_search = App.create_debouncer((args) => {
    App.do_filter(args)
  }, App.get_setting(`filter_delay_search`))

  App.check_filter_debouncer = App.create_debouncer((args) => {
    if (App.is_filtered(args.mode)) {
      args.select = false
      App.do_filter(args)
    }
  }, App.check_filter_delay)
}

App.check_filter = (mode) => {
  if (App.is_filtered(mode)) {
    App.check_filter_debouncer.call({mode: mode})
  }
}

App.filter = (args) => {
  if (args.from === `cycle`) {
    App.filter_debouncer_cycle.call(args)
  }
  else if (App.search_modes.includes(args.mode)) {
    App.filter_debouncer_search.call(args)
  }
  else {
    App.filter_debouncer.call(args)
  }
}

App.cancel_filter = () => {
  App.filter_debouncer.cancel()
  App.filter_debouncer_search.cancel()
}

App.do_filter = async (args) => {
  let def_args = {
    force: false,
    deep: false,
    select: true,
  }

  args = Object.assign(def_args, args)
  App.cancel_filter()
  App.debug(`Filter: ${args.mode}`)
  let value = App.get_filter(args.mode)
  App[`last_${args.mode}_filter`] = value
  value = App.remove_protocol(value)

  if (value.endsWith(`|`)) {
    return
  }

  let by_what
  let cmd

  for (let c of [`title`, `url`, `re`, `re_title`, `re_url`]) {
    if (value.startsWith(`${c}:`)) {
      cmd = [c, value.replace(`${c}:`, ``).trim()]
    }
  }

  if (cmd) {
    value = cmd[1]
    by_what = cmd[0]
  }
  else {
    value = value
    by_what = `all`
  }

  let search = false

  // This check is to avoid re-fetching items
  // For instance when moving from All to Image
  if (App.search_modes.includes(args.mode)) {
    let svalue = value

    if (args.force || (svalue !== App[`last_${args.mode}_query`])) {
      svalue = App.replace_filter_vars(svalue)
      let search_date = App.now()
      App.filter_search_date = search_date
      await App.search_items(args.mode, svalue, args.deep, search_date)

      if (App.filter_search_date !== search_date) {
        return
      }

      if (App.active_mode !== args.mode) {
        return
      }

      search = true
    }
  }

  let items = App.get_items(args.mode)

  if (!items) {
    return
  }

  let filter_mode = App.filter_mode(args.mode)
  let filter_mode_split = filter_mode.split(`_`)
  let f_value

  if (filter_mode_split.length === 2) {
    filter_mode = filter_mode_split[0]
    f_value = filter_mode_split[1]
  }

  let skip = !value && filter_mode === `all`
  let duplicates

  if (filter_mode === `duplicate`) {
    duplicates = App.find_duplicates(items, `url`)
  }

  let regexes = []
  let reg = App.make_filter_regex(value, by_what)

  if (reg) {
    regexes.push(reg)
  }
  else {
    return
  }

  let insensitive = App.get_setting(`case_insensitive`)

  if (value && by_what === `all`) {
    value = App.clean_filter(value)
    let aliases = App.get_setting(`aliases`)

    for (let alias of aliases) {
      let match

      if (insensitive) {
        let value_lower = value.toLowerCase()

        if (alias.a.toLowerCase().startsWith(value_lower)) {
          match = alias.b
        }
        else if (alias.b.toLowerCase().startsWith(value_lower)) {
          match = alias.a
        }
      }
      else {
        if (alias.a.startsWith(value)) {
          match = alias.b
        }
        else if (alias.b.startsWith(value)) {
          match = alias.a
        }
      }

      if (match) {
        reg = App.make_filter_regex(match, by_what)

        if (reg) {
          regexes.push(reg)
        }
      }
    }
  }

  function matched (item) {
    let args = {
      item: item,
      regexes: regexes,
      by_what: by_what,
      filter_mode: filter_mode,
      duplicates: duplicates,
      value: value,
      f_value: f_value,
      search: search,
    }

    return App.filter_check(args)
  }

  for (let item of items) {
    if (!item.element) {
      continue
    }

    if (skip || matched(item)) {
      App.show_item(item)
    }
    else {
      App.hide_item(item)
    }
  }

  if (args.select) {
    App.clear_selected(args.mode)
    App.select_first_item(args.mode, !App.is_filtered(args.mode))
  }

  App.update_footer_info(App.get_selected(args.mode))
  App.update_footer_count(args.mode)
  App.do_check_pinline()
  App.do_check_scroller(args.mode)
}

App.replace_filter_vars = (value) => {
  let date = App.now()
  let day = dateFormat(date, `dddd`).toLowerCase()
  let month = dateFormat(date, `mmmm`).toLowerCase()
  let year = dateFormat(date, `yyyy`)
  value = value.replace(/\$day/g, day)
  value = value.replace(/\$month/g, month)
  value = value.replace(/\$year/g, year)
  return value
}

App.make_filter_regex = (value, by_what) => {
  let regex
  value = App.replace_filter_vars(value)

  if (by_what.startsWith(`re`)) {
    let cleaned = value.replace(/\\+$/, ``)

    try {
      if (App.get_setting(`case_insensitive`)) {
        regex = new RegExp(cleaned, `i`)
      }
      else {
        regex = new RegExp(cleaned)
      }
    }
    catch (err) {}
  }
  else {
    let cleaned = App.escape_regex(App.clean_filter(value))

    if (App.get_setting(`case_insensitive`)) {
      regex = new RegExp(cleaned, `i`)
    }
    else {
      regex = new RegExp(cleaned)
    }
  }

  return regex
}

App.filter_check = (args) => {
  let match = false

  if (args.search) {
    match = true
  }

  if (!match) {
    let title = App.get_title(args.item)
    title = App.clean_filter(title)

    for (let regex of args.regexes) {
      if (args.by_what === `all` || args.by_what === `re`) {
        match = regex.test(title) || regex.test(args.item.path)
      }
      else if (args.by_what === `title` || args.by_what === `re_title`) {
        match = regex.test(title)
      }
      else if (args.by_what === `url` || args.by_what === `re_url`) {
        match = regex.test(args.item.path)
      }

      if (match) {
        break
      }
    }
  }

  if (match) {
    if (args.filter_mode === `all`) {
      match = true
    }
    else if (args.filter_mode === `image`) {
      match = args.item.image
    }
    else if (args.filter_mode === `video`) {
      match = args.item.video
    }
    else if (args.filter_mode === `audio`) {
      match = args.item.audio
    }
    else if (args.filter_mode === `tag`) {
      if (args.f_value === `all`) {
        match = args.item.tags.length > 0
      }
      else {
        match = args.item.tags.includes(args.f_value)
      }
    }
    else if (args.filter_mode === `color`) {
      if (args.f_value === `all`) {
        match = args.item.color !== ``
      }
      else {
        match = args.item.color === args.f_value
      }
    }
    else if (args.filter_mode === `edited`) {
      match = args.item.has_profile
    }
    else if (args.filter_mode === `pinned`) {
      match = args.item.pinned
    }
    else if (args.filter_mode === `normal`) {
      match = !args.item.pinned
    }
    else if (args.filter_mode === `playing`) {
      match = args.item.audible || args.item.muted
    }
    else if (args.filter_mode === `unloaded`) {
      match = args.item.discarded
    }
    else if (args.filter_mode === `duplicate`) {
      match = args.duplicates.includes(args.item)
    }
    else if (args.filter_mode === `loaded`) {
      match = !args.item.discarded
    }
    else if (args.filter_mode === `notab`) {
      let no_tab = true

      for (let tab of App.get_items(`tabs`)) {
        if (tab.path === args.item.path) {
          no_tab = false
          break
        }
      }

      match = no_tab
    }
  }

  return match
}

App.focus_filter = (mode) => {
  App.get_filter_el(mode).focus()
}

App.is_filtered = (mode) => {
  return App.filter_has_value(mode) || App.filter_mode(mode) !== `all`
}

App.clear_filter = (mode = App.window_mode) => {
  if (App.filter_has_value(mode)) {
    App.set_filter({mode: mode})
  }
}

App.set_filter = (args) => {
  let def_args = {
    text: ``,
    filter: true,
    instant: true,
  }

  args = Object.assign(def_args, args)
  App.get_filter_el(args.mode).value = args.text

  if (args.filter) {
    if (App.on_items(args.mode)) {
      if (args.instant) {
        App.do_filter({mode: args.mode})
      }
      else {
        App.filter({mode: args.mode})
      }
    }
    else if (App.on_settings(args.mode)) {
      if (args.instant) {
        App.do_filter_settings()
      }
      else {
        App.filter_settings()
      }
    }
    else {
      if (args.instant) {
        App[`do_filter_${args.mode}`]()
      }
      else {
        App[`filter_${args.mode}`]()
      }
    }
  }
}

App.filter_cmd = (mode, cmd) => {
  let new_text

  if (cmd === `all`) {
    new_text = ``
  }
  else {
    new_text = `${cmd}: `
  }

  let current = App.get_filter(mode)

  if (current) {
    let regex = new RegExp(/^(\w+\:)/)
    let cleaned = current.replace(regex, ``).trim()
    new_text += cleaned
  }

  App.set_filter({mode: mode, text: new_text})
}

App.filter_has_value = (mode) => {
  return App.get_filter(mode) !== ``
}

App.get_filter_el = (mode) => {
  return DOM.el(`#${mode}_filter`)
}

App.get_filter = (mode) => {
  return App.get_filter_el(mode).value
}

App.filter_empty = (mode) => {
  return App.get_filter(mode) === ``
}

App.filter_modes = (mode) => {
  return App[`${mode}_filter_modes`]
}

App.filter_mode = (mode) => {
  return App[`${mode}_filter_mode`]
}

App.get_filter_mode = (mode, type) => {
  for (let filter_mode of App.filter_modes(mode)) {
    if (filter_mode.type === type) {
      return filter_mode
    }
  }
}

App.set_filter_mode = (args) => {
  let def_args = {
    filter: true,
    instant: true,
  }

  args = Object.assign(def_args, args)
  let filter_mode = App.get_filter_mode(args.mode, args.type)
  App[`${args.mode}_filter_mode`] = filter_mode.type
  DOM.el(`#${args.mode}_filter_modes_text`).textContent = filter_mode.text

  if (args.filter) {
    if (args.instant) {
      App.do_filter({mode: args.mode})
    }
    else {
      App.filter({mode: args.mode, from: `cycle`})
    }
  }
}

App.set_custom_filter_mode = (mode, name, title) => {
  App[`${mode}_filter_mode`] = name
  DOM.el(`#${mode}_filter_modes_text`).textContent = title
}

App.create_filter = (mode) => {
  let filter = DOM.create(`input`, `text filter`, `${mode}_filter`)
  filter.type = `text`
  filter.autocomplete = `off`
  filter.spellcheck = false

  if (App.search_modes.includes(mode)) {
    filter.placeholder = `Search`
  }
  else {
    filter.placeholder = `Filter`
  }

  DOM.ev(filter, `contextmenu`, (e) => {
    if (App.get_setting(`show_filter_history`)) {
      App.show_filter_history(mode, e)
      e.preventDefault()
    }
  })

  DOM.ev(filter, `input`, () => {
    if (App.get_setting(`filter_enter`)) {
      return
    }

    App.filter({mode: mode})
  })

  return filter
}

App.get_custom_filters = (mode) => {
  let items = []

  for (let obj of App.get_setting(`custom_filters`)) {
    items.push({
      text: obj.filter,
      action: () => {
        App.set_custom_filter(mode, obj.filter)
      }
    })
  }

  return items
}

App.set_custom_filter = (mode, filter) => {
  App.set_filter_mode({mode: mode, type: `all`, filter: false})
  App.set_filter({mode: mode, text: filter})
}

App.do_filter_2 = (mode) => {
  let value = App.clean_filter(App.get_filter(mode)).toLowerCase()
  let type = App.popup_open() ? `popup` : `window`
  let win = DOM.el(`#${type}_${mode}`)
  let container = DOM.el_or_self(`.filter_container`, win)
  let items = DOM.els(`.filter_item`, container)

  for (let item of items) {
    let text = DOM.el_or_self(`.filter_text`, item).textContent
    text = App.clean_filter(text).toLowerCase()

    if (text.includes(value)) {
      item.classList.remove(`hidden`)
    }
    else {
      item.classList.add(`hidden`)
    }
  }
}

App.get_filter_refine = (mode) => {
  let items = []

  items.push({
    text: `By Title`,
    action: () => {
      App.filter_cmd(mode, `title`)
    },
  })

  items.push({
    text: `By URL`,
    action: () => {
      App.filter_cmd(mode, `url`)
    },
  })

  items.push({
    text: `By All`,
    action: () => {
      App.filter_cmd(mode, `all`)
    },
  })

  items.push({
    text: `Regex Title`,
    action: () => {
      App.filter_cmd(mode, `re_title`)
    },
  })

  items.push({
    text: `Regex URL`,
    action: () => {
      App.filter_cmd(mode, `re_url`)
    },
  })

  items.push({
    text: `Regex All`,
    action: () => {
      App.filter_cmd(mode, `re`)
    },
  })

  return items
}

App.search_items = async (mode, query, deep, date) => {
  let q = query || `Empty`
  App.debug(`Searching ${mode}: ${q}`)
  let items = await App[`get_${mode}`](query, deep)

  if (App.filter_search_date !== date) {
    return
  }

  if (App.window_mode !== mode) {
    return
  }

  App.process_info_list(mode, items)
}

App.deep_search = (mode) => {
  App.do_filter({mode: mode, force: true, deep: true})
}

App.was_filtered = (mode) => {
  if (App.get_filter(mode)) {
    return true
  }

  let fmode = App.filter_mode(mode)

  if (fmode && fmode !== `all`) {
    return true
  }

  return false
}

App.get_last_filter_value = (cycle) => {
  let last_mode = App.active_mode

  if (!App.on_items(last_mode)) {
    last_mode = `tabs`
  }

  let value = ``

  if (cycle) {
    value = App.get_filter(last_mode)
  }

  return value
}

App.filter_domain = (item) => {
  if (!item) {
    item = App.get_selected(mode)
  }

  if (!item) {
    return
  }

  let hostname = item.hostname

  if (!hostname && item.url.includes(`:`)) {
    hostname = item.url.split(`:`)[0] + `:`
  }

  if (!hostname) {
    return
  }

  App.set_filter({mode: item.mode, text: hostname})
}

App.filter_tag = (mode, tag) => {
  let s

  if (tag === `all`) {
    s = `All Tags`
  }
  else {
    s = tag
  }

  App.set_custom_filter_mode(mode, `tag_${tag}`, s)
  App.set_filter({mode: mode})
}

App.filter_color = (mode, color) => {
  let s

  if (color === `all`) {
    s = `All Colors`
  }
  else {
    s = App.capitalize(color)
  }

  App.set_custom_filter_mode(mode, `color_${color}`, s)
  App.set_filter({mode: mode})
}

App.filter_all = (mode = App.window_mode) => {
  if (App.is_filtered(mode)) {
    App.set_filter_mode({mode: mode, type: `all`, filter: false})
    App.set_filter({mode: mode})
  }
}

App.show_filter_history = (mode, e) => {
  let items = []

  for (let value of App.filter_history) {
    items.push({
      text: value,
      action: () => {
        App.set_filter({mode: mode, text: value})
      },
      alt_action: () => {
        App.forget_filter_history_item(value)
      }
    })
  }

  if (items.length) {
    App.sep(items)

    items.push({
      text: `Forget`,
      action: () => {
        App.forget_filter_history()
      }
    })
  }
  else {
    items.push({
      text: `Empty`,
      action: () => {
        App.alert(`Filters you use appear here`)
      }
    })
  }

  App.show_center_context(items, e)
}

App.update_filter_history = (mode) => {
  App.debug(`Update Filter History`)
  let value = App.get_filter(mode).trim()

  if (!value) {
    return
  }

  App.filter_history = App.filter_history.filter(x => x !== value)
  App.filter_history.unshift(value)
  let max = App.get_setting(`max_filter_history`)
  App.filter_history = App.filter_history.slice(0, max)
  App.stor_save_filter_history()
}

App.forget_filter_history = () => {
  App.show_confirm(`Forget filter history?`, () => {
    App.filter_history = []
    App.stor_save_filter_history()
  })
}

App.forget_filter_history_item = (value) => {
  App.filter_history = App.filter_history.filter(x => x !== value)
  App.stor_save_filter_history()
}

App.filter_is_focused = (mode) => {
  return App.get_filter_el(mode) === document.activeElement
}

App.filter_at_end = (mode) => {
  let filter = App.get_filter_el(mode)
  return filter.selectionStart === filter.selectionEnd &&
  filter.selectionEnd === filter.value.length
}

App.clean_filter = (s) => {
  if (!App.get_setting(`clean_filter`)) {
    return s
  }

  s = App.no_space(s)
  s = App.remove_special(s)
  s = s.trim()
  return s
}

App.show_filter_tag_menu = (mode, e) => {
  let items = App.get_tag_items(mode, `filter`)
  App.show_center_context(items, e)
}

App.show_filter_color_menu = (mode, e) => {
  let items = App.get_color_items(mode, `filter`)
  App.show_center_context(items, e)
}

App.filter_playing = (mode) => {
  App.set_filter_mode({mode: mode, type: `playing`})
}

App.filter_duplicate = (mode) => {
  App.set_filter_mode({mode: mode, type: `duplicate`})
}

App.filter_unloaded = (mode) => {
  App.set_filter_mode({mode: mode, type: `unloaded`})
}

App.filter_pinned = (mode) => {
  App.set_filter_mode({mode: mode, type: `pinned`})
}

App.filter_normal = (mode) => {
  App.set_filter_mode({mode: mode, type: `normal`})
}

App.filter_loaded = (mode) => {
  App.set_filter_mode({mode: mode, type: `loaded`})
}
App.create_filter_menu = (mode) => {
  function separator () {
    return {type: App.separator_string, skip: true}
  }

  let btn = DOM.create(`div`, `button icon_button filter_button`, `${mode}_filter_modes`)
  btn.title = `Filters (Ctrl + F) - Right Click to show filter commands`
  btn.append(DOM.create(`div`, ``, `${mode}_filter_modes_text`))
  let fmodes = []
  fmodes.push({type: `all`, text: `All`})
  let m_modes = App.filter_modes(mode)

  if (m_modes) {
    fmodes.push(separator())
    fmodes.push(...m_modes)
  }

  let image_icon = App.get_setting(`image_icon`)
  let video_icon = App.get_setting(`video_icon`)
  let audio_icon = App.get_setting(`audio_icon`)
  let profile_icon = App.profile_icon
  let color_icon = App.settings_icons.theme
  let tag_icon = App.tag_icon
  fmodes.push(separator())
  fmodes.push({type: `image`, text: `Image`, skip: false, info: `Show image items`, icon: image_icon})
  fmodes.push({type: `video`, text: `Video`, skip: false, info: `Show video items`, icon: video_icon})
  fmodes.push({type: `audio`, text: `Audio`, skip: false, info: `Show audio items`, icon: audio_icon})
  fmodes.push(separator())
  fmodes.push({type: `tag`, text: `Tag`, skip: true, skip: `Filter by a specific tag`, icon: tag_icon})
  fmodes.push({type: `color`, text: `Color`, skip: true, skip: `Filter by a specific color`, icon: color_icon})
  fmodes.push({type: `edited`, text: `Edited`, skip: false, info: `Items that have a profile`, icon: profile_icon})

  if (mode !== `tabs`) {
    fmodes.push(separator())
    fmodes.push({type: `notab`, text: `No Tab`, skip: false, info: `Items that are not open in a tab`})
  }

  fmodes.push(separator())
  fmodes.push({type: `refine`, text: `Refine`, skip: true, skip: `Refine the filter`})
  fmodes.push({type: `custom`, text: `Custom`, skip: true, skip: `Pick a custom filter`})
  App[`${mode}_filter_modes`] = fmodes

  DOM.ev(btn, `click`, () => {
    App.show_filter_menu(mode)
  })

  DOM.ev(btn, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_palette(`filter`)
  })

  DOM.ev(btn, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_filter_menu`)
      App.run_command({cmd: cmd, from: `filter_menu`})
    }
  })

  DOM.ev(btn, `wheel`, (e) => {
    let direction = App.wheel_direction(e)

    if (direction === `down`) {
      App.cycle_filter_modes(mode, true)
    }
    else if (direction === `up`) {
      App.cycle_filter_modes(mode, false)
    }
  })

  return btn
}

App.show_filter_menu = (mode) => {
  let items = []

  for (let filter_mode of App.filter_modes(mode)) {
    if (filter_mode.type === App.separator_string) {
      App.sep(items)
      continue
    }
    else if (filter_mode.type === `tag`) {
      items.push({
        icon: filter_mode.icon,
        text: filter_mode.text,
        get_items: () => {
          return App.get_tag_items(mode)
        },
        info: filter_mode.info,
      })

      continue
    }
    else if (filter_mode.type === `color`) {
      items.push({
        icon: filter_mode.icon,
        text: filter_mode.text,
        get_items: () => {
          return App.get_color_items(mode)
        },
        info: filter_mode.info,
      })

      continue
    }
    else if (filter_mode.type === `custom`) {
      items.push({
        icon: filter_mode.icon,
        text: `Custom`,
        get_items: () => {
          return App.get_custom_filters(mode)
        },
        info: filter_mode.info,
      })

      continue
    }
    else if (filter_mode.type === `refine`) {
      items.push({
        icon: filter_mode.icon,
        text: filter_mode.text,
        get_items: () => {
          return App.get_filter_refine(mode)
        },
        info: filter_mode.info,
      })

      continue
    }

    let selected = App.filter_mode(mode) === filter_mode.type

    items.push({
      icon: filter_mode.icon,
      text: filter_mode.text,
      action: () => {
        App.set_filter_mode({mode: mode, type: filter_mode.type})
      },
      selected: selected,
      info: filter_mode.info,
    })
  }

  let btn = DOM.el(`#${mode}_filter_modes`)
  NeedContext.show_on_element(btn, items, false, btn.clientHeight)
}

App.cycle_filter_modes = (mode, reverse = true) => {
  let modes = App.filter_modes(mode)
  let waypoint = false

  if (reverse) {
    modes = modes.slice(0).reverse()
  }

  let first

  for (let filter_mode of modes.slice(0).reverse()) {
    if (filter_mode.skip) {
      continue
    }

    if (!first) {
      first = filter_mode
    }

    if (waypoint) {
      App.set_filter_mode({mode: mode, type: filter_mode.type, instant: false})
      return
    }

    if (filter_mode.type === App.filter_mode(mode)) {
      waypoint = true
    }
  }

  App.set_filter_mode({mode: mode, type: first.type, instant: false})
}
App.setup_footer = () => {
  App.footer_count_debouncer = App.create_debouncer((mode) => {
    App.do_update_footer_count(mode)
  }, App.footer_delay)

  App.update_footer_info_debouncer = App.create_debouncer((item) => {
    App.do_update_footer_info(item)
  }, App.footer_delay)
}

App.update_footer_info = (item) => {
  if (App.get_setting(`show_footer`)) {
    App.update_footer_info_debouncer.call(item)
  }
}

App.do_update_footer_info = (item) => {
  App.update_footer_info_debouncer.cancel()

  if (item) {
    App.footer_item = item
    App.set_footer_info(item.mode, item.footer)
  }
  else {
    App.empty_footer_info()
  }
}

App.empty_footer_info = () => {
  App.footer_item = undefined
  App.set_footer_info(App.window_mode, `No Results`)
}

App.set_footer_info = (mode, text) => {
  let footer = App.get_footer(mode)

  if (footer) {
    let info = DOM.el(`.footer_info`, footer)
    info.textContent = text
    info.title = text
  }
}

App.get_footer = (mode) => {
  return DOM.el(`#${mode}_footer`)
}

App.create_footer = (mode) => {
  let footer = DOM.create(`div`, `footer`, `${mode}_footer`)

  let footer_count = DOM.create(`div`, `footer_count`, `${mode}_footer_count`)
  footer.append(footer_count)

  let footer_info = DOM.create(`div`, `footer_info`, `${mode}_footer_info`)
  footer.append(footer_info)

  DOM.ev(footer, `click`, (e) => {
    if (e.shiftKey || e.ctrlKey) {
      return
    }

    App.goto_bottom(mode)
  })

  DOM.ev(footer, `contextmenu`, (e) => {
    App.show_custom_menu(e, `footer`)
  })

  DOM.ev(footer, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_footer`)
      App.run_command({cmd: cmd, from: `footer`})
    }
  })

  return footer
}

App.update_footer_count = (mode) => {
  if (App.get_setting(`show_footer`)) {
    App.footer_count_debouncer.call(mode)
  }
}

App.do_update_footer_count = (mode) => {
  App.footer_count_debouncer.cancel()
  let el = DOM.el(`#${mode}_footer_count`)

  if (App.get_setting(`show_footer_count`)) {
    el.classList.remove(`hidden`)
  }
  else {
    el.classList.add(`hidden`)
    return
  }

  let n1 = App.selected_items(mode).length
  let n2 = App.get_visible(mode).length
  let count

  if (n1 > 1) {
    count= `(${n1}/${n2})`
  }
  else {
    count = `(${n2})`
  }

  el.textContent = count
}
App.setup_gestures = () => {
  App.refresh_gestures()
  let obj = {}

  for (let gesture of App.gestures) {
    obj[gesture] = (e) => {
      App.gesture_action(e, gesture)
    }
  }

  obj.default = (e) => {
    App.mouse_middle_action(App.window_mode, e)
  }

  NiceGesture.start(DOM.el(`#main`), obj)
}

App.gesture_action = (e, gesture) => {
  let cmd = App.get_setting(`gesture_${gesture}`)
  App.run_command({cmd: cmd, from: `gesture`})
}

App.refresh_gestures = () => {
  NiceGesture.enabled = App.get_setting(`gestures_enabled`)
  NiceGesture.threshold = App.get_setting(`gestures_threshold`)
}
App.setup_history = () => {
  browser.history.onVisited.addListener((info) => {
    App.debug(`History Visited`)

    if (App.active_mode === `history`) {
      App.history_changed = true
    }
  })
}

App.history_time = (deep = false) => {
  let months = App.get_setting(`history_max_months`)

  if (deep) {
    months = App.get_setting(`deep_history_max_months`)
  }

  return App.now() - (1000 * 60 * 60 * 24 * 30 * months)
}

App.get_history = async (query = ``, deep = false) => {
  App.getting(`history`)
  let results
  let max_items = App.get_setting(`max_search_items`)

  if (deep) {
    max_items = App.get_setting(`deep_max_search_items`)
  }

  try {
    results = await browser.history.search({
      text: query,
      maxResults: max_items,
      startTime: App.history_time(deep)
    })
  }
  catch (err) {
    App.error(err)
    return []
  }

  results.sort((a, b) => {
    return a.lastVisitTime > b.lastVisitTime ? -1 : 1
  })

  App.last_history_query = query
  return results
}

App.history_action = (item) => {
  App.on_action(`history`)
  App.focus_or_open_item(item)
}
App.show_input = (message, button, action, value = ``) => {
  App.start_popups()
  App.input_action = action
  DOM.el(`#input_message`).textContent = message
  let textarea = DOM.el(`#input_text`)
  textarea.value = value
  DOM.el(`#input_submit`).textContent = button
  App.show_popup(`input`)

  requestAnimationFrame(() => {
    App.focus_textarea(textarea)
  })
}

App.input_enter = () => {
  let ans = App.input_action(DOM.el(`#input_text`).value.trim())

  if (ans) {
    App.hide_popup(`input`)
  }
}
App.show_item_menu = async (item, x, y) => {
  if (!item) {
    return
  }

  let active = App.get_active_items(item.mode, item)
  let multiple = active.length > 1
  let items = []

  if (item.mode === `tabs`) {
    let some_pinned = false
    let some_unpinned = false
    let some_muted = false
    let some_unmuted = false
    let some_loaded = false
    let some_unloaded = false

    for (let it of active) {
      if (it.pinned) {
        some_pinned = true
      }
      else {
        some_unpinned = true
      }

      if (it.muted) {
        some_muted = true
      }
      else {
        some_unmuted = true
      }

      if (it.discarded) {
        some_unloaded = true
      }
      else {
        some_loaded = true
      }
    }

    if (some_unloaded) {
      items.push({
        text: `Load`,
        action: () => {
          App.load_tabs(item)
        }
      })
    }

    if (some_unpinned) {
      items.push({
        text: `Pin`,
        action: () => {
          App.pin_tabs(item)
        }
      })
    }

    if (some_pinned) {
      items.push({
        text: `Unpin`,
        action: () => {
          App.unpin_tabs(item)
        }
      })
    }

    App.common_menu_items(items, item, multiple)
    App.more_menu_items(items, item, multiple, some_loaded, some_unmuted, some_muted)
    App.extra_menu_items(items)
    App.sep(items)

    items.push({
      text: `Close`,
      action: () => {
        App.close_tabs(item)
      }
    })
  }
  else {
    items.push({
      text: `Open`,
      action: () => {
        App.open_items(item, true)
      }
    })

    App.common_menu_items(items, item, multiple)
    App.more_menu_items(items, item, multiple)
    App.extra_menu_items(items)
  }

  NeedContext.show(x, y, items)
}

App.show_item_menu_2 = (item) => {
  if (!item) {
    return
  }

  let rect = item.element.getBoundingClientRect()
  App.show_item_menu(item, rect.left, rect.top)
}

App.common_menu_items = (o_items, item, multiple) => {
  let items = []

  items.push({
    text: `Edit`,
    get_items: () => {
      return App.get_edit_items(item)
    }
  })

  if (item.has_notes) {
    items.push({
      text: `Notes`,
      action: () => {
        return App.show_notes(item)
      }
    })
  }

  if (App.get_media_type(item)) {
    items.push({
      text: `View`,
      action: () => {
        App.view_media(item)
      }
    })
  }

  if (!multiple) {
    if (item.color || item.tags.length) {
      items.push({
        text: `Filter`,
        get_items: () => {
          return App.filter_menu_items(item)
        }
      })
    }
    else {
      items.push({
        text: `Filter`,
        action: () => {
          App.filter_domain(item)
        }
      })
    }
  }

  if (!multiple) {
    items.push({
      text: `Copy`,
      items: [
      {
        text: `Copy URL`,
        action: () => {
          App.copy_url(item)
        }
      },
      {
        text: `Copy Title`,
        action: () => {
          App.copy_title(item)
        }
      }]
    })
  }

  if (items.length) {
    for (let c of items) {
      o_items.push(c)
    }
  }
}

App.more_menu_items = (o_items, item, multiple, some_loaded, some_unmuted, some_muted) => {
  let items = []

  if (item.mode === `tabs`) {
    if (some_unmuted) {
      items.push({
        text: `Mute`,
        action: () => {
          App.mute_tabs(item)
        }
      })
    }

    if (some_muted) {
      items.push({
        text: `Unmute`,
        action: () => {
          App.unmute_tabs(item)
        }
      })
    }

    if (some_loaded) {
      items.push({
        text: `Unload`,
        action: () => {
          App.unload_tabs(item)
        }
      })
    }

    items.push({
      text: `Duplicate`,
      action: () => {
        App.duplicate_tabs(item)
      }
    })
  }

  items.push({
    icon: App.mode_icons.bookmarks,
    text: `Bookmark`,
    action: () => {
      App.bookmark_items(item)
    }
  })

  if (item.image && !multiple) {
    items.push({
      icon: App.settings_icons.theme,
      text: `Background`,
      action: () => {
        App.change_background(item.url)
      }
    })
  }

  if (item.mode === `tabs`) {
    if (items.length) {
      App.sep(items)
    }

    items.push({
      text: `To Top`,
      action: () => {
        App.move_tabs_vertically(`top`, item)
      }
    })

    items.push({
      text: `To Bottom`,
      action: () => {
        App.move_tabs_vertically(`bottom`, item)
      }
    })

    items.push({
      text: `To Window`,
      get_items: async () => {
        return await App.get_window_menu_items(item)
      }
    })
  }

  if (item.mode === `closed`) {
    items.push({
      icon: App.mode_icons.closed,
      text: `Forget`,
      action: () => {
        App.forget_closed_item(item)
      }
    })
  }

  if (items.length) {
    o_items.push({
      text: `More`,
      items: items,
    })
  }
}

App.extra_menu_items = (o_items) => {
  let items = App.custom_menu_items(`extra_menu`)

  if (items.length) {
    o_items.push({
      text: `Extra`,
      items: items,
    })
  }
}

App.filter_menu_items = (item) => {
  let items = []

  if (item.tags.length) {
    items.push({
      text: `Tag`,
      get_items: () => {
        return App.get_item_tag_items(item)
      }
    })
  }

  if (item.color) {
    items.push({
      icon: App.settings_icons.theme,
      text: `Color`,
      action: () => {
        App.filter_color(item.mode, item.color)
      }
    })
  }

  items.push({
    icon: App.settings_icons.filter,
    text: `Domain`,
    action: () => {
      App.filter_domain(item)
    }
  })

  return items
}
App.remove_selected_class = (mode) => {
  for (let el of DOM.els(`.selected`, DOM.el(`#${mode}_container`))) {
    el.classList.remove(`selected`)
  }
}

App.select_item = (args) => {
  let def_args = {
    deselect: true,
    scroll: `center`,
  }

  args = Object.assign(def_args, args)

  if (!args.item) {
    return
  }

  let prev = App.get_selected(args.item.mode)

  if (args.deselect) {
    App.deselect(args.item.mode)
  }

  App.toggle_selected(args.item, true)

  if (prev) {
    App.scroll_to_item(args.item, args.scroll)
  }
  else {
    // Elements just got created
    // Give them time to render
    requestAnimationFrame(() => {
      App.scroll_to_item(args.item, args.scroll)
    })
  }
}

App.select_above = (mode) => {
  let item = App.get_other_item({mode: mode}, true)

  if (item) {
    App.select_item({item: item, scroll: `nearest`})
  }
}

App.select_below = (mode) => {
  let item = App.get_other_item({mode: mode})

  if (item) {
    App.select_item({item: item, scroll: `nearest`})
  }
}

App.select_next = (mode, dir) => {
  let waypoint = false
  let items = App.get_items(mode).slice(0)

  if (!items.length) {
    return
  }

  let current = App.get_selected(mode)

  if (dir === `above`) {
    items.reverse()
  }

  for (let item of items) {
    if (!item.visible) {
      continue
    }

    if (waypoint) {
      App.select_range(item)
      break
    }
    else {
      if (item === current) {
        waypoint = true
      }
    }
  }
}

App.select_to_edge = (mode, dir) => {
  let items = App.get_items(mode).slice(0)

  if (!items.length) {
    return
  }

  if (dir === `down`) {
    items.reverse()
  }

  App.select_range(items[0])
}

App.get_other_item = (args, reverse = false) => {
  let def_args = {
    only_visible: true,
    no_selected: false,
    no_discarded: false,
    wrap: true,
  }

  args = Object.assign(def_args, args)
  let waypoint = false

  if (!App.get_selected(args.mode)) {
    waypoint = true
  }

  if (!args.item) {
    args.item = App.get_selected(args.mode)
  }

  let items = App.get_items(args.mode).slice(0)

  if (reverse) {
    items.reverse()
  }

  for (let item of items) {
    if (waypoint) {
      if (args.only_visible) {
        if (!item.visible) {
          continue
        }
      }

      if (args.no_selected) {
        if (item.selected) {
          continue
        }
      }

      if (args.no_discarded) {
        if (item.discarded) {
          continue
        }
      }

      return item
    }

    if (item === args.item) {
      waypoint = true
    }
  }

  if (args.wrap) {
    for (let item of items) {
      if (item.visible) {
        return item
      }
    }
  }
}

App.get_selected = (mode = App.window_mode) => {
  return App[`last_selected_${mode}`]
}

App.set_selected = (item) => {
  if (!item) {
    App.remove_selected_class(mode)
    return
  }

  App[`last_selected_${item.mode}`] = item
  App.update_footer_info(item)
}

App.clear_selected = (mode) => {
  App[`last_selected_${mode}`] = undefined
}

App.get_items = (mode) => {
  let item_string = `${mode}_items`

  if (App[item_string]) {
    App[item_string] = App[item_string].filter(x => x !== undefined)
  }

  return App[item_string] || []
}

App.select_first_item = (mode, by_active = false, scroll = `nearest`) => {
  if (mode === `tabs` && by_active) {
    for (let item of App.get_items(mode)) {
      if (item.visible && item.active) {
        App.select_item({item: item, scroll: scroll})
        return
      }
    }
  }

  for (let item of App.get_items(mode)) {
    if (item.visible) {
      App.select_item({item: item})
      return
    }
  }
}

App.filter_item_by_id = (mode, id) => {
  id = id.toString()
  let item_string = `${mode}_items`
  App[item_string] = App[item_string].filter(x => x.id.toString() !== id)
}

App.remove_item = (item) => {
  let mode = item.mode

  if (App.get_selected(mode) === item) {
    let next_item = App.get_next_item(mode)

    if (next_item) {
      App.select_item({item: next_item})
    }
  }

  item.element.remove()
  App.filter_item_by_id(mode, item.id)
  App.update_footer_count(mode)
}

App.show_item = (it) => {
  it.element.classList.remove(`hidden`)
  it.visible = true
}

App.hide_item = (it) => {
  it.element.classList.add(`hidden`)
  it.visible = false
}

App.clear_items = (mode) => {
  App[`${mode}_items`] = []
  let c = DOM.el(`#${mode}_container`)

  if (c) {
    DOM.el(`#${mode}_container`).innerHTML = ``
  }
}

App.clear_all_items = () => {
  for (let mode of App.modes) {
    App.clear_items(mode)
  }
}

App.process_info_list = (mode, info_list) => {
  let container = DOM.el(`#${mode}_container`)
  App[`${mode}_idx`] = 0

  if (!App.persistent_modes.includes(mode)) {
    App.clear_items(mode)
  }

  let items = App.get_items(mode)
  let exclude = []

  for (let info of info_list) {
    let item = App.process_info({mode: mode, info: info, exclude: exclude})

    if (!item) {
      continue
    }

    if (mode !== `tabs`) {
      exclude.push(item.url)
    }

    items.push(item)
    container.append(item.element)
  }

  App.check_playing(mode)
  App.update_footer_count(mode)
  App.do_check_pinline()
  App.check_new_tabs()
}

App.process_info = (args) => {
  let def_args = {
    exclude: [],
  }

  args = Object.assign(def_args, args)

  if (!args.info) {
    return false
  }

  if (args.o_item) {
    args.info = Object.assign({}, args.o_item.original_data, args.info)
    args.o_item.original_data = args.info
  }

  if (args.info.url) {
    try {
      // Check if valid URL
      decodeURI(args.info.url)
    }
    catch (err) {
      return false
    }
  }

  let url = App.format_url(args.info.url || ``)

  if (args.exclude.includes(url)) {
    return false
  }

  let path = App.remove_protocol(url)
  let protocol = App.get_protocol(url)
  let hostname = App.get_hostname(url)
  let title = args.info.title || ``
  let image = App.is_image(url)
  let video = App.is_video(url)
  let audio = App.is_audio(url)
  let profile = App.get_profile(url)
  let has_profile = false
  let custom_title = ``
  let has_notes = false
  let color = ``
  let tags = []
  let icon = ``

  if (profile) {
    has_profile = true

    if (profile.title.value) {
      custom_title = profile.title.value
    }

    if (profile.color.value !== `none`) {
      color = profile.color.value
    }

    if (profile.tags.value.length) {
      tags = profile.tags.value.map(x => x.value)
    }

    if (profile.notes.value.length) {
      has_notes = true
    }

    if (profile.icon.value) {
      icon = profile.icon.value
    }
  }

  let item = {
    title: title,
    custom_title: custom_title,
    url: url,
    path: path,
    protocol: protocol,
    hostname: hostname,
    favicon: args.info.favIconUrl,
    icon: icon,
    mode: args.mode,
    window_id: args.info.windowId,
    session_id: args.info.sessionId,
    image: image,
    video: video,
    audio: audio,
    has_profile: has_profile,
    tags: tags,
    has_notes: has_notes,
    color: color,
    is_item: true,
  }

  if (args.mode === `tabs`) {
    item.active = args.info.active
    item.pinned = args.info.pinned
    item.audible = args.info.audible
    item.muted = args.info.mutedInfo.muted
    item.discarded = args.info.discarded
    item.last_accessed = args.info.lastAccessed
  }
  else if (args.mode === `history`) {
    item.last_visit = args.info.lastVisitTime
  }
  else if (args.mode === `bookmarks`) {
    item.parent_id = args.info.parentId
    item.date_added = args.info.dateAdded
  }

  if (args.o_item) {
    args.o_item = Object.assign(args.o_item, item)
    App.refresh_item_element(args.o_item)

    if (App.get_selected(args.mode) === args.o_item) {
      App.update_footer_info(args.o_item)
    }
  }
  else {
    item.original_data = args.info
    item.id = args.info.id || App[`${args.mode}_idx`]
    item.visible = true
    item.selected = false
    App.create_item_element(item)
    App[`${args.mode}_idx`] += 1
    return item
  }
}

App.check_item_icon = (item) => {
  if (App.get_setting(`item_icon`) !== `none`) {
    let container = DOM.el(`.item_icon_container`, item.element)
    container.innerHTML = ``
    let icon

    if (item.icon) {
      icon = App.get_text_icon(item.icon)
    }
    else if (item.favicon) {
      icon = App.get_favicon(item)
    }
    else {
      icon = App.get_jdenticon(item.hostname)
    }

    container.append(icon)
  }
}

App.check_item_status = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  if (App.get_setting(`unloaded_icon`)) {
    let unloaded = DOM.el(`.unloaded_icon`, item.element)

    if (item.discarded) {
      unloaded.classList.remove(`hidden`)
    }
    else {
      unloaded.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`playing_icon`)) {
    let playing = DOM.el(`.playing_icon`, item.element)

    if (item.audible && !item.muted) {
      playing.classList.remove(`hidden`)
    }
    else {
      playing.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`muted_icon`)) {
    let muted = DOM.el(`.muted_icon`, item.element)

    if (item.muted) {
      muted.classList.remove(`hidden`)
    }
    else {
      muted.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`pin_icon`)) {
    let pin = DOM.el(`.pin_icon`, item.element)

    if (item.pinned) {
      pin.classList.remove(`hidden`)
    }
    else {
      pin.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`normal_icon`)) {
    let pin = DOM.el(`.normal_icon`, item.element)

    if (!item.pinned) {
      pin.classList.remove(`hidden`)
    }
    else {
      pin.classList.add(`hidden`)
    }
  }
}

App.check_item_notes = (item) => {
  if (item.has_notes) {
    DOM.el(`.notes_icon`, item.element).classList.remove(`hidden`)
  }
  else {
    DOM.el(`.notes_icon`, item.element).classList.add(`hidden`)
  }
}

App.check_view_media = (item) => {
  let type = App.get_media_type(item)
  let view_media = DOM.el(`.view_media_button`, item.element)
  let icon

  if (type) {
    icon = App.get_setting(`${type}_icon`)
  }

  if (icon) {
    view_media.textContent = icon
    view_media.title = App.capitalize(type)
    view_media.classList.remove(`hidden`)

    if (App.get_setting(`view_${type}_${item.mode}`) !== `never`) {
      view_media.classList.add(`action`)
    }
    else {
      view_media.classList.remove(`action`)
    }
  }
  else {
    view_media.classList.add(`hidden`)
  }
}

App.apply_color_mode = (item) => {
  let color_mode = App.get_setting(`color_mode`)
  let color = item.color

  if (color_mode.includes(`icon`)) {
    let el = DOM.el(`.item_info_color`, item.element)

    if (color) {
      el.innerHTML = ``
      el.append(App.color_icon(color))
      el.classList.remove(`hidden`)

      if (color_mode.includes(`icon_2`)) {
        item.element.classList.add(`color_only_icon`)
      }
      else {
        item.element.classList.remove(`color_only_icon`)
      }
    }
    else {
      el.textContent = ``
      el.classList.add(`hidden`)
    }
  }

  if (color_mode.includes(`border`)) {
    for (let color of App.colors) {
      item.element.classList.remove(`colored`)
      item.element.classList.remove(`border_${color}`)
    }

    if (color) {
      item.element.classList.add(`colored`)
      item.element.classList.add(`border_${color}`)
    }
  }

  if (color_mode === `background`) {
    for (let color of App.colors) {
      item.element.classList.remove(`colored`)
      item.element.classList.remove(`colored_background`)
      item.element.classList.remove(`background_${color}`)
    }

    if (color) {
      item.element.classList.add(`colored`)
      item.element.classList.add(`colored_background`)
      item.element.classList.add(`background_${color}`)
    }
  }
}

App.add_close_icon = (item, side) => {
  if (item.mode === `tabs` && App.get_setting(`close_icon`)) {
    let on_left = App.get_setting(`close_icon_on_left`)

    if (side === `left` && !on_left) {
      return
    }
    else if (side === `right` && on_left) {
      return
    }

    let close = DOM.create(`div`, `close_icon item_node action`)
    close.textContent = App.get_setting(`close_icon`)
    item.element.append(close)
  }
}

App.refresh_item_element = (item) => {
  App.check_tab_item(item)
  App.check_item_icon(item)
  App.check_view_media(item)
  App.check_item_notes(item)
  App.check_item_status(item)
  App.set_item_text(item)
  App.apply_color_mode(item)
}

App.create_item_element = (item) => {
  item.element = DOM.create(`div`, `grasshopper_item item ${item.mode}_item`)
  item.element.dataset.id = item.id
  App.add_close_icon(item, `left`)
  let trace = DOM.create(`div`, `item_trace item_node`)
  item.element.append(trace)

  if (App.get_setting(`item_icon`) !== `none`) {
    let icon_container = DOM.create(`div`, `item_icon_container item_node`)
    item.element.append(icon_container)
    App.check_item_icon(item)
  }

  let color_icon = DOM.create(`div`, `item_info_color item_node hidden`)
  item.element.append(color_icon)
  App.apply_color_mode(item)
  let view_media = DOM.create(`div`, `view_media_button hidden`)
  item.element.append(view_media)
  App.check_view_media(item)

  if (item.mode === `tabs`) {
    let unloaded_icon = App.get_setting(`unloaded_icon`)

    if (unloaded_icon) {
      let unloaded = DOM.create(`div`, `unloaded_icon item_node hidden`)
      unloaded.textContent = unloaded_icon
      item.element.append(unloaded)
    }

    let cls = ``

    if (App.get_setting(`mute_click`)) {
      cls += ` action`
    }

    let playing_icon = App.get_setting(`playing_icon`)

    if (playing_icon) {
      let playing = DOM.create(`div`, `playing_icon item_node hidden${cls}`)
      playing.textContent = playing_icon
      item.element.append(playing)
    }

    let muted_icon = App.get_setting(`muted_icon`)

    if (muted_icon) {
      let muted = DOM.create(`div`, `muted_icon item_node hidden${cls}`)
      muted.textContent = muted_icon
      item.element.append(muted)
    }
  }

  let text = DOM.create(`div`, `item_text`)
  let text_1 = DOM.create(`div`, `item_text_1`)
  let text_2 = DOM.create(`div`, `item_text_2 hidden`)
  text.append(text_1)
  text.append(text_2)
  item.element.append(text)
  App.set_item_text(item)
  let notes = DOM.create(`div`, `notes_icon item_node action hidden`)
  notes.textContent = App.get_setting(`notes_icon`)
  item.element.append(notes)
  App.check_item_notes(item)

  if (item.mode === `tabs`) {
    item.element.draggable = true

    if (App.get_setting(`pin_icon`)) {
      let pin_icon = DOM.create(`div`, `pin_icon item_node hidden`)
      pin_icon.textContent = App.get_setting(`pin_icon`)
      item.element.append(pin_icon)
    }

    if (App.get_setting(`normal_icon`)) {
      let normal_icon = DOM.create(`div`, `normal_icon item_node hidden`)
      normal_icon.textContent = App.get_setting(`normal_icon`)
      item.element.append(normal_icon)
    }

    App.add_close_icon(item, `right`)
    App.check_tab_item(item)
    App.check_item_status(item)
  }

  if (item.selected) {
    item.element.classList.add(`selected`)
  }
  else {
    item.element.classList.remove(`selected`)
  }
}

App.get_text_icon = (icon_text) => {
  let icon = DOM.create(`div`, `item_icon`)
  icon.textContent = icon_text
  return icon
}

App.get_favicon = (item) => {
  let icon = DOM.create(`img`, `item_icon`)
  icon.loading = `lazy`

  DOM.ev(icon, `error`, () => {
    let icon_2 = App.get_jdenticon(item.hostname)
    icon.replaceWith(icon_2)
  })

  icon.src = item.favicon
  return icon
}

App.get_jdenticon = (hostname) => {
  let icon = DOM.create(`canvas`, `item_icon`)
  icon.width = App.icon_size
  icon.height = App.icon_size
  jdenticon.update(icon, hostname || `hostname`)
  return icon
}

App.set_item_text = (item) => {
  let content
  let path = decodeURI(item.path)
  let text_mode = App.get_setting(`text_mode`)
  let title = App.get_title(item)

  if (text_mode === `title`) {
    content = title || path
    item.footer = path || title
  }
  else if (text_mode === `url`) {
    content = path || title
    item.footer = title || path
  }
  else if (text_mode === `title_url`) {
    content = title

    if (content) {
      content += `\n`
    }

    content += path
    item.footer = path || title
  }
  else if (text_mode === `url_title`) {
    content = path

    if (content) {
      content += `\n`
    }

    content += title
    item.footer = title || path
  }

  if (App.get_setting(`show_tooltips`)) {
    if (content === item.footer || text_mode.includes(`_`)) {
      item.element.title = content
    }
    else {
      item.element.title = `${content}\n${item.footer}`
    }

    if (item.last_visit) {
      item.element.title += `\nLast Visit: ${App.nice_date(item.last_visit)}`
    }

    if (item.date_added) {
      item.element.title += `\nDate Added: ${App.nice_date(item.date_added)}`
    }
  }

  content = content || `Empty`
  let lines = content.split(`\n`)

  for (let [i, line] of lines.entries()) {
    let text = line.substring(0, App.max_text_length).trim()
    let text_el = DOM.el(`.item_text_${i + 1}`, item.element)
    text_el.classList.remove(`hidden`)
    text_el.textContent = text
  }
}

App.get_item_by_id = (mode, id) => {
  id = id.toString()

  for (let item of App.get_items(mode)) {
    if (item.id.toString() === id) {
      return item
    }
  }
}

App.get_item_by_url = (mode, url) => {
  for (let item of App.get_items(mode)) {
    if (item.url) {
      if (App.urls_equal(item.url, url)) {
        return item
      }
    }
  }
}

App.setup_item_window = (mode) => {
  if (App.check_ready(mode)) {
    return
  }

  let args = {}
  args.id = mode
  args.close_button = false
  args.align_top = `left`

  args.setup = () => {
    let win = DOM.el(`#window_content_${mode}`)

    if (mode === `tabs`) {
      let box = App.create_box(mode)
      DOM.el(`#window_${mode}`).append(box)
    }

    let footer = App.create_footer(mode)
    DOM.el(`#window_${mode}`).append(footer)
    let top = DOM.create(`div`, `item_top_container`, `${mode}_top_container`)
    DOM.el(`#window_top_${mode}`).append(top)
    let container = DOM.create(`div`, `item_container`, `${mode}_container`)
    let scroller = App.create_scroller(mode)

    DOM.ev(container, `scroll`, () => {
      App.check_scroller(mode)
    })

    win.append(scroller)
    win.append(container)
    App.setup_window_mouse(mode)
    let main_menu = App.create_main_menu(mode)
    let filter = App.create_filter(mode)
    let filter_modes = App.create_filter_menu(mode)
    let playing = App.create_playing_icon(mode)
    let back = App.create_step_back_button(mode)
    let actions_menu = App.create_actions_menu(mode)
    App.setup_drag(mode, container)
    let left_top = DOM.create(`div`, `item_top_left`)
    let right_top = DOM.create(`div`, `item_top_right`)
    left_top.append(main_menu)
    left_top.append(filter_modes)
    left_top.append(filter)
    right_top.append(playing)
    right_top.append(back)

    if (actions_menu) {
      right_top.append(actions_menu)
    }

    top.append(left_top)
    top.append(right_top)
  }

  App.create_window(args)
}

App.focus_or_open_item = async (item) => {
  for (let tab of App.get_items(`tabs`)) {
    if (App.urls_equal(tab.url, item.url)) {
      await App.focus_tab({item: tab})
      return `focused`
    }
  }

  App.open_tab(item)
  App.after_open()
  return `opened`
}

App.any_item_visible = (mode) => {
  for (let item of App.get_items(mode)) {
    if (item.visible) {
      return true
    }
  }

  return false
}

App.get_visible = (mode) => {
  return App.get_items(mode).filter(x => x.visible)
}

App.update_item = (mode, id, info) => {
  for (let item of App.get_items(mode)) {
    if (item.id === id) {
      App.process_info({mode: mode, info: info, o_item: item})
      App.check_filter(mode)
      break
    }
  }
}

App.get_item_element_index = (mode, el) => {
  return DOM.els(`.${mode}_item`).indexOf(el)
}

App.move_item = (mode, from_index, to_index) => {
  let item = App.get_items(mode).splice(from_index, 1)[0]
  App.get_items(mode).splice(to_index, 0, item)
  App.move_item_element(mode, item.element, to_index)

  if (App.get_selected(mode) === item) {
    App.scroll_to_item(App.get_selected(mode), `center`)
  }
}

App.move_item_element = (mode, el, to_index) => {
  let container = DOM.el(`#${mode}_container`)
  let items = DOM.els(`.${mode}_item`)
  let from_index = items.indexOf(el)

  if (from_index === to_index) {
    return
  }

  if (to_index === 0) {
    container.prepend(el)
  }
  else {
    if (from_index < to_index) {
      container.insertBefore(el, items[to_index + 1])
    }
    else {
      container.insertBefore(el, items[to_index])
    }
  }
}

App.select_range = (item) => {
  let selected = App.get_selected(item.mode)

  if (item === selected) {
    App.select_item({item: item, scroll: `nearest`})
    return
  }

  let items = App.get_items(item.mode).slice(0)
  let index_1 = items.indexOf(item)
  let index_2 = items.indexOf(selected)

  if (item.selected) {
    let reverse = index_1 < index_2

    for (let [i, it] of items.entries()) {
      if (!it.visible || !it.selected) {
        continue
      }

      let unselect = false

      if (index_1 < index_2) {
        if (i > index_1) {
          unselect = true
        }
      }
      else {
        if (i < index_1) {
          unselect = true
        }
      }

      if (unselect) {
        App.toggle_selected(it, false)
      }
    }

    let selected = App.selected_items(item.mode)
    let next_item

    if (reverse) {
      next_item = selected.at(-1)
    }
    else {
      next_item = selected.at(0)
    }

    App.set_selected(next_item)
  }
  else {
    let slice

    if (index_1 < index_2) {
      slice = items.slice(index_1, index_2 + 1)
    }
    else {
      slice = items.slice(index_2 + 1, index_1 + 1)
    }

    if (index_1 < index_2) {
      slice.reverse()
    }

    for (let it of slice) {
      if (!it.visible || it.selected) {
        continue
      }

      App.toggle_selected(it, true)
    }
  }

  App.scroll_to_item(item, `nearest`)
}

App.deselect = (mode = App.window_mode, select = `none`) => {
  let num = 0
  let first, last

  for (let item of App.selected_items(mode)) {
    App.toggle_selected(item, false, false)

    if (!first) {
      first = item
    }

    last = item
    num += 1
  }

  let next_item

  if (select === `up`) {
    if (first) {
      next_item = first
    }
  }
  else if (select === `down`) {
    if (last) {
      next_item = last
    }
  }
  else if (select === `selected`) {
    let selected = App.get_selected(mode)

    if (selected) {
      next_item = selected
    }
  }

  if (next_item) {
    App.select_item({item: next_item, scroll: `nearest`, deselect: false})
  }

  return num
}

App.toggle_selected = (item, what, select = true) => {
  let items = App.selected_items(item.mode)
  let selected

  if (what !== undefined) {
    selected = what
  }
  else {
    selected = !item.selected
  }

  if (!item.visible) {
    selected = false
  }

  if (selected) {
    item.element.classList.add(`selected`)
    App.set_selected(item)
  }
  else {
    if (items.length === 1 && select) {
      return
    }

    item.element.classList.remove(`selected`)
  }

  item.selected = selected

  if (select && !selected) {
    if (items.length && App.get_selected(item.mode) === item) {
      for (let it of items) {
        if (it === item) {
          continue
        }

        App.set_selected(it)
        break
      }
    }
  }

  App.update_footer_count(item.mode)
}

App.selected_items = (mode = App.window_mode) => {
  return App.get_items(mode).filter(x => x.selected)
}

App.after_focus = (args) => {
  let def_args = {
    method: `normal`,
  }

  args = Object.assign(def_args, args)

  if (args.method === `load`) {
    return
  }

  if (args.method === `normal`) {
    if (App.get_setting(`close_on_focus`)) {
      App.close_window()
    }
  }

  if (args.show_tabs) {
    if (App.active_mode !== `tabs`) {
      App.do_show_mode({mode: `tabs`})
    }
  }

  App.check_restore()
}

App.after_open = (shift = false) => {
  if (shift) {
    return
  }

  if (App.get_setting(`close_on_open`)) {
    App.close_window()
  }

  App.check_restore()
}

App.open_items = (item, shift, multiple = true) => {
  let mode = item.mode
  let items

  if (multiple) {
    items = App.get_active_items(mode, item)
  }
  else {
    items = [item]
  }

  if (items.length === 1) {
    App.open_tab(items[0])
    App.after_open(shift)
  }
  else {
    let force = App.check_force(`warn_on_open`, items)

    App.show_confirm(`Open these items ${items.length}?`, () => {
      for (let item of items) {
        App.open_tab(item)
      }

      App.deselect(mode, `selected`)
      App.after_open(shift)
    }, () => {
      App.deselect(mode, `selected`)
    }, force)
  }
}

App.goto_top = (mode = App.window_mode, select = false) => {
  if (select) {
    App.select_item({item: App.get_visible(mode).at(0), scroll: `nearest`})
  }
  else {
    let el = DOM.el(`#${mode}_container`)

    el.scrollTo({
      top: 0,
      behavior: `instant`,
    })
  }

  App.do_check_scroller(mode)
}

App.goto_bottom = (mode = App.window_mode, select = false) => {
  if (select) {
    App.select_item({item: App.get_visible(mode).at(-1), scroll: `nearest`})
  }
  else {
    let el = DOM.el(`#${mode}_container`)

    el.scrollTo({
      top: el.scrollHeight,
      behavior: `instant`,
    })
  }

  App.do_check_scroller(mode)
}

App.scroll = (mode, direction) => {
  let el = DOM.el(`#${mode}_container`)

  if (direction === `up`) {
    el.scrollTop -= App.scroll_amount
  }
  else if (direction === `down`) {
    el.scrollTop += App.scroll_amount
  }
}

App.select_all = (mode = App.window_mode, toggle = false) => {
  let items = App.get_items(mode)

  if (toggle) {
    let all_selected = true

    for (let item of items) {
      if (!item.selected) {
        all_selected = false
        break
      }
    }

    if (all_selected) {
      App.deselect(mode, `selected`)
      return
    }
  }

  let first

  for (let item of items) {
    if (!first) {
      first = item
    }

    App.toggle_selected(item, true, false)
  }

  if (first) {
    App.set_selected(first)
  }
}

App.create_icon = (name, type = 1) => {
  let icon = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)
  icon.classList.add(`icon_${type}`)
  let icon_use = document.createElementNS(`http://www.w3.org/2000/svg`, `use`)
  icon_use.href.baseVal = `#${name}_icon`
  icon.append(icon_use)
  return icon
}

App.get_active_items = (mode, item, multiple = true) => {
  if (!multiple) {
    return [item]
  }

  let selected = App.selected_items(mode)

  if (selected.length === 1) {
    if (item) {
      return [item]
    }
    else {
      return [App.get_selected(mode)]
    }
  }
  else {
    if (!selected.includes(item)) {
      selected.push(item)
    }

    return selected
  }
}

App.insert_item = (mode, info) => {
  let item = App.process_info({mode: mode, info: info})
  let container = DOM.el(`#${mode}_container`)

  if (mode === `tabs`) {
    App.get_items(mode).splice(info.index, 0, item)
    container.append(item.element)
    App.move_item_element(`tabs`, item.element, info.index)
  }
  else {
    let old = App.get_item_by_url(mode, item.url)

    if (old) {
      App.remove_item(old)
    }

    App.get_items(mode).unshift(item)
    container.prepend(item.element)
  }

  App.update_footer_count(mode)
  App.check_filter(mode)
  return item
}

App.container_is_scrolled = (mode) => {
  let container = DOM.el(`#${mode}_container`)
  return container.scrollHeight > container.clientHeight
}

App.scroll_to_item = (item, scroll = `nearest`) => {
  if (scroll === `none`) {
    return
  }

  item.element.scrollIntoView({
    block: scroll,
    behavior: `instant`,
  })

  App.do_check_scroller(item.mode)
}

App.copy_url = (item) => {
  App.copy_to_clipboard(item.url, `URL`)
}

App.copy_title = (item) => {
  let title = App.get_title(item)
  App.copy_to_clipboard(title, `Title`)
}

App.on_items = (mode = App.window_mode, check_popups = false) => {
  let on_items = App.modes.includes(mode)

  if (on_items && check_popups) {
    on_items = !App.popup_open()
  }

  return on_items
}

App.get_next_item = (mode, args = {}) => {
  let def_args = {
    mode: mode,
    wrap: false,
  }

  args = Object.assign(def_args, args)
  return App.get_other_item(args) || App.get_other_item(args, true)
}

App.multiple_selected = (mode) => {
  let n = 0

  for (let item of App.get_items(mode)) {
    if (item.selected) {
      n += 1

      if (n >= 2) {
        return true
      }
    }
  }

  return false
}

App.soft_copy_item = (o_item) => {
  let item = {}

  for (let key in o_item) {
    if (key === `element`) {
      continue
    }

    item[key] = o_item[key]
  }

  return item
}

App.get_title = (item) => {
  return item.custom_title || item.title
}

App.remove_duplicates = (items) => {
  let objs = []
  let urls = []

  for (let item of items) {
    if (!urls.includes(item.url)) {
      objs.push(item)
      urls.push(item.url)
    }
  }

  return objs
}

App.pick = (item) => {
  if (item.selected) {
    App.toggle_selected(item, false)
  }
  else {
    App.select_item({item: item, scroll: `nearest`, deselect: false})
  }
}

App.get_index_diff = (item_1, item_2) => {
  let i = App.get_item_element_index(item_1.mode, item_1.element)
  let ii = App.get_item_element_index(item_2.mode, item_2.element)
  return Math.abs(i - ii)
}

App.get_persistent_items = () => {
  let items = []

  for (let mode of App.persistent_modes) {
    items.push(...App.get_items(mode))
  }

  return items
}

// Clear but always have tabs available
App.clear_show = async () => {
  App.clear_all_items()
  await App.do_show_mode({mode: `tabs`})
  App.show_primary_mode(false)
}

App.select_item_by_id = (mode, id) => {
  let item = App.get_item_by_id(mode, id)

  if (item) {
    App.select_item({item: item, scroll: `center`})
  }
}

App.item_is_visible = (item) => {
  let container_rect = item.element.parentElement.getBoundingClientRect()
  let rect = item.element.getBoundingClientRect()
  let scroller = DOM.el(`#${item.mode}_scroller`)
  let top = container_rect.top

  if (!scroller.classList.contains(`hidden`)) {
    top += scroller.clientHeight
  }

  let extra = 2
  let top_visible = rect.top >= (top - extra)
  let bottom_visible = rect.bottom <= (container_rect.bottom + extra)
  return top_visible && bottom_visible
}
App.check_items_keyboard = (e) => {
  let mode = App.window_mode
  let item = App.get_selected(mode)
  let filter_focus = App.filter_is_focused(mode)

  function arrow (direction, e) {
    if (!item) {
      e.preventDefault()
      return
    }

    if (!App.item_is_visible(item)) {
      App.select_item({item: item, scroll: `nearest`})
    }
    else {
      if (App.deselect(mode, direction) > 1) {
        e.preventDefault()
        return
      }

      if (direction === `up`) {
        App.select_above(mode)
      }
      else if (direction === `down`) {
        App.select_below(mode)
      }
    }

    e.preventDefault()
  }

  for (let sc of App.get_setting(`keyboard_shortcuts`)) {
    if (sc.key !== e.code) {
      continue
    }

    if (sc.ctrl && !e.ctrlKey) {
      continue
    }

    if (sc.shift && !e.shiftKey) {
      continue
    }

    if (sc.alt && !e.altKey) {
      continue
    }

    if (!sc.ctrl && !sc.alt) {
      if (filter_focus) {
        continue
      }
    }

    App.run_command({cmd: sc.cmd, from: `keyboard_shortcut`})
    e.preventDefault()
    e.stopPropagation()
    return
  }

  if (e.ctrlKey && !e.shiftKey) {
    if (e.key === `ArrowUp`) {
      App.move_tabs_vertically(`top`)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowDown`) {
      App.move_tabs_vertically(`bottom`)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowLeft`) {
      App.show_main_menu(mode)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowRight`) {
      App.show_actions_menu(mode)
      e.preventDefault()
      return
    }
    else if (e.key === `a`) {
      if (!filter_focus) {
        App.select_all(mode, true)
        e.preventDefault()
      }

      return
    }
    else if (e.key === `f`) {
      App.show_filter_menu(mode)
      e.preventDefault()
      return
    }
    else if (e.key === `.`) {
      App.go_to_playing_tab()
      e.preventDefault()
      return
    }
    else if (e.key === `,`) {
      App.go_to_previous_tab()
      e.preventDefault()
      return
    }
    else if (e.key === `Home`) {
      App.goto_top(mode, true)
      e.preventDefault()
      return
    }
    else if (e.key === `End`) {
      App.goto_bottom(mode, true)
      e.preventDefault()
      return
    }
    else if (e.key === `Delete`) {
      if (mode === `tabs` && App.is_filtered(mode)) {
        App.close_visible_tabs()
      }

      e.preventDefault()
      return
    }
  }

  if (e.shiftKey && !e.ctrlKey) {
    if (e.key === `Enter`) {
      App.show_item_menu_2(item)
      e.preventDefault()
      return
    }
    else if (e.key === `Home`) {
      App.select_to_edge(mode, `up`)
      e.preventDefault()
      return
    }
    else if (e.key === `End`) {
      App.select_to_edge(mode, `down`)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowUp`) {
      App.select_next(mode, `above`)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowDown`) {
      App.select_next(mode, `below`)
      e.preventDefault()
      return
    }
    else if (e.key === `PageUp`) {
      App.scroll(mode, `up`)
      e.preventDefault()
      return
    }
    else if (e.key === `PageDown`) {
      App.scroll(mode, `down`)
      e.preventDefault()
      return
    }
    else if (e.key === `Tab`) {
      App.cycle_modes(true)
      e.preventDefault()
      return
    }
  }

  if (!e.ctrlKey && !e.shiftKey) {
    if (e.key === `Escape`) {
      App.step_back(mode, e)
      e.preventDefault()
      return
    }
    else if (e.key === `Enter`) {
      if (filter_focus) {
        if (App.get_setting(`filter_enter`)) {
          let current = App.get_filter(mode)
          let last = App[`last_${mode}_filter`]

          if (current !== last) {
            App.do_filter({mode: mode})
            return
          }
        }
      }

      App[`${mode}_action`](item)
      e.preventDefault()
      return
    }
    else if (e.key === `PageUp`) {
      App.scroll(mode, `up`)
      e.preventDefault()
      return
    }
    else if (e.key === `PageDown`) {
      App.scroll(mode, `down`)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowUp`) {
      arrow(`up`, e)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowDown`) {
      arrow(`down`, e)
      e.preventDefault()
      return
    }
    else if (e.key === `ArrowLeft`) {
      if (!filter_focus) {
        App.cycle_modes(true)
        e.preventDefault()
        return
      }
    }
    else if (e.key === `ArrowRight`) {
      if (!filter_focus) {
        App.cycle_modes(false)
        e.preventDefault()
        return
      }
    }
    else if (e.key === `Tab`) {
      App.cycle_modes(false)
      e.preventDefault()
      return
    }
    else if (e.key === `Delete`) {
      if (item && mode === `tabs`) {
        if (!filter_focus || !App.filter_has_value(mode) || App.filter_at_end(mode)) {
          App.close_tabs(item)
          e.preventDefault()
        }
      }

      return
    }
    else if (e.key === `Home`) {
      if (!filter_focus) {
        App.goto_top(mode, true)
        e.preventDefault()
        return
      }
    }
    else if (e.key === `End`) {
      if (!filter_focus) {
        App.goto_bottom(mode, true)
        e.preventDefault()
        return
      }
    }
  }

  if (!App.filter_is_focused(mode)) {
    let allowed = [`Backspace`]

    if (e.key.length === 1 || allowed.includes(e.key)) {
      App.focus_filter(mode)
    }
  }

  App.clear_restore()
}

App.setup_keyboard = () => {
  DOM.ev(document, `keydown`, (e) => {
    let mode = App.window_mode
    let pmode = App.popup_mode()

    if (e.key === `Control`) {
      if (App.now() - App.double_tap_date < App.double_tap_delay) {
        App.show_palette()
        e.preventDefault()
        return
      }

      App.double_tap_date = App.now()
    }

    if (NeedContext.open) {
      if (e.shiftKey && e.key === `Enter`) {
        NeedContext.hide()
        e.preventDefault()
      }
      else if (e.ctrlKey && e.key === `ArrowLeft`) {
        NeedContext.hide()
        e.preventDefault()
      }
      else if (e.ctrlKey && e.key === `ArrowDown`) {
        NeedContext.hide()
        e.preventDefault()
      }
      else if (e.ctrlKey && e.key === `ArrowRight`) {
        NeedContext.hide()
        e.preventDefault()
      }
    }
    else if (App.popup_open()) {
      if (pmode === `dialog`) {
        if (e.key === `Enter`) {
          App.dialog_enter()
          e.preventDefault()
          return
        }
        else if (e.key === `Escape`) {
          App.dismiss_popup(`dialog`)
          e.preventDefault()
          return
        }
        else if (e.key === `ArrowLeft`) {
          App.dialog_left()
          e.preventDefault()
          return
        }
        else if (e.key === `ArrowRight`) {
          App.dialog_right()
          e.preventDefault()
          return
        }
      }
      else if (pmode === `prompt`) {
        if (e.key === `Enter`) {
          App.prompt_submit()
          e.preventDefault()
          return
        }
      }
      else if (pmode === `palette`) {
        if (e.key === `Escape`) {
          if (App.palette_filter_focused()) {
            App.clear_palette_filter()
            e.preventDefault()
          }
          else {
            App.hide_all_popups()
            e.preventDefault()
          }

          return
        }
        else if (e.key === `Enter`) {
          App.palette_enter()
          e.preventDefault()
          return
        }
        else if (e.key === `ArrowUp`) {
          App.palette_next(true)
          e.preventDefault()
          return
        }
        else if (e.key === `ArrowDown`) {
          App.palette_next()
          e.preventDefault()
          return
        }
        else if (App.palette_filter_focused()) {
          App.filter_palette()
          return
        }
      }
      else if (pmode === `close_tabs`) {
        if (e.key === `Enter`) {
          App.close_tabs_action()
          e.preventDefault()
          return
        }
        else if (e.key === `ArrowLeft`) {
          App.close_tabs_next(true)
          e.preventDefault()
          return
        }
        else if (e.key === `ArrowRight`) {
          App.close_tabs_next()
          e.preventDefault()
          return
        }
      }
      else if (Addlist.on_addlist()) {
        if (e.key === `Enter`) {
          Addlist.enter()
          e.preventDefault()
          return
        }
        else if (e.key === `Escape`) {
          Addlist.hide(true, `escape`)
          e.preventDefault()
          return
        }
        else if (e.key === `ArrowLeft`) {
          if (!App.text_with_value_focused()) {
            Addlist.left()
            e.preventDefault()
            return
          }
        }
        else if (e.key === `ArrowRight`) {
          if (!App.text_with_value_focused()) {
            Addlist.right()
            e.preventDefault()
            return
          }
        }
      }

      if (e.key === `Escape`) {
        App.hide_all_popups()
        e.preventDefault()
        return
      }
    }
    else if (App.on_items()) {
      App.check_items_keyboard(e)
    }
    else if (App.on_settings()) {
      if (e.key === `Escape`) {
        if (App.settings_filter_focused()) {
          App.clear_settings_filter()
          e.preventDefault()
        }
        else {
          App.hide_window()
          e.preventDefault()
        }

        return
      }
      else if (e.key === `ArrowLeft`) {
        if (!App.text_with_value_focused()) {
          App.settings_wheel.call(undefined, `up`)
          e.preventDefault()
          return
        }
      }
      else if (e.key === `ArrowRight`) {
        if (!App.text_with_value_focused()) {
          App.settings_wheel.call(undefined, `down`)
          e.preventDefault()
          return
        }
      }
      else if (App.settings_filter_focused()) {
        App.filter_settings()
        return
      }
    }
    else if (App.on_media()) {
      if (e.key === `Escape`) {
        App.hide_window()
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowLeft`) {
        App.media_prev()
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowRight`) {
        App.media_next()
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowUp`) {
        App.scroll_media_up()
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowDown`) {
        App.scroll_media_down()
        e.preventDefault()
        return
      }
      else if (e.key === `Enter`) {
        if (e.shiftKey) {
          App.show_media_menu(mode)
        }
        else {
          App.open_media()
        }

        e.preventDefault()
        return
      }
    }
    else if (mode === `about`) {
      if (e.key === `Escape`) {
        if (App.about_filter_focused()) {
          App.clear_about_filter()
          e.preventDefault()
        }
        else {
          App.hide_window()
          e.preventDefault()
        }

        return
      }
      else if (App.about_filter_focused()) {
        App.filter_about()
        return
      }
    }
    else if (mode === `profile_editor`) {
      if (e.key === `Enter` || e.key === `Escape`) {
        App.profile_editor_close()
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowLeft`) {
        if (!App.text_with_value_focused()) {
          App.profile_editor_left()
          e.preventDefault()
          return
        }
      }
      else if (e.key === `ArrowRight`) {
        if (!App.text_with_value_focused()) {
          App.profile_editor_right()
          e.preventDefault()
          return
        }
      }
    }
  })
}
App.create_main_menu = (mode) => {
  let btn = DOM.create(`div`, `button icon_button`, `${mode}_main_menu`)
  btn.textContent = App.get_mode_name(mode)
  btn.title = `Main Menu (Ctrl + Left) - Right Click to show the Palette`

  DOM.ev(btn, `click`, () => {
    App.show_main_menu(mode)
  })

  DOM.ev(btn, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_palette()
  })

  DOM.ev(btn, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_main_menu`)
      App.run_command({cmd: cmd, from: `main_menu`})
    }
  })

  DOM.ev(btn, `wheel`, (e) => {
    let direction = App.wheel_direction(e)

    if (direction === `down`) {
      App.cycle_modes(false)
    }
    else if (direction === `up`) {
      App.cycle_modes(true)
    }
  })

  return btn
}

App.show_main_menu = (mode) => {
  let items = []

  for (let m of App.modes) {
    let icon = App.mode_icons[m]
    let name = App.get_mode_name(m)

    items.push({
      icon: icon,
      text: name,
      action: () => {
        App.do_show_mode({mode: m, reuse_filter: true})
      },
      selected: m === mode
    })
  }

  App.sep(items)

  if (App.get_setting(`direct_settings`)) {
    items.push({
      icon: App.settings_icons.general,
      text: `Settings`,
      action: () => {
        App.show_settings()
      }
    })
  }
  else {
    items.push({
      icon: App.settings_icons.general,
      text: `Settings`,
      get_items: () => {
        return App.settings_menu_items(`main_menu`)
      }
    })
  }

  items.push({
    icon: App.profile_icon,
    text: `Profiles`,
    get_items: () => {
      return App.get_profile_menu_items()
    }
  })

  items.push({
    icon: App.bot_icon,
    text: `About`,
    action: () => {
      App.show_about()
    }
  })

  App.sep(items)

  items.push({
    icon: App.command_icon,
    text: `Cmd...`,
    action: () => {
      App.show_palette()
    },
    title: `You can also double tap Ctrl to open this`
  })

  let btn = DOM.el(`#${mode}_main_menu`)
  NeedContext.show_on_element(btn, items, true, btn.clientHeight)
}
App.image_extensions = [`jpg`, `jpeg`, `png`, `gif`, `webp`, `bmp`]
App.video_extensions = [`mp4`, `webm`]
App.audio_extensions = [`mp3`, `ogg`, `flac`, `wav`]

App.start_media = (what) => {
  if (App.check_ready(`media_${what}`)) {
    return
  }

  App.create_window({
    id: `media_${what}`,
    setup: () => {
      let media = DOM.el(`#media_${what}_player`)
      let buttons = DOM.el(`#media_${what}_buttons`)

      let prev = DOM.create(`div`, `button arrow_prev`, `media_${what}_prev`)
      prev.textContent = `<`
      prev.title = `Go To Previous (Left)`
      buttons.append(prev)

      let open = DOM.create(`div`, `button`, `media_${what}_open`)
      open.textContent = `Open`
      open.title = `Open Tab (Enter)`
      buttons.append(open)

      let menu = DOM.create(`div`, `button icon_button`, `media_${what}_menu`)
      menu.title = `Menu (Space)`
      menu.append(App.create_icon(`sun`))
      buttons.append(menu)

      let close = DOM.create(`div`, `button`, `media_${what}_close`)
      close.textContent = App.close_text
      close.title = `Close this window`
      buttons.append(close)

      let next = DOM.create(`div`, `button arrow_next`, `media_${what}_next`)
      next.textContent = `>`
      next.title = `Go To Next (Right)`
      buttons.append(next)

      if (what === `image`) {
        DOM.ev(media, `load`, () => {
          App.stop_media_timeout(what)
          media.classList.remove(`hidden`)
          DOM.el(`#media_${what}_loading`).classList.add(`hidden`)
        })
      }
      else if (what === `video` || what === `audio`) {
        DOM.ev(media, `canplay`, () => {
          App.stop_media_timeout(what)
          media.classList.remove(`hidden`)
          DOM.el(`#media_${what}_loading`).classList.add(`hidden`)
          media.play()
        })
      }

      DOM.ev(media, `error`, () => {
        App.media_show_error(what)
      })

      DOM.ev(open, `click`, () => {
        App.open_media(what)
      })

      DOM.ev(menu, `click`, () => {
        App.show_media_menu(what)
      })

      DOM.ev(close, `click`, () => {
        App.hide_window()
      })

      DOM.ev(DOM.el(`#media_${what}_prev`), `click`, () => {
        App.media_prev(what)
      })

      DOM.ev(DOM.el(`#media_${what}_next`), `click`, () => {
        App.media_next(what)
      })

      DOM.ev(DOM.el(`#media_${what}_url`), `click`, () => {
        App.media_copy(what)
      })

      DOM.ev(buttons, `wheel`, (e) => {
        App.media_wheel.call(e, what)
      })
    },
    after_hide: () => {
      if (what === `video` || what === `audio`) {
        App.stop_media_player(what)
      }

      App.hide_media_elements(what)
      App.stop_media_timeout(what)
    },
    colored_top: true,
    cls: `media`,
  })

  App.fill_media_window(what)

  App.media_wheel = App.create_debouncer((e, what) => {
    let direction = App.wheel_direction(e)

    if (direction === `down`) {
      App.media_next(what)
    }
    else if (direction === `up`) {
      App.media_prev(what)
    }
  }, App.wheel_delay)
}

App.get_media_type = (item) => {
  for (let type of App.media_types) {
    if (item[type]) {
      return type
    }
  }
}

App.view_media = (o_item) => {
  let what = App.get_media_type(o_item)

  if (!what) {
    return
  }

  App.start_media(what)
  let item = App.soft_copy_item(o_item)
  App.hide_media_elements(what)
  App[`current_media_${what}_item`] = item
  App.current_media_type = what
  DOM.el(`#media_${what}_player`).src = item.url
  App.stop_media_timeout(what)

  App[`media_${what}_loading_timeout`] = setTimeout(() => {
    DOM.el(`#media_${what}_loading`).classList.remove(`hidden`)
  }, 500)

  let url_el = DOM.el(`#media_${what}_url`)
  url_el.textContent = item.url
  url_el.title = item.url
  App.show_window(`media_${what}`)
  App.media_show_loading(what)

  if (App.get_visible_media(item.mode, what).length <= 1) {
    DOM.el(`#media_${what}_prev`).classList.add(`disabled`)
    DOM.el(`#media_${what}_next`).classList.add(`disabled`)
  }
  else {
    DOM.el(`#media_${what}_prev`).classList.remove(`disabled`)
    DOM.el(`#media_${what}_next`).classList.remove(`disabled`)
  }
}

App.stop_media_player = (what) => {
  let player = DOM.el(`#media_${what}_player`)
  player.pause()
  player.src = ``
}

App.hide_media_elements = (what) => {
  DOM.el(`#media_${what}_player`).classList.add(`hidden`)
  DOM.el(`#media_${what}_loading`).classList.add(`hidden`)
}

App.stop_media_timeout = (what) => {
  clearTimeout(App[`media_${what}_loading_timeout`])
}

App.media_prev = (what = App.current_media_type) => {
  App.cycle_media(App[`current_media_${what}_item`], what, `prev`)
}

App.media_next = (what = App.current_media_type) => {
  App.cycle_media(App[`current_media_${what}_item`], what, `next`)
}

App.cycle_media = (item, what, dir) => {
  let items = App.get_visible_media(item.mode, what)

  if (items.length <= 1) {
    return
  }

  let waypoint = false
  let next_item

  if (dir === `prev`) {
    items.reverse()
  }

  for (let it of items) {
    if (!it[what] || !it.visible) {
      continue
    }

    if (waypoint) {
      if (it.url !== item.url) {
        next_item = it
        break
      }
    }

    if (it.id === item.id) {
      waypoint = true
    }
  }

  if (!next_item) {
    next_item = items[0]
  }

  App.view_media(next_item)
}

App.media_show_loading = (what) => {
  DOM.el(`#media_${what}_loading`).textContent = `Loading...`
}

App.media_show_error = (what) => {
  DOM.el(`#media_${what}_loading`).textContent = `Error`
}

App.open_media = (what = App.window_mode) => {
  if (what === `video` || what === `audio`) {
    App.stop_media_player(what)
  }

  let item = App[`current_media_${what}_item`]
  App.hide_window()
  App.focus_or_open_item(item)
}

App.media_copy = (what) => {
  App.copy_url(App[`current_media_${what}_item`])
}

App.media_background = (what = App.window_mode) => {
  if (what === `image`) {
    let item = App[`current_media_${what}_item`]
    App.change_background(item.url)
  }
}

App.get_visible_media = (mode, what) => {
  let items = []

  for (let item of App.get_items(mode)) {
    if (item[what]) {
      items.push(item)
    }
  }

  return items
}

App.on_media = () => {
  return App.window_mode.startsWith(`media_`)
}

App.show_media_menu = (what) => {
  let items = []
  let item = App.current_media_item()

  items.push({
    icon: App.mode_icons[item.mode],
    text: `Select`,
    action: () => {
      App.hide_window()
      App.select_item_by_id(item.mode, item.id)
    }
  })

  items.push({
    icon: App.clipboard_icon,
    text: `Copy URL`,
    action: () => {
      App.media_copy(what)
    }
  })

  items.push({
    icon: App.mode_icons.bookmarks,
    text: `Bookmark`,
    action: () => {
      App.bookmark_items(item)
    }
  })

  if (what === `image`) {
    items.push({
      icon: App.settings_icons.theme,
      text: `Background`,
      action: () => {
        App.media_background(what)
      }
    })
  }

  let btn = DOM.el(`#media_${what}_menu`)
  NeedContext.show_on_element(btn, items)
}

App.search_media = (mode, e) => {
  let items = []

  for (let type of App.media_types) {
    let subitems = []
    let icon = App.get_setting(`${type}_icon`)

    for (let ext of App[`${type}_extensions`]) {
      subitems.push({text: ext, icon: icon, action: () => {
        App.set_filter_mode({mode: mode, type: type, filter: false})
        App.set_filter({mode: mode, text: `.${ext}`})
      }})
    }

    items.push({
      text: App.capitalize(type), icon: icon, action: () => {
      App.show_center_context(subitems, e)
    }})
  }

  App.show_center_context(items, e)
}

App.scroll_media_up = (what = App.window_mode) => {
  DOM.el(`#window_content_media_${what}`).scrollTop -= App.media_scroll
}

App.scroll_media_down = (what = App.window_mode) => {
  DOM.el(`#window_content_media_${what}`).scrollTop += App.media_scroll
}

App.current_media_item = () => {
  let what = App.current_media_type
  return App[`current_media_${what}_item`]
}

App.is_image = (src) => {
  let extension = App.get_extension(src).toLowerCase()
  return extension && App.image_extensions.includes(extension)
}

App.is_video = (src) => {
  let extension = App.get_extension(src).toLowerCase()
  return extension && App.video_extensions.includes(extension)
}

App.is_audio = (src) => {
  let extension = App.get_extension(src).toLowerCase()
  return extension && App.audio_extensions.includes(extension)
}

App.fill_media_window = (what) => {
  let c = DOM.create(`div`, `flex_column_center gap_2`)
  let url = DOM.create(`div`, `media_url action`, `media_${what}_url`)
  c.append(url)
  let mc = DOM.create(`div`, `media_container`, `media_${what}_container`)
  let loading = DOM.create(`div`, `media_loading hidden`, `media_${what}_loading`)
  mc.append(loading)
  let media

  if (what === `image`) {
    media = DOM.create(`img`, `media_player`, `media_${what}_player`)
  }
  else if (what === `video`) {
    media = DOM.create(`video`, `media_player`, `media_${what}_player`)
    media.controls = true
  }
  else if (what === `audio`) {
    media = DOM.create(`audio`, `media_player`, `media_${what}_player`)
    media.controls = true
  }

  mc.append(media)
  c.append(mc)
  DOM.el(`#window_content_media_${what}`).append(c)
  let top = DOM.create(`div`, `flex_row_center gap_2 grow`, `media_${what}_buttons`)
  DOM.el(`#window_top_media_${what}`).append(top)
}
const Menubutton = {}

Menubutton.create = (args = {}) => {
  let def_args = {
    wrap: true,
  }

  args = Object.assign(def_args, args)

  if (!args.button) {
    args.button = DOM.create(`div`, `menubutton button`, args.id)
  }

  args.container = DOM.create(`div`, `menubutton_container`)
  let prev = DOM.create(`div`, `button`)
  prev.textContent = `<`
  let next = DOM.create(`div`, `button`)
  next.textContent = `>`

  DOM.ev(args.button, `click`, () => {
    let items = []

    for (let opt of args.opts) {
      if (opt.text === App.separator_string) {
        App.sep(items)
        continue
      }

      items.push({
        icon: opt.icon,
        text: opt.text,
        info: opt.info,
        image: opt.image,
        action: () => {
          Menubutton.set_text(args, opt)

          if (args.on_change) {
            args.on_change(args, opt)
          }
        },
      })
    }

    NeedContext.show_on_element(args.button, items, true, args.button.clientHeight)
  })

  args.set = (value, on_change = true) => {
    let opt = Menubutton.opt(args, value)
    Menubutton.set_text(args, opt)

    if (on_change && args.on_change) {
      args.on_change(args, opt)
    }
  }

  args.prev = () => {
    Menubutton.cycle(args, `prev`)
  }

  args.next = () => {
    Menubutton.cycle(args, `next`)
  }

  if (args.selected) {
    for (let opt of args.opts) {
      if (args.selected === opt.value) {
        Menubutton.set_text(args, opt)
        break
      }
    }
  }

  DOM.ev(prev, `click`, args.prev)
  DOM.ev(next, `click`, args.next)
  args.container.append(prev)
  args.container.append(next)
  args.button.after(args.container)
  prev.after(args.button)
  return args
}

Menubutton.set_text = (args, opt) => {
  args.button.innerHTML = ``

  if (opt.icon) {
    let icon = DOM.create(`div`)
    icon.append(opt.icon)
    args.button.append(icon)
  }

  let text = DOM.create(`div`)
  text.append(opt.text)
  args.button.append(text)
  args.value = opt.value
}

Menubutton.cycle = (args, dir) => {
  let waypoint = false
  let opts = args.opts.slice(0)

  if (dir === `prev`) {
    opts.reverse()
  }

  let opt

  if (args.wrap) {
    opt = opts[0]
  }

  for (let o of opts) {
    if (o.text === App.separator_string) {
      continue
    }

    if (waypoint) {
      opt = o
      break
    }

    if (o.value === args.value) {
      waypoint = true
    }
  }

  if (opt) {
    Menubutton.set_text(args, opt)

    if (args.on_change) {
      args.on_change(args, opt)
    }
  }
}

Menubutton.opt = (args, value) => {
  for (let opt of args.opts) {
    if (opt.value === value) {
      return opt
    }
  }
}
App.setup_modes = () => {
  for (let mode of App.modes) {
    App[`${mode}_changed`] = false
    App[`${mode}_ready`] = false
  }

  App.show_mode_debouncer = App.create_debouncer((args) => {
    App.do_show_mode(args)
  }, App.show_mode_delay)
}

App.show_mode = (args) => {
  App.show_mode_debouncer.call(args)
}

App.do_show_mode = async (args) => {
  let def_args = {
    reuse_filter: false,
    force: false,
  }

  args = Object.assign(def_args, args)

  if (!App.get_setting(`reuse_filter`)) {
    args.reuse_filter = false
  }

  App.setup_item_window(args.mode)
  let pre_show = App[`pre_show_${args.mode}`]

  if (pre_show) {
    pre_show()
  }

  App.windows[args.mode].show()
  let was_filtered = App.was_filtered(args.mode)

  if (!args.force) {
    if ((App.active_mode === args.mode) &&
    (App[`${args.mode}_items`].length) &&
    !was_filtered && !App[`${args.mode}_changed`]) {
      App.select_first_item(args.mode, true)

      if (args.mode === `tabs`) {
        App.check_pinline()
      }

      return
    }
  }

  let value = App.get_last_filter_value(args.reuse_filter)
  App.active_mode = args.mode
  App.empty_footer_info()
  App.cancel_filter()
  App.set_filter({mode: args.mode, text: value, filter: false})
  let filter_mode = App.filter_modes(args.mode)[0]
  App.set_filter_mode({mode: args.mode, type: filter_mode.type, filter: false})
  App[`${args.mode}_filter_mode`] = filter_mode.type
  App[`last_${args.mode}_query`] = undefined
  let persistent = App.persistent_modes.includes(args.mode)
  let search = App.search_modes.includes(args.mode)
  let items_ready = false
  let items

  if (persistent) {
    if (App[`${args.mode}_items`].length) {
      items = App[`${args.mode}_items`]
      items_ready = true
    }
  }

  // Clear inactive items
  for (let m of App.modes) {
    if (App.persistent_modes.includes(m)) {
      if (App[`${m}_items`].length) {
        continue
      }
    }

    App.clear_items(m)
  }

  if (search && value) {
    items = []
  }
  else if (!items_ready) {
    items = await App[`get_${args.mode}`]()
    was_filtered = false
  }

  if (!persistent) {
    if (args.mode !== App.active_mode) {
      return
    }
  }

  if (search && value) {
    // Filter will search
  }
  else if (!items_ready) {
    if (items.length) {
      App.process_info_list(args.mode, items)
    }
    else {
      App.do_check_scroller(args.mode)
    }
  }
  else {
    App.update_footer_info(App.get_selected(args.mode))
  }

  if (value || was_filtered) {
    App.do_filter({mode: args.mode, force: true})
  }
  else {
    App.select_first_item(args.mode, true, `center`)
  }

  App[`${args.mode}_changed`] = false
  App.check_playing(args.mode)

  if (args.mode === `tabs`) {
    App.check_pinline()
  }
}

App.get_mode_index = (mode) => {
  for (let [i, m] of App.modes) {
    if (m === mode) {
      return i
    }
  }
}

App.get_mode_name = (mode) => {
  return App.capitalize(mode)
}

App.show_primary_mode = () => {
  App.do_show_mode({mode: App.primary_mode()})
}

App.cycle_modes = (reverse, reuse_filter = true) => {
  let index = App.modes.indexOf(App.window_mode)
  let new_mode

  if (index === -1) {
    return
  }

  if (reverse) {
    if (index === 0) {
      new_mode = App.modes.slice(-1)[0]
    }
    else {
      new_mode = App.modes[index - 1]
    }
  }
  else {
    if (index === App.modes.length - 1) {
      new_mode = App.modes[0]
    }
    else {
      new_mode = App.modes[index + 1]
    }
  }

  App.show_mode({mode: new_mode, reuse_filter: reuse_filter})
}

App.primary_mode = () => {
  return App.get_setting(`primary_mode`)
}

App.show_primary_mode = (allow_same = true) => {
  let mode = App.primary_mode()

  if (!allow_same) {
    if (App.active_mode === mode) {
      return
    }
  }

  App.do_show_mode({mode: mode})
}

App.getting = (mode, force = false) => {
  let icon = App.mode_icons[mode]
  let name = App.capitalize(mode)
  App.debug(`${icon} Getting ${name}`, force)
}

App.on_action = (mode) => {
  App.update_filter_history(mode)
}
App.get_cursor_item = (mode, e) => {
  let el = e.target.closest(`.${mode}_item`)
  let item = App.get_item_by_id(mode, el.dataset.id)

  if (!item) {
    el.remove()
    return
  }

  return item
}

App.cursor_on_item = (e, mode) => {
  return e.target.closest(`.${mode}_item`)
}

App.setup_window_mouse = (mode) => {
  let container = DOM.el(`#${mode}_container`)

  DOM.ev(window, `mouseup`, (e) => {
    App.mouse_up_action(e)
  })

  DOM.ev(container, `click`, (e) => {
    App.mouse_click_action(mode, e)
  })

  DOM.ev(container, `dblclick`, (e) => {
    App.mouse_double_click_action(mode, e)
  })

  DOM.ev(container, `contextmenu`, (e) => {
    App.mouse_context_action(mode, e)
  })

  DOM.ev(container, `wheel`, (e) => {
    App.mouse_wheel_action(mode, e)
  })

  DOM.ev(container, `mouseover`, (e) => {
    App.mouse_over_action(mode, e)
  })

  DOM.ev(container, `mouseout`, (e) => {
    App.mouse_out_action(mode, e)
  })
}

App.mouse_up_action = (e) => {
  if (e.button !== 0) {
    return
  }
}

// Using this on mousedown instead causes some problems
// For instance can't move a tab without selecting it
// And in a popup it would close the popup on selection
App.mouse_click_action = (mode, e) => {
  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)
  let media_type = App.get_media_type(item)

  if (e.target.classList.contains(`view_media_button`)) {
    if (!e.shiftKey && !e.ctrlKey) {
      if (media_type) {
        if (App.get_setting(`view_${media_type}_${mode}`) === `icon`) {
          App.select_item({item: item, scroll: `nearest`})
          App.view_media(item)
          return
        }
      }
    }
  }

  if (e.shiftKey) {
    App.select_range(item)
    return
  }

  if (e.ctrlKey) {
    App.pick(item)
    return
  }

  if (App.get_setting(`icon_pick`)) {
    if (e.target.closest(`.item_icon_container`)) {
      App.pick(item)
      return
    }
  }

  App.select_item({item: item, scroll: `nearest`})

  if (mode === `tabs`) {
    if (App.get_setting(`close_icon`)) {
      if (e.target.classList.contains(`close_icon`)) {
        App.close_tabs(item, false, false)
        return
      }
    }

    if (App.get_setting(`mute_click`)) {
      if (App.get_setting(`muted_icon`) || App.get_setting(`playing_icon`)) {
        if (e.target.classList.contains(`playing_icon`) ||
          e.target.classList.contains(`muted_icon`)) {
          App.toggle_mute_tabs(item)
          return
        }
      }
    }
  }

  if (App.get_setting(`notes_click`)) {
    if (App.get_setting(`notes_icon`)) {
      if (e.target.classList.contains(`notes_icon`)) {
        App.show_notes(item)
        return
      }
    }
  }

  if (media_type) {
    if (App.get_setting(`view_${media_type}_${mode}`) === `item`) {
      App.select_item({item: item, scroll: `nearest`})
      App.view_media(item)
      return
    }
  }

  if (App.get_setting(`double_click_command`) === `action`) {
    return
  }

  if (e.altKey || App.get_setting(`click_select`)) {
    return
  }

  App[`${mode}_action`](item)
}

App.mouse_double_click_action = (mode, e) => {
  if (App.get_setting(`double_click_new`)) {
    if (e.target.classList.contains(`item_container`)) {
      App.new_tab()
      return
    }
  }

  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)
  let cmd = App.get_setting(`double_click_command`)

  if (cmd === `item_action`) {
    if (!App.get_setting(`click_select`)) {
      return
    }
  }

  App.run_command({cmd: cmd, item: item, from: `double_click`})
}

App.mouse_context_action = (mode, e) => {
  e.preventDefault()

  if (!App.cursor_on_item(e, mode)) {
    App.show_custom_menu(e, `empty`)
    return
  }

  let item = App.get_cursor_item(mode, e)
  App.select_item({item: item, scroll: `nearest`, deselect: !item.selected})
  App.show_item_menu(item, e.clientX, e.clientY)
}

App.mouse_middle_action = (mode, e) => {
  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)

  if (e.target.classList.contains(`close_icon`)) {
    let cmd = App.get_setting(`middle_click_close_icon`)
    App.run_command({cmd: cmd, item: item, from: `close_button`})
    return
  }

  let cmd = App.get_setting(`middle_click_${item.mode}`)
  App.run_command({cmd: cmd, item: item, from: `middle_click`})
}

App.mouse_wheel_action = (mode, e) => {
  if (e.shiftKey) {
    let direction = App.wheel_direction(e)

    if (direction === `up`) {
      App.scroll(mode, `up`, true)
    }
    else if (direction === `down`) {
      App.scroll(mode, `down`, true)
    }

    e.preventDefault()
  }
}

App.mouse_over_action = (mode, e) => {
  if (!App.cursor_on_item(e, mode)) {
    return
  }

  let item = App.get_cursor_item(mode, e)
  App.update_footer_info(item)
}

App.mouse_out_action = (mode, e) => {
  let selected = App.get_selected(mode)

  if (selected) {
    App.update_footer_info(selected)
  }
}

App.right_button_action = (item) => {
  if (item.mode === `tabs`) {
    App.close_tabs(item, false, false)
  }
  else {
    App.open_items(item, true, false)
  }
}
App.check_first_time = () => {
  if (!App.first_time.date) {
    App.show_intro_message()
    App.first_time.date = App.now()
    App.stor_save_first_time()
  }
}

App.show_intro_message = () => {
  let s = `Hi there. The main menu is the top-left button. Check the settings for some customizations.
  I constantly experiment and change stuff, so expect things to break`
  App.alert(App.single_space(s))
}

App.restart_extension = () => {
  browser.runtime.reload()
}

App.print_intro = () => {
  let d = App.now()
  let s = String.raw`
//_____ __
@ )====// .\___
\#\_\__(_/_\\_/
  / /       \\
`
  App.log(s.trim(), `green`)
  App.log(`Starting ${App.manifest.name} v${App.manifest.version}`)
  App.log(`${App.nice_date(d, true)} | ${d}`)
}

App.show_custom_menu = (e, what) => {
  let items = App.custom_menu_items(`${what}_menu`)
  NeedContext.show(e.clientX, e.clientY, items)
  e.preventDefault()
}

App.custom_menu_items = (name) => {
  let cmds = App.get_setting(name)
  return App.show_cmds_menu(cmds, name)
}

App.show_cmds_menu = (cmds, from) => {
  let items = []

  if (!cmds.length) {
    return items
  }

  for (let obj of cmds) {
    let c = App.get_command(obj.cmd)

    if (!c) {
      continue
    }

    items.push({
      text: c.name,
      action: (e) => {
        App.run_command({cmd: c.cmd, from: from, e: e})
      },
      icon: c.icon,
    })
  }

  return items
}

App.show_center_context = (items, e) => {
  if (e) {
    NeedContext.show(e.clientX, e.clientY, items)
  }
  else {
    NeedContext.show_on_center(items)
  }
}

App.check_ready = (what) => {
  let s = `${what}_ready`

  if (App[s]) {
    return true
  }

  App[s] = true
  return false
}

App.color_icon = (color) => {
  return DOM.create(`div`, `color_icon background_${color}`)
}

App.check_force = (warn_setting, items) => {
  if (items.length >= App.get_setting(`max_warn_limit`)) {
    return false
  }

  let warn_on_action = App.get_setting(warn_setting)

  if (warn_on_action === `always`) {
    return false
  }
  else if (warn_on_action === `never`) {
    return true
  }
  else if (warn_on_action === `multiple`) {
    if (items.length > 1) {
      return false
    }
  }
  else if (warn_on_action === `special`) {
    if (items.length > 1) {
      return false
    }

    for (let item of items) {
      if (item.pinned || item.audible) {
        return false
      }
    }
  }

  return true
}

App.show_browser_menu = (e) => {
  let cmds = [
    {cmd: `browser_back`},
    {cmd: `browser_forward`},
    {cmd: `browser_reload`},
  ]

  let items = App.show_cmds_menu(cmds, `browser_commands`)
  App.show_center_context(items, e)
}
App.start_palette = () => {
  if (App.check_ready(`palette`)) {
    return
  }

  App.create_popup({
    id: `palette`,
    setup: () => {
      App.fill_palette()
      let container = DOM.el(`#palette_commands`)

      DOM.ev(container, `click`, (e) => {
        App.palette_action(e.target)
      })

      DOM.ev(DOM.el(`#palette_info`), `click`, () => {
        let s = `You can use this palette to run commands.`
        s += ` You can also open this by tapping Ctrl twice in a row`
        App.alert(s)
      })
    },
  })

  App.filter_palette_debouncer = App.create_debouncer(() => {
    App.do_filter_palette()
  }, App.filter_delay_2)
}

App.show_palette = (prefilter = ``) => {
  App.start_palette()
  // Create initial elements
  App.setup_popup(`palette`)
  let container = DOM.el(`#palette_commands`)
  let filter = DOM.el(`#palette_filter`)
  let els = DOM.els(`.palette_item`, container)

  // Hide all commands that are not available in the current mode
  for (let el of els) {
    el.classList.remove(`hidden`)
    let command = App.get_command(el.dataset.command)

    if (App.check_command(command, {from: `palette`})) {
      el.classList.remove(`hidden_2`)
    }
    else {
      el.classList.add(`hidden_2`)
    }
  }

  NeedContext.hide()
  App.show_popup(`palette`)
  App.palette_select_first()
  container.scrollTop = 0
  filter.value = prefilter
  filter.focus()

  if (prefilter) {
    App.do_filter_palette()
  }
}

App.palette_select = (el) => {
  let container = DOM.el(`#palette_commands`)
  let els = DOM.els(`.palette_item`, container)

  for (let el of els) {
    el.classList.remove(`palette_selected`)
  }

  App.palette_selected = el
  App.palette_selected.classList.add(`palette_selected`)
  App.palette_selected.scrollIntoView({block: `nearest`})
}

App.palette_item_hidden = (el) => {
  return el.classList.contains(`hidden`) || el.classList.contains(`hidden_2`)
}

App.palette_select_first = () => {
  let container = DOM.el(`#palette_commands`)
  let els = DOM.els(`.palette_item`, container)

  for (let el of els) {
    if (!App.palette_item_hidden(el)) {
      App.palette_select(el)
      break
    }
  }
}

App.palette_next = (reverse = false) => {
  let container = DOM.el(`#palette_commands`)
  let els = DOM.els(`.palette_item`, container)

  if (els.length < 2) {
    return
  }

  let waypoint = false

  if (reverse) {
    els.reverse()
  }

  let first

  for (let el of els) {
    if (!App.palette_item_hidden(el)) {
      if (waypoint) {
        App.palette_select(el)
        return
      }
      else {
        if (!first) {
          first = el
        }
      }
    }

    if (el === App.palette_selected) {
      waypoint = true
    }
  }

  if (first) {
    App.palette_select(first)
  }
}

App.palette_enter = () => {
  App.palette_action(App.palette_selected)
}

App.palette_action = (el) => {
  if (!el) {
    return
  }

  let item = el.closest(`.palette_item`)
  let cmd = item.dataset.command

  if (cmd) {
    App.hide_all_popups()
    App.update_command_history(cmd)
    App.fill_palette()
    App.run_command({cmd: cmd, from: `palette`})
  }
}

App.fill_palette = () => {
  if (!App.palette_ready) {
    return
  }

  let container = DOM.el(`#palette_commands`)
  container.innerHTML = ``

  for (let cmd of App.sorted_commands) {
    let el = DOM.create(`div`, `palette_item action filter_item filter_text`)
    el.dataset.command = cmd.cmd

    if (cmd.icon) {
      let icon = DOM.create(`div`)
      icon.append(cmd.icon)
      el.append(icon)
    }

    let name = DOM.create(`div`)
    name.append(cmd.name)
    el.append(name)
    el.title = cmd.info

    if (App.get_setting(`debug_mode`)) {
      el.title += ` (${cmd.cmd})`
    }

    container.append(el)
  }
}

App.palette_filter_focused = () => {
  return document.activeElement.id === `palette_filter`
}

App.clear_palette_filter = () => {
  if (App.palette_filter_focused()) {
    if (App.filter_has_value(`palette`)) {
      App.set_filter({mode: `palette`})
    }
    else {
      App.hide_all_popups()
    }
  }
}

App.filter_palette = () => {
  App.filter_palette_debouncer.call()
}

App.do_filter_palette = () => {
  App.filter_palette_debouncer.cancel()
  App.palette_selected = undefined
  App.do_filter_2(`palette`)
  App.palette_select_first()
}
App.setup_pinline = () => {
  App.pinline_debouncer = App.create_debouncer(() => {
    App.do_check_pinline()
  }, App.pinline_delay)
}

App.check_pinline = () => {
  if (App.get_setting(`show_pinline`) !== `never`) {
    App.pinline_debouncer.call()
  }
}

App.do_check_pinline = () => {
  App.pinline_debouncer.cancel()
  let show = App.get_setting(`show_pinline`)

  if (show === `never`) {
    return
  }

  App.debug(`Checking pinline`)
  App.remove_pinline()
  let tabs = App.divide_tabs(`visible`)

  if ((!tabs.pinned_f.length) && (!tabs.normal_f.length)) {
    return
  }

  if (show === `auto`) {
    if ((!tabs.pinned_f.length) || (!tabs.normal_f.length)) {
      return
    }
  }

  let pinline = DOM.create(`div`, `pinline`)
  let pinline_content = DOM.create(`div`, `pinline_content action`)
  let n1 = tabs.pinned_f.length
  let n2 = tabs.normal_f.length
  let s1 = App.plural(n1, `Pin`, `Pins`)
  let s2 = `Normal`
  let sep = `&nbsp;&nbsp;+&nbsp;&nbsp;`
  pinline_content.innerHTML = `${n1} ${s1}${sep}${n2} ${s2}`
  pinline_content.title = `Pins above. Normal below`

  DOM.ev(pinline_content, `click`, (e) => {
    App.show_custom_menu(e, `pinline`)
  })

  DOM.ev(pinline_content, `auxclick`, (e) => {
    if (e.button !== 1) {
      return
    }

    let cmd = App.get_setting(`middle_click_pinline`)
    App.run_command({cmd: cmd, from: `pinline`})
  })

  pinline.append(pinline_content)

  if (tabs.pinned_f.length) {
    tabs.pinned_f.at(-1).element.after(pinline)
  }
  else {
    tabs.normal_f.at(0).element.before(pinline)
  }
}

App.remove_pinline = () => {
  for (let el of DOM.els(`.pinline`, DOM.el(`#tabs_container`))) {
    el.remove()
  }
}
App.create_playing_icon = (mode) => {
  btn = DOM.create(`div`, `button icon_button hidden`, `playing_icon_${mode}`)
  btn.title = `Go To Playing Tab (Ctrl + Dot) - Right Click to filter playing tabs`
  let icon = App.create_icon(`speaker`)

  DOM.ev(btn, `click`, () => {
    App.go_to_playing_tab()
  })

  DOM.ev(btn, `contextmenu`, (e) => {
    e.preventDefault()
    App.filter_playing(mode)
  })

  btn.append(icon)
  return btn
}

App.show_playing = (mode) => {
  DOM.el(`#playing_icon_${mode}`).classList.remove(`hidden`)
}

App.hide_playing = (mode) => {
  DOM.el(`#playing_icon_${mode}`).classList.add(`hidden`)
}

App.check_playing = (mode = App.active_mode) => {
  let playing = App.get_playing_tabs()

  if (playing.length) {
    App.show_playing(mode)
  }
  else {
    App.hide_playing(mode)
  }
}

App.get_playing_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.audible)
}

App.go_to_playing_tab = async () => {
  if (App.active_mode !== `tabs`) {
    await App.do_show_mode({mode: `tabs`})
  }
  else {
    App.filter_all(`tabs`)
  }

  let items = App.get_items(`tabs`)
  let waypoint = false
  let first

  for (let item of items) {
    if (item.audible) {
      if (!first) {
        first = item
      }

      if (waypoint) {
        App.focus_tab({item: item, scroll: `center`, method: `playing`})
        return
      }
    }

    if (!waypoint && item.active) {
      waypoint = true
      continue
    }
  }

  // If none found then pick the first one
  if (first) {
    App.focus_tab({item: first, scroll: `center`, method: `playing`})
  }
}
App.create_popup = (args) => {
  let p = {}
  p.setup_done = false
  let popup = DOM.create(`div`, `popup_main hidden`, `popup_${args.id}`)
  let container = DOM.create(`div`, `popup_container`, `popup_${args.id}_container`)
  container.tabIndex = 0

  if (args.element) {
    container.innerHTML = ``
    container.append(args.element)
  }
  else {
    container.innerHTML = App.get_template(args.id)
  }

  popup.append(container)

  DOM.ev(popup, `click`, (e) => {
    if (e.target.isConnected && !e.target.closest(`.popup_container`)) {
      p.dismiss()
    }
  })

  DOM.el(`#main`).append(popup)
  p.element = popup

  p.setup = () => {
    if (args.setup && !p.setup_done) {
      args.setup()
      p.setup_done = true
      App.debug(`Popup Setup: ${args.id}`)
    }
  }

  p.show = () => {
    p.setup()
    p.element.classList.remove(`hidden`)
    container.focus()
    p.open = true
  }

  p.hide = (bypass = false) => {
    if (!p.open) {
      return
    }

    if (!bypass && args.on_hide) {
      args.on_hide(args.id)
    }
    else {
      p.element.classList.add(`hidden`)
      p.open = false

      if (args.after_hide) {
        args.after_hide(args.id)
      }
    }
  }

  p.dismiss = () => {
    App.popups[args.id].hide()

    if (args.on_dismiss) {
      args.on_dismiss()
    }
  }

  App.popups[args.id] = p
}

App.show_popup = (id) => {
  clearTimeout(App.alert_timeout)
  App.popups[id].show()
  App.popups[id].show_date = App.now()
  let open = App.open_popups()

  open.sort((a, b) => {
    return a.show_date < b.show_date ? -1 : 1
  })

  let zindex = 999

  for (let popup of open) {
    popup.element.style.zIndex = zindex
    zindex += 1
  }
}

App.setup_popup = (id) => {
  App.popups[id].setup()
}

App.start_popups = () => {
  if (App.check_ready(`popups`)) {
    return
  }

  App.create_popup({
    id: `alert`,
  })

  App.create_popup({
    id: `textarea`,
    setup: () => {
      DOM.ev(DOM.el(`#textarea_copy`), `click`, () => {
        App.textarea_copy()
      })
    },
  })

  App.create_popup({
    id: `input`,
    setup: () => {
      DOM.ev(DOM.el(`#input_submit`), `click`, () => {
        App.input_enter()
      })
    },
  })

  App.create_popup({
    id: `dialog`,
    on_dismiss: () => {
      if (App.dialog_on_dismiss) {
        App.dialog_on_dismiss()
      }
    },
  })

  App.create_popup({
    id: `prompt`,
    setup: () => {
      DOM.ev(DOM.el(`#prompt_submit`), `click`, () => {
        App.prompt_submit()
      })
    },
  })
}

App.hide_all_popups = () => {
  clearTimeout(App.alert_timeout)

  for (let id of App.open_popup_list()) {
    App.popups[id].hide()
  }
}

App.hide_popup = (id, bypass = false) => {
  App.popups[id].hide(bypass)
}

App.open_popup_list = () => {
  let open = []

  for (let id in App.popups) {
    if (App.popups[id].open) {
      open.push(id)
    }
  }

  return open
}

App.popup_is_open = (id, exact = true) => {
  for (let pid of App.open_popup_list()) {
    if (exact) {
      if (pid === id) {
        return true
      }
    }
    else {
      if (pid.startsWith(id)) {
        return true
      }
    }
  }

  return false
}

App.popup_open = () => {
  for (let key in App.popups) {
    if (App.popups[key].open) {
      return true
    }
  }

  return false
}

App.open_popups = () => {
  let open = []

  for (let popup in App.popups) {
    if (App.popups[popup].open) {
      open.push(App.popups[popup])
    }
  }

  return open
}

App.dismiss_popup = (id) => {
  App.popups[id].dismiss()
}

App.popup_mode = () => {
  let highest_z = 0
  let pmode

  for (let popup of App.open_popup_list()) {
    let z = parseInt(App.popups[popup].element.style.zIndex)

    if (z > highest_z) {
      highest_z = z
      pmode = popup
    }
  }

  return pmode
}
App.profile_props = {
  url: {
    type: `text`,
    value: ``,
    version: 1,
  },
  exact: {
    type: `checkbox`,
    value: false,
    version: 1,
  },
  tags: {
    type: `list`,
    value: [],
    label: `Add Tag`,
    title: `Tags`,
    version: 2,
  },
  notes: {
    type: `list`,
    value: [],
    label: `Add Note`,
    title: `Notes`,
    version: 2,
  },
  title: {
    type: `text`,
    value: ``,
    version: 1,
  },
  color: {
    type: `menu`,
    value: `none`,
    version: 1,
  },
  icon: {
    type: `text`,
    value: ``,
    version: 1,
  },
}

App.start_profile_editor = () => {
  if (App.check_ready(`profile_editor`)) {
    return
  }

  App.create_window({
    id: `profile_editor`,
    setup: () => {
      DOM.ev(DOM.el(`#profile_editor_remove`), `click`, () => {
        App.profile_editor_remove()
      })

      let close_el = DOM.el(`#profile_editor_close`)
      close_el.textContent = App.close_text

      DOM.ev(close_el, `click`, () => {
        App.profile_editor_close()
      })

      DOM.el(`#profile_editor_icon`).placeholder = App.icon_placeholder

      DOM.ev(DOM.el(`#profile_editor_url_root`), `click`, (e) => {
        App.profile_editor_root_url()
      })

      DOM.ev(DOM.el(`#profile_editor_url_full`), `click`, (e) => {
        App.profile_editor_full_url(e)
      })

      App.profile_editor_color_opts = [{text: `None`, value: `none`}]

      for (let color of App.colors) {
        let icon = App.color_icon(color)
        let name = App.capitalize(color)
        App.profile_editor_color_opts.push({text: name, value: color, icon: icon})
      }

      App.profile_make_menu(`color`, App.profile_editor_color_opts)

      DOM.ev(DOM.el(`#profile_editor_tags_add`), `click`, (e) => {
        App.profile_tags_add(e)
      })

      App.profile_setup_labels()
    },
    colored_top: true,
  })

  App.profile_start_addlists()
}

App.get_profile_items = (item) => {
  let active = App.get_active_items(item.mode, item)
  active = App.remove_duplicates(active)

  if (!active.length) {
    return
  }

  let items = []

  for (let it of active) {
    items.push(App.soft_copy_item(it))
  }

  return items
}

App.show_profile_editor = (item, action = `edit`) => {
  App.start_profile_editor()
  let new_edit = false
  App.profile_urls = []

  if (action === `new`) {
    new_edit = true
    action = `edit`
  }

  App.profile_editor_items = App.get_profile_items(item)
  let items = App.profile_editor_items
  let profiles = []
  let added = []

  if (!new_edit) {
    [profiles, added] = App.get_profiles(items)
  }
  else {
    added = [item]
  }

  App.profile_editor_profiles = profiles
  App.profile_editor_added = added
  App.profile_editor_action = action
  App.show_window(`profile_editor`)
  App.profile_default_all()
  let remove_el = DOM.el(`#profile_editor_remove`)

  if (profiles.length) {
    remove_el.classList.remove(`hidden`)
  }
  else {
    remove_el.classList.add(`hidden`)
  }

  if (profiles.length && !new_edit) {
    let profile = profiles[0]

    if (action === `edit`) {
      App.profile_set_value(`tags`, profile.tags.value)
      App.profile_set_value(`notes`, profile.notes.value)
    }

    App.profile_set_value(`url`, profile.url.value)
    App.profile_set_value(`exact`, profile.exact.value)
    App.profile_set_value(`title`, profile.title.value)
    App.profile_set_value(`icon`, profile.icon.value)
    App.profile_set_value(`color`, profile.color.value)
  }
  else {
    App.profile_set_value(`url`, items[0].url)
  }

  App.window_goto_top(`profile_editor`)
  App.profile_addlist_counts()

  requestAnimationFrame(() => {
    App.scroll_to_right(DOM.el(`#profile_editor_url`))
  })
}

App.get_empty_profile = (url) => {
  let profile = {}

  for (let key in App.profile_props) {
    let props = App.profile_props[key]
    profile[key] = {}
    profile[key].version = props.version

    if (key === `url`) {
      profile.url.value = url
      continue
    }

    profile[key].value = App.clone(props.value)
  }

  return profile
}

App.copy_profile = (profile) => {
  let obj = {}

  for (let key in App.profile_props) {
    if (profile[key] !== undefined) {
      obj[key] = App.clone(profile[key])
    }
  }

  return obj
}

App.save_profile = () => {
  let items = App.profile_editor_items

  if (!items.length) {
    return
  }

  let args = {}

  for (let key in App.profile_props) {
    args[key] = App.profile_get_value(key)
  }

  args.profiles = App.profile_editor_profiles
  args.added = App.profile_editor_added
  args.action = App.profile_editor_action
  args.type = `all`
  App.do_save_profile(args)
}

App.do_save_profile = (args) => {
  function add_url (url) {
    if (!App.profile_urls.includes(url)) {
      App.profile_urls.push(url)
    }
  }

  function proc (profile, p_mode) {
    if (App.same_profile(profile, args)) {
      return
    }

    function item_in_list (list, item) {
      for (let it of list) {
        if (it.value === item.value) {
          return true
        }
      }

      return false
    }

    function add_to_list (key) {
      let n_list = []

      for (let item of args[key]) {
        if (!item_in_list(n_list, item)) {
          n_list.push(item)
        }
      }

      if (p_mode === `edit` && args.action === `add`) {
        for (let item of profile[key].value) {
          if (!item_in_list(n_list, item)) {
            n_list.push(item)
          }
        }
      }

      return n_list
    }

    let og_url = profile.url.value
    profile.url.value = args.url || profile.url.value

    if (!profile.url.value) {
      return
    }

    profile.url.value = App.format_url(profile.url.value)

    for (let key in App.profile_props) {
      if (key === `url`) {
        continue
      }

      if (args.type === `all` || args.type === key) {
        let props = App.profile_props[key]

        if (props.type === `list`) {
          profile[key].value = add_to_list(key)
        }
        else {
          profile[key].value = args[key]
        }
      }
    }

    App.profiles = App.profiles.filter(x => x.url.value !== og_url)

    if (og_url !== profile.url.value) {
      App.profiles = App.profiles.filter(x => x.url.value !== profile.url.value)
    }

    if (App.used_profile(profile)) {
      App.profiles.unshift(profile)

      if (App.profiles.length > App.max_profiles) {
        App.profiles = App.profiles.slice(0, App.max_profiles)
      }
    }

    add_url(og_url)
    add_url(profile.url.value)
  }

  // Added
  if (args.added.length) {
    for (let item of args.added) {
      proc(App.get_empty_profile(item.url), `add`)
    }
  }

  // Edited
  if (args.profiles.length) {
    for (let profile of args.profiles) {
      proc(App.copy_profile(profile), `edit`)
    }
  }

  App.stor_save_profiles()
}

App.profile_remove_menu = (item) => {
  let items = App.get_active_items(item.mode, item)
  return App.remove_profiles(items)
}

App.profile_editor_remove = () => {
  App.remove_profiles(App.profile_editor_profiles)
}

App.remove_profiles = (items) => {
  if (!items.length) {
    return
  }

  let [profiles, added] = App.get_profiles(items)

  if (!profiles.length) {
    return
  }

  let force = App.check_force(`warn_on_remove_profiles`, profiles)

  App.show_confirm(`Remove profiles? (${profiles.length})`, () => {
    for (let profile of profiles) {
      App.profiles = App.profiles.filter(x => x.url.value !== profile.url.value)
    }

    App.apply_profiles(profiles.map(x => x.url.value))
    App.stor_save_profiles()
    App.refresh_profile_filters()

    if (App.window_mode === `profile_editor`) {
      App.hide_window(true)
    }
  }, undefined, force)
}

App.apply_profiles = (urls) => {
  let items = []

  if (!App.persistent_modes.includes(App.active_mode)) {
    items.push(...App.get_items(App.active_mode))
  }

  items.push(...App.get_persistent_items())

  for (let item of items) {
    for (let url of urls) {
      if (item.url.startsWith(url)) {
        App.update_item(item.mode, item.id, {})
      }
    }
  }
}

App.get_profile = (url) => {
  let profile

  function proc (pf) {
    if (!profile) {
      profile = pf
    }
    else if (pf.url.value.length > profile.url.value.length) {
      profile = pf
    }
  }

  for (let pf of App.profiles) {
    if (pf.exact.value) {
      if (url === pf.url.value) {
        proc(pf)
      }
    }
    else {
      if (url.startsWith(pf.url.value)) {
        proc(pf)
      }
    }
  }

  if (profile) {
    for (let key in profile) {
      let props = App.profile_props[key]

      if (!props) {
        continue
      }

      if (profile[key].version !== props.version) {
        profile[key].value = App.clone(props.value)
        profile[key].version = props.version
      }
    }
  }

  return profile
}

App.get_profiles = (items) => {
  let profiles = []
  let add = []

  for (let item of items) {
    let profile

    if (item.url) {
      if (item.is_item) {
        profile = App.get_profile(item.url)
      }
      else {
        profile = App.get_profile(item.url.value)
      }
    }

    if (profile) {
      profiles.push(profile)
    }
    else {
      add.push(item)
    }
  }

  return [profiles, add]
}

App.get_profile_menu_items = () => {
  let items = []

  items.push({
    text: `Export`,
    action: () => {
      App.export_profiles()
    }
  })

  items.push({
    text: `Import`,
    action: () => {
      App.import_profiles()
    }
  })

  items.push({
    text: `Remove`,
    get_items: () => {
      return App.clear_profiles_items()
    }
  })

  return items
}

App.export_profiles = () => {
  App.export_data(App.profiles)
}

App.import_profiles = () => {
  App.import_data((json) => {
    if (App.is_array(json)) {
      App.profiles = json
      App.check_profiles()
      App.stor_save_profiles()
      App.clear_show()
    }
  })
}

App.check_profiles = () => {
  let changed = false

  for (let profile of App.profiles) {
    if (profile.url.value === undefined) {
      profile.url.value = `https://empty.profile`
      changed = true
    }

    for (let key in App.profile_props) {
      if (profile[key] && profile[key].value === undefined) {
        let props = App.profile_props[key]

        profile[key].value = App.clone(props.value)
        changed = true
      }
    }
  }

  if (changed) {
    App.stor_save_profiles()
  }
}

App.get_tags = () => {
  let tags = []

  for (let profile of App.profiles) {
    for (let tag of profile.tags.value) {
      if (!tags.includes(tag.value)) {
        tags.push(tag.value)
      }
    }
  }

  return tags
}

App.get_tag_items = (mode, action = `filter`) => {
  let items = []
  let tags

  if (action === `remove`) {
    tags = App.get_tags()

    items.push({
      text: `All`,
      action: () => {
        App.remove_all_tags()
      }
    })
  }
  else if (action === `filter`) {
    tags = App.get_active_tags(mode)

    items.push({
      text: `All`,
      action: () => {
        App.filter_tag(mode, `all`)
      }
    })
  }

  for (let tag of tags) {
    items.push({
      text: tag,
      action: () => {
        if (action === `filter`) {
          App.filter_tag(mode, tag)
        }
        else if (action === `remove`) {
          App.remove_tag(tag)
        }
      }
    })

    if (items.length >= App.max_tag_filters) {
      break
    }
  }

  if (!items.length) {
    items.push({
      text: `No Tags`,
      action: () => {
        App.alert(`Add tags by right-clicking items and selecting Edit, or through commands`)
      }
    })
  }

  return items
}

App.get_color_items = (mode, action = `filter`) => {
  let items = []
  let count

  if (action === `remove`) {
    count = App.get_profile_count()
  }
  else if (action === `filter`) {
    count = App.get_active_colors(mode)

    items.push({
      text: `All`,
      action: () => {
        App.filter_color(mode, `all`)
      }
    })
  }

  if (action === `remove`) {
    items.push({
      text: `All`,
      action: () => {
        App.remove_all_colors()
      }
    })
  }

  for (let color of App.colors) {
    if (!count[color]) {
      continue
    }

    let icon = App.color_icon(color)
    let name = App.capitalize(color)

    items.push({
      icon: icon,
      text: name,
      action: () => {
        if (action === `filter`) {
          App.filter_color(mode, color)
        }
        else {
          App.remove_color(color)
        }
      }
    })
  }

  return items
}

App.clear_profiles_items = () => {
  let items = []
  let count = App.get_profile_count()

  if (count.titles) {
    items.push({
      text: `Titles`,
      action: () => {
        App.remove_all_titles()
      }
    })
  }

  if (count.colors) {
    items.push({
      text: `Colors`,
      get_items: () => {
        return App.get_color_items(App.active_mode, `remove`)
      }
    })
  }

  if (count.tags) {
    items.push({
      text: `Tags`,
      get_items: () => {
        return App.get_tag_items(App.active_mode, `remove`)
      }
    })
  }

  if (count.notes) {
    items.push({
      text: `Notes`,
      action: () => {
        App.remove_all_notes()
      }
    })
  }

  if (count.icons) {
    items.push({
      text: `Icons`,
      action: () => {
        App.remove_all_icons()
      }
    })
  }

  if (App.profiles.length) {
    items.push({
      text: `All`,
      action: () => {
        App.remove_all_profiles()
      }
    })
  }

  return items
}

App.remove_color = (color) => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.color.value === color) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  if (!profiles.length) {
    App.alert(`No profiles found`)
    return
  }

  App.show_confirm(`Remove ${color}? (${profiles.length})`, () => {
    for (let profile of profiles) {
      profile.color.value = App.profile_get_default(`color`)
    }

    App.after_profile_remove()
  })
}

App.remove_all_colors = () => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.color.value) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  App.show_confirm(`Remove all colors? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.color.value = App.profile_get_default(`color`)
    }

    App.after_profile_remove()
  })
}

App.remove_all_notes = () => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.notes.value) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  App.show_confirm(`Remove all notes? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.notes.value = App.profile_get_default(`notes`)
    }

    App.after_profile_remove()
  })
}

App.remove_all_titles = () => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.title.value) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  App.show_confirm(`Remove all titles? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.title.value = App.profile_get_default(`title`)
    }

    App.after_profile_remove()
  })
}

App.remove_all_icons = () => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.icon.value) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  App.show_confirm(`Remove all icons? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.icon.value = App.profile_get_default(`icon`)
    }

    App.after_profile_remove()
  })
}

App.remove_tag = (tag) => {
  App.show_confirm(`Remove tag? (${tag})`, () => {
    for (let profile of App.profiles) {
      profile.tags.value = profile.tags.value.filter(x => x.value !== tag)
    }

    App.after_profile_remove()
  })
}

App.remove_all_tags = () => {
  let tags = App.get_tags()

  if (!tags.length) {
    return
  }

  App.show_confirm(`Remove all tags? (${tags.length})`, () => {
    for (let profile of App.profiles) {
      profile.tags.value = App.profile_get_default(`tags`)
    }

    App.after_profile_remove()
  })
}

App.remove_all_profiles = () => {
  if (!App.profiles.length) {
    return
  }

  App.show_confirm(`Remove all profiles? (${App.profiles.length})`, () => {
    App.profiles = []
    App.after_profile_remove()
  })
}

App.remove_empty_profiles = () => {
  for (let profile of App.profiles) {
    if (!App.used_profile(profile)) {
      App.profiles = App.profiles.filter(p => p !== profile)
    }
  }

  App.stor_save_profiles()
}

App.after_profile_remove = () => {
  App.remove_empty_profiles()
  App.clear_show()
}

App.used_profile = (profile) => {
  for (let key in App.profile_props) {
    if (key === `url` || key === `exact`) {
      continue
    }

    if (App.str(profile[key].value) !== App.str(App.profile_props[key].value)) {
      return true
    }
  }

  return false
}

App.get_profile_count = () => {
  let count = {}

  for (let key in App.profile_props) {
    count[key] = 0
  }

  count.colors = 0

  for (let profile of App.profiles) {
    if (profile.color.value !== `none`) {
      if (!count[profile.color.value]) {
        count[profile.color.value] = 0
      }

      count[profile.color.value] += 1
      count.colors += 1
    }

    for (let key in App.profile_props) {
      if (key === `url` || key === `exact`) {
        continue
      }

      let props = App.profile_props[key]

      if (App.str(profile[key]) !== App.str(props.value)) {
        count[key] += 1
      }
    }
  }

  return count
}

App.refresh_profile_filters = () => {
  let mode = App.active_mode
  let filter_mode = App.filter_mode(mode)

  if (filter_mode === `edited` || filter_mode.startsWith(`tag_`) || filter_mode.startsWith(`color_`)) {
    App.filter({mode: mode})
    return
  }
}

App.get_edit_items = (item) => {
  let items = []
  let its = App.get_profile_items(item)
  let [profiles, added] = App.get_profiles(its)

  items.push({
    icon: App.tag_icon,
    text: `Add Tag`,
    action: () => {
      App.add_tag(item)
    }
  })

  items.push({
    icon: App.get_setting(`notes_icon`),
    text: `Add Note`,
    action: () => {
      App.add_note(item)
    }
  })

  items.push({
    icon: App.settings_icons.theme,
    text: `Edit Color`,
    get_items: () => {
      return App.color_menu_items(item)
    }
  })

  items.push({
    icon: App.profile_icon,
    text: `Edit Title`,
    action: () => {
      App.edit_title(item)
    }
  })

  items.push({
    icon: App.profile_icon,
    text: `Edit Icon`,
    action: () => {
      App.edit_icon(item)
    }
  })

  App.sep(items)

  items.push({
    icon: App.profile_icon,
    text: `Profile`,
    action: () => {
      App.show_profile_editor(item)
    }
  })

  if (its.length === 1) {
    let profile = profiles[0]
    let exact = false

    if (profile) {
      exact = profile.url.value === item.url
    }

    if (profile && !exact) {
      items.push({
        icon: App.profile_icon,
        text: `This URL`,
        action: () => {
          App.show_profile_editor(item, `new`)
        }
      })
    }
  }

  if (profiles.length) {
    App.sep(items)

    items.push({
      text: `Remove`,
      action: () => {
        App.profile_remove_menu(item)
      }
    })
  }

  return items
}

App.edit_profiles = (item) => {
  App.show_profile_editor(item)
}

App.add_tag = (item) => {
  App.profile_add_to_list(`tags`, item)
}

App.add_note = (item) => {
  App.profile_add_to_list(`notes`, item)
}

App.profile_addlist_on_set = (key, item, action) => {
  let args = App.profile_change_args(item, key, App.profile_get_value(key), action)
  App.do_save_profile(args)
  App.profile_editor_close(false)
}

App.profile_add_to_list = (key, item) => {
  App.start_profile_editor()
  App.profile_set_value(key, [])

  Addlist.edit({id: `profile_editor_${key}`, items: {}, on_set: () => {
    App.profile_addlist_on_set(key, item, `add`)
  }})
}

App.profile_edit_text = (key, title, item) => {
  let value = ``
  let items = App.get_profile_items(item)
  let [profiles, added] = App.get_profiles(items)

  if (profiles.length && !added.length) {
    value = App.profile_shared_value(profiles, key) || ``
  }

  App.show_prompt(value, title, (ans) => {
    let args = App.profile_change_args(item, key, ans)
    App.do_save_profile(args)
    App.profile_editor_close(false)
  })
}

App.profile_change_args = (item, type, value, action = `edit`) => {
  let args = {}
  let items = App.get_profile_items(item)
  let [profiles, added] = App.get_profiles(items)
  App.profile_urls = []
  args.profiles = profiles
  args.added = added
  args.type = type
  args[type] = value
  args.action = action
  return args
}

App.change_color = (item, color, toggle = false) => {
  let args = App.profile_change_args(item, `color`, color)

  if (toggle) {
    if (args.profiles.length) {
      if (args.profiles[0].color.value === color) {
        color = `none`
      }
    }
  }

  args.color = color
  let items = [...args.profiles, ...args.added]
  let some = false

  if (args.added.length) {
    if (color !== `none`) {
      some = true
    }
  }

  for (let profile of args.profiles) {
    if (profile.color.value !== color) {
      some = true
      break
    }
  }

  if (!some) {
    return
  }

  let force

  if (color === `none`) {
    force = App.check_force(`warn_on_remove_color`, items)
  }
  else {
    force = App.check_force(`warn_on_color`, items)
  }

  let msg

  if (color === `none`) {
    msg = `Remove color?`
  }
  else {
    msg = `Color items ${color}?`
  }

  msg += ` (${items.length})`

  App.show_confirm(msg, () => {
    App.do_save_profile(args)
    App.profile_editor_close(false)
  }, undefined, force)
}

App.profile_make_menu = (key, opts,) => {
  App[`profile_menubutton_${key}`] = Menubutton.create({
    button: DOM.el(`#profile_editor_${key}`),
    opts: opts,
  })
}

App.profile_editor_left = () => {
  let el = DOM.el(`#profile_editor_color_container`)

  if (!el.classList.contains(`hidden`)) {
    App.profile_menubutton_color.prev()
  }
}

App.profile_editor_right = () => {
  let el = DOM.el(`#profile_editor_color_container`)

  if (!el.classList.contains(`hidden`)) {
    App.profile_menubutton_color.next()
  }
}

App.get_item_tag_items = (item) => {
  let items = []

  for (let tag of item.tags) {
    items.push({
      text: tag,
      action: () => {
        App.filter_tag(item.mode, tag)
      }
    })
  }

  return items
}

App.get_active_colors = (mode) => {
  let count = {colors: 0}

  for (let item of App.get_items(mode)) {
    if (item.color) {
      if (!count[item.color]) {
        count[item.color] = 0
      }

      count[item.color] += 1
      count.colors += 1
    }
  }

  return count
}

App.get_active_tags = (mode) => {
  let tags = []

  for (let item of App.get_items(mode)) {
    for (let tag of item.tags) {
      if (tag && !tags.includes(tag)) {
        tags.push(tag)
      }
    }
  }

  return tags
}

App.profile_editor_root_url = () => {
  let el = DOM.el(`#profile_editor_url`)
  let item = App.profile_editor_items[0]
  el.value = item.protocol + `//` + item.hostname
  App.scroll_to_right(el)
  el.focus()
}

App.profile_editor_full_url = () => {
  let el = DOM.el(`#profile_editor_url`)
  el.value = App.profile_editor_items[0].url
  App.scroll_to_right(el)
  el.focus()
}

App.profile_start_addlists = () => {
  for (let key in App.profile_props) {
    let props = App.profile_props[key]

    if (props.type === `list`) {
      App.profile_register_addlist(key, props.label, props.title)
    }
  }
}

App.profile_register_addlist = (key, label, title) => {
  let id = `profile_editor_${key}`
  let lowercase = false
  let widget

  if (key === `notes`) {
    widget = `textarea`
  }
  else if (key === `tags`) {
    widget = `text`
    lowercase = true
  }

  App.create_popup({
    id: `addlist_${id}`,
    element: Addlist.register({
      id: id,
      pk: `value`,
      widgets: [widget],
      labels: [label],
      keys: [`value`],
      list_text: (items) => {
        return items.value
      },
      title: title,
      lowercase: lowercase,
      get_data: (id) => {
        return App[id]
      },
      set_data: (id, value) => {
        App[id] = value
      },
    }),
    on_hide: () => {
      Addlist.hide()
    },
  })

  let el = DOM.el(`#${id}`)
  Addlist.add_buttons(id, el)
}

App.profile_tags_add = (e) => {
  let tags = App.get_tags()
  let tags_used = App.profile_editor_tags.map(x => x.value)
  let items = []

  for (let tag of tags) {
    if (!tags_used.includes(tag)) {
      items.push({
        text: tag,
        action: () => {
          App.profile_editor_tags.unshift({value: tag})
          Addlist.update_count(`profile_editor_tags`)
        }
      })

      if (items.length >= App.max_tag_filters) {
        break
      }
    }
  }

  if (!items.length) {
    items.push({
      text: `No more tags`,
      action: () => {
        App.alert(`Add some tags manually`)
      }
    })
  }

  NeedContext.show(e.clientX, e.clientY, items)
}

App.profile_addlist_counts = () => {
  for (let key in App.profile_props) {
    let props = App.profile_props[key]

    if (props.type === `list`) {
      Addlist.update_count(`profile_editor_${key}`)
    }
  }
}

App.profile_setup_labels = () => {
  for (let el of DOM.els(`.profile_editor_label`)) {
    let key = el.dataset.key

    if (key === `url`) {
      continue
    }

    let items = []

    items.push({
      text: `Reset`,
      action: () => {
        if (App.profile_is_default(key)) {
          return
        }

        App.show_confirm(`Reset this?`, () => {
          App.profile_set_default(key, true)
        })
      },
    })

    DOM.ev(el, `click`, (e) => {
      NeedContext.show(e.clientX, e.clientY, items)
    })
  }
}

App.profile_get_default = (key) => {
  let props = App.profile_props[key]

  if (props) {
    return App.clone(props.value)
  }
}

App.profile_set_default = (key, action = false) => {
  let def = App.profile_get_default(key)
  App.profile_set_value(key, def, action)
}

App.profile_get_value = (key) => {
  let props = App.profile_props[key]

  if (!props) {
    return
  }

  if (props.type === `list`) {
    return App[`profile_editor_${key}`]
  }
  else if (props.type === `menu`) {
    return App[`profile_menubutton_${key}`].value
  }
  else if (props.type === `color`) {
    let hex = App[`profile_editor_${key}`].color
    return App.colorlib.hex_to_rgb(hex)
  }
  else {
    let el = DOM.el(`#profile_editor_${key}`)

    if (props.type === `checkbox`) {
      return el.checked
    }
    else if (props.type === `text`) {
      return el.value.trim()
    }
  }
}

App.profile_set_value = (key, value, actions = false) => {
  let props = App.profile_props[key]

  if (!props) {
    return
  }

  if (props.type === `list`) {
    App[`profile_editor_${key}`] = App.clone(value)

    if (actions) {
      Addlist.update_count(`profile_editor_${key}`)
    }
  }
  else if (props.type === `menu`) {
    App[`profile_menubutton_${key}`].set(value || `none`)
  }
  else if (props.type === `color`) {
    App[`profile_editor_${key}`].setColor(value)
  }
  else {
    let el = DOM.el(`#profile_editor_${key}`)

    if (props.type === `checkbox`) {
      el.checked = value
    }
    else if (props.type === `text`) {
      el.value = value
    }
  }
}

App.profile_is_default = (key) => {
  let value = App.profile_get_value(key)
  let props = App.profile_props[key]

  if (!props) {
    return
  }

  return App.str(value) === App.str(props.value)
}

App.profile_default_all = () => {
  for (let key in App.profile_props) {
    App.profile_set_default(key)
  }
}

App.profile_editor_close = (save = true) => {
  if (save) {
    App.save_profile()
  }

  if (App.profile_urls.length) {
    App.apply_profiles(App.profile_urls)
    App.refresh_profile_filters()
  }

  App.hide_window()
}

App.same_profile = (profile, args) => {
  for (let key in App.profile_props) {
    if (App.str(profile[key].value) !== App.str(args[key])) {
      return false
    }
  }

  return true
}

App.color_menu_items = (item) => {
  let items = []

  for (let color of App.colors) {
    let icon = App.color_icon(color)
    let text = `Color ${App.capitalize(color)}`

    items.push({
      icon: icon,
      text: text,
      action: () => {
        App.change_color(item, color)
      }
    })
  }

  App.sep(items)

  items.push({
    text: `Remove Color`,
    action: () => {
      App.change_color(item, `none`)
    }
  })

  return items
}

App.show_color_menu = (item, e) => {
  let items = App.color_menu_items(item)
  App.show_center_context(items, e)
}

App.show_notes = (item) => {
  App.start_profile_editor()
  let profile = App.get_profile(item.url)

  if (profile) {
    if (profile.notes.value.length) {
      App.profile_set_value(`notes`, profile.notes.value)

      Addlist.view({id: `profile_editor_notes`, index: 0, on_set: () => {
        App.profile_addlist_on_set(`notes`, item, `edit`)
      }})
    }
  }
}

App.profile_shared_value = (profiles, key) => {
  if (profiles[0][key] === undefined) {
    return
  }

  let first = profiles[0][key].value

  for (let profile of profiles) {
    if (profile[key] !== undefined) {
      if (profile[key].value !== first) {
        return
      }
    }
  }

  return first
}

App.edit_title = (item) => {
  App.profile_edit_text(`title`, `Title`, item)
}

App.edit_icon = (item) => {1
  App.profile_edit_text(`icon`, `Icon`, item)
}
App.show_prompt = (value, placeholder, on_submit) => {
  App.start_popups()
  App.show_popup(`prompt`)
  let input = DOM.el(`#prompt_input`)
  input.value = value || ``
  input.placeholder = placeholder
  App.prompt_on_submit = on_submit
  input.focus()
}

App.prompt_submit = () => {
  let value = DOM.el(`#prompt_input`).value.trim()
  App.hide_popup(`prompt`)
  App.prompt_on_submit(value)
}
App.setup_recent_tabs = () => {
  App.empty_previous_tabs_debouncer = App.create_debouncer(() => {
    App.do_empty_previous_tabs()
  }, App.empty_previous_tabs_delay)
}

App.empty_previous_tabs = () => {
  App.empty_previous_tabs_debouncer.call()
}

App.do_empty_previous_tabs = () => {
  App.previous_tabs = []
}

App.get_previous_tabs = (include_active = false) => {
  App.previous_tabs = App.get_items(`tabs`).slice(0)

  if (!include_active) {
    App.previous_tabs = App.previous_tabs.filter(x => !x.active)
  }

  App.previous_tabs.sort((a, b) => {
    return a.last_accessed > b.last_accessed ? -1 : 1
  })

  App.previous_tabs_index = 0
}

App.go_to_previous_tab = () => {
  if (!App.previous_tabs.length) {
    App.get_previous_tabs()
  }

  App.empty_previous_tabs()

  if (App.previous_tabs.length <= 1) {
    return
  }

  let prev_tab = App.previous_tabs[App.previous_tabs_index]
  let item = App.get_item_by_id(`tabs`, prev_tab.id)

  if (item) {
    App.focus_tab({item: item, scroll: `center`, method: `previous`})
    App.previous_tabs_index += 1

    if (App.previous_tabs_index > (App.previous_tabs.length - 1)) {
      App.previous_tabs_index = 0
    }
  }
}

App.show_recent_tabs = (e) => {
  let items = []
  App.get_previous_tabs(true)
  let max = App.get_setting(`max_recent_tabs`)
  let playing = App.get_setting(`playing_icon`)

  for (let item of App.previous_tabs.slice(0, max)) {
    let title = App.get_title(item)

    if (item.audible) {
      title = `${playing} ${title}`
    }

    items.push({
      image: item.favicon,
      text: title,
      action: () => {
        App.focus_tab({item: item, scroll: `nearest`, show_tabs: true})
      },
    })
  }

  App.show_center_context(items, e)
}
App.check_restore = () => {
  if (App.get_setting(`auto_restore`) === `action`) {
    App.restore()
  }
}

App.start_auto_restore = () => {
  App.clear_restore()
  let d = App.get_setting(`auto_restore`)

  if (d === `never` || d === `action`) {
    return
  }

  let delay = App.parse_delay(d)

  App.restore_timeout = setTimeout(() => {
    App.restore()
  }, delay)
}

App.restore = () => {
  NeedContext.hide()
  App.hide_all_popups()

  if (!App.on_items()) {
    if (App.on_settings()) {
      App.hide_window()
      return
    }
    else {
      App.hide_window()
    }
  }

  let mode = App.active_mode

  if ((mode !== App.primary_mode()) || App.is_filtered(mode)) {
    App.show_primary_mode()
  }
  else {
    let item = App.get_selected(mode)

    if (!item) {
      return
    }

    if (mode === `tabs`) {
      if (!item.active) {
        App.focus_current_tab()
        return
      }
    }

    if (!App.item_is_visible(item)) {
      App.select_item({item: item, scroll: `center`})
    }
  }
}

App.clear_restore = () => {
  clearTimeout(App.restore_timeout)
}
App.setup_scroller = () => {
  App.scroller_debouncer = App.create_debouncer((mode) => {
    App.do_check_scroller(mode)
  }, App.scroller_delay)
}

App.show_scroller = (mode) => {
  let scroller = DOM.el(`#${mode}_scroller`)
  scroller.classList.remove(`hidden`)
}

App.hide_scroller = (mode) => {
  let scroller = DOM.el(`#${mode}_scroller`)
  scroller.classList.add(`hidden`)
}

App.check_scroller = (mode) => {
  if (App.get_setting(`show_scroller`)) {
    App.scroller_debouncer.call(mode)
  }
}

App.do_check_scroller = (mode) => {
  App.scroller_debouncer.cancel()

  if (App.dragging) {
    return
  }

  let container = DOM.el(`#${mode}_container`)
  let percentage

  if (App.get_setting(`reverse_scroller_percentage`)) {
    percentage = (container.scrollTop /
    (container.scrollHeight - container.clientHeight)) * 100
  }
  else {
    percentage = 100 - ((container.scrollTop /
    (container.scrollHeight - container.clientHeight)) * 100)
  }

  let per = parseInt(percentage)
  DOM.el(`#${mode}_scroller_percentage`).textContent = `(${per}%)`

  if (container.scrollTop > App.scroller_max_top) {
    App.show_scroller(mode)
  }
  else {
    App.hide_scroller(mode)
  }
}

App.create_scroller = (mode) => {
  let scroller = DOM.create(`div`, `scroller`, `${mode}_scroller`)
  let text = DOM.create(`div`)
  text.textContent = `Go To Top`
  let percentage = DOM.create(`div`, ``, `${mode}_scroller_percentage`)
  scroller.append(text)
  scroller.append(percentage)

  DOM.ev(scroller, `click`, (e) => {
    if (e.shiftKey || e.ctrlKey) {
      return
    }

    App.goto_top(mode)
  })

  return scroller
}
App.settings_do_action = (what) => {
  if (what === `theme`) {
    App.apply_theme()
  }
  else if (what === `filter_debouncers`) {
    App.start_filter_debouncers()
  }
}

App.get_settings_label = (setting) => {
  let item = DOM.el(`#settings_${setting}`)
  let container = item.closest(`.settings_item`)
  let label = DOM.el(`.settings_label`, container)
  return label
}

App.settings_setup_labels = (category) => {
  function proc (item, btns) {
    let bc = DOM.create(`div`, `flex_row_center gap_1`)
    let cls = `action underline`

    for (let btn of btns) {
      let c = DOM.create(`div`, `flex_row_center gap_1`)
      let d = DOM.create(`div`)
      d.textContent = `|`
      let a = DOM.create(`div`, cls)
      a.id = btn[0]
      a.textContent = btn[1]
      c.append(d)
      c.append(a)
      bc.append(c)
    }

    item.before(bc)
    bc.prepend(item)
  }

  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if ((props.category === category) && props.btns) {
      let btns = []

      if (props.btns.includes(`pick`)) {
        btns.push([`settings_${key}_pick`, `Pick`])
      }

      if (btns.length) {
        proc(DOM.el(`#settings_label_${key}`), btns)
      }
    }
  }
}

App.settings_setup_checkboxes = (category) => {
  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if ((props.category === category) && props.type === `checkbox`) {
      let el = DOM.el(`#settings_${key}`)
      el.checked = App.get_setting(key)

      DOM.ev(el, `change`, () => {
        App.set_setting(key, el.checked)
      })

      DOM.ev(App.get_settings_label(key), `click`, (e) => {
        App.settings_label_menu(e,
        [
          {
            name: `Reset`, action: () => {
              let force = App.check_setting_default(key)

              App.show_confirm(`Reset setting?`, () => {
                App.set_default_setting(key)
                el.checked = App.get_setting(key)
              }, undefined, force)
            }
          },
        ])
      })
    }
  }
}

App.settings_setup_texts = (category) => {
  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if (props.category !== category) {
      continue
    }

    if (props.type !== `text` && props.type !== `text_smaller`) {
      continue
    }

    let el = DOM.el(`#settings_${key}`)
    let value = App.get_setting(key)
    el.value = value

    DOM.ev(el, `change`, () => {
      App.scroll_to_top(el)
      let value = el.value.trim()

      if (props.no_empty) {
        if (value === ``) {
          el.value = App.get_setting(key)
          return
        }
      }

      el.value = value
      el.scrollTop = 0
      App.set_setting(key, value)
    })

    let menu = [
      {
        name: `Reset`,  action: () => {
          let force = App.check_setting_default(key) || App.check_setting_empty(key)

          App.show_confirm(`Reset setting?`, () => {
            App.set_default_setting(key)
            el.value = App.get_setting(key)
            App.scroll_to_top(el)
          }, undefined, force)
        },
      },
      {
        name: `Copy`,  action: () => {
          if (el.value === ``) {
            return
          }

          App.copy_to_clipboard(el.value)
        },
      },
    ]

    if (!props.no_empty) {
      menu.push({
        name: `Clear`,  action: () => {
          if (el.value === ``) {
            return
          }

          App.show_confirm(`Clear setting?`, () => {
            el.value = ``
            App.set_setting(key, ``)
            el.focus()
          })
        },
      })
    }

    DOM.ev(App.get_settings_label(key), `click`, (e) => {
      App.settings_label_menu(e, menu)
    })
  }
}

App.settings_setup_numbers = (category) => {
  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if (props.category !== category) {
      continue
    }

    if (props.type !== `number`) {
      continue
    }

    let el = DOM.el(`#settings_${key}`)
    let value = App.get_setting(key)
    el.value = value

    DOM.ev(el, `change`, () => {
      let value = parseInt(el.value)

      if (isNaN(value)) {
        value = App.get_setting(key)
      }

      if (value < parseInt(props.min || 0)) {
        value = props.min || 0
      }

      if (props.max) {
        if (value > props.max) {
          value = props.max
        }
      }

      el.value = value
      App.set_setting(key, value)
    })

    let menu = [
      {
        name: `Reset`,  action: () => {
          let force = App.check_setting_default(key) || App.check_setting_empty(key)

          App.show_confirm(`Reset setting?`, () => {
            App.set_default_setting(key)
            let value = App.get_setting(key)
            el.value = value
          }, undefined, force)
        },
      },
      {
        name: `Copy`,  action: () => {
          if (el.value === ``) {
            return
          }

          App.copy_to_clipboard(el.value)
        },
      },
    ]

    DOM.ev(App.get_settings_label(key), `click`, (e) => {
      App.settings_label_menu(e, menu)
    })
  }
}

App.setting_setup_lists = (category) => {
  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if (props.category === category) {
      if (props.type !== `list`) {
        continue
      }

      Addlist.add_buttons(`settings_${key}`)

      let menu = [
        {
          name: `Reset`,  action: () => {
            let force = App.check_setting_default(key) || App.check_setting_empty(key)

            App.show_confirm(`Reset setting?`, () => {
              App.set_default_setting(key)
              Addlist.update_count(`settings_${key}`)
            }, undefined, force)
          },
        },
      ]

      DOM.ev(App.get_settings_label(key), `click`, (e) => {
        App.settings_label_menu(e, menu)
      })
    }
  }
}

App.settings_make_menu = (setting, opts, action = () => {}) => {
  let no_wrap = [`font_size`, `width`, `height`]

  App[`settings_menubutton_${setting}`] = Menubutton.create({
    opts: opts,
    button: DOM.el(`#settings_${setting}`),
    selected: App.get_setting(setting),
    wrap: !no_wrap.includes(setting),
    on_change: (args, opt) => {
      App.set_setting(setting, opt.value)
      action()
    },
  })

  DOM.ev(App.get_settings_label(setting), `click`, (e) => {
    App.settings_label_menu(e,
    [
      {
        name: `Reset`, action: () => {
          let force = App.check_setting_default(setting)

          App.show_confirm(`Reset setting?`, () => {
            App.set_default_setting(setting)
            App.set_settings_menu(setting, undefined, false)
            action()
          }, undefined, force)
        }
      },
    ])
  })
}

App.add_settings_filter = (category) => {
  let container = DOM.el(`#settings_${category}_container`)
  let filter = DOM.create(`input`, `settings_filter text small_filter`, `settings_${category}_filter`)
  filter.type = `text`
  filter.autocomplete = `off`
  filter.spellcheck = false
  let s = ``

  if (App.get_setting(`debug_mode`)) {
    let items = DOM.els(`.settings_item`, container)
    s = ` (${items.length})`
  }

  filter.placeholder = `Filter${s}`
  container.prepend(filter)
}

App.filter_settings = () => {
  App.filter_settings_debouncer.call()
}

App.do_filter_settings = () => {
  App.filter_settings_debouncer.cancel()
  App.do_filter_2(`settings_${App.settings_category}`)
}

App.clear_settings_filter = () => {
  if (App.settings_filter_focused()) {
    let mode = `settings_${App.settings_category}`

    if (App.filter_has_value(mode)) {
      App.set_filter({mode: mode})
    }
    else {
      App.hide_window()
    }
  }
}

App.settings_filter_focused = () => {
  return document.activeElement.classList.contains(`settings_filter`)
}

App.prepare_settings_category = (category) => {
  App.fill_settings(category)
  App.settings_buttons(category)
  App.settings_setup_texts(category)
  App.settings_setup_checkboxes(category)
  App.settings_setup_numbers(category)
  App.setting_setup_lists(category)
  App.settings_setup_labels(category)
  App.add_settings_switchers(category)
  App.add_settings_filter(category)
  let container = DOM.el(`#settings_${category}_container`)
  container.classList.add(`filter_container`)

  for (let el of DOM.els(`.settings_item`, container)) {
    el.classList.add(`filter_item`)
  }

  for (let el of DOM.els(`.settings_label`, container)) {
    el.classList.add(`filter_text`)
    el.classList.add(`action`)
  }
}

App.setup_settings = () => {
  window.addEventListener(`storage`, (e) => {
    if (e.key === App.stor_settings_name) {
      App.debug(`Settings changed in another window`)
      App.stor_get_settings()
      App.restart_settings(`sync`)
    }
  })

  App.save_settings_debouncer = App.create_debouncer(() => {
    App.stor_save_settings()
  }, App.settings_save_delay)
}

App.start_settings = () => {
  if (App.check_ready(`settings`)) {
    return
  }

  App.cmdlist = App.settings_commands()
  App.settings_categories = Object.keys(App.setting_catprops)

  let common = {
    persistent: false,
    colored_top: true,
    after_show: () => {
      DOM.el(`#settings_${App.settings_category}_filter`).focus()
    },
    on_hide: async () => {
      App.apply_theme()
      App.setup_commands()
      App.fill_palette()
      App.clear_show()
    },
  }

  for (let key in App.setting_catprops) {
    let catprops = App.setting_catprops[key]

    App.create_window(Object.assign({}, common, {
      id: `settings_${key}`,
      element: App.settings_build_category(key),
      setup: () => {
        App.prepare_settings_category(key)
        catprops.setup()
      },
    }))
  }

  App.setup_settings_addlist()

  App.settings_wheel = App.create_debouncer((e, direction) => {
    if (!direction) {
      direction = App.wheel_direction(e)
    }

    if (direction === `down`) {
      App.show_next_settings()
    }
    else if (direction === `up`) {
      App.show_prev_settings()
    }
  }, App.wheel_delay)

  App.filter_settings_debouncer = App.create_debouncer(() => {
    App.do_filter_settings()
  }, App.filter_delay_2)
}

App.add_settings_switchers = (category) => {
  let top = DOM.el(`#window_top_settings_${category}`)

  if (DOM.dataset(top, `done`)) {
    return
  }

  let container = DOM.create(`div`, `flex_row_center gap_2 grow`)
  top.append(container)
  let title = DOM.create(`div`, `settings_title button`)
  title.id = `settings_title_${category}`
  title.textContent = App.capitalize(category)
  container.append(title)
  let actions = DOM.create(`div`, `button icon_button`)
  actions.id = `settings_actions_${category}`
  actions.append(App.create_icon(`sun`))
  container.append(actions)
  let close = DOM.create(`div`, `button`)
  close.textContent = App.close_text
  container.append(close)

  DOM.ev(actions, `click`, () => {
    App.settings_actions(category)
  })

  DOM.ev(close, `click`, () => {
    App.hide_window()
  })

  let prev = DOM.create(`div`, `button arrow_prev`)
  prev.textContent = `<`
  container.prepend(prev)

  DOM.ev(prev, `click`, () => {
    App.show_prev_settings()
  })

  let next = DOM.create(`div`, `button arrow_next`)
  next.textContent = `>`
  container.append(next)

  DOM.ev(next, `click`, () => {
    App.show_next_settings()
  })

  DOM.ev(title, `click`, () => {
    App.show_settings_menu()
  })

  DOM.ev(title, `contextmenu`, (e) => {
    App.show_settings_menu()
    e.preventDefault()
  })

  DOM.ev(title, `auxclick`, (e) => {
    if (e.button === 1) {
      App.hide_window()
    }
  })

  DOM.ev(title.closest(`.window_top`), `wheel`, (e) => {
    App.settings_wheel.call(e)
  })

  DOM.dataset(top, `done`, true)
}

App.start_color_picker = (setting, alpha = false) => {
  let el = DOM.el(`#settings_${setting}`)

  App[setting] = AColorPicker.createPicker(el, {
    showAlpha: alpha,
    showHSL: false,
    showHEX: false,
    showRGB: true,
    color: App.get_setting(setting)
  })

  App[setting].on(`change`, (picker, color) => {
    App.set_setting(setting, color)
  })

  DOM.ev(App.get_settings_label(setting), `click`, (e) => {
    App.settings_label_menu(e,
    [
      {
        name: `Reset`, action: () => {
          let force = App.check_setting_default(setting)

          App.show_confirm(`Reset setting?`, () => {
            App[setting].setColor(App.get_default_setting(setting))
            App.set_default_setting(setting)
          }, undefined, force)
        }
      },
    ])
  })
}

App.settings_default_category = (category) => {
  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if (props.category === category) {
      App.set_default_setting(key, false)
    }
  }
}

App.set_default_setting = (setting, do_action) => {
  App.set_setting(setting, App.default_setting_string, do_action)
}

App.reset_settings = (category) => {
  App.show_confirm(`Reset settings? (${App.capitalize(category)})`, () => {
    App.settings_default_category(category)

    if (category === `gestures`) {
      App.refresh_gestures()
    }

    App.apply_theme()
    App.show_settings_category(category)
  })
}

App.reset_all_settings = () => {
  App.show_confirm(`Reset all settings?`, () => {
    for (let key in App.setting_props) {
      App.set_default_setting(key)
    }

    App.restart_settings()
  })
}

App.get_size_options = () => {
  let opts = []

  for (let i=50; i<=100; i+=5) {
    opts.push({text: `${i}%`, value: i})
  }

  return opts
}

App.show_settings = () => {
  App.show_settings_category(`general`)
}

App.show_settings_category = (category) => {
  App.start_settings()
  App.get_settings_with_list()
  App.settings_category = category
  App.show_window(`settings_${category}`)
}

App.show_prev_settings = () => {
  let index = App.settings_index()
  index -= 1

  if (index < 0) {
    index = App.settings_categories.length - 1
  }

  App.show_settings_category(App.settings_categories[index])
}

App.show_next_settings = () => {
  let index = App.settings_index()
  index += 1

  if (index >= App.settings_categories.length) {
    index = 0
  }

  App.show_settings_category(App.settings_categories[index])
}

App.settings_index = () => {
  return App.settings_categories.indexOf(App.settings_category)
}

App.show_settings_menu = () => {
  let category = App.settings_category
  let btn = DOM.el(`#settings_title_${category}`)
  let items = App.settings_menu_items()
  NeedContext.show_on_element(btn, items)
}

App.export_settings = () => {
  App.export_data(App.settings)
}

App.import_settings = () => {
  App.import_data((json) => {
    if (App.is_object(json)) {
      App.settings = json
      App.check_settings()
      App.stor_save_settings()
      App.restart_settings()
    }
  })
}

App.restart_settings = (type = `normal`) => {
  App.apply_theme()
  App.refresh_gestures()

  if (App.on_items() || type === `sync`) {
    App.clear_show()
  }
  else {
    App.show_settings()
  }
}

App.settings_data_items = () => {
  let items = []

  items.push({
    text: `Export`,
    action: () => {
      App.export_settings()
    }
  })

  items.push({
    text: `Import`,
    action: () => {
      App.import_settings()
    }
  })

  items.push({
    text: `Reset All`,
    action: () => {
      App.reset_all_settings()
    }
  })

  return items
}

App.settings_label_menu = (e, args) => {
  let items = []

  for (let arg of args) {
    items.push({
      text: arg.name,
      action: arg.action,
    })
  }

  NeedContext.show(e.clientX, e.clientY, items)
}

App.get_setting = (setting) => {
  let value = App.settings[setting].value

  if (value === App.default_setting_string) {
    value = App.get_default_setting(setting)
  }

  return value
}

App.set_setting = (setting, value, do_action = true) => {
  if (App.str(App.settings[setting].value) !== App.str(value)) {
    App.settings[setting].value = value
    App.save_settings_debouncer.call()

    if (do_action) {
      let props = App.setting_props[setting]

      if (props.action) {
        App.settings_do_action(props.action)
      }
    }
  }
}

App.get_default_setting = (setting) => {
  let value = App.setting_props[setting].value

  if (typeof value === `object`) {
    value = [...value]
  }

  return value
}

App.check_settings = () => {
  let changed = false

  function set_default (setting) {
    App.settings[setting].value = App.default_setting_string
    App.settings[setting].version = App.setting_props[setting].version
  }

  for (let key in App.setting_props) {
    // Fill defaults
    if (App.settings[key] === undefined ||
      App.settings[key].value === undefined ||
      App.settings[key].version === undefined)
    {
      App.debug(`Stor: Adding setting: ${key}`)
      App.settings[key] = {}
      set_default(key)
      changed = true
    }
  }

  for (let key in App.settings) {
    // Remove unused settings
    if (App.setting_props[key] === undefined) {
      App.debug(`Stor: Deleting setting: ${key}`)
      delete App.settings[key]
      changed = true
    }
    // Check new version
    else if (App.settings[key].version !== App.setting_props[key].version) {
      App.debug(`Stor: Upgrading setting: ${key}`)
      set_default(key)
      changed = true
    }
  }

  if (changed) {
    App.stor_save_settings()
  }
}

App.on_settings = (mode = App.window_mode) => {
  return mode.startsWith(`settings_`)
}

App.settings_commands = () => {
  let items = [
    {text: `Do Nothing`, value: `none`},
    {text: App.separator_string},
  ]

  for (let cmd of App.commands) {
    if (cmd.name === App.separator_string) {
      items.push({text: App.separator_string})
    }
    else {
      items.push({text: cmd.name, value: cmd.cmd, icon: cmd.icon, info: cmd.info})
    }
  }

  return items
}

App.settings_menu_items = () => {
  let items = []

  for (let c of App.settings_categories) {
    let icon = App.settings_icons[c]
    let name = App.capitalize(c)

    items.push({
      icon: icon,
      text: name,
      action: () => {
        App.show_settings_category(c)
      },
    })
  }

  return items
}

App.is_default_setting = (setting) => {
  return (App.settings[setting].value === App.default_setting_string) ||
  (App.str(App.settings[setting].value) === App.str(App.get_default_setting(setting)))
}

App.check_setting_default = (setting) => {
  return App.is_default_setting(setting)
}

App.check_setting_empty = (setting) => {
  let props = App.setting_props[setting]
  let value = App.get_setting(setting)
  let text_types = [`text`, `text_smaller`, `number`]

  if (text_types.includes(props.type)) {
    return value === ``
  }
  else if (props.type === `list`) {
    return App.str(value) === App.str([])
  }
}

App.set_settings_menu = (setting, value, on_change) => {
  if (!value) {
    value = App.get_setting(setting)
  }

  App[`settings_menubutton_${setting}`].set(value, on_change)
}

App.settings_actions = (category) => {
  let items = []

  items.push({
    text: `Reset`,
    action: () => {
      App.reset_settings(category)
    }
  })

  items.push({
    text: `Data`,
    get_items: () => {
      return App.settings_data_items()
    },
  })

  let btn = DOM.el(`#settings_actions_${category}`)
  NeedContext.show_on_element(btn, items, true, btn.clientHeight)
}

App.get_background_effect = (value) => {
  for (let key in App.background_effects) {
    let eff = App.background_effects[key]

    if (eff.value === value) {
      return eff
    }
  }
}

App.settings_buttons = (category) => {
  let cat = App.setting_catprops[category]

  if (cat.buttons) {
    let btc = DOM.create(`div`, `settings_buttons`)

    for (let row of cat.buttons) {
      let row_el = DOM.create(`div`, `settings_buttons_row`)

      for (let item of row) {
        let btn = DOM.create(`div`, `button`)
        btn.textContent = item.text

        DOM.ev(btn, `click`, () => {
          item.action()
        })

        row_el.append(btn)
      }

      btc.append(row_el)
    }

    DOM.el(`#setting_${category}`).before(btc)
  }
}

App.fill_settings = (category) => {
  let c = DOM.el(`#setting_${category}`)
  c.innerHTML = ``

  function input (type, cls, placeholder) {
    let widget = DOM.create(`input`, `text ${cls}`)
    widget.type = type
    widget.autocomplete = `off`
    widget.spellcheck = false
    widget.placeholder = placeholder || ``
    return widget
  }

  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if (props.category === category) {
      let el = DOM.create(`div`, `settings_item`)
      let label = DOM.create(`div`, `settings_label`)
      label.id = `settings_label_${key}`
      label.textContent = props.name
      el.append(label)
      let widget

      if (props.type === `menu`) {
        widget = DOM.create(`div`, `menubutton button`)
      }
      else if (props.type === `list`) {
        widget = DOM.create(`div`, `addlist_control`)
      }
      else if (props.type === `text`) {
        widget = input(`text`, `settings_text`, props.placeholder)
      }
      else if (props.type === `text_smaller`) {
        widget = input(`text`, `settings_text text_smaller`, props.placeholder)
      }
      else if (props.type === `number`) {
        widget = input(`number`, `settings_number`, props.placeholder)
        widget.min = props.min

        if (props.max) {
          widget.max = props.max
        }
      }
      else if (props.type === `checkbox`) {
        widget = DOM.create(`input`, `settings_checkbox`)
        widget.type = `checkbox`
      }
      else if (props.type === `color`) {
        widget = DOM.create(`div`, `settings_color`)
      }

      widget.id = `settings_${key}`
      el.append(widget)
      el.title = App.single_space(props.info)

      if (App.get_setting(`debug_mode`)) {
        el.title += ` (${key})`
      }

      c.append(el)
    }
  }
}

App.get_settings_with_list = () => {
  if (!App.settings_with_list) {
    App.settings_with_list = []

    for (let key in App.setting_props) {
      let props = App.setting_props[key]

      if (props.type === `list`) {
        if (!App.settings_with_list.includes(props.category)) {
          App.settings_with_list.push(props.category)
        }
      }
    }
  }
}

App.setup_settings_addlist = () => {
  function cmd_name (cmd) {
    let c = App.get_command(cmd)

    if (c) {
      return c.name
    }
    else {
      return `None`
    }
  }

  function on_hide () {
    Addlist.hide()
  }

  let popobj = {
    on_hide: on_hide,
  }

  let get_data = (id) => {
    let key = id.replace(`settings_`, ``)
    return App.get_setting(key)
  }

  let set_data = (id, value) => {
    let key = id.replace(`settings_`, ``)
    App.set_setting(key, value)
  }

  let regobj = {
    get_data: get_data,
    set_data: set_data,
  }

  let id = `settings_aliases`
  let props = App.setting_props[`aliases`]

  App.create_popup(Object.assign({}, popobj, {
    id: `addlist_${id}`,
    element: Addlist.register(Object.assign({}, regobj, {
      id: id,
      pk: `a`,
      widgets: [`text`, `text`],
      labels: [`Term A`, `Term B`],
      keys: [`a`, `b`],
      list_text: (items) => {
        return `${items.a} = ${items.b}`
      },
      title: props.name,
    }))
  }))

  id = `settings_custom_filters`
  props = App.setting_props[`custom_filters`]

  App.create_popup(Object.assign({}, popobj, {
    id: `addlist_${id}`,
    element: Addlist.register(Object.assign({}, regobj, {
      id: id,
      pk: `filter`,
      widgets: [`text`],
      labels: [`Filter`],
      keys: [`filter`],
      list_text: (items) => {
        return items.filter
      },
      title: props.name,
    }))
  }))

  id = `settings_keyboard_shortcuts`
  props = App.setting_props[`keyboard_shortcuts`]

  App.create_popup(Object.assign({}, popobj, {
    id: `addlist_${id}`,
    element: Addlist.register(Object.assign({}, regobj, {
      id: id,
      pk: `key`,
      widgets: [`key`, `menu`, `checkbox`, `checkbox`, `checkbox`],
      labels: [`Key`, `Command`, `Require Ctrl`, `Require Shift`, `Require Alt`],
      sources: [undefined, App.cmdlist.slice(0), true, false, false],
      keys: [`key`, `cmd`, `ctrl`, `shift`, `alt`],
      list_text: (items) => {
        let cmd = cmd_name(items.cmd)
        return `${items.key} = ${cmd}`
      },
      title: props.name,
    }))
  }))

  for (let key in App.setting_props) {
    let id = `settings_${key}`
    props = App.setting_props[key]

    if (props.category === `menus`) {
      App.create_popup(Object.assign({}, popobj, {
        id: `addlist_${id}`,
        element: Addlist.register(Object.assign({}, regobj, {
          id: id,
          pk: `cmd`,
          widgets: [`menu`],
          labels: [`Command`],
          sources: [App.cmdlist.slice(0)],
          keys: [`cmd`],
          list_text: (items) => {
            return cmd_name(items.cmd)
          },
          title: props.name,
        }))
      }))
    }
  }
}

App.settings_build_category = (key) => {
  let cat = App.setting_catprops[key]
  let c = DOM.create(`div`, `settings_container`, `settings_${key}_container`)
  let info = DOM.create(`div`, `settings_info`)
  info.textContent = cat.info
  c.append(info)
  let sub = DOM.create(`div`, `settings_subcontainer`, `setting_${key}`)
  c.append(sub)

  if (cat.image) {
    let img = DOM.create(`img`, `settings_image`)
    img.src = cat.image

    if (cat.image_title) {
      img.title = cat.image_title
    }

    c.append(img)
  }

  return c
}

App.pick_background = (e) => {
  let items = []

  for (let num=1; num<=App.num_backgrounds; num++) {
    items.push({
      text: `Background ${num}`,
      action: () => {
        App.do_pick_background(num)
      },
      image: App.background_path(num)
    })
  }

  NeedContext.show(e.clientX, e.clientY, items)
}

App.do_pick_background = (num) => {
  let value = `Background ${num}`
  DOM.el(`#settings_background_image`).value = value
  App.set_setting(`background_image`, value)
  App.apply_theme()
}

App.background_path = (num) => {
  return App.backgrounds_dir + `background_${num}.jpg`
}
App.build_settings = () => {
  // Setting Properties
  App.setting_props = {}
  let category, props

  // Add category props to main object
  function add_props () {
    for (let key in props) {
      props[key].category = category
      App.setting_props[key] = props[key]
    }
  }

  category = `general`

  props = {
    font_size: {
      name: `Font Size`,
      type: `number`,
      value: 16,
      action: `theme`,
      placeholder: `Px`,
      min: 6,
      max: 28,
      info: `The font size in pixels to use for text. The interface scales accordingly`,
      version: 1,
    },
    font: {
      name: `Font`,
      type: `menu`,
      value: `sans-serif`,
      info: `The font to use for text`,
      version: 1,
    },
    text_mode: {
      name: `Text`,
      type: `menu`,
      value: `title`,
      info: `What to show as the text for each item`,
      version: 1,
    },
    item_height: {
      name: `Spacing`,
      type: `menu`,
      value: `normal`,
      info: `The space between items`,
      version: 1,
    },
    item_border: {
      name: `Borders`,
      type: `menu`,
      value: `none`,
      info: `Borders between items`,
      version: 2,
    },
    item_icon: {
      name: `Icons`,
      type: `menu`,
      value: `normal`,
      info: `The size of the item icons`,
      version: 1,
    },
    width: {
      name: `Width`,
      type: `menu`,
      value: 75,
      info: `Width of the popup`,
      version: 1,
    },
    height: {
      name: `Height`,
      type: `menu`,
      value: 85,
      info: `Height of the popup`,
      version: 1,
    },
    primary_mode: {
      name: `Primary Mode`,
      type: `menu`,
      value: `tabs`,
      info: `The main preferred mode. This is shown at startup`,
      version: 1,
    },
    auto_restore: {
      name: `Auto-Restore`,
      type: `menu`,
      value: `never`,
      info: `When to auto-restore after the mouse leaves the window. Or if it should restore instantly after an action.
      Restore means going back to the primary mode and clearing the filter`,
      version: 1,
    },
    double_click_command: {
      name: `On Double Click`,
      type: `menu`,
      value: `item_action`,
      info: `What command to perform when double clicking an item`,
      version: 1,
    },
    bookmarks_folder: {
      name: `Bookmarks Folder`,
      type: `text`,
      value: `Grasshopper`,
      placeholder: `Folder Name`,
      no_empty: true,
      info: `Where to save bookmarks`,
      version: 1,
    },
    wrap_text: {
      name: `Wrap Text`,
      type: `checkbox`,
      value: false,
      info: `Allow long lines to wrap into multiple lines, increasing the height of some items`,
      version: 1,
    },
    click_select: {
      name: `Click Select`,
      type: `checkbox`,
      value: false,
      info: `Click to select without triggering an action`,
      version: 1,
    },
    icon_pick: {
      name: `Icon Pick`,
      type: `checkbox`,
      value: false,
      info: `Clicking the icons on the left of items toggles select`,
      version: 1,
    },
    lock_drag: {
      name: `Lock Drag`,
      type: `checkbox`,
      value: false,
      info: `Require holding Ctrl to drag tab items vertically. This is to avoid accidental re-ordering`,
      version: 1,
    },
  }

  add_props()
  category = `theme`

  props = {
    background_color: {
      name: `Background Color`,
      type: `color`,
      value: App.dark_colors.background,
      action: `theme`,
      info: `The background color`,
      version: 1,
    },
    text_color: {
      name: `Text Color`,
      type: `color`,
      value: App.dark_colors.text,
      action: `theme`,
      info: `The text color`,
      version: 1,
    },
    background_image: {
      name: `Background Image`,
      type: `text`,
      value: `Background 1`,
      action: `theme`,
      placeholder: `Image URL`,
      btns: [`pick`],
      info: `The background image. Pick from the buttons or enter a URL`,
      version: 1,
    },
    background_effect: {
      name: `Background Effect`,
      type: `menu`,
      value: `none`,
      action: `theme`,
      info: `The effect on the background image`,
      version: 1,
    },
    background_tiles: {
      name: `Background Tiles`,
      type: `menu`,
      value: `none`,
      action: `theme`,
      info: `The tile size of the background image`,
      version: 1,
    },
  }

  add_props()
  category = `media`

  props = {
    image_icon: {
      name: `View Image Icon`,
      type: `text_smaller`,
      value: `🖼️`,
      placeholder: App.icon_placeholder,
      info: `Media icon for images`,
      version: 1,
    },
    view_image_tabs: {
      name: `View Image (Tabs)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an image in tabs mode`,
      version: 1,
    },
    view_image_history: {
      name: `View Image (History)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an image in history mode`,
      version: 1,
    },
    view_image_bookmarks: {
      name: `View Image (Bookmarks)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an image in bookmarks mode`,
      version: 1,
    },
    view_image_closed: {
      name: `View Image (Closed)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an image in closed mode`,
      version: 1,
    },
    video_icon: {
      name: `View Video Icon`,
      type: `text_smaller`,
      value: `▶️`,
      placeholder: App.icon_placeholder,
      info: `Media icon for videos`,
      version: 1,
    },
    view_video_tabs: {
      name: `View Video (Tabs)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on a video in tabs mode`,
      version: 1,
    },
    view_video_history: {
      name: `View Video (History)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on a video in history mode`,
      version: 1,
    },
    view_video_bookmarks: {
      name: `View Video (Bookmarks)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on a video in bookmarks mode`,
      version: 1,
    },
    view_video_closed: {
      name: `View Video (Closed)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on a video in closed mode`,
      version: 1,
    },
    audio_icon: {
      name: `View Audio Icon`,
      type: `text_smaller`,
      value: `🎵`,
      placeholder: App.icon_placeholder,
      info: `Media icon for audio`,
      version: 1,
    },
    view_audio_tabs: {
      name: `View Audio (Tabs)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an audio in tabs mode`,
      version: 1,
    },
    view_audio_history: {
      name: `View Audio (History)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an audio in history mode`,
      version: 1,
    },
    view_audio_bookmarks: {
      name: `View Audio (Bookmarks)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an audio in bookmarks mode`,
      version: 1,
    },
    view_audio_closed: {
      name: `View Audio (Closed)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an audio in closed mode`,
      version: 1,
    },
  }

  add_props()
  category = `icons`

  props = {
    pin_icon: {
      name: `Pin Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for pinned tabs`,
      version: 1,
    },
    normal_icon: {
      name: `Normal Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for normal tabs`,
      version: 1,
    },
    playing_icon: {
      name: `Playing Icon`,
      type: `text_smaller`,
      value: `🔊`,
      placeholder: App.icon_placeholder,
      info: `Icons for tabs emitting audio`,
      version: 1,
    },
    muted_icon: {
      name: `Muted Icon`,
      type: `text_smaller`,
      value: `🔇`,
      placeholder: App.icon_placeholder,
      info: `Icons for muted tabs`,
      version: 1,
    },
    unloaded_icon: {
      name: `Unloaded Icon`,
      type: `text_smaller`,
      value: `💤`,
      info: `Icons for unloaded tabs`,
      placeholder: App.icon_placeholder,
      version: 1,
    },
    notes_icon: {
      name: `Notes Icon`,
      type: `text_smaller`,
      value: `📜`,
      placeholder: App.icon_placeholder,
      info: `Icon for items with notes📜`,
      version: 1,
    },
    close_icon: {
      name: `Close Icon`,
      type: `text_smaller`,
      value: `x`,
      placeholder: App.icon_placeholder,
      info: `Icon for the close buttons`,
      version: 1,
    },
  }

  add_props()
  category = `show`

  props = {
    show_pinline: {
      name: `Show Pinline`,
      type: `menu`,
      value: `auto`,
      info: `Show the widget between pinned and normal tabs`,
      version: 3,
    },
    tab_box: {
      name: `Tab Box`,
      type: `menu`,
      value: `none`,
      info: `The height of the tab box with recent tabs`,
      version: 2,
    },
    show_tooltips: {
      name: `Show Tooltips`,
      type: `checkbox`,
      value: true,
      info: `Show tooltips when hovering items`,
      version: 1,
    },
    show_scroller: {
      name: `Show Scrollers`,
      type: `checkbox`,
      value: true,
      info: `Show the scroller widget when scrolling the lists`,
      version: 1,
    },
    show_footer: {
      name: `Show Footer`,
      type: `checkbox`,
      value: true,
      info: `Show the footer at the bottom`,
      version: 1,
    },
    show_filter_history: {
      name: `Show Filter History`,
      type: `checkbox`,
      value: true,
      info: `Show the filter history when right clicking the filter`,
      version: 1,
    },
    show_feedback: {
      name: `Show Feedback`,
      type: `checkbox`,
      value: true,
      info: `Show feedback messages on certain actions`,
      version: 1,
    },
    show_footer_count: {
      name: `Count In Footer`,
      type: `checkbox`,
      value: true,
      info: `Show the item count in the footer`,
      version: 1,
    },
    active_trace: {
      name: `Active Trace`,
      type: `checkbox`,
      value: false,
      info: `Show numbers as a trace on recently used tabs`,
      version: 1,
    },
    show_scrollbars: {
      name: `Show Scrollbars`,
      type: `checkbox`,
      value: false,
      info: `Show the regular scrollbars. Else scrollbars are disabled`,
      version: 1,
    },
    reverse_scroller_percentage: {
      name: `Reverse Scroller %`,
      type: `checkbox`,
      value: false,
      info: `Reverse the scrolling percentage in the scroller`,
      version: 1,
    },
    close_icon_on_left: {
      name: `Close Icon On Left`,
      type: `checkbox`,
      value: false,
      info: `Put the close icon on the left side`,
      version: 1,
    },
  }

  add_props()
  category = `gestures`

  props = {
    gestures_enabled: {
      name: `Gestures Enabled`,
      type: `checkbox`,
      value: true,
      info: `Enable mouse gestures`,
      version: 1,
    },
    gestures_threshold: {
      name: `Gestures Threshold`,
      type: `menu`,
      value: 10,
      info: `How sensitive gestures are`,
      version: 1,
    },
    gesture_up: {
      name: `Gesture Up`,
      type: `menu`,
      value: `go_to_top`,
      info: `Up gesture`,
      version: 1,
    },
    gesture_down: {
      name: `Gesture Down`,
      type: `menu`,
      value: `go_to_bottom`,
      info: `Down gesture`,
      version: 1,
    },
    gesture_left: {
      name: `Gesture Left`,
      type: `menu`,
      value: `show_previous_mode`,
      info: `Left gesture`,
      version: 1,
    },
    gesture_right: {
      name: `Gesture Right`,
      type: `menu`,
      value: `show_next_mode`,
      info: `Right gesture`,
      version: 1,
    },
    gesture_up_and_down: {
      name: `Gesture Up Down`,
      type: `menu`,
      value: `filter_all`,
      info: `Up and Down gesture`,
      version: 1,
    },
    gesture_left_and_right: {
      name: `Gesture Left Right`,
      type: `menu`,
      value: `filter_domain`,
      info: `Left and Right gesture`,
      version: 1,
    },
  }

  add_props()
  category = `auxclick`

  props = {
    middle_click_tabs: {
      name: `Middle-Click Tabs`,
      type: `menu`,
      value: `close_tabs`,
      info: `Middle-click on tab items`,
      version: 1,
    },
    middle_click_history: {
      name: `Middle-Click History`,
      type: `menu`,
      value: `open_items`,
      info: `Middle-click on history items`,
      version: 1,
    },
    middle_click_bookmarks: {
      name: `Middle-Click Bookmarks`,
      type: `menu`,
      value: `open_items`,
      info: `Middle-click on bookmark items`,
      version: 1,
    },
    middle_click_closed: {
      name: `Middle-Click Closed`,
      type: `menu`,
      value: `open_items`,
      info: `Middle-click on closed items`,
      version: 1,
    },
    middle_click_main_menu: {
      name: `Middle-Click Main Menu`,
      type: `menu`,
      value: `show_primary_mode`,
      info: `Middle-click on the main menu`,
      version: 1,
    },
    middle_click_filter_menu: {
      name: `Middle-Click Filter Menu`,
      type: `menu`,
      value: `filter_all`,
      info: `Middle-click on the filter menu`,
      version: 1,
    },
    middle_click_back_button: {
      name: `Middle-Click Back Button`,
      type: `menu`,
      value: `browser_back`,
      info: `Middle-click on the back button`,
      version: 1,
    },
    middle_click_actions_menu: {
      name: `Middle-Click Actions Menu`,
      type: `menu`,
      value: `browser_reload`,
      info: `Middle-click on the actions menu`,
      version: 1,
    },
    middle_click_footer: {
      name: `Middle-Click Footer`,
      type: `menu`,
      value: `copy_item_url`,
      info: `Middle-click on the footer`,
      version: 1,
    },
    middle_click_pinline: {
      name: `Middle-Click Pinline`,
      type: `menu`,
      value: `close_normal_tabs`,
      info: `Middle-click on the pinline`,
      version: 1,
    },
    middle_click_close_icon: {
      name: `Middle-Click Close Icon`,
      type: `menu`,
      value: `unload_tabs`,
      info: `Middle-click on the close buttons`,
      version: 1,
    },
  }

  add_props()
  category = `menus`

  props = {
    tabs_actions: {
      name: `Tab Actions`,
      type: `list`,
      value: [
        {cmd: `open_new_tab`},
        {cmd: `sort_tabs`},
        {cmd: `reopen_tab`},
        {cmd: `show_tabs_info`},
        {cmd: `show_tab_urls`},
        {cmd: `open_tab_urls`},
        {cmd: `show_close_tabs_menu`},
      ],
      info: `Tabs action menu`,
      version: 1,
    },
    history_actions: {
      name: `History Actions`,
      type: `list`,
      value: [
        {cmd: `deep_search`},
        {cmd: `show_search_media_menu`},
      ],
      info: `History action menu`,
      version: 1,
    },
    bookmarks_actions: {
      name: `Bookmark Actions`,
      type: `list`,
      value: [
        {cmd: `deep_search`},
        {cmd: `show_search_media_menu`},
        {cmd: `bookmark_page`},
      ],
      info: `Bookmarks action menu`,
      version: 1,
    },
    closed_actions: {
      name: `Closed Actions`,
      type: `list`,
      value: [
        {cmd: `forget_closed`},
      ],
      info: `Closed action menu`,
      version: 1,
    },
    extra_menu: {
      name: `Extra Menu`,
      type: `list`,
      value: [],
      info: `If this has items an Extra menu is shown in the item menu when right clicking items`,
      version: 4,
    },
    pinline_menu: {
      name: `Pinline Menu`,
      type: `list`,
      value: [
        {cmd: `select_pinned_tabs`},
        {cmd: `select_normal_tabs`},
      ],
      info: `Menu when clicking the pinline`,
      version: 4,
    },
    empty_menu: {
      name: `Empty Menu`,
      type: `list`,
      value: [
        {cmd: `open_new_tab`},
        {cmd: `select_all_items`},
      ],
      info: `Menu when right clicking empty space`,
      version: 4,
    },
    footer_menu: {
      name: `Footer Menu`,
      type: `list`,
      value: [
        {cmd: `copy_item_url`},
        {cmd: `copy_item_title`},
      ],
      info: `Menu when right clicking the footer`,
      version: 4,
    },
  }

  add_props()
  category = `keyboard`

  props = {
    keyboard_shortcuts: {
      name: `Keyboard Shortcuts`,
      type: `list`,
      value: [],
      info: `Extra keyboard shortcuts. If these are triggered the default shortcuts get ignored`,
      version: 4,
    },
  }

  add_props()
  category = `warns`

  props = {
    warn_on_close_tabs: {
      name: `Warn On Close Tabs`,
      type: `menu`,
      value: `special`,
      info: `Warn when closing tabs`,
      version: 1,
    },
    warn_on_unload_tabs: {
      name: `Warn On Unload Tabs`,
      type: `menu`,
      value: `special`,
      info: `Warn when unloading tabs`,
      version: 1,
    },
    warn_on_pin_tabs: {
      name: `Warn On Pin Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when pinning tabs`,
      version: 2,
    },
    warn_on_unpin_tabs: {
      name: `Warn On Unpin Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when unpinning tabs`,
      version: 2,
    },
    warn_on_close_normal_tabs: {
      name: `Warn On Close Normal`,
      type: `menu`,
      value: `always`,
      info: `Warn when closing normal tabs using the close menu`,
      version: 2,
    },
    warn_on_close_playing_tabs: {
      name: `Warn On Close Playing`,
      type: `menu`,
      value: `always`,
      info: `Warn when closing playing tabs using the close menu`,
      version: 2,
    },
    warn_on_close_unloaded_tabs: {
      name: `Warn On Close Unloaded`,
      type: `menu`,
      value: `always`,
      info: `Warn when closing unloaded tabs using the close menu`,
      version: 2,
    },
    warn_on_close_duplicate_tabs: {
      name: `Warn On Close Duplicates`,
      type: `menu`,
      value: `always`,
      info: `Warn when closing duplicate tabs using the close menu`,
      version: 2,
    },
    warn_on_close_visible_tabs: {
      name: `Warn On Close Visible`,
      type: `menu`,
      value: `always`,
      info: `Warn when closing visible tabs using the close menu`,
      version: 2,
    },
    warn_on_duplicate_tabs: {
      name: `Warn Duplicate Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when duplicating tabs`,
      version: 2,
    },
    warn_on_open: {
      name: `Warn On Open`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when opening items`,
      version: 2,
    },
    warn_on_remove_profiles: {
      name: `Warn On Remove Profiles`,
      type: `menu`,
      value: `always`,
      info: `Warn when removing profiles`,
      version: 2,
    },
    warn_on_bookmark: {
      name: `Warn On Bookmark`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when adding bookmarks`,
      version: 2,
    },
    warn_on_load_tabs: {
      name: `Warn On Load Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when loading tabs`,
      version: 2,
    },
    warn_on_mute_tabs: {
      name: `Warn On Mute Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when muting tabs`,
      version: 2,
    },
    warn_on_unmute_tabs: {
      name: `Warn On Unmute Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when unmuting tabs`,
      version: 2,
    },
    warn_on_color: {
      name: `Warn On Color`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when changing colors`,
      version: 2,
    },
    warn_on_remove_color: {
      name: `Warn On Remove Color`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when removing colors`,
      version: 2,
    },
    max_warn_limit: {
      name: `Max Warn Limit`,
      type: `number`,
      value: 25,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Force a confirm after this many items regardless of warn settings`,
      version: 1,
    },
  }

  add_props()
  category = `colors`

  props = {
    color_mode: {
      name: `Color Mode`,
      type: `menu`,
      value: `border_icon`,
      info: `What color mode to use`,
      version: 2,
    },
    color_red: {
      name: `Color Red`,
      type: `color`,
      value: `rgb(172, 59, 59)`,
      info: `Color an item red`,
      version: 1,
    },
    color_green: {
      name: `Color Green`,
      type: `color`,
      value: `rgb(45, 115, 45)`,
      info: `Color an item green`,
      version: 1,
    },
    color_blue: {
      name: `Color Blue`,
      type: `color`,
      value: `rgb(59, 59, 147)`,
      info: `Color an item blue`,
      version: 1,
    },
    color_yellow: {
      name: `Color Yellow`,
      type: `color`,
      value: `rgb(200, 200, 88)`,
      info: `Color an item yellow`,
      version: 1,
    },
    color_purple: {
      name: `Color Purple`,
      type: `color`,
      value: `rgb(124, 35, 166)`,
      info: `Color an item purple`,
      version: 1,
    },
    color_orange: {
      name: `Color Orange`,
      type: `color`,
      value: `rgb(189, 144, 74)`,
      info: `Color an item orange`,
      version: 1,
    },
  }

  add_props()
  category = `filter`

  props = {
    aliases: {
      name: `Aliases`,
      type: `list`,
      value: [],
      info: `Aliases to use when filtering items`,
      version: 3,
    },
    custom_filters: {
      name: `Custom Filters`,
      type: `list`,
      value: [
        {filter: `re: (today|$day)`},
        {filter: `re: ($month|$year)`},
      ],
      info: `Pre-made filters to use. These appear in the Custom section`,
      version: 3,
    },
    filter_enter: {
      name: `Filter Enter`,
      type: `checkbox`,
      value: false,
      info: `Require pressing Enter to use filter or search`,
      version: 1,
    },
    clean_filter: {
      name: `Clean Filter`,
      type: `checkbox`,
      value: true,
      info: `Remove special characters from the filter`,
      version: 1,
    },
    case_insensitive: {
      name: `Case Insensitive`,
      type: `checkbox`,
      value: true,
      info: `Make the filter case insensitive`,
      version: 1,
    },
    reuse_filter: {
      name: `Re-Use Filter`,
      type: `checkbox`,
      value: true,
      info: `Re-use the filter when moving across modes`,
      version: 1,
    },
    max_search_items: {
      name: `Max Search Items`,
      type: `number`,
      value: 500,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max items to return on search modes like history and bookmarks`,
      version: 1,
    },
    deep_max_search_items: {
      name: `Deep Max Search Items`,
      type: `number`,
      value: 5000,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max search items to return in deep mode (more items)`,
      version: 1,
    },
    history_max_months: {
      name: `History Max Months`,
      type: `number`,
      value: 18,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `How many months back to consider when searching history`,
      version: 1,
    },
    deep_history_max_months: {
      name: `Deep History Max Months`,
      type: `number`,
      value: 54,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `How many months back to consider when searching history in deep mode (more months)`,
      version: 1,
    },
    filter_delay: {
      name: `Filter Delay`,
      type: `number`,
      value: 50,
      action: `filter_debouncers`,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `The filter delay on instant modes like tabs and closed (milliseconds)`,
      version: 1,
    },
    filter_delay_search: {
      name: `Filter Delay (Search)`,
      type: `number`,
      value: 225,
      action: `filter_debouncers`,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `The filter delay on search modes like history and bookmarks (milliseconds)`,
      version: 1,
    },
    max_filter_history: {
      name: `Max Filter History`,
      type: `number`,
      value: 10,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max items to show in the filter history`,
      version: 1,
    },
  }

  add_props()
  category = `more`

  props = {
    hover_effect: {
      name: `Hover Effect`,
      type: `menu`,
      value: `glow`,
      info: `What effect to use when hoving items`,
      version: 1,
    },
    selected_effect: {
      name: `Selected Effect`,
      type: `menu`,
      value: `background`,
      info: `What effect to use on selected items`,
      version: 1,
    },
    single_new_tab: {
      name: `Single New Tab`,
      type: `checkbox`,
      value: true,
      info: `Keep only one new tab at any time`,
      version: 1,
    },
    close_on_focus: {
      name: `Close On Focus`,
      type: `checkbox`,
      value: true,
      info: `Close the popup when focusing a tab`,
      version: 1,
    },
    close_on_open: {
      name: `Close On Open`,
      type: `checkbox`,
      value: true,
      info: `Close the popup when opening a popup`,
      version: 1,
    },
    mute_click: {
      name: `Mute Click`,
      type: `checkbox`,
      value: true,
      info: `Un-Mute tabs when clicking on the mute icon`,
      version: 1,
    },
    notes_click: {
      name: `Notes Click`,
      type: `checkbox`,
      value: true,
      info: `Show notes when clicking the notes icon`,
      version: 1,
    },
    double_click_new: {
      name: `Double Click New`,
      type: `checkbox`,
      value: true,
      info: `Open a new tab when double clicking empty space`,
      version: 1,
    },
    rounded_corners: {
      name: `Rounded Corners`,
      type: `checkbox`,
      value: true,
      info: `Allow rounded corners in some parts of the interface`,
      version: 1,
    },
    direct_settings: {
      name: `Direct Settings`,
      type: `checkbox`,
      value: true,
      info: `Go straight to General when clicking Settings. Else show a menu to pick a category`,
      version: 1,
    },
    sort_commands: {
      name: `Sort Commands`,
      type: `checkbox`,
      value: true,
      info: `Sort commands in the palette by recent use`,
      version: 1,
    },
    all_bookmarks: {
      name: `All Bookmarks`,
      type: `checkbox`,
      value: true,
      info: `Show other bookmarks apart from the configured bookmarks folder`,
      version: 1,
    },
    max_recent_tabs: {
      name: `Max Recent Tabs`,
      type: `number`,
      value: 10,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max items to show in Recent Tabs`,
      version: 1,
    },
    max_active_history: {
      name: `Max Active History`,
      type: `number`,
      value: 20,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max active tab history to remember`,
      version: 1,
    },
    debug_mode: {
      name: `Debug Mode`,
      type: `checkbox`,
      value: false,
      info: `Enable some data for developers`,
      version: 1,
    },
  }

  add_props()

  // Category Properties
  App.setting_catprops = {
    general: {
      info: `This is the main settings window with some general settings. There are various categories.
            Clicking the labels shows menus. Use the top buttons to navigate and save/load data`,
      setup: () => {
        App.settings_make_menu(`text_mode`, [
          {text: `Title`, value: `title`},
          {text: `URL`, value: `url`},
          {text: `Title / URL`, value: `title_url`},
          {text: `URL / Title`, value: `url_title`},
        ])

        App.settings_make_menu(`font`, [
          {text: `Sans`, value: `sans-serif`},
          {text: `Serif`, value: `serif`},
          {text: `Mono`, value: `monospace`},
          {text: `Cursive`, value: `cursive`},
        ], () => {
          App.apply_theme()
        })

        App.settings_make_menu(`auto_restore`, [
          {text: `Never`, value: `never`},
          {text: `1 Second`, value: `1_seconds`},
          {text: `3 Seconds`, value: `3_seconds`},
          {text: `5 Seconds`, value: `5_seconds`},
          {text: `10 Seconds`, value: `10_seconds`},
          {text: `30 Seconds`, value: `30_seconds`},
          {text: `On Action`, value: `action`},
        ], () => {
          clearTimeout(App.restore_timeout)
        })

        App.settings_make_menu(`item_height`, [
          {text: `Tiny`, value: `tiny`},
          {text: `Small`, value: `small`},
          {text: `Normal`, value: `normal`},
          {text: `Big`, value: `big`},
          {text: `Huge`, value: `huge`},
        ])

        App.settings_make_menu(`item_border`, [
          {text: `None`, value: `none`},
          {text: `Normal`, value: `normal`},
          {text: `Big`, value: `big`},
          {text: `Huge`, value: `huge`},
        ])

        App.settings_make_menu(`item_icon`, [
          {text: `None`, value: `none`},
          {text: `Tiny`, value: `tiny`},
          {text: `Small`, value: `small`},
          {text: `Normal`, value: `normal`},
          {text: `Big`, value: `big`},
          {text: `Huge`, value: `huge`},
        ])

        App.settings_make_menu(`primary_mode`, [
          {text: `Tabs`, value: `tabs`},
          {text: `History`, value: `history`},
          {text: `Bookmarks`, value: `bookmarks`},
          {text: `Closed`, value: `closed`},
        ])

        App.settings_make_menu(`width`, App.get_size_options(), () => {
          App.apply_theme()
        })

        App.settings_make_menu(`height`, App.get_size_options(), () => {
          App.apply_theme()
        })

        App.settings_make_menu(`double_click_command`, App.cmdlist)
      },
    },
    theme: {
      info: `Here you can change the color theme and background image. Colors can be randomized. The background image can have an effect and/or tile mode`,
      setup: () => {
        App.start_color_picker(`background_color`)
        App.start_color_picker(`text_color`)

        App.settings_make_menu(`background_effect`, App.background_effects, () => {
          App.apply_theme()
        })

        App.settings_make_menu(`background_tiles`, [
          {text: `None`, value: `none`},
          {text: `50px`, value: `50px`},
          {text: `100px`, value: `100px`},
          {text: `150px`, value: `150px`},
          {text: `200px`, value: `200px`},
          {text: `250px`, value: `250px`},
          {text: `300px`, value: `300px`},
          {text: `350px`, value: `350px`},
          {text: `400px`, value: `400px`},
          {text: `450px`, value: `450px`},
          {text: `500px`, value: `500px`},
        ], () => {
          App.apply_theme()
        })

        DOM.ev(DOM.el(`#settings_background_image_pick`), `click`, (e) => {
          App.pick_background(e)
        })
      },
      buttons: [
        [
          {
            text: `Dark Colors`, action: () => {
              App.set_dark_colors()
            }
          },
          {
            text: `Light Colors`, action: () => {
              App.set_light_colors()
            }
          },
        ],
        [
          {
            text: `Random Dark`, action: () => {
              App.random_colors(`dark`)
            }
          },
          {
            text: `Random Light`, action: () => {
              App.random_colors(`light`)
            }
          },
        ],
      ]
    },
    colors: {
      info: `These are the colors you assign to items by editing their profiles`,
      setup: () => {
        for (let color of App.colors) {
          App.start_color_picker(`color_${color}`)
        }

        App.settings_make_menu(`color_mode`, [
          {text: `None`, value: `none`},
          {text: `Icon`, value: `icon`},
          {text: `Icon 2`, value: `icon_2`},
          {text: `Border`, value: `border`},
          {text: `Border & Icon`, value: `border_icon`},
          {text: `Border & Icon 2`, value: `border_icon_2`},
          {text: `Background`, value: `background`},
        ])
      },
    },
    filter: {
      info: `Adjust the filter and search`,
      setup: () => {},
    },
    media: {
      info: `How to view media items. An icon appears to the left of items. You can make it view media when clicking the icons, the whole item, or never`,
      setup: () => {
        let opts = [
          {text: `Never`, value: `never`},
          {text: `On Icon Click`, value: `icon`},
          {text: `On Item Click`, value: `item`},
        ]

        for (let m of App.modes) {
          App.settings_make_menu(`view_image_${m}`, opts)
          App.settings_make_menu(`view_video_${m}`, opts)
          App.settings_make_menu(`view_audio_${m}`, opts)
        }
      },
    },
    icons: {
      info: `Customize the icons of items. You can leave them empty`,
      setup: () => {},
    },
    show: {
      info: `Hide or show interface components. Set component behavior`,
      setup: () => {
        App.settings_make_menu(`show_pinline`, [
          {text: `Never`, value: `never`},
          {text: `Auto`, value: `auto`},
          {text: `Always`, value: `always`},
        ])

        App.settings_make_menu(`tab_box`, [
          {text: `None`, value: `none`},
          {text: `Tiny`, value: `tiny`},
          {text: `Small`, value: `small`},
          {text: `Normal`, value: `normal`},
          {text: `Big`, value: `big`},
          {text: `Huge`, value: `huge`},
        ])
      },
    },
    gestures: {
      info: `You perform gestures by holding the middle mouse button, moving in a direction, and releasing the button`,
      setup: () => {
        DOM.ev(DOM.el(`#settings_gestures_enabled`), `change`, () => {
          App.refresh_gestures()
        })

        App.settings_make_menu(`gestures_threshold`, [
          {text: `Normal`, value: 10},
          {text: `Less Sensitive`, value: 100},
        ], () => {
          App.refresh_gestures()
        })

        for (let key in App.setting_props) {
          let props = App.setting_props[key]

          if (props.category === `gestures`) {
            if (key.startsWith(`gesture_`)) {
              App.settings_make_menu(key, App.cmdlist)
            }
          }
        }
      },
    },
    auxclick: {
      info: `Perform actions on middle-click`,
      setup: () => {
        for (let key in App.setting_props) {
          let props = App.setting_props[key]

          if (props.category === `auxclick`) {
            App.settings_make_menu(key, App.cmdlist)
          }
        }
      },
    },
    menus: {
      info: `Customize context and action menus`,
      setup: () => {},
    },
    keyboard: {
      info: `You can use these custom shortcuts to run commands. You can define if you need ctrl, shift, or alt`,
      image: `img/cewik.jpg`,
      image_title: `Cewik using his keyboard`,
      setup: () => {},
    },
    warns: {
      info: `When to show the confirmation dialog on some actions.
      Special does action depending if tabs are pinned. Multiple warns if multiple items are selected`,
      setup: () => {
        let tab_warn_opts = [
          {text: `Never`, value: `never`},
          {text: `Multiple`, value: `multiple`},
          {text: `Special`, value: `special`},
          {text: `Always`, value: `always`},
        ]

        App.settings_make_menu(`warn_on_close_tabs`, tab_warn_opts)
        App.settings_make_menu(`warn_on_unload_tabs`, tab_warn_opts)

        let tab_warn_opts_2 = [
          {text: `Never`, value: `never`},
          {text: `Multiple`, value: `multiple`},
          {text: `Always`, value: `always`},
        ]

        App.settings_make_menu(`warn_on_pin_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_unpin_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_close_normal_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_close_playing_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_close_unloaded_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_close_duplicate_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_close_visible_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_duplicate_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_open`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_remove_profiles`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_bookmark`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_load_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_mute_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_unmute_tabs`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_color`, tab_warn_opts_2)
        App.settings_make_menu(`warn_on_remove_color`, tab_warn_opts_2)
      },
    },
    more: {
      info: `More settings`,
      setup: () => {
        App.settings_make_menu(`hover_effect`, App.effects)
        App.settings_make_menu(`selected_effect`, App.effects)
      },
    },
  }
}
App.create_step_back_button = (mode) => {
  let btn = DOM.create(`div`, `button icon_button`, `${mode}_back`)
  btn.title = `Step Back (Esc) - Right Click to show Recent Tabs`
  btn.append(App.create_icon(`back`))

  DOM.ev(btn, `click`, (e) => {
    App.step_back(mode, e)
  })

  DOM.ev(btn, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_back_button`)
      App.run_command({cmd: cmd, from: `back_button`})
    }
  })

  DOM.ev(btn, `contextmenu`, (e) => {
    e.preventDefault()
    App.show_recent_tabs(e)
  })

  return btn
}

App.step_back = (mode = App.window_mode, e) => {
  let item = App.get_selected(mode)

  if (App.multiple_selected(mode)) {
    App.deselect(mode, `selected`)
  }
  else if (App.filter_has_value(mode)) {
    App.clear_filter(mode)
  }
  else if (App[`${mode}_filter_mode`] !== `all`) {
    App.filter_all()
  }
  else if (item && !App.item_is_visible(item)) {
    App.select_item({item: item, scroll: `center`})
  }
  else if (mode === `tabs` && !item.active) {
    App.focus_current_tab()
  }
  else if (mode === `tabs` && (e && e.key !== `Escape`)) {
    App.go_to_previous_tab()
  }
  else if (mode !== App.primary_mode()) {
    App.show_primary_mode()
  }
}
App.get_local_storage = (ls_name, fallback) => {
  let obj

  if (localStorage[ls_name]) {
    try {
      obj = App.obj(localStorage.getItem(ls_name))
    }
    catch (err) {
      localStorage.removeItem(ls_name)
      obj = null
    }
  }
  else {
    obj = null
  }

  if (!obj) {
    obj = fallback
  }

  return obj
}

App.save_local_storage = (ls_name, obj) => {
  localStorage.setItem(ls_name, App.str(obj))
}

App.stor_get_settings = () => {
  App.settings = App.get_local_storage(App.stor_settings_name, {})
  App.check_settings()
  App.settings_done = true
  App.debug(`Stor: Got settings`)
}

App.stor_save_settings = () => {
  App.debug(`Stor: Saving settings`)
  App.save_local_storage(App.stor_settings_name, App.settings)
}

App.stor_get_profiles = () => {
  App.profiles = App.get_local_storage(App.stor_profiles_name, [])
  App.check_profiles()
  App.debug(`Stor: Got profiles`)
}

App.stor_save_profiles = () => {
  App.debug(`Stor: Saving profiles`)
  App.save_local_storage(App.stor_profiles_name, App.profiles)
}

App.stor_get_command_history = () => {
  App.command_history = App.get_local_storage(App.stor_command_history_name, [])
  App.debug(`Stor: Got command_history`)
}

App.stor_save_command_history = () => {
  App.debug(`Stor: Saving command_history`)
  App.save_local_storage(App.stor_command_history_name, App.command_history)
}

App.stor_get_filter_history = () => {
  App.filter_history = App.get_local_storage(App.stor_filter_history_name, [])
  App.debug(`Stor: Got filter_history`)
}

App.stor_save_filter_history = () => {
  App.debug(`Stor: Saving filter_history`)
  App.save_local_storage(App.stor_filter_history_name, App.filter_history)
}

App.stor_get_first_time = () => {
  App.first_time = App.get_local_storage(App.stor_first_time_name, {})
  App.debug(`Stor: Got first_time`)
}

App.stor_save_first_time = () => {
  App.debug(`Stor: Saving first_time`)
  App.save_local_storage(App.stor_first_time_name, App.first_time)
}
App.setup_tabs = () => {
  App.tabs_filter_modes = [
    {type: `pinned`, text:`Pinned`, skip: false, info: `Show pinned tabs`},
    {type: `normal`, text:`Normal`, skip: false, info: `Show normal tabs`},
    {type: `playing`, text:`Playing`, skip: false, info: `Show tabs emitting sound`},
    {type: `loaded`, text:`Loaded`, skip: false, info: `Show tabs that are loaded`},
    {type: `unloaded`, text:`Unloaded`, skip: false, info: `Show unloaded tabs`},
    {type: `duplicate`, text:`Duplicate`, skip: false, info: `Show tabs that have duplicates`},
  ]

  App.debug_tabs = false

  browser.tabs.onCreated.addListener(async (info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Created: ID: ${info.id}`, App.debug_tabs)

    if (info.windowId === App.window_id) {
      await App.refresh_tab(info.id, false, info)
    }
  })

  browser.tabs.onUpdated.addListener(async (id, cinfo, info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Updated: ID: ${id}`, App.debug_tabs)

    if (info.windowId === App.window_id) {
      await App.refresh_tab(id, false, info)
      App.check_playing()
    }
  })

  browser.tabs.onActivated.addListener(async (info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Activated: ID: ${info.tabId}`, App.debug_tabs)

    if (info.windowId === App.window_id) {
      await App.on_tab_activated(info)
      App.check_playing()
    }
  })

  browser.tabs.onRemoved.addListener((id, info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Removed: ID: ${id}`, App.debug_tabs)

    if (info.windowId === App.window_id) {
      App.remove_closed_tab(id)
      App.check_playing()
    }
  })

  browser.tabs.onMoved.addListener((id, info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Moved: ID: ${id}`, App.debug_tabs)

    if (info.windowId === App.window_id) {
      App.move_item(`tabs`, info.fromIndex, info.toIndex)
      App.check_playing()
    }
  })

  browser.tabs.onDetached.addListener((id, info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Detached: ID: ${id}`, App.debug_tabs)

    if (info.oldWindowId === App.window_id) {
      App.remove_closed_tab(id)
      App.check_playing()
    }
  })
}

App.start_sort_tabs = () => {
  if (App.check_ready(`sort_tabs`)) {
    return
  }

  App.create_popup({
    id: `sort_tabs`,
    setup: () => {
      DOM.ev(DOM.el(`#sort_tabs_button`), `click`, () => {
        let sort_pins = DOM.el(`#sort_tabs_pins`).checked
        App.do_sort_tabs(sort_pins)
      })
    },
  })
}

App.pre_show_tabs = () => {
  App.tabs_locked = false
}

App.get_tabs = async () => {
  App.getting(`tabs`)
  let tabs

  try {
    tabs = await browser.tabs.query({currentWindow: true})
  }
  catch (err) {
    App.error(err)
    return
  }

  tabs.sort((a, b) => {
    return a.index < b.index ? -1 : 1
  })

  return tabs
}

App.focus_tab = async (args) => {
  let def_args = {
    method: `normal`,
    show_tabs: false,
    scroll: `center`,
  }

  args = Object.assign(def_args, args)

  if (!args.item) {
    return
  }

  App.select_item({item: args.item, scroll: args.scroll})

  if (args.item.window_id) {
    await browser.windows.update(args.item.window_id, {focused: true})
  }

  try {
    await browser.tabs.update(args.item.id, {active: true})
  }
  catch (err) {
    App.error(err)
    App.remove_closed_tab(args.item.id)
    App.check_playing()
  }

  App.after_focus(args)
}

App.open_new_tab = async (url) => {
  try {
    await browser.tabs.create({url: url, active: true})
  }
  catch (err) {
    App.error(err)
  }
}

App.new_tab = async () => {
  await App.open_new_tab()
  App.after_focus({show_tabs: true})
}

App.get_tab_info = async (id) => {
  try {
    let info = await browser.tabs.get(id)
    return info
  }
  catch (err) {
    App.error(err)
    return
  }
}

App.refresh_tab = async (id, select, info) => {
  if (!info) {
    try {
      info = await App.get_tab_info(id)
    }
    catch (err) {
      App.check_pinline()
      return
    }
  }

  if (!info) {
    return
  }

  if (App.get_setting(`single_new_tab`)) {
    if (App.is_new_tab(info.url)) {
      App.close_other_new_tabs(info.id)
    }
  }

  let item = App.get_item_by_id(`tabs`, id)

  if (item) {
    if (item.pinned !== info.pinned) {
      App.check_pinline()
    }

    App.update_item(`tabs`, item.id, info)
  }
  else {
    item = App.insert_item(`tabs`, info)
    App.check_pinline()
  }

  if (select) {
    if (App.get_selected(`tabs`) !== item) {
      App.select_item({item: item, scroll: `nearest`})
    }
  }
}

App.mute_tab = async (id) => {
  try {
    await browser.tabs.update(id, {muted: true})
  }
  catch (err) {
    App.error(err)
  }
}

App.unmute_tab = async (id) => {
  try {
    await browser.tabs.update(id, {muted: false})
  }
  catch (err) {
    App.error(err)
  }
}

App.get_pinned_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.pinned)
}

App.get_normal_tabs = () => {
  return App.get_items(`tabs`).filter(x => !x.pinned)
}

App.get_muted_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.muted)
}

App.get_unloaded_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.discarded)
}

App.remove_closed_tab = (id) => {
  let item = App.get_item_by_id(`tabs`, id)

  if (item) {
    App.remove_item(item)
    App.check_pinline()
  }
}

App.tabs_action = async (item) => {
  App.on_action(`tabs`)
  App.do_empty_previous_tabs()
  await App.focus_tab({item: item, scroll: `nearest`})
}

App.duplicate_tab = async (item) => {
  try {
    await browser.tabs.duplicate(item.id)
  }
  catch (err) {
    App.error(err)
  }
}

App.duplicate_tabs = (item) => {
  let items = App.get_active_items(`tabs`, item)
  let force = App.check_force(`warn_on_duplicate_tabs`, items)

  App.show_confirm(`Duplicate tabs? (${items.length})`, () => {
    for (let it of items) {
      App.duplicate_tab(it)
    }
  }, undefined, force)
}

App.pin_tab = async (id) => {
  try {
    await browser.tabs.update(id, {pinned: true})
  }
  catch (err) {
    App.error(err)
  }
}

App.unpin_tab = async (id) => {
  try {
    await browser.tabs.update(id, {pinned: false})
  }
  catch (err) {
    App.error(err)
  }
}

App.pin_tabs = (item) => {
  let items = []

  for (let it of App.get_active_items(`tabs`, item)) {
    if (it.pinned || it.discarded) {
      continue
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_pin_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm(`Pin items? (${ids.length})`, async () => {
    for (let id of ids) {
      App.pin_tab(id)
    }
  }, undefined, force)
}

App.unpin_tabs = (item) => {
  let items = []

  for (let it of App.get_active_items(`tabs`, item)) {
    if (!it.pinned || it.discarded) {
      continue
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_unpin_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm(`Unpin items? (${ids.length})`, async () => {
    for (let id of ids) {
      App.unpin_tab(id)
    }
  }, undefined, force)
}

App.unload_tabs = (item, multiple = true) => {
  let items = []
  let active = false

  for (let it of App.get_active_items(`tabs`, item, multiple)) {
    if (it.discarded || App.is_new_tab(it.url)) {
      continue
    }

    if (it.active) {
      active = true
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_unload_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm(`Unload items? (${ids.length})`, async () => {
    if (active) {
      let next

      if (ids.length > 1) {
        next = App.get_next_item(`tabs`, {mode: `tabs`, no_selected: true, no_discarded: true})
      }
      else {
        next = App.get_next_item(`tabs`, {mode: `tabs`, no_discarded: true, item: item})
      }

      if (next) {
        await App.focus_tab({item: next, scroll: `nearest`, method: `unload`})
      }
      else {
        await App.open_new_tab(`about:blank`)
      }
    }

    App.do_unload_tabs(ids)
  }, undefined, force)
}

App.do_unload_tabs = async (ids) => {
  try {
    await browser.tabs.discard(ids)
  }
  catch (err) {
    App.error(err)
  }
}

App.mute_tabs = (item) => {
  let items = []

  for (let it of App.get_active_items(`tabs`, item)) {
    if (!it.muted) {
      items.push(it)
    }
  }

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_mute_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm(`Mute items? (${ids.length})`, async () => {
    for (let id of ids) {
      App.mute_tab(id)
    }
  }, undefined, force)
}

App.unmute_tabs = (item) => {
  let items = []

  for (let it of App.get_active_items(`tabs`, item)) {
    if (it.muted) {
      items.push(it)
    }
  }

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_unmute_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm(`Unmute items? (${ids.length})`, async () => {
    for (let id of ids) {
      App.unmute_tab(id)
    }
  }, undefined, force)
}

App.show_tabs_info = () => {
  let all = App.get_items(`tabs`).length
  let pins = App.get_pinned_tabs().length
  let normal = App.get_normal_tabs().length
  let playing = App.get_playing_tabs().length
  let muted = App.get_muted_tabs().length
  let unloaded = App.get_unloaded_tabs().length

  let s = ``
  s += `All: ${all}\n`
  s += `Pins: ${pins}\n`
  s += `Normal: ${normal}\n`
  s += `Playing: ${playing}\n`
  s += `Muted: ${muted}\n`
  s += `Unloaded: ${unloaded}`

  App.alert(s)
}

App.show_tab_urls = () => {
  let urls = []

  for (let item of App.get_items(`tabs`)) {
    urls.push(item.url)
  }

  urls = App.to_set(urls)
  let s = urls.join(`\n`)
  App.show_textarea(`All Open Tabs (${urls.length})`, s)
}

App.toggle_pin = (item) => {
  if (item.pinned) {
    App.unpin_tab(item.id)
  }
  else {
    App.pin_tab(item.id)
  }
}

App.toggle_pin_tabs = (item) => {
  let ids = []
  let action

  for (let it of App.get_active_items(`tabs`, item)) {
    if (!action) {
      if (it.pinned) {
        action = `unpin`
      }
      else {
        action = `pin`
      }
    }

    if (action === `pin`) {
      if (it.pinned) {
        continue
      }
    }
    else if (action === `unpin`) {
      if (!it.pinned) {
        continue
      }
    }

    ids.push(it.id)
  }

  if (!ids.length) {
    return
  }

  for (let id of ids) {
    if (action === `pin`) {
      App.pin_tab(id)
    }
    else {
      App.unpin_tab(id)
    }
  }
}

App.toggle_mute_tabs = (item) => {
  let ids = []
  let action

  for (let it of App.get_active_items(`tabs`, item)) {
    if (!action) {
      if (it.muted) {
        action = `unmute`
      }
      else {
        action = `mute`
      }
    }

    if (action === `mute`) {
      if (it.muted) {
        continue
      }
    }
    else if (action === `unmute`) {
      if (!it.muted) {
        continue
      }
    }

    ids.push(it.id)
  }

  if (!ids.length) {
    return
  }

  for (let id of ids) {
    if (action === `mute`) {
      App.mute_tab(id)
    }
    else {
      App.unmute_tab(id)
    }
  }
}

App.open_tab = async (item) => {
  try {
    let tab = await browser.tabs.create({url: item.url})
    return tab
  }
  catch (err) {
    App.error(err)
  }
}

App.update_tabs_index = async (items) => {
  let info = await App.get_tab_info(items[0].id)

  if (!info) {
    return
  }

  let first_index = App.get_item_element_index(`tabs`, items[0].element)
  let direction

  if (first_index < info.index) {
    direction = `up`
  }
  else if (first_index > info.index) {
    direction = `down`
  }
  else {
    return
  }

  if (direction === `down`) {
    items = items.slice(0).reverse()
  }

  for (let item of items) {
    let index = App.get_item_element_index(`tabs`, item.element)
    await App.do_move_tab_index(item.id, index)
  }
}

App.do_move_tab_index = async (id, index) => {
  let ans

  try {
    ans = await browser.tabs.move(id, {index: index})
  }
  catch (err) {
    App.error(err)
  }

  return ans
}

App.on_tab_activated = async (info) => {
  let current, new_active

  for (let item of App.get_items(`tabs`)) {
    if (item.active) {
      current = item
    }

    item.active = item.id === info.tabId

    if (item.active) {
      new_active = item
    }
  }

  let select = true

  if (App.is_filtered(`tabs`)) {
    select = false
  }

  await App.refresh_tab(info.tabId, select)
  App.update_active_history(current, new_active)
}

App.move_tabs = async (item, window_id) => {
  for (let it of App.get_active_items(`tabs`, item)) {
    let index = it.pinned ? 0 : -1

    try {
      await browser.tabs.move(it.id, {index: index, windowId: window_id})
    }
    catch (err) {
      App.error(err)
    }
  }
}

App.detach_tab = async (item) => {
  try {
    await browser.windows.create({tabId: item.id, focused: false})
  }
  catch (err) {
    App.error(err)
  }
}

App.detach_tabs = async (item) => {
  if (App.get_active_items(`tabs`, item).length === 1) {
    await App.detach_tab(item)
  }
  else {
    let info = await browser.windows.create({focused: false})

    setTimeout(() => {
      App.move_tabs(item, info.id)
    }, 250)
  }
}

App.get_active_tab = async () => {
  try {
    let tabs = await browser.tabs.query({active: true, currentWindow: true})
    return tabs[0]
  }
  catch (err) {
    App.error(err)
  }
}

App.get_active_tab_item = () => {
  for (let item of App.get_items(`tabs`)) {
    if (item.active) {
      return item
    }
  }
}

App.focus_current_tab = async (scroll = `nearest`) => {
  let item = await App.get_active_tab_item()

  if (item) {
    App.select_item({item: item, scroll: scroll})
  }
}

App.move_tabs_vertically = (direction, item) => {
  if (!item) {
    item = App.get_selected(`tabs`)
  }

  if (!item) {
    return
  }

  let items = App.get_active_items(item.mode, item)

  if (items[0].pinned) {
    for (let item of items) {
      if (!item.pinned) {
        return
      }
    }
  }
  else {
    for (let item of items) {
      if (item.pinned) {
        return
      }
    }
  }

  let first, last
  let els = items.map(x => x.element)

  if (direction === `top`) {
    if (item.pinned) {
      first = 0
    }
    else {
      first = App.get_first_normal_index()
    }

    App.get_items(`tabs`)[first].element.before(...els)
  }
  else if (direction === `bottom`) {
    if (item.pinned) {
      last = App.get_last_pin_index()
    }
    else {
      last = App.get_items(`tabs`).length - 1
    }

    App.get_items(`tabs`)[last].element.after(...els)
  }

  App.update_tabs_index(items)
}

App.get_first_normal_index = () => {
  let i = -1

  for (let item of App.get_items(`tabs`)) {
    i += 1

    if (!item.pinned) {
      return i
    }
  }

  return i
}

App.get_last_pin_index = () => {
  let i = -1

  for (let item of App.get_items(`tabs`)) {

    if (item.pinned) {
      i += 1
    }
    else {
      return i
    }
  }

  return i
}

App.browser_reload = (id) => {
  if (id !== undefined) {
    browser.tabs.reload(id)
  }
  else {
    browser.tabs.reload()
  }
}

App.browser_back = () => {
  browser.tabs.goBack()
}

App.browser_forward = () => {
  browser.tabs.goForward()
}

App.check_tab_item = (item) => {
  if (item.mode === `tabs`) {
    App.check_tab_pinned(item)
  }
}

App.check_tab_pinned = (item) => {
  if (App.get_setting(`pin_icon`)) {
    if (item.pinned) {
      item.element.classList.add(`pin_item`)
    }
    else {
      item.element.classList.remove(`pin_item`)
    }
  }

  if (App.get_setting(`normal_icon`)) {
    if (item.pinned) {
      item.element.classList.remove(`normal_item`)
    }
    else {
      item.element.classList.add(`normal_item`)
    }
  }
}

App.check_new_tabs = () => {
  if (!App.get_setting(`single_new_tab`)) {
    return
  }

  let items = App.get_items(`tabs`)
  let first = false
  let ids = []

  for (let item of items) {
    if (App.is_new_tab(item.url)) {
      if (first) {
        ids.push(item.id)
      }
      else {
        first = true
      }
    }
  }

  if (ids.length) {
    App.close_tab_or_tabs(ids)
  }
}

App.divide_tabs = (filter) => {
  let pinned = []
  let normal = []
  let pinned_f = []
  let normal_f = []

  for (let item of App.get_items(`tabs`)) {
    if (item.pinned) {
      pinned.push(item)
    }
    else {
      normal.push(item)
    }
  }

  if (filter) {
    pinned_f = pinned.filter(x => x[filter])
    normal_f = normal.filter(x => x[filter])
  }

  return {
    pinned: pinned,
    normal: normal,
    pinned_f: pinned_f,
    normal_f: normal_f,
  }
}

App.select_tabs = (type = `pins`) => {
  let first

  for (let item of App.get_items(`tabs`)) {
    let valid

    if (type === `pins`) {
      valid = item.pinned
    }
    else if (type === `normal`) {
      valid = !item.pinned
    }

    if (item.visible && valid) {
      if (!first) {
        first = item
      }

      if (!item.selected) {
        App.toggle_selected(item, true, false)
      }
    }
    else {
      if (item.selected) {
        App.toggle_selected(item, false, false)
      }
    }
  }

  if (first) {
    App.set_selected(first)
  }
}

App.is_new_tab = (url) => {
  return App.new_tab_urls.includes(url)
}

App.sort_tabs = () => {
  App.start_sort_tabs()
  App.show_popup(`sort_tabs`)
  DOM.el(`#sort_tabs_pins`).checked = false
  DOM.el(`#sort_tabs_reverse`).checked = false
}

App.do_sort_tabs = () => {
  function sort (list, reverse) {
    list.sort((a, b) => {
      if (a.hostname !== b.hostname) {
        if (reverse) {
          return a.hostname < b.hostname ? 1 : -1
        }
        else {
          return a.hostname > b.hostname ? 1 : -1
        }
      }

      return a.title < b.title ? -1 : 1
    })
  }

  App.show_confirm(`Sort tabs?`, async () => {
    let items = App.get_items(`tabs`).slice(0)

    if (!items.length) {
      return
    }

    let include_pins = DOM.el(`#sort_tabs_pins`).checked
    let reverse = DOM.el(`#sort_tabs_reverse`).checked
    let normal = items.filter(x => !x.pinned)
    let pins = items.filter(x => x.pinned)
    sort(normal, reverse)

    if (include_pins) {
      sort(pins, reverse)
    }

    let all = [...pins, ...normal]
    App.tabs_locked = true

    for (let [i, item] of all.entries()) {
      await App.do_move_tab_index(item.id, i)
    }

    App.tabs_locked = false
    App.hide_all_popups()
    App.clear_all_items()
    await App.do_show_mode({mode: `tabs`})
  })
}

App.open_tab_urls = () => {
  App.show_input(`Open URLs`, `Open`, (text) => {
    let urls = text.split(`\n`).map(x => x.trim()).filter(x => x !== ``)
    let to_open = []

    if (urls.length) {
      for (let url of urls) {
        if (App.is_url(url)) {
          if (App.get_item_by_url(`tabs`, url)) {
            continue
          }

          to_open.push(url)
        }
      }
    }

    if (to_open.length) {
      App.show_confirm(`Open URLs? (${to_open.length})`, () => {
        for (let url of to_open) {
          App.open_tab({url: url})
        }
      })
    }

    return true
  })
}

App.load_tabs = (item) => {
  let items = []

  for (let it of App.get_active_items(`tabs`, item)) {
    if (!it.discarded) {
      continue
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_load_tabs`, items)

  App.show_confirm(`Load items? (${items.length})`, async () => {
    for (let it of items) {
      App.focus_tab({item: it, scroll: `none`, method: `load`})
    }
  }, undefined, force)
}

App.update_active_history = (current, new_active) => {
  if (current === new_active) {
    return
  }

  if (!App.active_history.length) {
    App.active_history.push(current)
  }

  App.active_history.unshift(new_active)
  App.active_history = [...new Set(App.active_history)]
  App.active_history = App.active_history.slice(0, App.get_setting(`max_active_history`))

  if (App.get_setting(`active_trace`)) {
    App.update_active_trace(new_active)
  }

  if (App.get_setting(`tab_box`) !== `none`) {
    App.update_tab_box(new_active)
  }
}
App.show_textarea = (message, text) => {
  App.start_popups()
  let textarea = DOM.el(`#textarea_text`)
  DOM.el(`#textarea_message`).textContent = message
  textarea.value = text
  App.show_popup(`textarea`)

  requestAnimationFrame(() => {
    App.focus_textarea(textarea)
  })
}

App.textarea_copy = () => {
  App.hide_popup(`textarea`)
  App.copy_to_clipboard(DOM.el(`#textarea_text`).value.trim())
}

App.focus_textarea = (el) => {
  el.focus()
  el.selectionStart = 0
  el.selectionEnd = 0
  App.scroll_to_top(el)
}
App.apply_theme = (args) => {
  App.debug(`Apply Theme`)

  let def_args = {
    safe_mode: false,
  }

  args = Object.assign(def_args, args)

  try {
    if (!args.background_color) {
      args.background_color = App.get_setting(`background_color`)
    }

    if (!args.text_color) {
      args.text_color = App.get_setting(`text_color`)
    }

    if (!args.background_image) {
      args.background_image = App.get_setting(`background_image`)
    }

    if (!args.background_effect) {
      args.background_effect = App.get_setting(`background_effect`)
    }

    if (!args.background_tiles) {
      args.background_tiles = App.get_setting(`background_tiles`)
    }

    App.set_css_var(`background_color`, args.background_color)
    App.set_css_var(`text_color`, args.text_color)
    let main_background = App.colorlib.rgb_to_rgba(args.background_color, 0.93)
    App.set_css_var(`main_background`, main_background)
    let alt_color_0 = App.colorlib.rgb_to_rgba(args.text_color, 0.15)
    App.set_css_var(`alt_color_0`, alt_color_0)
    let alt_color_1 = App.colorlib.rgb_to_rgba(args.text_color, 0.20)
    App.set_css_var(`alt_color_1`, alt_color_1)
    let alt_color_2 = App.colorlib.rgb_to_rgba(args.text_color, 0.50)
    App.set_css_var(`alt_color_2`, alt_color_2)
    let alt_background = App.colorlib.rgb_to_rgba(args.background_color, 0.66)
    App.set_css_var(`alt_background`, alt_background)
    let alt_background_2 = App.colorlib.get_lighter_or_darker(args.background_color, 0.06)
    App.set_css_var(`alt_background_2`, alt_background_2)

    if (args.safe_mode) {
      return
    }

    for (let color of App.colors) {
      let rgb = App.get_setting(`color_${color}`)
      App.set_css_var(`color_${color}`, rgb)
    }

    App.set_css_var(`font_size`, App.get_setting(`font_size`) + `px`)
    App.set_css_var(`font`, `${App.get_setting(`font`)}, sans-serif`)
    let w = `${(App.get_setting(`width`) / 100) * 800}px`
    App.set_css_var(`width`, w)
    let h = `${(App.get_setting(`height`) / 100) * 600}px`
    App.set_css_var(`height`, h)
    let item_padding = 0.42
    let height_diff = 0.15
    let item_height = App.get_setting(`item_height`)

    if (item_height === `tiny`) {
      item_padding -= (height_diff * 2)
    }
    else if (item_height === `small`) {
      item_padding -= height_diff
    }
    else if (item_height === `big`) {
      item_padding += height_diff
    }
    else if (item_height === `huge`) {
      item_padding += (height_diff * 2)
    }

    App.set_css_var(`item_padding`, `${item_padding}rem`)

    if (App.get_setting(`show_scrollbars`)) {
      document.body.classList.remove(`no_scrollbars`)
    }
    else {
      document.body.classList.add(`no_scrollbars`)
    }

    let main = DOM.el(`#main`)

    if (App.get_setting(`show_footer`)) {
      main.classList.remove(`hide_footer`)
    }
    else {
      main.classList.add(`hide_footer`)
    }

    if (App.get_setting(`show_scroller`)) {
      main.classList.remove(`hide_scroller`)
    }
    else {
      main.classList.add(`hide_scroller`)
    }

    let borders_opts = [`normal`, `big`, `huge`]

    for (let b of borders_opts) {
      main.classList.remove(`borders_${b}`)
    }

    let borders = App.get_setting(`item_border`)

    if (borders_opts.includes(borders)) {
      main.classList.add(`borders_${borders}`)
    }

    App.set_background(args.background_image)
    App.apply_background_effects(args.background_effect, args.background_tiles)

    if (App.get_setting(`rounded_corners`)) {
      App.set_css_var(`border_radius`, `3px`)
      App.set_css_var(`border_radius_2`, `20px`)
    }
    else {
      App.set_css_var(`border_radius`, `0`)
      App.set_css_var(`border_radius_2`, `0`)
    }

    for (let eff of App.effects) {
      main.classList.remove(`hover_effect_${eff.value}`)
    }

    let hover_effect = App.get_setting(`hover_effect`)
    main.classList.add(`hover_effect_${hover_effect}`)

    for (let eff of App.effects) {
      main.classList.remove(`selected_effect_${eff.value}`)
    }

    let selected_effect = App.get_setting(`selected_effect`)
    main.classList.add(`selected_effect_${selected_effect}`)

    if (App.get_setting(`wrap_text`)) {
      main.classList.remove(`no_wrap`)
    }
    else {
      main.classList.add(`no_wrap`)
    }

    if (App.get_setting(`icon_pick`)) {
      main.classList.add(`icon_pick`)
    }
    else {
      main.classList.remove(`icon_pick`)
    }

    let item_icon = App.get_setting(`item_icon`)
    let icon_size = 1.11
    let icon_size_diff = 0.181

    if (item_icon === `tiny`) {
      icon_size -= (icon_size_diff * 2)
    }
    else if (item_icon === `small`) {
      icon_size -= icon_size_diff
    }
    else if (item_icon === `big`) {
      icon_size += icon_size_diff
    }
    else if (item_icon === `huge`) {
      icon_size += (icon_size_diff * 2)
    }

    App.set_css_var(`icon_size`, `${icon_size}rem`)

    let tbh = App.get_setting(`tab_box`)
    let tbh_rem = 11.11
    let tbh_diff = 3.33
    let tbh_display = `flex`

    if (tbh === `none`) {
      tbh_display = `none`
    }
    else if (tbh === `tiny`) {
      tbh_rem -= (tbh_diff * 2)
    }
    else if (tbh === `small`) {
      tbh_rem -= tbh_diff
    }
    else if (tbh === `big`) {
      tbh_rem += (tbh_diff * 2)
    }
    else if (tbh === `huge`) {
      tbh_rem += (tbh_diff * 4)
    }

    App.set_css_var(`tab_box_display`, tbh_display)
    App.set_css_var(`tab_box_height`, `${tbh_rem}rem`)
  }
  catch (err) {
    App.error(err)
    App.theme_safe_mode()
  }
}

App.theme_safe_mode = () => {
  App.apply_theme({
    background_color: `rgb(33, 33, 33)`,
    text_color: `rgb(222, 222, 222)`,
    safe_mode: true,
  })

  if (!App.theme_safe_mode_msg) {
    App.alert(`Theme settings are invalid. Using safe mode`)
    App.theme_safe_mode_msg = true
  }
}

App.set_css_var = (name, value) => {
  document.documentElement.style.setProperty(`--${name}`, value)
}

App.get_css_var = (name) => {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`)
}

App.set_dark_colors = () => {
  App.set_colors(App.dark_colors.background, App.dark_colors.text)
}

App.set_light_colors = () => {
  App.set_colors(App.light_colors.background, App.light_colors.text)
}

App.set_colors = (c1, c2) => {
  App.set_setting(`background_color`, c1, false)
  App.set_setting(`text_color`, c2, false)
  App.apply_theme()
  App.check_theme_refresh()
}

App.change_background = (url, bg_eff, bg_tiles) => {
  App.set_setting(`background_image`, url, false)

  if (bg_eff) {
    App.set_setting(`background_effect`, bg_eff, false)
  }

  if (bg_tiles) {
    App.set_setting(`background_tiles`, bg_tiles, false)
  }

  App.apply_theme()
  App.check_theme_refresh()
}

App.check_theme_refresh = () => {
  if (App.on_settings()) {
    if (App.settings_category === `theme`) {
      App.background_color.setColor(App.get_setting(`background_color`), true)
      App.text_color.setColor(App.get_setting(`text_color`), true)
      DOM.el(`#settings_background_image`).value = App.get_setting(`background_image`)
      App.set_settings_menu(`background_effect`, undefined, false)
      App.set_settings_menu(`background_tiles`, undefined, false)
    }
  }
}

App.random_colors = (type = `dark`) => {
  if (type === `dark`) {
    App.random_color(`background`, `dark`)
    App.random_color(`text`, `light`)
  }
  else {
    App.random_color(`background`, `light`)
    App.random_color(`text`, `dark`)
  }
}

App.random_color = (what, type) => {
  let color

  if (type === `dark`) {
    color = App.colorlib.get_dark_color()
  }
  else if (type === `light`) {
    color = App.colorlib.get_light_color()
  }

  color = App.colorlib.hex_to_rgb(color)
  App.set_setting(`${what}_color`, color)
  App.check_theme_refresh()
}

App.set_background = (url) => {
  function unset () {
    App.set_css_var(`background_image`, `unset`)
  }

  if (!url) {
    unset()
    return
  }

  if (url.toLowerCase().startsWith(`background`)) {
    let match = url.match(/\d+/)

    if (!match) {
      unset()
      return
    }

    let num = parseInt(match[0])

    if (num > App.num_backgrounds) {
      unset()
      return
    }

    url = App.background_path(num)
  }
  else if (!App.is_url(url)) {
    unset()
    return
  }

  App.set_css_var(`background_image`, `url(${url})`)
}

App.apply_background_effects = (effect, tiles) => {
  let bg = DOM.el(`#background`)

  function bg_add (cls) {
    bg.classList.add(cls)
  }

  function bg_rem (cls) {
    bg.classList.remove(cls)
  }

  let effects = App.background_effects.map(x => x.value)

  for (let eff of effects) {
    bg_rem(eff)
  }

  if (effects.includes(effect)) {
    bg_add(effect)
  }

  if (tiles !== `none`) {
    bg.style.backgroundSize = `${tiles} auto`
    bg_add(`tiles`)
  }
  else {
    bg.style.backgroundSize = `cover`
    bg_rem(`tiles`)
  }
}
App.update_active_trace = (new_active) => {
  for (let it of App.get_items(`tabs`)) {
    it.element.classList.remove(`show_trace`)
  }

  let n = 1

  for (let item of App.active_history) {
    if (item === new_active) {
      continue
    }

    item.element.classList.add(`show_trace`)
    let trace = DOM.el(`.item_trace`, item.element)
    trace.textContent = n

    if (n === 9) {
      break
    }

    n += 1
  }
}
App.create_debouncer = (func, delay) => {
  if (typeof func !== `function`) {
    App.error(`Invalid debouncer function`)
    return
  }

  if (!delay) {
    App.error(`Invalid debouncer delay`)
    return
  }

  let timer
  let obj = {}

  function clear () {
    clearTimeout(timer)
  }

  function run (...args) {
    func(...args)
  }

  obj.call = (...args) => {
    clear()

    timer = setTimeout(() => {
      run(...args)
    }, delay)
  }

  obj.now = (...args) => {
    clear()
    run(...args)
  }

  obj.cancel = () => {
    clear()
  }

  return obj
}

App.remove_protocol = (url) => {
  return url.replace(/^https?:\/\//, ``)
}

App.copy_to_clipboard = (text, what = `Text`) => {
  navigator.clipboard.writeText(text)
  App.alert_autohide(`${what} copied to clipboard`)
}

App.plural = (n, singular, plural) => {
  if (n === 1) {
    return singular
  }
  else {
    return plural
  }
}

App.get_hostname = (url) => {
  let url_obj

  try {
    url_obj = new URL(url)
  }
  catch (err) {
    return ``
  }

  return url_obj.hostname
}

App.get_protocol = (url) => {
  let url_obj

  try {
    url_obj = new URL(url)
  }
  catch (err) {
    return ``
  }

  return url_obj.protocol
}

App.urls_equal = (u1, u2) => {
  return App.remove_slashes_end(u1) === App.remove_slashes_end(u2)
}

App.remove_slashes_end = (s) => {
  return s.replace(/\/+$/g, ``)
}

App.remove_hash = (url) => {
  return url.split(`#`)[0]
}

App.format_url = (url) => {
  return App.remove_slashes_end(App.remove_hash(url))
}

App.capitalize = (s) => {
  let w = s.charAt(0).toUpperCase() + s.slice(1)
  let lower = w.toLowerCase()

  if (lower === `url`) {
    w = `URL`
  }

  return w
}

App.capitalize_words = (s) => {
  let words = s.split(` `)

  let capitalized = words.map(word => {
    return App.capitalize(word)
  })

  return capitalized.join(` `)
}

App.nice_date = (date = App.now(), seconds = false) => {
  let s = ``

  if (seconds) {
    s = `:ss`
  }

  return dateFormat(date, `dd/mmm/yy | h:MM${s} tt`)
}

App.is_url = (s) => {
  return s.startsWith(`http://`) || s.startsWith(`https://`)
}

App.get_extension = (s) => {
  if (App.is_url(s)) {
    let u = new URL(s)
    let url = u.origin + u.pathname
    let url_2 = url.split(`//`).slice(1).join(`//`)
    let matches = url_2.match(/\/.*\.(\w+)(?=$|[#?])/)

    if (matches) {
      return matches[1]
    }
  }
  else {
    let matches = s.match(/\.(\w+)(?=$|[#?])/)

    if (matches) {
      return matches[1]
    }
  }

  return ``
}

App.get_template = (id) => {
  let template = DOM.el(`#template_${id}`)

  if (template) {
    return template.innerHTML.trim()
  }
}

App.log = (message, mode = `normal`, date = false) => {
  if (date) {
    let d = App.nice_date(undefined, true)
    message = `${message} - ${d}`
  }

  if (mode === `error`) {
    console.error(`🔴 ${message}`)
  }
  else if (mode === `normal`) {
    console.info(`🟢 ${message}`)
  }
  else if (mode === `debug`) {
    if (App.settings_done && !App.get_setting(`debug_mode`)) {
      return
    }

    console.info(`🔵 ${message}`)
  }
  else if (mode === `debug_force`) {
    console.info(`🔵 ${message}`)
  }
  else if (mode === `green`) {
    console.info(`%c${message}`, `color: lightgreen;`)
  }
  else {
    console.info(message)
  }
}

App.debug = (message, force = false) => {
  let s = force ? `debug_force` : `debug`
  App.log(message, s, true)
}

App.error = (message) => {
  App.log(message, `error`, true)
}

App.find_duplicates = (objects, property) => {
  let frequency_map = objects.reduce((map, obj) => {
    map[obj[property]] = (map[obj[property]] || 0) + 1
    return map
  }, {})

  return objects.filter(obj => frequency_map[obj[property]] > 1)
}

App.get_excess = (objects, property) => {
  let items = {}
  let excess = []

  for (let obj of objects) {
    if (items[obj[property]]) {
      excess.push(obj)
    }
    else {
      items[obj[property]] = obj
    }
  }

  return excess
}

App.text_with_value_focused = () => {
  let el = document.activeElement

  if (el.classList.contains(`text`)) {
    if (el.value.trim()) {
      return true
    }
  }

  return false
}

App.no_space = (s) => {
  return s.replace(/\s+/g, ``)
}

App.single_space = (s) => {
  return s.replace(/\s+/g, ` `)
}

App.remove_special = (s) => {
  return s.replace(/[\'\"\-\!\?\@\#\$\%\^\&\*\+\<\>\[\]\(\)\|\_]/g, ``)
}

App.wheel_direction = (e) => {
  if (e.deltaY > 0) {
    return `down`
  }
  else {
    return `up`
  }
}

App.one_linebreak = (s) => {
  return s.replace(/(\n\s*){2,}/g, `\n`).replace(/ +/g, ` `).trim()
}

App.single_linebreak = (s) => {
  return s.replace(/(\n\s*){2,}/g, `\n\n`).replace(/ +/g, ` `).trim()
}

App.double_linebreak = (s) => {
  return s.replace(/(\n\s*){3,}/g, `\n\n`).replace(/ +/g, ` `).trim()
}

App.contains_number = (str) => {
  return /\d/.test(str)
}

App.escape_regex = (s) => {
  return s.replace(/[^A-Za-z0-9|]/g, `\\$&`)
}

App.hostname_full = (item) => {
  return `${item.protocol}//${item.hostname}`
}

App.text_with_empty_lines = () => {
  if (document.activeElement.tagName === `TEXTAREA`) {
    return /\s*\n{1,}$/.test(document.activeElement.value)
  }

  return true
}

App.make_html_safe = (s) => {
  return s.replace(/\</g, `&lt;`).replace(/\>/g, `&gt;`)
}

App.is_object = (o) => {
  if (typeof o === `object` && !Array.isArray(o) && o !== null) {
    return true
  }

  return false
}

App.is_array = (a) => {
  return Array.isArray(a)
}

App.random_int = (min, max, exclude = undefined, random_function) => {
  let num

  if (random_function) {
    num = Math.floor(random_function() * (max - min + 1) + min)
  }
  else {
    num = Math.floor(Math.random() * (max - min + 1) + min)
  }

  if (exclude) {
    if (num === exclude) {
      if (num + 1 <= max) {
        num = num + 1
      }
      else if (num - 1 >= min) {
        num = num - 1
      }
    }
  }

  return num
}

App.parse_delay = (s) => {
  let delay
  let split = s.split(`_`)

  if (split[1] === `seconds`) {
    delay = split[0] * 1000
  }
  else if (split[1] === `minutes`) {
    delay = split[0] * 1000 * 60
  }
  else if (split[1] === `hours`) {
    delay = split[0] * 1000 * 60 * 60
  }

  return delay
}

App.scroll_to_bottom = (el) => {
  el.scrollTop = el.scrollHeight
  el.scrollLeft = 0
}

App.scroll_to_top = (el) => {
  el.scrollTop = 0
  el.scrollLeft = 0
}

App.scroll_to_right = (el) => {
  el.scrollLeft = el.scrollWidth
}

App.to_set = (array) => {
  return [...new Set(array)]
}

App.MINUTE = 60000
App.HOUR = 3600000
App.DAY = 86400000
App.YEAR = 31536000000

App.timeago = (date) => {
  let diff = App.now() - date
  let s

  if (diff < App.MINUTE) {
    s = `just now`
  }
  else if (diff < App.HOUR) {
    let n = Math.floor(diff / 60 / 1000)

    if (n === 1) {
      s = `${n} min ago`
    }
    else {
      s = `${n} mins ago`
    }
  }
  else if (diff >= App.HOUR && diff < App.DAY) {
    let n = Math.floor(diff / 60 / 60 / 1000)

    if (n === 1) {
      s = `${n} hr ago`
    }
    else {
      s = `${n} hrs ago`
    }
  }
  else if (diff >= App.DAY && diff < App.YEAR) {
    let n = Math.floor(diff / 24 / 60 / 60 / 1000)

    if (n === 1) {
      s = `${n} day ago`
    }
    else {
      s = `${n} days ago`
    }
  }
  else if (diff >= App.YEAR) {
    let n = Math.floor(diff / 365 / 24 / 60 / 60 / 1000)

    if (n === 1) {
      s = `${n} year ago`
    }
    else {
      s = `${n} years ago`
    }
  }

  return s
}

App.obj = (str) => {
  return JSON.parse(str)
}

App.str = (obj, format = false) => {
  if (format) {
    return JSON.stringify(obj, null, 2)
  }
  else {
    return JSON.stringify(obj)
  }
}

App.remove_extension = (s) => {
  return s.split(`.`).slice(0, -1).join(`.`)
}

App.now = () => {
  return Date.now()
}

App.clone = (obj) => {
  return structuredClone(obj)
}

App.sep = (items) => {
  items.push({separator: true})
}
App.create_window = (args) => {
  if (args.close_button === undefined) {
    args.close_button = true
  }

  if (args.align_top === undefined) {
    args.align_top = `center`
  }

  if (args.show_top === undefined) {
    args.show_top = true
  }

  if (args.cls === undefined) {
    args.cls = `normal`
  }

  if (args.persistent === undefined) {
    args.persistent = true
  }

  let w = {}
  let el = DOM.create(`div`, `window_main window_main_${args.cls}`, `window_${args.id}`)
  let top, top_html

  if (args.show_top) {
    let extra_cls = ``

    if (args.colored_top) {
      extra_cls = ` colored_top`
    }

    top = DOM.create(`div`, `window_top window_top_${args.align_top} window_top_${args.cls}${extra_cls}`, `window_top_${args.id}`)
    top_html = App.get_template(`${args.id}_top`)

    if (top_html) {
      top.innerHTML = top_html
    }

    el.append(top)
  }

  let content = DOM.create(`div`, `window_content window_content_${args.cls}`, `window_content_${args.id}`)
  let content_html

  if (args.element) {
    content.append(args.element.cloneNode(true))
  }
  else {
    let content_html = App.get_template(args.id)

    if (content_html) {
      content.innerHTML = content_html
    }
  }

  el.append(content)
  w.element = el
  DOM.el(`#main`).append(el)
  w.setup = false
  w.visible = false

  w.check_setup = () => {
    if (args.setup) {
      if (!args.persistent || !w.setup) {
        args.setup()
        w.setup = true
        App.debug(`Setup Window: ${args.id}`)
      }
    }
  }

  w.show = (scroll = true) => {
    if (!args.persistent) {
      if (args.element) {
        content.innerHTML = ``
        content.append(args.element.cloneNode(true))
      }
      else {
        content.innerHTML = content_html
      }

      if (top_html) {
        top.innerHTML = top_html
      }
    }

    w.check_setup()
    App.hide_all_windows()
    w.element.style.display = `flex`

    if (App.window_mode !== args.id) {
      App.last_window_mode = App.window_mode
      App.window_mode = args.id
    }

    if (scroll) {
      content.scrollTop = 0
    }

    if (args.after_show) {
      args.after_show()
    }
  }

  w.hide = (bypass = false) => {
    if (!bypass && args.on_hide) {
      args.on_hide(args.id)
    }
    else {
      App.show_last_window()

      if (args.after_hide) {
        args.after_hide(args.id)
      }
    }
  }

  App.windows[args.id] = w
}

App.hide_all_windows = () => {
  for (let id in App.windows) {
    App.windows[id].element.style.display = `none`
  }
}

App.show_window = (mode) => {
  App.debug(`Show Window: ${mode}`)

  if (App.on_items(mode)) {
    App.do_show_mode({mode: mode})
  }
  else {
    App.windows[mode].show()
  }
}

App.show_last_window = () => {
  App.raise_window(App.last_window_mode)
}

App.raise_window = (mode) => {
  App.windows[mode].show(false)
}

App.setup_window = () => {
  DOM.ev(document.documentElement, `mouseleave`, () => {
    if (App.dragging) {
      return
    }

    if (App.get_setting(`auto_restore`) !== `never`) {
      App.start_auto_restore()
    }
  })

  DOM.ev(document.documentElement, `mouseenter`, () => {
    if (App.get_setting(`auto_restore`) !== `never`) {
      App.clear_restore()
    }
  })
}

App.window_goto_top = (mode) => {
  DOM.el(`#window_content_${mode}`).scrollTop = 0
}

App.window_goto_bottom = (mode) => {
  let el = DOM.el(`#window_content_${mode}`)
  el.scrollTop = el.scrollHeight
}

App.hide_window = (bypass = false) => {
  if (App.on_items()) {
    return
  }

  App.windows[App.window_mode].hide(bypass)
}

App.make_window_visible = () => {
  DOM.el(`#all`).classList.remove(`hidden`)
}

App.close_window = () => {
  window.close()
}

App.get_window_menu_items = async (item) => {
  let items = []
  let wins = await browser.windows.getAll({populate: false})

  items.push({
    text: `Detach`,
    action: () => {
      App.detach_tabs(item)
    }
  })

  for (let win of wins) {
    if (item.window_id === win.id) {
      continue
    }

    let s = `${win.title.substring(0, 25).trim()} (ID: ${win.id})`
    let text = `Move to: ${s}`

    items.push({
      text: text,
      action: () => {
        App.move_tabs(item, win.id)
      }
    })
  }

  return items
}

App.to_window = async (item) => {
  let items = await App.get_window_menu_items(item)
  NeedContext.show_on_center(items)
}