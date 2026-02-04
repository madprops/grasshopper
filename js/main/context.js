App.setup_context = () => {
  NeedContext.min_width = `1rem`
  NeedContext.center_top = 50
  NeedContext.init()
  App.refresh_context()
}

App.refresh_context = () => {
  let autohide_delay = App.get_setting(`context_autohide_delay`)
  let autoclick_delay = App.get_setting(`context_autoclick_delay`)
  NeedContext.start_autohide(autohide_delay)
  NeedContext.start_autoclick(autoclick_delay)
}

App.show_context = (args = {}) => {
  if (!args.items) {
    return
  }

  clearInterval(App.autoclick_timeout)

  if (!args.items.length) {
    args.items.push({
      text: `No items`,
      action: () => {
        if (args.no_items) {
          App.alert(args.no_items)
        }
      },
      fake: true,
    })
  }

  if (!App.get_setting(`context_titles`)) {
    args.title = undefined
  }

  let ac_enabled = App.get_setting(`autoclick_enabled`)
  args.autohide = App.get_setting(`context_autohide`)
  args.autoclick = ac_enabled && App.get_setting(`context_autoclick`)
  NeedContext.show(args)
}

App.hide_context = () => {
  if (NeedContext.dragging) {
    return
  }

  NeedContext.hide()
}

App.context_open = () => {
  return NeedContext.open
}

App.show_generic_menu = (num, item, e) => {
  let items = App.custom_menu_items({
    name: `generic_menu_${num}`,
    item,
  })

  let element = item?.element
  let compact = App.get_setting(`compact_generic_menu_${num}`)
  App.show_context({items, e, element, compact})
}

App.show_extra_menu = (item, e) => {
  let items = App.custom_menu_items({
    name: `extra_menu`,
    item, e,
  })

  let element = item?.element
  let compact = App.get_setting(`compact_extra_menu`)
  App.show_context({items, e, element, compact})
}

App.show_empty_menu = (item, e) => {
  let name
  let mode = item?.mode || App.active_mode
  let mode_menu = App.get_setting(`empty_menu_${mode}`)

  if (mode_menu.length) {
    name = `empty_menu_${mode}`
  }
  else {
    let global = App.get_setting(`empty_menu`)

    if (global.length) {
      name = `empty_menu`
    }
  }

  if (!name) {
    return
  }

  let items = App.custom_menu_items({name, item})
  let compact = App.get_setting(`compact_empty_menu`)
  App.show_context({items, e, compact})
}

App.show_stuff_menu = (item, e) => {
  let items = App.custom_menu_items({name: `stuff_menu`, item})
  let compact = App.get_setting(`compact_stuff_menu`)

  App.show_context({
    e,
    items,
    title: `Stuff`,
    title_icon: App.shroom_icon,
    title_number: true,
    compact,
  })
}

App.show_toggle_menu = (item, e) => {
  let items = App.custom_menu_items({name: `toggle_menu`, item})
  let compact = App.get_setting(`compact_toggle_menu`)

  App.show_context({
    e,
    items,
    title: `Toggle`,
    title_icon: App.toggle_icon,
    title_number: true,
    compact,
  })
}