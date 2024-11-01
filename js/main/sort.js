App.start_sort_tabs = () => {
  if (App.check_ready(`sort_tabs`)) {
    return
  }

  App.create_popup({
    id: `sort_tabs`,
    setup: () => {
      DOM.ev(`#sort_tabs_button`, `click`, () => {
        App.sort_tabs_action()
      })
    },
  })
}

App.sort_tabs = () => {
  App.start_sort_tabs()
  App.show_popup(`sort_tabs`)
  DOM.el(`#sort_tabs_pins`).checked = false
  DOM.el(`#sort_tabs_normal`).checked = true
  DOM.el(`#sort_tabs_reverse`).checked = false
}

App.do_sort_tabs = () => {
  function sort (list, reverse) {
    list.sort((a, b) => {
      if (a.hostname !== b.hostname) {
        if (reverse) {
          return a.hostname < b.hostname ? 1 : -1
        }

        return a.hostname > b.hostname ? 1 : -1
      }

      return a.title < b.title ? -1 : 1
    })
  }

  let include_pins = DOM.el(`#sort_tabs_pins`).checked
  let include_normal = DOM.el(`#sort_tabs_normal`).checked

  if (!include_pins && !include_normal) {
    return
  }

  let items = App.get_items(`tabs`).slice(0)

  if (!items.length) {
    return
  }

  let normal = items.filter(x => !x.pinned)
  let pins = items.filter(x => x.pinned)
  let num = 0

  if (include_pins) {
    num += pins.length
  }

  if (include_normal) {
    num += normal.length
  }

  App.show_confirm({
    message: `Sort tabs? (${num})`,
    confirm_action: async () => {
      let reverse = DOM.el(`#sort_tabs_reverse`).checked

      if (include_normal) {
        sort(normal, reverse)
      }

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

      if (App.tabs_normal()) {
        App.clear_all_items()
        await App.do_show_mode({mode: `tabs`})
      }
    },
  })
}

App.sort_tabs_action = () => {
  let sort_pins = DOM.el(`#sort_tabs_pins`).checked
  App.do_sort_tabs(sort_pins)
}

App.sort_selected_tabs = async (direction) => {
  let items = App.get_active_items({mode: `tabs`})

  if (!items.length) {
    return
  }

  let index_top = App.get_item_index(`tabs`, items[0])
  let new_items = items.slice(0)

  if (!App.tabs_in_same_place(new_items)) {
    return
  }

  if (direction === `asc`) {
    new_items.sort((a, b) => {
      return a.title.localeCompare(b.title)
    })
  }
  else if (direction === `desc`) {
    new_items.sort((a, b) => {
      return b.title.localeCompare(a.title)
    })
  }
  else if (direction === `reverse`) {
    new_items.reverse()
  }

  let force = App.check_warn(`warn_on_sort_tabs`, items)

  App.show_confirm({
    message: `Sort tabs? (${new_items.length})`,
    confirm_action: async () => {
      for (let [i, item] of new_items.entries()) {
        let index = index_top + i
        await App.do_move_tab_index(item.id, index)
      }
    },
    force,
  })
}

App.tabs_normal = () => {
  return App.get_setting(`tab_sort`) === `normal`
}

App.tabs_recent = () => {
  return App.get_setting(`tab_sort`) === `recent`
}

App.toggle_tab_sort = () => {
  let value

  if (App.tabs_normal()) {
    value = `recent`
  }
  else if (App.tabs_recent()) {
    value = `normal`
  }

  App.set_setting({setting: `tab_sort`, value})
  App.clear_items(`tabs`)
  App.do_show_mode({mode: `tabs`})
}