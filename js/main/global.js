App.setup_global = () => {
  //
}

App.get_global = async () => {
  App.getting(`global`)
  let tabs

  try {
    tabs = await App.browser().tabs.query({})
  }
  catch (err) {
    App.error(err)
    return []
  }

  return tabs
}

App.global_action = (args = {}) => {
  let def_args = {
    on_action: true,
    soft: false,
  }

  App.def_args(def_args, args)
  App.select_item({item: args.item, scroll: `nearest_smooth`, check_auto_scroll: true})

  if (args.on_action) {
    App.on_action(`global`)
  }

  App.focus_global_tab(args.item)
}