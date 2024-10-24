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

App.show_stuff_menu = (e) => {
  let items = []

  function add(cmd) {
    items.push(App.cmd_item({cmd}))
  }

  add(`show_flashlight`)
  add(`generate_password`)
  add(`breathe_effect`)
  add(`locust_swarm`)
  App.sep(items)
  add(`toggle_main_title`)
  add(`toggle_taglist`)
  add(`toggle_favorites`)
  add(`toggle_favorites_autohide`)
  add(`toggle_tab_box`)
  add(`toggle_footer`)
  App.sep(items)
  add(`toggle_show_pins`)
  add(`toggle_show_unloaded`)
  add(`toggle_tab_sort`)
  App.sep(items)
  add(`toggle_wrap_text`)
  add(`toggle_auto_blur`)
  App.sep(items)
  add(`set_next_theme`)
  add(`increase_background_opacity`)
  add(`decrease_background_opacity`)

  App.show_context({
    e,
    items,
    title: `Stuff (${items.length})`,
    title_icon: App.shroom_icon,
  })
}