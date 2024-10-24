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

App.show_stuff = (e) => {
  let items = []
  items.push(App.cmd_item({cmd: `show_flashlight`}))
  items.push(App.cmd_item({cmd: `generate_password`}))
  items.push(App.cmd_item({cmd: `breathe_effect`}))
  items.push(App.cmd_item({cmd: `locust_swarm`}))
  App.sep(items)
  items.push(App.cmd_item({cmd: `toggle_main_title`}))
  items.push(App.cmd_item({cmd: `toggle_taglist`}))
  items.push(App.cmd_item({cmd: `toggle_favorites`}))
  items.push(App.cmd_item({cmd: `toggle_favorites_autohide`}))
  items.push(App.cmd_item({cmd: `toggle_tab_box`}))
  items.push(App.cmd_item({cmd: `toggle_footer`}))
  App.sep(items)
  items.push(App.cmd_item({cmd: `toggle_show_pins`}))
  items.push(App.cmd_item({cmd: `toggle_show_unloaded`}))
  items.push(App.cmd_item({cmd: `toggle_tab_sort`}))
  App.sep(items)
  items.push(App.cmd_item({cmd: `toggle_wrap_text`}))
  items.push(App.cmd_item({cmd: `toggle_auto_blur`}))
  App.sep(items)
  items.push(App.cmd_item({cmd: `set_next_theme`}))
  items.push(App.cmd_item({cmd: `increase_background_opacity`}))
  items.push(App.cmd_item({cmd: `decrease_background_opacity`}))

  App.show_context({
    e,
    items,
    title: `Stuff`,
  })
}