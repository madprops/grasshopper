App.update_command_history = (cmd) => {
  App.command_history = App.command_history.filter(x => x !== cmd)

  // Remove non-existent commands
  App.command_history = App.command_history.filter(x => {
    return App.commands.some(y => y.cmd === x)
  })

  App.command_history.unshift(cmd)
  App.stor_save_command_history()
  App.sort_commands()
}

App.sort_commands = () => {
  App.sorted_commands = App.commands.slice(0)

  if (!App.get_setting(`sort_commands`)) {
    return
  }

  App.sorted_commands.sort((a, b) => {
    let ia = App.command_history.indexOf(a.cmd)
    let ib = App.command_history.indexOf(b.cmd)

    if (ia !== -1 && ib !== -1) {
      return ia - ib
    }

    if (ia !== -1) {
      return -1
    }

    if (ib !== -1) {
      return 1
    }
  })
}

App.get_command = (cmd) => {
  if (!cmd || cmd === `none`) {
    return
  }

  for (let c of App.commands) {
    if (c.cmd === cmd) {
      return c
    }
  }
}

App.run_command = async (args) => {
  if (!args.cmd || args.cmd === `none`) {
    return false
  }

  let command = App.get_command(args.cmd)

  if (command) {
    if (!App.check_command(command, args)) {
      return false
    }

    args.self = command

    let last_args = {
      cmd: args.cmd,
      item: args.item,
      from: args.from,
    }

    let no_repat = [`repeat_command`, `show_palette`]

    if (!no_repat.includes(args.cmd)) {
      App.last_command = last_args
    }

    await command.action(args)
  }

  return true
}

