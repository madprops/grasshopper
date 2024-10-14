App.start_command_combos_addlist = () => {
  if (App.command_combos_addlist_ready) {
    return
  }

  let id = `settings_command_combos`
  let props = App.setting_props.command_combos
  let {popobj, regobj} = App.get_setting_addlist_objects()

  App.create_popup({...popobj, id: `addlist_${id}`,
    element: Addlist.register({...regobj, id,
      keys: [
        `name`, `icon`,
        `cmd_1`, `cmd_2`, `cmd_3`, `cmd_4`,
        `cmd_5`, `cmd_6`, `cmd_7`, `cmd_8`,
      ],
      widgets: {
        icon: `text`,
        name: `text`,
        cmd_1: `menu`,
        cmd_2: `menu`,
        cmd_3: `menu`,
        cmd_4: `menu`,
        cmd_5: `menu`,
        cmd_6: `menu`,
        cmd_7: `menu`,
        cmd_8: `menu`,
      },
      labels: {
        icon: `Icon`,
        name: `Name`,
        cmd_1: `Command 1`,
        cmd_2: `Command 2`,
        cmd_3: `Command 3`,
        cmd_4: `Command 4`,
        cmd_5: `Command 5`,
        cmd_6: `Command 6`,
        cmd_7: `Command 7`,
        cmd_8: `Command 8`,
      },
      sources: {
        cmd_1: () => {
          return App.cmdlist_single.slice(0)
        },
        cmd_2: () => {
          return App.cmdlist_single.slice(0)
        },
        cmd_3: () => {
          return App.cmdlist_single.slice(0)
        },
        cmd_4: () => {
          return App.cmdlist_single.slice(0)
        },
        cmd_5: () => {
          return App.cmdlist_single.slice(0)
        },
        cmd_6: () => {
          return App.cmdlist_single.slice(0)
        },
        cmd_7: () => {
          return App.cmdlist_single.slice(0)
        },
        cmd_8: () => {
          return App.cmdlist_single.slice(0)
        },
      },
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

  let delay = App.get_setting(`command_combo_delay`)

  for (let cmd of cmds) {
    if (cmd.startsWith(`sleep_ms`)) {
      let ms = parseInt(cmd.split(`_`).pop())
      await App.sleep(ms)
      continue
    }

    await App.run_command({cmd, item, e})

    if (delay > 0) {
      await App.sleep(delay)
    }
  }
}