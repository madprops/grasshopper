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
        argument: `Argument for the action, if needed`,
      },
      sources: {
        action: () => {
          return [
            {text: `Go To Zone`, value: `goto_zone`},
            {text: `Edit Title`, value: `edit_title`},
          ]
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

  if (cmd.action === `goto_zone`) {
    let zone = App.get_zone_by_title(cmd.argument)

    if (!zone) {
      return
    }

    App.scroll_to_item({item: zone, scroll: `center_smooth`})
  }
  else if (cmd.action === `edit_title`) {
    let active = App.get_active_items({mode: item.mode, item})

    for (let it of active) {
      App.edit_title_directly(it, cmd.argument)
    }
  }
}