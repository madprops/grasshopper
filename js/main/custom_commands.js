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
          return [
            {text: `Go To Zone`, value: `goto_zone`},
            {text: `Edit Title`, value: `edit_title`},
            {text: `Add Tag`, value: `add_tag`},
          ]
        },
      },
      title: props.name,
    })})

  App.custom_commands_addlist_ready = true
}

App.custom_command_actions = {
  goto_zone: (cmd, item, e) => {
    let zone = App.get_zone_by_title(cmd.argument)

    if (!zone) {
      return
    }

    App.scroll_to_item({item: zone, scroll: `center_smooth`})
  },
  edit_title: (cmd, item, e) => {
    let active = App.get_active_items({mode: item.mode, item})

    for (let it of active) {
      App.edit_title_directly(it, cmd.argument)
    }
  },
  add_tag: (cmd, item, e) => {
    let active = App.get_active_items({mode: item.mode, item})
    let tags = cmd.argument.split(` `).filter(x => x.trim() !== ``)

    for (let it of active) {
      for (let tag of tags) {
        App.add_tag(it, tag)
      }
    }
  }
}

App.run_custom_command = (cmd, item, e) => {
  if (!cmd.argument) {
    return
  }

  let action = App.custom_command_actions[cmd.action]

  if (action) {
    action(cmd, item, e)
  }
}