App.check_command = (command, args = {}) => {
  if (!command) {
    return false
  }

  let def_args = {
    active: [],
  }

  App.def_args(def_args, args)
  args.mode = App.window_mode

  if (args.item) {
    args.mode = args.item.mode
  }

  if (command.min_items) {
    if (App.get_item_count(args.mode) < command.min_items) {
      return false
    }
  }

  args.on_items = App.on_items()
  args.on_media = App.on_media()

  if (!args.item) {
    if (args.on_items) {
      args.item = App.get_selected()
    }
    else if (args.on_media) {
      args.item = App.current_media_item()
    }
  }

  if (!App.get_setting(`check_commands`)) {
    return true
  }

  if (command.bookmarks_folder) {
    if (!App.bookmarks_folder) {
      return false
    }
  }

  let filter_value = App.get_filter(args.mode)

  if (command.filter_filled) {
    if (!filter_value) {
      return false
    }
  }

  if (args.item) {
    if (!args.active.length) {
      args.active = App.get_active_items({mode: args.mode, item: args.item})
    }

    if (args.active.length === 1) {
      args.single = true
      args.multiple = false
    }
    else if (args.active.length > App.max_command_check_items) {
      return true
    }
    else {
      args.single = false
      args.multiple = true
    }

    for (let media of App.media_types) {
      if (args.item[media]) {
        args.media = media
        break
      }
    }

    if (App.get_color(args.item)) {
      args.color = App.get_color(args.item)
    }

    args.some_edits = false

    for (let item of args.active) {
      if (item.pinned) {
        args.some_pinned = true
      }
      else {
        args.some_unpinned = true
      }

      if (item.muted) {
        args.some_muted = true
      }
      else {
        args.some_unmuted = true
      }

      if (item.unloaded) {
        args.some_unloaded = true
      }
      else {
        args.some_loaded = true
      }

      if (item.header) {
        args.some_header = true
      }
      else {
        args.some_no_header = true
      }

      for (let prop of App.get_edit_prop_list()) {
        if (App.some(App.get_edit(item, prop))) {
          args[`some_${prop}`] = true
          args.some_edits = true
        }
        else {
          args[`some_no_${prop}`] = true
        }

        if (App.some(App.get_edit(item, prop, false))) {
          args[`some_custom_${prop}`] = true
        }
        else {
          args[`some_no_custom_${prop}`] = true
        }
      }

      for (let color of App.colors()) {
        if (App.get_color(item) === color.id) {
          args[`some_color_id_${color.id}`] = true
        }
        else {
          args[`some_no_color_id_${color.id}`] = true
        }

        if (App.get_color(item, false) === color.id) {
          args[`some_custom_color_id_${color.id}`] = true
        }
        else {
          args[`some_no_custom_color_id_${color.id}`] = true
        }
      }

      if (command.some_nodes && !args.some_nodes) {
        if (App.tab_has_nodes(item)) {
          args.some_nodes = true
        }
      }

      if (command.some_parent && !args.some_parent) {
        if (App.tab_has_parent(item)) {
          args.some_parent = true
        }
      }

      if (command.some_root_possible && !args.some_root_possible) {
        if (App.root_possible(item)) {
          args.some_root_possible = true
        }
      }

      if (item.hostname) {
        args.some_hostname = true
      }

      if (item.ruled) {
        args.some_ruled = true
      }

      if (item.container_name) {
        args.some_container = true
      }
    }
  }

  if (args.some_split_top || args.some_split_bottom) {
    args.some_split = true
  }
  else {
    args.some_no_split = true
  }

  if (args.some_custom_split_top || args.some_custom_split_bottom) {
    args.some_custom_split = true
  }
  else {
    args.some_no_custom_split = true
  }

  let valid = true

  function check_1 (what) {
    if (!valid) {
      return
    }

    if (command[what]) {
      if (!args[what]) {
        valid = false
      }
    }
  }

  function check_2 (what, value) {
    if (!valid) {
      return
    }

    if (command[what]) {
      if (command[what] !== value) {
        valid = false
      }
    }
  }

  function check_3 (what) {
    if (!valid) {
      return
    }

    if (command[what]) {
      let value = command[what]

      if (!args[`${what}_${value}`]) {
        valid = false
      }
    }
  }

  if (valid) {
    if (command.modes && ![`lock_screen`].includes(args.mode)) {
      if (command.modes.includes(`items`)) {
        if (!args.on_items) {
          valid = false
        }
      }
      else if (command.modes.includes(`search`)) {
        if (!App.search_modes.includes(args.mode)) {
          valid = false
        }
      }
      else if (!command.modes.includes(args.mode)) {
        valid = false
      }
    }
  }

  check_1(`single`)
  check_1(`multiple`)
  check_1(`item`)
  check_1(`color`)
  check_1(`some_pinned`)
  check_1(`some_unpinned`)
  check_1(`some_muted`)
  check_1(`some_unmuted`)
  check_1(`some_loaded`)
  check_1(`some_unloaded`)
  check_1(`some_header`)
  check_1(`some_no_header`)
  check_1(`some_edits`)
  check_1(`some_nodes`)
  check_1(`some_parent`)
  check_1(`some_root_possible`)
  check_1(`some_hostname`)
  check_1(`some_ruled`)
  check_1(`some_container`)

  let edit_props = App.get_edit_prop_list()
  edit_props.push(`split`)

  for (let prop of edit_props) {
    check_1(`some_${prop}`)
    check_1(`some_no_${prop}`)
    check_1(`some_custom_${prop}`)
    check_1(`some_no_custom_${prop}`)
  }

  check_2(`media`, args.media)

  check_3(`some_color_id`)
  check_3(`some_no_color_id`)
  check_3(`some_custom_color_id`)
  check_3(`some_no_custom_color_id`)

  return valid
}

// For devs to check once in a while
App.check_dead_commands = () => {
  function check (cmd, key) {
    if (cmd === `none`) {
      return
    }

    if (cmd === App.separator_string) {
      return
    }

    if (!App.get_command(cmd)) {
      App.error(`Dead command: ${cmd} in ${key}`)
    }
  }

  let keys = [`cmd`, `middle`, `shift`, `ctrl`, `alt`]
  let keys_kb = [`cmd`]

  for (let key in App.setting_props) {
    let value = App.setting_props[key].value

    if (Array.isArray(value)) {
      for (let item of value) {
        if (typeof item === `object`) {
          for (let key2 in item) {
            if (key === `keyboard_shortcuts`) {
              if (keys_kb.includes(key2)) {
                check(item[key2], key)
              }
            }
            else if (keys.includes(key2)) {
              check(item[key2], key)
            }
          }
        }
      }
    }
    else {
      if (key.endsWith(`_header`)) {
        continue
      }

      let value = App.setting_props[key].value

      if (key === `double_click_item`) {
        check(value, key)
      }
      else if (key.startsWith(`middle_click_`)) {
        check(value, key)
      }
      else if (key.startsWith(`gesture_`)) {
        check(value, key)
      }
    }
  }
}

