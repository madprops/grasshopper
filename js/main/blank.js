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

  let color = App.random_choice(App.colors)

  if (App.apply_edit(`color`, item, color)) {
    App.custom_save(item.id, `custom_color`, color)
  }
}

App.open_blank_above_tab = (item) => {
  let index = App.get_item_element_index(item.mode, item.element)
  App.open_blank_tab({index: index, pinned: item.pinned})
}

App.on_blank_click = (item) => {
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
    App.deselect(item.mode, `none`)

    for (let it of selected) {
      App.toggle_selected(it, true)
    }
  }
}