App.cmd_combo_keys = () => {
  let keys = [`name`, `icon`]

  for (let i = 1; i <= App.command_combo_num; i++) {
    keys.push(`cmd_${i}`)
  }

  return keys
}

App.cmd_combo_widgets = () => {
  let obj = {
    name: `text`,
    icon: `text`,
  }

  for (let i = 1; i <= App.command_combo_num; i++) {
    obj[`cmd_${i}`] = `menu`
  }

  return obj
}

App.cmd_combo_labels = () => {
  let obj = {
    name: `Name`,
    icon: `Icon`,
  }

  for (let i = 1; i <= App.command_combo_num; i++) {
    obj[`cmd_${i}`] = `Command ${i}`
  }

  return obj
}

App.cmd_combo_sources = () => {
  let obj = {}

  for (let i = 1; i <= App.command_combo_num; i++) {
    obj[`cmd_${i}`] = () => {
      return App.cmdlist_single.slice(0)
    }
  }

  return obj
}

App.start_command_combos_addlist = () => {
  if (App.command_combos_addlist_ready) {
    return
  }

  let id = `settings_command_combos`
  let props = App.setting_props.command_combos
  let {popobj, regobj} = App.get_setting_addlist_objects()

  App.create_popup({...popobj, id: `addlist_${id}`,
    element: Addlist.register({...regobj, id,
      keys: App.cmd_combo_keys(),
      widgets: App.cmd_combo_widgets(),
      labels: App.cmd_combo_labels(),
      sources: App.cmd_combo_sources(),
      list_icon: (item) => {
        return item.icon || App.combo_icon
      },
      list_text: (item) => {
        return item.name
      },
      required: {
        name: true,
      },
      tooltips: {
        icon: `Icon for this combo`,
        name: `Name of the combo`,
      },
      title: props.name,
    })})

  App.command_combos_addlist_ready = true
}

App.run_command_combo = async (combo, item, e) => {
  let cmds = []

  for (let key in combo) {
    if (key.startsWith(`cmd_`)) {
      let value = combo[key]

      if (!value || (value === `none`)) {
        continue
      }

      cmds.push(value)
    }
  }

  if (!cmds.length) {
    return
  }

  let mode = item?.mode || App.active_mode
  let delay = App.get_setting(`command_combo_delay`)
  let last_selected = App.last_selected_date[mode]

  for (let cmd of cmds) {
    if (cmd.startsWith(`sleep_ms`)) {
      let ms = parseInt(cmd.split(`_`).pop())
      await App.sleep(ms)
      continue
    }

    let lsd = App.last_selected_date[mode]

    if (lsd !== last_selected) {
      item = App.get_selected(mode)
      last_selected = lsd
    }

    await App.run_command({cmd, item, e})

    if (delay > 0) {
      await App.sleep(delay)
    }
  }
}