App.cmd_item = (args = {}) => {
  let def_args = {
    short: false,
    from: `cmd_item`,
  }

  App.def_args(def_args, args)

  if (!args.command) {
    args.command = App.get_command(args.cmd)
  }

  if (!args.command) {
    App.error(`${args.from} -> No command: ${args.cmd}`)
    return
  }

  return {
    e: args.e,
    icon: App.clone_if_node(args.command.icon),
    text: App.command_name(args.command, args.short),
    info: args.command.info,
    action: (e) => {
      App.run_command({
        cmd: args.command.cmd,
        item: args.item,
        from: args.from,
        e,
      })
    },
  }
}

App.cmd_list = (cmds, short = false) => {
  let items = []

  for (let cmd of cmds) {
    if (cmd === App.separator_string) {
      App.sep(items)
    }
    else {
      items.push(App.cmd_item({cmd, short}))
    }
  }

  return items
}

App.show_cmds_menu = (args = {}) => {
  let def_args = {
    check: true,
    short: false,
  }

  App.def_args(def_args, args)
  let items = []

  if (!args.cmds.length) {
    items.push({
      text: `No items yet`,
      action: (e) => {
        App.alert(`Add some in Settings`)
      },
      empty: true,
    })
  }
  else {
    for (let obj of args.cmds) {
      if (obj.cmd === App.separator_string) {
        App.sep(items)
        continue
      }

      let cmd = App.get_command(obj.cmd)

      if (!cmd) {
        continue
      }

      let cmd_obj = {
        from: args.from,
        item: args.item,
      }

      let shift

      if (obj.shift) {
        shift = App.get_command(obj.shift)
      }

      let ctrl

      if (obj.ctrl) {
        ctrl = App.get_command(obj.ctrl)
      }

      let alt

      if (obj.alt) {
        alt = App.get_command(obj.alt)
      }

      let middle

      if (obj.middle) {
        middle = App.get_command(obj.middle)
      }

      let ok = true
      let cmd_ok = true
      let shift_ok = true
      let ctrl_ok = true
      let alt_ok = true
      let middle_ok = true

      if (args.check) {
        cmd_ok = App.check_command(cmd, cmd_obj)

        if (shift || ctrl || alt || middle) {
          middle_ok = App.check_command(middle, cmd_obj)
          shift_ok = App.check_command(shift, cmd_obj)
          ctrl_ok = App.check_command(ctrl, cmd_obj)
          alt_ok = App.check_command(alt, cmd_obj)

          if ([cmd_ok, shift_ok, ctrl_ok, alt_ok, middle_ok].every(c => !c)) {
            ok = false
          }
        }
        else if (!cmd_ok) {
          ok = false
        }
      }

      if (!ok) {
        continue
      }

      let infos = []
      let name = App.command_name(cmd, args.short)

      let item_obj = {
        text: name,
        action: (e) => {
          if (cmd_ok) {
            cmd_obj.e = e
            cmd_obj.cmd = cmd.cmd
            App.run_command(cmd_obj)
          }
        },
        icon: App.clone_if_node(cmd.icon),
      }

      infos.push(cmd.info)

      function add_cmd(is_ok, cmd, str, name) {
        if (cmd) {
          item_obj[`${str}_action`] = (e) => {
            if (is_ok) {
              App.run_command({
                cmd: cmd.cmd,
                from: args.from,
                item: args.item,
                e,
              })
            }
          }

          infos.push(`${name}: ${cmd.name}`)
        }
      }

      add_cmd(middle_ok, middle, `middle`, `Middle`)
      add_cmd(shift_ok, shift, `shift`, `Shift`)
      add_cmd(ctrl_ok, ctrl, `ctrl`, `Ctrl`)
      add_cmd(alt_ok, alt, `alt`, `Alt`)

      item_obj.info = infos.join(`\n`)
      items.push(item_obj)
    }
  }

  return items
}

App.command_name = (command, force_short = false) => {
  if (command.short_name && App.get_setting(`short_commands`)) {
    return command.short_name
  }
  else if (command.short_name && force_short) {
    return command.short_name
  }

  return command.name
}

App.custom_menu_items = (args = {}) => {
  let def_args = {
    short: false,
  }

  App.def_args(def_args, args)
  let cmds = App.get_setting(args.name)

  return App.show_cmds_menu({
    cmds,
    from: args.name,
    item: args.item,
    check: args.check,
    short: args.short,
  })
}

App.get_cmd_name = (cmd) => {
  let command = App.get_command(cmd)

  if (command) {
    return command.name
  }

  return `Unknown`
}

App.repeat_command = () => {
  if (!App.last_command) {
    return
  }

  App.run_command(App.last_command)
}