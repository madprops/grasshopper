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

  App.show_context({items, e})
}