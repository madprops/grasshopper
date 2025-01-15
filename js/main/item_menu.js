App.show_item_menu = async (args = {}) => {
  if (!args.item) {
    return
  }

  App.item_menu_separable = false
  App.item_menu_args = args
  App.item_menu_active = App.get_active_items({mode: args.item.mode, item: args.item})
  App.item_menu_too_many = App.item_menu_active.length > App.max_command_check_items
  let element = args.item.element
  let items = []

  if (args.item.type === `folder`) {
    App.item_menu_item(items, `save_bookmarks_folder_pick`, {item: args.item})
    App.show_context({items, e: args.e, element})
    return
  }

  let mode_menu = App.get_setting(`item_menu_${args.item.mode}`)

  if (mode_menu.length) {
    for (let item of mode_menu) {
      App.item_menu_item(items, item.cmd, {item: args.item})
    }

    App.extra_menu_items(items)
    let compact = App.get_setting(`compact_item_menu`)
    App.show_context({items, e: args.e, element, compact})
    return
  }

  let global = App.get_setting(`item_menu`)

  if (global.length) {
    for (let item of global) {
      App.item_menu_item(items, item.cmd, {item: args.item})
    }

    App.extra_menu_items(items)
    let compact = App.get_setting(`compact_item_menu`)
    App.show_context({items, e: args.e, short: true, compact})
    return
  }

  if (args.item.mode === `tabs`) {
    App.item_menu_item(items, `pin_tabs`, {item: args.item})
    App.item_menu_item(items, `unpin_tabs`, {item: args.item})
    App.item_menu_item(items, `show_color_menu`, {item: args.item})
    App.item_menu_tags(items, args.item)
    App.item_menu_item(items, `edit_icon`, {item: args.item})
    App.item_menu_item(items, `edit_title`, {item: args.item})
    App.item_menu_item(items, `edit_notes`, {item: args.item})

    let zone_items = []

    App.item_menu_item(zone_items, `insert_header`, {item: args.item, short: false})
    App.item_menu_item(zone_items, `insert_subheader`, {item: args.item, short: false})

    App.sep(zone_items)

    App.item_menu_item(zone_items, `add_split_top`, {item: args.item, short: false})
    App.item_menu_item(zone_items, `add_split_bottom`, {item: args.item, short: false})
    App.item_menu_item(zone_items, `add_split_both`, {item: args.item, short: false})
    App.item_menu_item(zone_items, `remove_split`, {item: args.item, short: false})

    items.push({
      icon: App.zone_icon,
      text: `Zones`,
      items: zone_items,
    })

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
    App.extra_menu_items(items)

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
    App.extra_menu_items(items)
  }

  let compact = App.get_setting(`compact_item_menu`)
  App.show_context({items, e: args.e, element, compact})
}

