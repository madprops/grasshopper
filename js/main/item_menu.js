App.show_item_menu = async (args = {}) => {
  if (!args.item) {
    return
  }

  App.item_menu_args = args
  App.item_menu_active = App.get_active_items({mode: args.item.mode, item: args.item})
  let items = []

  if (App.get_setting(`extra_menu_mode`) === `total`) {
    items = App.custom_menu_items({
      name: `extra_menu`,
      item: args.item
    })
  }
  else {
    if (args.item.mode === `tabs`) {
      App.item_menu_item(items, `load_tabs`, {item: args.item})
      App.item_menu_item(items, `pin_tabs`, {item: args.item})
      App.item_menu_item(items, `unpin_tabs`, {item: args.item})
      App.item_menu_item(items, `show_color_menu`, {item: args.item})
      App.item_menu_tags(items, args.item)
      App.item_menu_item(items, `edit_icon`, {item: args.item})
      App.item_menu_item(items, `edit_title`, {item: args.item})
      App.item_menu_item(items, `edit_notes`, {item: args.item})

      let common_obj = {
        o_items: items,
        item: args.item,
      }

      App.common_menu_items(common_obj)
      App.extra_menu_items(items)

      let more_obj = {
        o_items: items,
        item: args.item,
      }

      App.more_menu_items(more_obj)
      App.sep(items)
      App.item_menu_item(items, `close_tabs`, {item: args.item})
    }
    else {
      App.item_menu_item(items, `open_items`, {item: args.item})

      let common_obj = {
        o_items: items,
        item: args.item,
      }

      App.common_menu_items(common_obj)

      let more_obj = {
        o_items: items,
        item: args.item,
      }

      App.more_menu_items(more_obj)
    }
  }

  App.show_context({items: items, e: args.e})
}

App.common_menu_items = (args = {}) => {
  let items = []

  if (App.get_media_type(args.item)) {
    App.item_menu_item(items, `view_media`, {item: args.item})
  }

  let filter_items = []
  App.item_menu_item(filter_items, `filter_domain`, {item: args.item})
  App.item_menu_item(filter_items, `filter_title`, {item: args.item})
  App.item_menu_item(filter_items, `filter_color`, {item: args.item})
  App.item_menu_item(filter_items, `filter_tag`, {item: args.item})
  App.item_menu_item(filter_items, `filter_icon`, {item: args.item})

  items.push({
    icon: App.settings_icons.filter,
    text: `Filter`,
    items: filter_items,
  })

  let copy_items = []
  App.item_menu_item(copy_items, `copy_item_url`, {item: args.item})
  App.item_menu_item(copy_items, `copy_item_title`, {item: args.item})
  App.item_menu_item(copy_items, `copy_tabs`, {item: args.item})
  App.item_menu_item(copy_items, `paste_tabs`, {item: args.item})

  items.push({
    icon: App.clipboard_icon,
    text: `Copy`,
    items: copy_items,
  })

  if (items.length) {
    for (let c of items) {
      args.o_items.push(c)
    }
  }
}

App.more_menu_items = (args = {}) => {
  let items = []

  if (args.item.mode === `tabs`) {
    App.item_menu_item(items, `mute_tabs`, {item: args.item})
    App.item_menu_item(items, `unmute_tabs`, {item: args.item})
    App.item_menu_item(items, `unload_tabs`, {item: args.item})
    App.item_menu_item(items, `duplicate_tabs`, {item: args.item})
    App.item_menu_item(items, `remove_item_edits`, {item: args.item})
  }

  App.item_menu_item(items, `bookmark_items`, {item: args.item})
  App.item_menu_item(items, `set_background_image`, {item: args.item})
  App.item_menu_item(items, `edit_domain_rule`, {item: args.item})

  if (args.item.mode === `tabs`) {
    if (items.length) {
      App.sep(items)
    }

    App.item_menu_item(items, `insert_header`, {item: args.item})
    App.item_menu_item(items, `add_split_both`, {item: args.item})
    App.item_menu_item(items, `add_split_top`, {item: args.item})
    App.item_menu_item(items, `add_split_bottom`, {item: args.item})
    App.item_menu_item(items, `remove_split`, {item: args.item})
    App.sep(items)
    App.item_menu_item(items, `move_tabs_to_top`, {item: args.item})
    App.item_menu_item(items, `move_tabs_to_bottom`, {item: args.item})
    App.sep(items)
    App.item_menu_item(items, `show_windows_menu`, {item: args.item})
  }

  if (args.item.mode === `closed`) {
    App.item_menu_item(items, `forget_closed_item`, {item: args.item})
  }

  if (items.length) {
    args.o_items.push({
      icon: App.command_icon,
      text: `More`,
      items: items,
    })
  }
}

App.extra_menu_items = (o_items) => {
  let mode = App.get_setting(`extra_menu_mode`)

  if (mode === `none`) {
    return
  }

  let items = App.custom_menu_items({
    name: `extra_menu`,
    item: App.item_menu_args.item,
  })

  if (mode === `normal`) {
    if (items.length) {
      o_items.push({
        icon: App.extra_icon,
        text: `Extra`,
        items: items,
      })
    }
  }
  else if (mode === `flat`) {
    for (let item of items) {
      o_items.push(item)
    }
  }
  else if (mode === `total`) {
    o_items = items
  }
}

App.item_menu_item = (items, cmd, obj) => {
  let command = App.get_command(cmd)

  if (command && App.check_command(command, obj)) {
    obj.from = `item_menu`
    obj.e = App.item_menu_args.e
    obj.mode = App.item_menu_args.item.mode
    obj.active = App.item_menu_active
    obj.command = command
    obj.short = true
    items.push(App.cmd_item(obj))
  }
}

App.item_menu_tags = (items, item) => {
  let tag_items = []
  App.item_menu_item(tag_items, `edit_tags`, {item: item, short: false}),
  App.item_menu_item(tag_items, `add_tags`, {item: item, short: false}),

  items.push({
    icon: App.tag_icon,
    text: `Tags`,
    items: tag_items,
  })
}