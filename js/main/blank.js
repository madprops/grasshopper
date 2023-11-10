App.open_blank_tab = (args = {}) => {
  let url = {
    url: App.blank_url
  }

  let obj = Object.assign({}, url, args)
  browser.tabs.create(obj)
}

App.start_blank = (item) => {
  let word_1 = App.capitalize(App.random_word(4))
  let word_2 = App.capitalize(App.random_word(4))
  let title = `${word_1} ${word_2}`

  if (App.apply_edit(`title`, item, title)) {
    App.custom_save(item.id, `custom_title`, title)
  }

  let icon = App.get_setting(`blank_icon`)

  if (icon) {
    if (App.apply_edit(`icon`, item, icon)) {
      App.custom_save(item.id, `custom_icon`, icon)
    }
  }
  else {
    let color = App.random_choice(App.colors)

    if (App.apply_edit(`color`, item, color)) {
      App.custom_save(item.id, `custom_color`, color)
    }
  }
}

App.insert_blank = (item) => {
  let active = App.get_active_items({mode: item.mode, item: item})
  let first = active.at(0)
  let index = App.get_item_element_index(first.mode, first.element)
  App.open_blank_tab({index: index, pinned: item.pinned})

  if (active.length > 1) {
    for (let it of active.slice(1, -1)) {
      if (App.apply_edit(`split_top`, it, false)) {
        App.custom_save(it.id, `custom_split_top`, false)
      }

      if (App.apply_edit(`split_bottom`, it, false)) {
        App.custom_save(it.id, `custom_split_bottom`, false)
      }
    }

    let bottom = active.at(-1)

    if (App.apply_edit(`split_bottom`, bottom, true)) {
      App.custom_save(bottom.id, `custom_split_bottom`, true)
    }
  }
}

App.on_blank_click = async (item) => {
  let waypoint = false
  let select = false
  let selected = []
  let items = App.get_items(item.mode)

  for (let [i, it] of items.entries()) {
    if (waypoint) {
      if (it.blank) {
        select = true
        break
      }
      else if (item.pinned && !it.pinned) {
        select = true
        break
      }
      else if (App.get_split(it, `top`)) {
        select = true
        break
      }
      else if (App.get_split(it, `bottom`)) {
        selected.push(it)
        select = true
        break
      }
      else {
        selected.push(it)
      }

      if (i === (items.length - 1)) {
        select = true
      }
    }

    if (it === item) {
      selected.push(it)
      waypoint = true
      continue
    }
  }

  if (select) {
    if (App.is_filtered(item.mode)) {
      App.filter_all(`tabs`)
      App.select_item({item: item, scroll: `center`})
    }
    else {
      App.deselect(item.mode, `none`)

      for (let it of selected) {
        App.toggle_selected(it, true)
      }
    }
  }
}

App.get_blank_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.blank)
}

App.remove_all_blanks = () => {
  let items = App.get_blank_tabs()

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.special_blank = (item) => {
  return item.blank && App.get_setting(`special_blanks`)
}