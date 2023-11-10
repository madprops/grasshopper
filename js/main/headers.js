App.open_header_tab = async (args = {}) => {
  let url = {
    url: App.header_url,
  }

  let obj = Object.assign({}, url, args)
  browser.tabs.create(obj)
}

App.insert_header = (item) => {
  let active = App.get_active_items({mode: item.mode, item: item})
  let first = active.at(0)
  let index = App.get_item_element_index(first.mode, first.element)
  App.open_header_tab({index: index, pinned: item.pinned})

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

App.on_header_click = async (item) => {
  let waypoint = false
  let select = false
  let selected = []
  let items = App.get_items(item.mode)

  for (let [i, it] of items.entries()) {
    if (waypoint) {
      if (it.header) {
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

App.get_header_tabs = () => {
  return App.get_items(`tabs`).filter(x => App.is_header(x))
}

App.remove_all_headers = () => {
  let items = App.get_header_tabs()

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.is_header = (item) => {
  if (!App.get_setting(`enable_headers`)) {
    return false
  }

  return (item.mode === `tabs`) && App.tab_ready(item) && item.header
}

App.is_header_url = (url) => {
  return url === App.header_url
}