App.common_menu_items = (args = {}) => {
  let items = []

  if (App.get_media_type(args.item)) {
    App.item_menu_item(items, `view_media`, {item: args.item})
  }

  let filter_items = []
  App.item_menu_item(filter_items, `filter_title`, {item: args.item, short: false})
  App.item_menu_item(filter_items, `filter_domain`, {item: args.item, short: false})
  App.item_menu_item(filter_items, `filter_node_tabs`, {item: args.item, short: false})
  App.item_menu_item(filter_items, `filter_color`, {item: args.item, short: false})
  App.item_menu_item(filter_items, `filter_tag`, {item: args.item, short: false})
  App.item_menu_item(filter_items, `filter_icon`, {item: args.item, short: false})
  App.item_menu_item(filter_items, `search_domain_history`, {item: args.item, short: false})
  App.item_menu_item(filter_items, `search_domain_bookmarks`, {item: args.item, short: false})

  if (filter_items.length) {
    items.push({
      icon: App.settings_icons.filter,
      text: `Filter`,
      items: filter_items,
    })
  }

  let copy_items = []

  App.item_menu_item(copy_items, `copy_item_url`, {item: args.item, short: false})
  App.item_menu_item(copy_items, `copy_item_title`, {item: args.item, short: false})

  App.sep(copy_items)

  App.item_menu_item(copy_items, `copy_tabs`, {item: args.item, short: false})
  App.item_menu_item(copy_items, `paste_tabs`, {item: args.item, short: false})

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
    App.item_menu_item(items, `mute_tabs`, {item: args.item, short: true})
    App.item_menu_item(items, `unmute_tabs`, {item: args.item, short: true})
    App.item_menu_item(items, `unload_tabs`, {item: args.item, short: true})
    App.item_menu_item(items, `reverse_tabs`, {item: args.item, short: false})
    App.item_menu_item(items, `sort_tabs_asc`, {item: args.item, short: false})
    App.item_menu_item(items, `sort_tabs_desc`, {item: args.item, short: false})
    App.item_menu_item(items, `duplicate_tabs`, {item: args.item, short: true})
    App.item_menu_item(items, `edit_root_url`, {item: args.item, short: false})
    App.item_menu_item(items, `remove_item_edits`, {item: args.item, short: false})
    App.item_menu_item(items, `open_tabs_in_container`, {item: args.item, short: true})
  }

  App.item_menu_item(items, `bookmark_items`, {item: args.item, short: false})
  App.item_menu_item(items, `set_background_image`, {item: args.item, short: false})
  App.item_menu_item(items, `edit_domain_rule`, {item: args.item, short: false})

  if (args.item.mode === `tabs`) {
    if (items.length) {
      App.sep(items)
    }

    App.item_menu_item(items, `move_tabs_to_top`, {item: args.item, short: false})
    App.item_menu_item(items, `move_tabs_to_bottom`, {item: args.item, short: false})
    App.sep(items)
    App.item_menu_item(items, `show_windows_menu`, {item: args.item, short: false})
  }

  if (args.item.mode === `closed`) {
    App.item_menu_item(items, `forget_closed_item`, {item: args.item, short: false})
  }

  if (items.length) {
    args.o_items.push({
      icon: App.command_icon,
      text: `More`,
      items,
    })
  }
}

App.extra_menu_items = (o_items) => {
  let mode = App.get_setting(`extra_menu_mode`)

  if (mode === `none`) {
    return
  }

  let m_items = App.get_setting(`extra_menu`)

  if (!m_items.length) {
    return
  }

  let items = App.custom_menu_items({
    name: `extra_menu`,
    item: App.item_menu_args.item,
    short: mode === `flat`,
  })

  if (mode === `flat`) {
    if (!items || !items.length) {
      return
    }

    if ((items.length === 1) && items[0].empty) {
      return
    }
  }

  if (mode === `normal`) {
    if (items.length) {
      o_items.push({
        icon: App.extra_icon,
        text: `Extra`,
        items,
      })
    }
  }
  else if (mode === `flat`) {
    App.item_menu_separate(items)

    for (let item of items) {
      o_items.push(item)
    }
  }
}

App.item_menu_item = (items, cmd, obj) => {
  let command = App.get_command(cmd)
  let added = false

  if (App.item_menu_too_many || (command && App.check_command(command, obj))) {
    obj.from = `item_menu`
    obj.e = App.item_menu_args.e
    obj.mode = App.item_menu_args.item.mode
    obj.active = App.item_menu_active
    obj.command = command

    if (obj.short === undefined) {
      obj.short = true
    }

    items.push(App.cmd_item(obj))
    added = true
  }

  if (added) {
    App.item_menu_separable = true
  }
}

App.item_menu_tags = (items, item) => {
  if (App.item_menu_active.length > 1) {
    let tag_items = []
    App.item_menu_item(tag_items, `edit_tags`, {item, short: false})
    App.item_menu_item(tag_items, `add_tags`, {item, short: false})

    items.push({
      icon: App.get_setting(`tags_icon`),
      text: `Tags`,
      items: tag_items,
    })
  }
  else if (App.get_tags(item, false).length) {
    App.item_menu_item(items, `edit_tags`, {item})
  }
  else {
    App.item_menu_item(items, `add_tags`, {item})
  }
}

App.item_menu_separate = (items) => {
  if (App.item_menu_separable) {
    App.sep(items)
    App.item_menu_separable = false
  }
}