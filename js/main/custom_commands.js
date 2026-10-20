App.custom_command_actions = {
  go_to_zone: (cmd, item, items, e) => {
    let zone = App.get_zone_by_title(cmd.argument)

    if (!zone) {
      return
    }

    App.go_to_zone(zone)
  },
  move_to_zone_top: (cmd, item, items, e) => {
    let zone = App.get_zone_by_title(cmd.argument)

    if (!zone || !items.length) {
      return
    }

    App.move_to_zone(zone, item, `top`)
  },
  move_to_zone_bottom: (cmd, item, items, e) => {
    let zone = App.get_zone_by_title(cmd.argument)

    if (!zone || !items.length) {
      return
    }

    App.move_to_zone(zone, item, `bottom`)
  },
  edit_title: (cmd, item, items, e) => {
    App.edit_title_directly(item, cmd.argument)
  },
  edit_icon: (cmd, item, items, e) => {
    App.edit_tab_icon({
      item,
      icon: cmd.argument,
      force: true,
    })
  },
  show_icon: (cmd, item, items, e) => {
    App.show_tab_list(`icon_${cmd.argument}`, e)
  },
  add_tag: (cmd, item, items, e) => {
    App.add_tag_string(item, cmd.argument)
  },
  append_note: (cmd, item, items, e) => {
    App.append_note(item, cmd.argument)
  },
  prepend_note: (cmd, item, items, e) => {
    App.prepend_note(item, cmd.argument)
  },
  append_global_note: (cmd, item, items, e) => {
    App.append_global_note(cmd.argument)
  },
  prepend_global_note: (cmd, item, items, e) => {
    App.prepend_global_note(cmd.argument)
  },
  open_in_container: (cmd, item, items, e) => {
    App.open_in_tab_container(item, e, cmd.argument)
  },
  open_in_container_2: (cmd, item, items, e) => {
    App.open_in_tab_container(item, e, cmd.argument, true)
  },
  jump_to_tag: (cmd, item, items, e) => {
    App.jump_tabs({what: `tag_${cmd.argument}`, item})
  },
  show_tag: (cmd, item, items, e) => {
    App.show_tab_list(`tag_${cmd.argument}`, e)
  },
  custom_filter: (cmd, item, items, e) => {
    App.set_filter({text: cmd.argument, enter_if_cmd: true})
  },
  find_command: (cmd, item, items, e) => {
    App.show_palette(cmd.argument)
  },
  close_tabs: (cmd, item, items, e) => {
    App.custom_close_tabs(cmd.argument, item)
  },
  select_items: (cmd, item, items, e) => {
    App.select_item_list(cmd.argument)
  },
}

App.custom_command_items = [
  {text: `Go To Zone`, value: `go_to_zone`, icon: App.zone_icon},
  {text: `Move To Zone (Top)`, value: `move_to_zone_top`, icon: App.zone_icon},
  {text: `Move To Zone (Bottom)`, value: `move_to_zone_bottom`, icon: App.zone_icon},
  {text: `Edit Title`, value: `edit_title`, icon: App.notepad_icon},
  {text: `Edit Icon`, value: `edit_icon`, icon: App.settings_icons.icons},
  {text: `Show Icon`, value: `show_icon`, icon: App.settings_icons.icons},
  {text: `Add Tag`, value: `add_tag`, icon: App.tag_icon},
  {text: `Append Note`, value: `append_note`, icon: App.notepad_icon},
  {text: `Prepend Note`, value: `prepend_note`, icon: App.notepad_icon},
  {text: `Append Global Note`, value: `append_global_note`, icon: App.notepad_icon},
  {text: `Prepend Global Note`, value: `prepend_global_note`, icon: App.notepad_icon},
  {text: `Open In Container`, value: `open_in_container`, icon: App.container_icon},
  {text: `Open In Container 2`, value: `open_in_container_2`, icon: App.container_icon},
  {text: `Jump To Tag`, value: `jump_to_tag`, icon: App.tag_icon},
  {text: `Show Tag`, value: `show_tag`, icon: App.tag_icon},
  {text: `Find Command`, value: `find_command`, icon: App.command_icon},
  {text: `Custom Filter`, value: `custom_filter`, icon: App.filter_icon},
  {text: `Select Items`, value: `select_items`, icon: App.filter_icon},
  {text: `Close Tabs`, value: `close_tabs`, icon: App.close_icon},
]

App.start_custom_commands_addlist = () => {
  if (App.custom_commands_addlist_ready) {
    return
  }

  let id = `settings_custom_commands`
  let props = App.setting_props.custom_commands
  let {popobj, regobj} = App.get_setting_addlist_objects()

  App.create_popup({...popobj, id: `addlist_${id}`,
    element: Addlist.register({...regobj, id,
      keys: [`name`, `icon`, `action`, `argument`],
      widgets: {
        name: `text`,
        icon: `text`,
        action: `menu`,
        argument: `text`,
      },
      labels: {
        name: `Name`,
        icon: `Icon`,
        action: `Action`,
        argument: `Argument`,
      },
      required: {
        name: true,
        action: true,
        argument: false,
      },
      list_icon: (item) => {
        return item.icon
      },
      list_text: (item) => {
        return item.name
      },
      tooltips: {
        icon: `Icon for this command`,
        name: `Name of the command`,
        action: `Type of action to run`,
        argument: `Argument for the action`,
      },
      sources: {
        action: () => {
          return App.custom_command_items
        },
      },
      title: props.name,
    })})

  App.custom_commands_addlist_ready = true
}

App.run_custom_command = (cmd, item, e) => {
  if (!cmd.argument) {
    return
  }

  let action = App.custom_command_actions[cmd.action]

  if (action) {
    let items = App.get_active_items({mode: item.mode, item})
    action(cmd, item, items, e)
  }
}