App.setup_context = () => {
  NeedContext.min_width = `1rem`
  NeedContext.center_top = 50
  NeedContext.init()
}

App.show_context = (args = {}) => {
  if (!args.items) {
    return
  }

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
  App.show_context({items, e, element})
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
  let mode_menu = App.get_setting(`${mode}_empty_menu`)

  if (mode_menu.length) {
    name = `${mode}_empty_menu`
  }
  else {
    let global = App.get_setting(`global_empty_menu`)

    if (global.length) {
      name = `global_empty_menu`
    }
  }

  if (!name) {
    return
  }

  let items = App.custom_menu_items({name, item})
  App.show_context({items, e})
}