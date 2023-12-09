App.setup_context = () => {
  NeedContext.min_width = `1rem`
  NeedContext.center_top = 50
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
    })
  }

  if (!App.get_setting(`context_titles`)) {
    args.title = undefined
  }

  NeedContext.show(args)
}

App.hide_context = () => {
  NeedContext.hide()
}

App.context_open = () => {
  return NeedContext.open
}