App.custom_command_actions = {
  go_to_zone: (args) => {
    let zone = App.get_zone_by_title(args.cmd.argument)

    if (!zone) {
      return
    }

    App.go_to_zone(zone)
  },
  move_to_zone_top: (args) => {
    let zone = App.get_zone_by_title(args.cmd.argument)

    if (!zone || !args.items.length) {
      return
    }

    App.move_to_zone(zone, args.item, `top`)
  },
  move_to_zone_bottom: (args) => {
    let zone = App.get_zone_by_title(args.cmd.argument)

    if (!zone || !args.items.length) {
      return
    }

    App.move_to_zone(zone, args.item, `bottom`)
  },
  edit_title: (args) => {
    App.edit_title_directly(args.item, args.cmd.argument)
  },
  edit_icon: (args) => {
    App.edit_tab_icon({
      item: args.item,
      icon: args.cmd.argument,
      force: true,
    })
  },
  show_icon: (args) => {
    App.show_tab_list(`icon_${args.cmd.argument}`, args.e)
  },
  add_tag: (args) => {
    App.add_tag_string(args.item, args.cmd.argument)
  },
  append_note: (args) => {
    App.append_note(args.item, args.cmd.argument)
  },
  prepend_note: (args) => {
    App.prepend_note(args.item, args.cmd.argument)
  },
  append_global_note: (args) => {
    App.append_global_note(args.cmd.argument)
  },
  prepend_global_note: (args) => {
    App.prepend_global_note(args.cmd.argument)
  },
  open_in_container: (args) => {
    App.open_in_tab_container(args.item, args.e, args.cmd.argument)
  },
  open_in_container_2: (args) => {
    App.open_in_tab_container(args.item, args.e, args.cmd.argument, true)
  },
  jump_to_tag: (args) => {
    App.jump_tabs({what: `tag_${args.cmd.argument}`, item: args.item})
  },
  show_tag: (args) => {
    App.show_tab_list(`tag_${args.cmd.argument}`, args.e)
  },
  custom_filter: (args) => {
    App.set_filter({text: args.cmd.argument, enter_if_cmd: true})
  },
  find_command: (args) => {
    App.show_palette(args.cmd.argument)
  },
  close_tabs: (args) => {
    App.custom_close_tabs(args.cmd.argument, args.item)
  },
  select_items: (args) => {
    App.select_item_list(args.cmd.argument)
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
    action({cmd, item, items, e})
  }
}