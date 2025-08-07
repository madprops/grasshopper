App.custom_command_actions = {
  go_to_zone: (cmd, items, e) => {
    let zone = App.get_zone_by_title(cmd.argument)

    if (!zone) {
      return
    }

    App.go_to_zone(zone)
  },
  move_to_zone_top: (cmd, items, e) => {
    let zone = App.get_zone_by_title(cmd.argument)

    if (!zone || !items.length) {
      return
    }

    App.move_to_zone(zone, items[0], `top`)
  },
  move_to_zone_bottom: (cmd, items, e) => {
    let zone = App.get_zone_by_title(cmd.argument)

    if (!zone || !items.length) {
      return
    }

    App.move_to_zone(zone, items[0], `bottom`)
  },
  edit_title: (cmd, items, e) => {
    for (let it of items) {
      App.edit_title_directly(it, cmd.argument)
    }
  },
  add_tag: (cmd, items, e) => {
    for (let it of items) {
      App.add_tag_string(it, cmd.argument)
    }
  },
  append_note: (cmd, items, e) => {
    for (let it of items) {
      App.append_note(it, cmd.argument)
    }
  },
  prepend_note: (cmd, items, e) => {
    for (let it of items) {
      App.prepend_note(it, cmd.argument)
    }
  },
  append_global_note: (cmd, items, e) => {
    for (let it of items) {
      App.append_global_note(cmd.argument)
    }
  },
  prepend_global_note: (cmd, items, e) => {
    for (let it of items) {
      App.prepend_global_note(cmd.argument)
    }
  },
}

App.custom_command_items = [
  {text: `Go To Zone`, value: `go_to_zone`, icon: App.zone_icon},
  {text: `Move To Zone (Top)`, value: `move_to_zone_top`, icon: App.zone_icon},
  {text: `Move To Zone (Bottom)`, value: `move_to_zone_bottom`, icon: App.zone_icon},
  {text: `Edit Title`, value: `edit_title`, icon: App.notepad_icon},
  {text: `Add Tag`, value: `add_tag`, icon: App.tag_icon},
  {text: `Append Note`, value: `append_note`, icon: App.notepad_icon},
  {text: `Prepend Note`, value: `prepend_note`, icon: App.notepad_icon},
  {text: `Append Global Note`, value: `append_global_note`, icon: App.notepad_icon},
  {text: `Prepend Global Note`, value: `prepend_global_note`, icon: App.notepad_icon},
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
    action(cmd, items, e)
  }
}