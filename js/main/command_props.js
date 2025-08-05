App.setup_commands = () => {
  function short_name(name) {
    return name.substring(0, 10).trim()
  }

  let tabs_icon = App.get_setting_icon(`tabs_mode`)
  let history_icon = App.get_setting_icon(`history_mode`)
  let bookmarks_icon = App.get_setting_icon(`bookmarks_mode`)
  let closed_icon = App.get_setting_icon(`closed_mode`)
  let pin_icon = App.get_setting_icon(`pin`)
  let normal_icon = App.get_setting_icon(`normal`)
  let playing_icon = App.get_setting_icon(`playing`)
  let loaded_icon = App.get_setting_icon(`loaded`)
  let unloaded_icon = App.get_setting_icon(`unloaded`)
  let muted_icon = App.get_setting_icon(`muted`)
  let unread_icon = App.get_setting_icon(`unread`)
  let obfuscated_icon = App.get_setting_icon(`obfuscated`)
  let notes_icon = App.get_setting_icon(`notes`)
  let header_icon = App.get_setting_icon(`header`) || App.zone_icon
  let subheader_icon = App.get_setting_icon(`subheader`) || App.zone_icon
  let hover_button_icon = App.get_setting_icon(`hover_button`)
  let root_icon = App.get_setting_icon(`root`)
  let node_icon = App.get_setting_icon(`node`)
  let parent_icon = App.get_setting_icon(`parent`)
  let title_icon = App.get_setting_icon(`title`)
  let tags_icon = App.get_setting_icon(`tags`)
  let image_icon = App.get_setting_icon(`image`)
  let video_icon = App.get_setting_icon(`video`)
  let audio_icon = App.get_setting_icon(`audio`)
  let edited_icon = App.get_setting_icon(`edited`)
  let container_icon = App.get_setting_icon(`container`)

  let main_title_icon = App.settings_icons.title
  let settings_icon = App.settings_icons.general
  let theme_icon = App.settings_icons.theme
  let filter_icon = App.settings_icons.filter
  let media_icon = App.settings_icons.media
  let tab_box_icon = App.settings_icons.tab_box
  let colors_icon = App.settings_icons.colors
  let favorites_icon = App.settings_icons.favorites
  let signal_icon = App.settings_icons.signals
  let browser_icon = App.settings_icons.browser
  let menu_icon = App.settings_icons.menus
  let footer_icon = App.settings_icons.footer
  let pinline_icon = App.settings_icons.pinline
  let gestures_icon = App.settings_icons.gestures
  let hat_icon = App.hat_icon
  let letters_icon = App.letters_icon
  let blur_icon = App.blur_icon
  let prev_icon = App.prev_icon
  let next_icon = App.next_icon
  let open_icon = App.open_icon
  let action_icon = App.action_icon
  let select_icon = App.select_icon

  let combo_icon = App.combo_icon
  let time_icon = App.time_icon
  let command_icon = App.command_icon
  let clipboard_icon = App.clipboard_icon
  let notepad_icon = App.notepad_icon
  let bot_icon = App.bot_icon
  let up_icon = App.up_arrow_icon
  let down_icon = App.down_arrow_icon
  let left_icon = App.left_arrow_icon
  let right_icon = App.right_arrow_icon
  let close_icon = App.close_icon
  let zone_icon = App.zone_icon
  let globe_icon = App.globe_icon
  let grasshopper_icon = App.grasshopper_icon
  let lock_icon = App.lock_icon
  let key_icon = App.key_icon
  let rewind_icon = App.rewind_icon
  let new_icon = App.new_icon
  let duplicate_icon = App.duplicate_icon
  let keyboard_icon = App.keyboard_icon
  let mouse_icon = App.mouse_icon
  let tree_icon = App.tree_icon
  let extra_icon = App.extra_icon
  let template_icon = App.template_icon
  let plus_icon = App.plus_icon
  let minus_icon = App.minus_icon
  let flashlight_icon = App.flashlight_icon
  let shroom_icon = App.shroom_icon
  let window_icon = App.window_icon
  let mirror_icon = App.mirror_icon
  let data_icon = App.data_icon

  let tbmodes = []

  for (let mode in App.tab_box_modes) {
    let m_name = App.capitalize(mode)
    let name = `Tab Box: ${m_name}`
    let icon = App.tab_box_modes[mode].icon

    tbmodes.push({
      name,
      short_name: m_name,
      cmd: `change_tab_box_${mode}`,
      icon,
      action: (args) => {
        App.change_tab_box_mode(mode)
      },
      info: `Change the Tab Box mode: ${mode}`,
    })

    name = `Toggle Tab Box: ${m_name}`

    tbmodes.push({
      name,
      short_name: m_name,
      cmd: `toggle_tab_box_${mode}`,
      icon,
      action: (args) => {
        App.change_tab_box_mode(mode, true, true)
      },
      info: `Toggle the Tab Box mode: ${mode}`,
    })
  }

  let color_filters = []
  let color_changers = []
  let color_removers = []
  let color_closers = []

  color_filters.push({
    name: `Filter All Colors`,
    short_name: `All Colors`,
    cmd: `filter_color_all`,
    modes: [`items`],
    icon: colors_icon,
    filter_mode: true,
    action: (args) => {
      App.filter_color({
        mode: args.mode,
        id: `all`,
        toggle: true,
        from: args.from,
      })
    },
    info: `Filter all colors`,
  })

  for (let color of App.colors()) {
    let icon, name, short
    icon = App.color_icon(color.id)
    name = `Filter ${color.name}`

    color_filters.push({
      name,
      short_name: color.name,
      cmd: `filter_color_${color.id}`,
      modes: [`items`],
      icon,
      filter_mode: true,
      action: (args) => {
        App.filter_color({
          mode: args.mode,
          id: color.id,
          toggle: true,
          from: args.from,
        })
      },
      info: `Filter color (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `Show ${color.name}`

    color_filters.push({
      name,
      short_name: color.name,
      cmd: `show_color_${color.id}`,
      icon,
      action: (args) => {
        App.show_tab_list(`color_${color.id}`, args.e)
      },
      info: `Show color (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `Color ${color.name}`
    short = color.name

    color_changers.push({
      name,
      short_name: short,
      cmd: `color_${color.id}`,
      some_no_color_id: color.id,
      modes: [`tabs`],
      item: true,
      icon,
      action: (args) => {
        App.edit_tab_color({item: args.item, color: color.id})
      },
      info: `Add a custom color to tabs (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `Toggle ${color.name}`
    short = color.name

    color_changers.push({
      name,
      short_name: short,
      cmd: `toggle_color_${color.id}`,
      modes: [`tabs`],
      item: true,
      icon,
      action: (args) => {
        App.edit_tab_color({item: args.item, color: color.id, toggle: true})
      },
      info: `Toggle color on or off (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `Remove ${color.name}`
    short = `Rm ${color.name}`

    color_removers.push({
      name,
      short_name: short,
      cmd: `remove_color_${color.id}`,
      modes: [`tabs`],
      some_custom_color_id: color.id,
      some_custom_color: true,
      icon,
      action: (args) => {
        App.remove_color(color.id)
      },
      info: `Remove color from tabs (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `Remove All ${color.name}`
    short = `Rm All ${color.name}`

    color_removers.push({
      name,
      short_name: short,
      cmd: `remove_all_color_${color.id}`,
      modes: [`tabs`],
      icon,
      action: (args) => {
        App.remove_color(color.id)
      },
      info: `Remove color from all tabs (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `Close ${color.name}`

    color_closers.push({
      name,
      cmd: `close_color_${color.id}`,
      icon: close_icon,
      action: (args) => {
        App.close_color(color.id)
      },
      info: `Close tabs with this color (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `${color.name} Up`

    color_closers.push({
      name,
      cmd: `jump_tabs_color_${color.id}_up`,
      icon,
      action: (args) => {
        App.jump_tabs_color(color.id, true)
      },
      info: `Jump in reverse to tabs with this color (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `${color.name} Down`

    color_closers.push({
      name,
      cmd: `jump_tabs_color_${color.id}_down`,
      icon,
      action: (args) => {
        App.jump_tabs_color(color.id)
      },
      info: `Jump to tabs with this color (${color.name})`,
    })
  }

  color_filters.push({
    name: `Filter Color Menu`,
    short_name: `Colors`,
    cmd: `show_filter_color_menu`,
    modes: [`items`],
    item: true,
    icon: colors_icon,
    action: (args) => {
      App.show_filter_color_menu(args.mode, args.e)
    },
    info: `Show the Filter Color Menu`,
  })

  color_changers.push({
    name: `Color Menu`,
    short_name: `Color`,
    cmd: `show_color_menu`,
    modes: [`tabs`],
    item: true,
    icon: colors_icon,
    action: (args) => {
      App.show_color_menu(args.item, args.e)
    },
    info: `Show the Colors Menu`,
  })

  color_removers.push({
    name: `Remove Color`,
    short_name: `Rm Color`,
    cmd: `remove_color`,
    modes: [`tabs`],
    item: true,
    some_custom_color: true,
    icon: colors_icon,
    action: (args) => {
      App.edit_tab_color({item: args.item})
    },
    info: `Remove the custom color of tabs`,
  })

  color_removers.push({
    name: `Remove All Colors`,
    short_name: `Rm Colors`,
    cmd: `remove_all_colors`,
    modes: [`tabs`],
    item: true,
    icon: colors_icon,
    action: (args) => {
      App.remove_edits({what: [`color`], text: `colors`})
    },
    info: `Remove all colors from tabs`,
  })

  color_closers.push({
    name: `Replace Color`,
    cmd: `replace_color`,
    modes: [`tabs`],
    icon: colors_icon,
    action: (args) => {
      App.replace_color(args.e)
    },
    info: `Replace a color with another one`,
  })

  color_closers.push({
    name: `Close Color`,
    cmd: `close_color_all`,
    icon: close_icon,
    action: (args) => {
      App.close_color_all(args.e)
    },
    info: `Show the close color menu`,
  })

  color_closers.push({
    name: `Prev Color`,
    cmd: `cycle_color_previous`,
    modes: [`tabs`],
    icon: colors_icon,
    action: (args) => {
      App.cycle_color(args.item, `prev`)
    },
    info: `Cycle colors on the item backwards`,
  })

  color_closers.push({
    name: `Next Color`,
    cmd: `cycle_color_next`,
    modes: [`tabs`],
    icon: colors_icon,
    action: (args) => {
      App.cycle_color(args.item, `next`)
    },
    info: `Cycle colors on the item forwards`,
  })

  let media_filters = []

  for (let media of App.media_types) {
    let cap = App.capitalize(media)
    let icon = App.get_setting(`${media}_icon`)
    let name = `Filter ${cap}`.trim()

    media_filters.push({
      name,
      short_name: cap,
      cmd: `filter_media_${media}`,
      modes: [`items`],
      icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter Media (${media})`,
    })
  }

  let show_modes = []
  let mode_menus = []

  for (let mode of App.modes) {
    let icon = App.mode_icon(mode)
    let m_name = App.get_mode_name(mode, false)
    let name = `Show ${m_name}`

    show_modes.push({
      name,
      short_name: m_name,
      cmd: `show_mode_${mode}`,
      icon,
      action: (args) => {
        App.show_mode({mode, reuse_filter: true})
      },
      info: `Show Mode: ${mode}`,
    })
  }

  show_modes.push({
    name: `Show Main Mode`,
    short_name: `Main Mode`,
    cmd: `show_main_mode`,
    icon: tabs_icon,
    action: (args) => {
      App.show_main_mode()
    },
    info: `Show the Main Mode`,
  })

  let settings_categories = []

  for (let category in App.setting_catprops) {
    let icon = App.settings_icons[category]
    let c_name = App.category_string(category)
    let name = `Set: ${c_name}`

    settings_categories.push({
      name,
      short_name: c_name,
      cmd: `settings_category_${category}`,
      icon,
      action: (args) => {
        App.show_settings_category(category)
      },
      info: `Show Settings (${c_name})`,
    })
  }

  let custom_urls = []

  for (let [i, item] of App.get_setting(`custom_urls`).entries()) {
    let num = i + 1
    let id = item._id_

    custom_urls.push({
      name: item.name,
      cmd: `open_url_${id}`,
      icon: item.icon || browser_icon,
      action: (args) => {
        App.open_custom_url(args.item, num, args.from)
      },
      info: `Open Custom URL (${num})`,
    })

    custom_urls.push({
      name: `${item.name} (Pin)`,
      short_name: item.name,
      cmd: `open_url_${id}_pin`,
      icon: item.icon || browser_icon,
      action: (args) => {
        App.open_custom_url(args.item, num, args.from, `pin`)
      },
      info: `Open Custom URL (${num}) (Pin)`,
    })

    custom_urls.push({
      name: `${item.name} (Normal)`,
      short_name: item.name,
      cmd: `open_url_${id}_normal`,
      icon: item.icon || browser_icon,
      action: (args) => {
        App.open_custom_url(args.item, num, args.from, `normal`)
      },
      info: `Open Custom URL (${num}) (Normal)`,
    })

    custom_urls.push({
      name: `${item.name} (Replace)`,
      short_name: item.name,
      cmd: `open_url_${id}_replace`,
      icon: item.icon || browser_icon,
      action: (args) => {
        App.open_custom_url(args.item, num, args.from, `replace`)
      },
      info: `Open Custom URL (${num}) (Replace)`,
    })
  }

  let signals = []

  for (let [i, item] of App.get_setting(`signals`).entries()) {
    let num = i + 1
    let id = item._id_

    signals.push({
      name: item.name,
      short_name: short_name(item.name),
      cmd: `send_signal_${id}`,
      icon: item.icon || signal_icon,
      signal_mode: true,
      action: (args) => {
        App.send_signal(item)
      },
      info: `Send Signal (${num})`,
    })
  }

  let theme_nums = []

  for (let i = 1; i <= App.themes.length; i++) {
    theme_nums.push({
      name: `Theme ${i}`,
      cmd: `set_theme_${i}`,
      icon: theme_icon,
      action: (args) => {
        App.set_theme(i)
      },
      info: `Set Theme (${i})`,
    })
  }

  let tabnums = []

  for (let i = 1; i <= App.max_tab_num; i++) {
    tabnums.push({
      name: `Focus Tab ${i}`,
      cmd: `focus_tab_${i}`,
      min_items: i,
      icon: tabs_icon,
      action: (args) => {
        App.focus_tab_number(i)
      },
      info: `Focus tab by index (${i})`,
    })
  }

  let cmd_combos = []

  for (let [i, combo] of App.get_setting(`command_combos`).entries()) {
    cmd_combos.push({
      name: combo.name,
      short: short_name(combo.name),
      cmd: `run_command_combo_${combo._id_}`,
      icon: combo.icon || combo_icon,
      action: async (args) => {
        await App.run_command_combo(combo, args.item, args.e)
      },
      info: `Run Command Combo (${i})`,
    })
  }

  let custom_commands = []

  for (let [i, cmd] of App.get_setting(`custom_commands`).entries()) {
    custom_commands.push({
      name: cmd.name,
      short: short_name(cmd.name),
      cmd: `run_custom_command_${cmd._id_}`,
      icon: cmd.icon || command_icon,
      action: async (args) => {
        await App.run_custom_command(cmd, args.item, args.e)
      },
      info: `Run Custom Command (${i})`,
    })
  }

  let templates = []

  for (let [i, template] of App.get_setting(`templates`).entries()) {
    templates.push({
      name: template.name,
      short: short_name(template.name),
      cmd: `apply_template_${template._id_}`,
      modes: [`tabs`],
      icon: template.cmd_icon || template_icon,
      action: (args) => {
        App.apply_template(template, args.item)
      },
      info: `Apply Template (${i})`,
    })
  }

  let gen_menus = []

  for (let i = 1; i <= App.num_generic_menus; i++) {
    let menu = App.get_setting(`generic_menu_${i}`)
    let skip_palette = false

    if (!menu || !menu.length) {
      skip_palette = true
    }

    let name = App.get_setting(`generic_menu_name_${i}`) || `Gen Menu ${i}`
    let icon = App.get_setting(`generic_menu_icon_${i}`) || menu_icon

    gen_menus.push({
      name,
      short_name: short_name(name),
      cmd: `show_generic_menu_${i}`,
      skip_palette,
      icon,
      action: (args) => {
        App.show_generic_menu(i, args.item, args.e)
      },
      info: `Show Generic Menu (${i})`,
    })
  }

  let custom_tags = []

  for (let item of App.get_setting(`custom_tags`)) {
    custom_tags.push({
      name: `Tag: ${item.tag}`,
      short_name: item.tag,
      cmd: `add_tag_${item.tag}`,
      modes: [`tabs`],
      item: true,
      icon: tags_icon,
      action: (args) => {
        App.add_tag(args.item, item.tag)
      },
      info: `Add the '${item.tag}' tag to tabs`,
    })
  }

  App.commands = [
    {
      name: `Go To Top`,
      short_name: `Top`,
      cmd: `go_to_top`,
      modes: [`items`],
      icon: up_icon,
      action: (args) => {
        App.go_to_top_or_bottom({what: `top`, e: args.e})
      },
      info: `Go to the top of the list`,
    },
    {
      name: `Go To Bottom`,
      short_name: `Bottom`,
      cmd: `go_to_bottom`,
      modes: [`items`],
      icon: down_icon,
      action: (args) => {
        App.go_to_top_or_bottom({what: `bottom`, e: args.e})
      },
      info: `Go to the bottom of the list`,
    },
    {
      name: `Scroll Up`,
      cmd: `scroll_up`,
      modes: [`items`],
      icon: up_icon,
      action: (args) => {
        App.scroll(args.mode, `up`)
      },
      info: `Scroll up one step`,
    },
    {
      name: `Scroll Down`,
      cmd: `scroll_down`,
      modes: [`items`],
      icon: down_icon,
      action: (args) => {
        App.scroll(args.mode, `down`)
      },
      info: `Scroll down one step`,
    },
    {
      name: `Page Up`,
      cmd: `page_up`,
      modes: [`items`],
      icon: up_icon,
      action: (args) => {
        App.scroll_page(args.mode, `up`)
      },
      info: `Scroll up one page`,
    },
    {
      name: `Page Down`,
      cmd: `page_down`,
      modes: [`items`],
      icon: down_icon,
      action: (args) => {
        App.scroll_page(args.mode, `down`)
      },
      info: `Scroll down one page`,
    },
    {
      name: `Step Back`,
      short_name: `Back`,
      cmd: `step_back`,
      modes: [`items`],
      icon: left_icon,
      action: (args) => {
        App.step_back()
      },
      info: `Do the Step Back action. What it does depend on the current state`,
    },
    {
      name: `Esc Key`,
      short_name: `Esc`,
      cmd: `trigger_esc_key`,
      icon: keyboard_icon,
      skip_palette: true,
      action: (args) => {
        App.trigger_esc_key()
      },
      info: `Trigger the Esc Key`,
    },
    {
      name: `Enter Key`,
      short_name: `Enter`,
      cmd: `trigger_enter_key`,
      icon: keyboard_icon,
      skip_palette: true,
      action: (args) => {
        App.trigger_enter_key()
      },
      info: `Trigger the Enter Key`,
    },
    {
      name: `Backspace Key`,
      short_name: `Backspace`,
      cmd: `trigger_backspace_key`,
      icon: keyboard_icon,
      skip_palette: true,
      action: (args) => {
        App.trigger_backspace_key()
      },
      info: `Trigger the Backspace Key`,
    },
    {
      name: `Up Key`,
      short_name: `Up`,
      cmd: `trigger_up_key`,
      icon: keyboard_icon,
      skip_palette: true,
      action: (args) => {
        App.trigger_up_key()
      },
      info: `Trigger the Up Key`,
    },
    {
      name: `Down Key`,
      short_name: `Down`,
      cmd: `trigger_down_key`,
      icon: keyboard_icon,
      skip_palette: true,
      action: (args) => {
        App.trigger_down_key()
      },
      info: `Trigger the Down Key`,
    },
    {
      name: `Left Key`,
      short_name: `Left`,
      cmd: `trigger_left_key`,
      icon: keyboard_icon,
      skip_palette: true,
      action: (args) => {
        App.trigger_left_key()
      },
      info: `Trigger the Left Key`,
    },
    {
      name: `Right Key`,
      short_name: `Right`,
      cmd: `trigger_right_key`,
      icon: keyboard_icon,
      skip_palette: true,
      action: (args) => {
        App.trigger_right_key()
      },
      info: `Trigger the Right Key`,
    },
    {
      name: `Left Click`,
      short_name: `Left`,
      cmd: `trigger_left_click`,
      icon: mouse_icon,
      skip_palette: true,
      action: (args) => {
        App.trigger_left_click()
      },
      info: `Trigger the Left Click`,
    },
    {
      name: `Right Click`,
      short_name: `Right`,
      cmd: `trigger_right_click`,
      icon: mouse_icon,
      skip_palette: true,
      action: (args) => {
        App.trigger_right_click()
      },
      info: `Trigger the Right Click`,
    },
    {
      name: `Middle Click`,
      short_name: `Middle`,
      cmd: `trigger_middle_click`,
      icon: mouse_icon,
      skip_palette: true,
      action: (args) => {
        App.trigger_middle_click()
      },
      info: `Trigger the Middle Click`,
    },
    {
      name: `Select All`,
      short_name: `Select`,
      cmd: `select_all_items`,
      modes: [`items`],
      icon: select_icon,
      action: (args) => {
        App.select_all(args.mode, true)
      },
      info: `Select all items`,
    },
    {
      name: `Deselect All`,
      short_name: `Deselect`,
      cmd: `deselect_all_items`,
      modes: [`items`],
      icon: select_icon,
      action: (args) => {
        App.deselect_all(args.mode, true)
      },
      info: `Deselect all items`,
    },
    {
      name: `Select Above`,
      short_name: `Above`,
      cmd: `select_items_above`,
      modes: [`items`],
      icon: up_icon,
      action: (args) => {
        App.select_to_edge(args.mode, `up`)
      },
      info: `Select all items above this item`,
    },
    {
      name: `Select Below`,
      short_name: `Below`,
      cmd: `select_items_below`,
      modes: [`items`],
      icon: down_icon,
      action: (args) => {
        App.select_to_edge(args.mode, `down`)
      },
      info: `Select all items below this item`,
    },
    {
      name: `Select Up`,
      short_name: `Sel Up`,
      cmd: `select_item_up`,
      modes: [`items`],
      icon: up_icon,
      action: (args) => {
        App.select_up_down(args.mode, `up`)
      },
      info: `Select the item above`,
    },
    {
      name: `Select Next Up`,
      short_name: `Sel Up`,
      cmd: `select_next_item_up`,
      modes: [`items`],
      icon: up_icon,
      action: (args) => {
        App.select_next(args.mode, `above`)
      },
      info: `Select the next item above`,
    },
    {
      name: `Select Down`,
      short_name: `Sel Down`,
      cmd: `select_item_down`,
      modes: [`items`],
      icon: down_icon,
      action: (args) => {
        App.select_up_down(args.mode, `down`)
      },
      info: `Select the item below`,
    },
    {
      name: `Select Next Down`,
      short_name: `Sel Down`,
      cmd: `select_next_item_down`,
      modes: [`items`],
      icon: up_icon,
      action: (args) => {
        App.select_next(args.mode, `below`)
      },
      info: `Select the next item below`,
    },
    {
      name: `Select Up Alt`,
      short_name: `Sel Up`,
      cmd: `select_item_up_alt`,
      modes: [`items`],
      icon: up_icon,
      action: (args) => {
        App.select_up_down(args.mode, `up`, true)
      },
      info: `Select the item above ignoring unloaded`,
    },
    {
      name: `Select Down Alt`,
      short_name: `Sel Down`,
      cmd: `select_item_down_alt`,
      modes: [`items`],
      icon: down_icon,
      action: (args) => {
        App.select_up_down(args.mode, `down`, true)
      },
      info: `Select the item below ignoring unloaded`,
    },
    {
      name: `To Zone Up`,
      short_name: `Zone Up`,
      cmd: `move_to_zone_up`,
      modes: [`tabs`],
      item: true,
      icon: up_icon,
      action: (args) => {
        App.move_to_zone_up(args.item)
      },
      info: `Move item to the zone above`,
    },
    {
      name: `To Zone Down`,
      short_name: `Zone Down`,
      cmd: `move_to_zone_down`,
      modes: [`tabs`],
      item: true,
      icon: down_icon,
      action: (args) => {
        App.move_to_zone_down()
      },
      info: `Move item to the zone below`,
    },
    {
      name: `First Pin`,
      cmd: `go_to_first_pinned_tab`,
      icon: pin_icon,
      action: (args) => {
        App.first_pinned_tab()
      },
      info: `Go to the first pinned tab`,
    },
    {
      name: `Last Pin`,
      cmd: `go_to_last_pinned_tab`,
      icon: pin_icon,
      action: (args) => {
        App.last_pinned_tab()
      },
      info: `Go to the last pinned tab`,
    },
    {
      name: `First Normal`,
      cmd: `go_to_first_normal_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.first_normal_tab()
      },
      info: `Go to the first normal tab`,
    },
    {
      name: `Last Normal`,
      cmd: `go_to_last_normal_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.last_normal_tab()
      },
      info: `Go to the last normal tab`,
    },

    ...tabnums,
    ...cmd_combos,
    ...custom_commands,
    ...gen_menus,
    ...templates,

    {
      name: `Edge Up`,
      cmd: `tabs_edge_up`,
      icon: right_icon,
      action: (args) => {
        App.edge_tab_up_down(`up`)
      },
      info: `Go to the next edge up`,
    },
    {
      name: `Edge Down`,
      cmd: `tabs_edge_down`,
      icon: right_icon,
      action: (args) => {
        App.edge_tab_up_down(`down`)
      },
      info: `Go to the next edge down`,
    },
    {
      name: `Copy Tabs`,
      short_name: `Copy`,
      cmd: `copy_tabs`,
      modes: [`tabs`],
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.copy_tabs(args.item)
      },
      info: `Copy tabs to paste later at another position`,
    },
    {
      name: `Paste Tabs`,
      short_name: `Paste`,
      cmd: `paste_tabs`,
      modes: [`tabs`],
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.paste_tabs(args.item)
      },
      info: `Paste tabs at the current position`,
    },
    {
      name: `Paste Filter`,
      short_name: `Paste`,
      cmd: `paste_filter`,
      icon: filter_icon,
      action: (args) => {
        App.paste_filter(args.mode)
      },
      info: `Paste into the filter input`,
    },
    {
      name: `Clear Filter`,
      short_name: `Paste`,
      cmd: `clear_filter`,
      icon: filter_icon,
      action: (args) => {
        App.clear_filter(args.mode)
      },
      info: `Clear the filter input`,
    },
    {
      name: `Prev Mode`,
      cmd: `show_previous_mode`,
      icon: prev_icon,
      action: (args) => {
        App.cycle_modes(true)
      },
      info: `Go to the previous mode`,
    },
    {
      name: `Next Mode`,
      cmd: `show_next_mode`,
      icon: next_icon,
      action: (args) => {
        App.cycle_modes()
      },
      info: `Go to the next mode`,
    },
    {
      name: `Prev Filter`,
      cmd: `do_prev_filter`,
      modes: [`items`],
      icon: filter_icon,
      action: (args) => {
        App.cycle_filter_modes(args.mode, true, args.e)
      },
      info: `Cycle to the previous filter`,
    },
    {
      name: `Next Filter`,
      cmd: `do_next_filter`,
      modes: [`items`],
      icon: filter_icon,
      action: (args) => {
        App.cycle_filter_modes(args.mode, false, args.e)
      },
      info: `Cycle to the next filter`,
    },

    ...show_modes,

    {
      name: `Show Settings`,
      short_name: `Settings`,
      cmd: `show_settings`,
      icon: settings_icon,
      action: (args) => {
        App.show_settings(args.e)
      },
      info: `Show the Settings window`,
    },
    {
      name: `Export Settings`,
      short_name: `E. Settings`,
      cmd: `export_settings`,
      icon: settings_icon,
      action: (args) => {
        App.export_settings()
      },
      info: `Export settings`,
    },
    {
      name: `Export Theme`,
      short_name: `E. Theme`,
      cmd: `export_theme`,
      icon: settings_icon,
      action: (args) => {
        App.export_theme()
      },
      info: `Export theme`,
    },
    {
      name: `Import Settings`,
      short_name: `Import`,
      cmd: `import_settings`,
      icon: settings_icon,
      action: (args) => {
        App.import_settings()
      },
      info: `Import settings`,
    },
    {
      name: `All Settings`,
      short_name: `Settings`,
      cmd: `show_all_settings`,
      icon: settings_icon,
      action: (args) => {
        App.show_all_settings()
      },
      info: `Show the All Settings window to search for a setting`,
    },
    {
      name: `Last Settings`,
      short_name: `Settings`,
      cmd: `show_last_settings`,
      icon: settings_icon,
      action: (args) => {
        App.show_last_settings()
      },
      info: `Go back to the last settings position you were at`,
    },
    {
      name: `Settings Summary`,
      cmd: `show_settings_summary`,
      icon: settings_icon,
      action: (args) => {
        App.settings_summary()
      },
      info: `Show the settings summary`,
    },
    {
      name: `Setting Guides`,
      cmd: `show_setting_guides`,
      icon: settings_icon,
      action: (args) => {
        App.show_setting_guides()
      },
      info: `Show the setting guides`,
    },
    {
      name: `Reset Settings`,
      cmd: `reset_settings`,
      icon: settings_icon,
      action: (args) => {
        App.reset_all_settings()
      },
      info: `Reset all settings`,
    },

    ...settings_categories,

    {
      name: `Prev Theme`,
      cmd: `set_previous_theme`,
      icon: theme_icon,
      action: (args) => {
        App.set_previous_theme()
      },
      info: `Set the previous theme`,
    },
    {
      name: `Next Theme`,
      cmd: `set_next_theme`,
      icon: theme_icon,
      action: (args) => {
        App.set_next_theme()
      },
      info: `Set the next theme`,
    },
    {
      name: `Theme Menu`,
      cmd: `show_theme_menu`,
      icon: theme_icon,
      action: (args) => {
        App.show_theme_menu(args.e)
      },
      info: `Show the theme menu`,
    },
    {
      name: `Background Menu`,
      short_name: `BG Menu`,
      cmd: `show_background_menu`,
      icon: theme_icon,
      action: (args) => {
        App.show_background_menu(args.e)
      },
      info: `Show the background menu`,
    },
    {
      name: `Paste Background`,
      short_name: `BG Menu`,
      cmd: `paste_background`,
      icon: theme_icon,
      action: (args) => {
        App.paste_background()
      },
      info: `Apply background from image URL in clipboard`,
    },
    {
      name: `Welcome`,
      cmd: `show_welcome_message`,
      icon: bot_icon,
      action: (args) => {
        App.show_intro_message()
      },
      info: `Show the welcome message`,
    },
    {
      name: `Show About`,
      short_name: `About`,
      cmd: `show_about`,
      icon: bot_icon,
      action: (args) => {
        App.show_about()
      },
      info: `Show the About window`,
    },
    {
      name: `Show Palette`,
      short_name: `Cmd...`,
      cmd: `show_palette`,
      skip_palette: true,
      icon: command_icon,
      action: (args) => {
        App.show_palette()
      },
      info: `Show the Command Palette`,
    },
    {
      name: `Toggle Favorites`,
      short_name: `Favs`,
      cmd: `toggle_favorites`,
      icon: favorites_icon,
      action: (args) => {
        App.toggle_favorites(args.mode)
      },
      info: `Show or hide the Favorites Bar or Button`,
    },
    {
      name: `Favorites Autohide`,
      short_name: `Favs Autohide`,
      cmd: `toggle_favorites_autohide`,
      icon: favorites_icon,
      action: (args) => {
        App.toggle_favorites_autohide()
      },
      info: `Enable or disable Favorites Autohide`,
    },
    {
      name: `Toggle Tab Box`,
      short_name: `Tab Box`,
      cmd: `toggle_tab_box`,
      icon: tab_box_icon,
      action: (args) => {
        App.toggle_tab_box()
      },
      info: `Show or hide the Tab Box`,
    },
    {
      name: `Show Tab Box`,
      short_name: `Show`,
      cmd: `show_tab_box`,
      icon: tab_box_icon,
      action: (args) => {
        App.show_tab_box(true, true)
      },
      info: `Show the Tab Box`,
    },
    {
      name: `Hide Tab Box`,
      short_name: `Hide`,
      cmd: `hide_tab_box`,
      icon: tab_box_icon,
      action: (args) => {
        App.hide_tab_box(true)
      },
      info: `Hide the Tab Box`,
    },
    {
      name: `Tab Box Select`,
      short_name: `Select`,
      cmd: `tab_box_select`,
      modes: [`items`],
      icon: tab_box_icon,
      action: (args) => {
        App.select_tab_box_tabs()
      },
      info: `Select the current Tab Box tabs`,
    },
    {
      name: `Tab Box Close`,
      short_name: `Close`,
      cmd: `tab_box_close`,
      icon: tab_box_icon,
      action: (args) => {
        App.close_tab_box_tabs()
      },
      info: `Close the current Tab Box tabs`,
    },
    {
      name: `Tab Box Top`,
      short_name: `TB Top`,
      cmd: `tab_box_go_to_top`,
      icon: up_icon,
      action: (args) => {
        App.scroll_tab_box_top()
      },
      info: `Go to the top of the Tab Box`,
    },
    {
      name: `Tab Box Bottom`,
      short_name: `TB Bottom`,
      cmd: `tab_box_go_to_bottom`,
      icon: down_icon,
      action: (args) => {
        App.scroll_tab_box_bottom()
      },
      info: `Go to the bottom of the Tab Box`,
    },
    {
      name: `Tab Box Scroll Up`,
      short_name: `TB Up`,
      cmd: `tab_box_scroll_up`,
      icon: up_icon,
      action: (args) => {
        App.tab_box_scroll_up()
      },
      info: `Scroll up on the Tab Box`,
    },
    {
      name: `Tab Box Scroll Down`,
      short_name: `TB Down`,
      cmd: `tab_box_scroll_down`,
      icon: down_icon,
      action: (args) => {
        App.tab_box_scroll_down()
      },
      info: `Scroll down on the Tab Box`,
    },
    {
      name: `Tab Box Prev Mode`,
      short_name: `TB Prev`,
      cmd: `tab_box_previous_mode`,
      icon: left_icon,
      action: (args) => {
        App.cycle_tab_box_mode(`prev`)
      },
      info: `Go to the previous mode in the Tab Box`,
    },
    {
      name: `Tab Box Next Mode`,
      short_name: `TB Next`,
      cmd: `tab_box_next_mode`,
      icon: right_icon,
      action: (args) => {
        App.cycle_tab_box_mode(`next`)
      },
      info: `Go to the next mode in the Tab Box`,
    },

    ...tbmodes,

    {
      name: `Toggle Taglist`,
      short_name: `Taglist`,
      cmd: `toggle_taglist`,
      icon: tags_icon,
      action: (args) => {
        App.toggle_taglist(args.mode)
      },
      info: `Show or hide the Taglist`,
    },
    {
      name: `Toggle Footer`,
      short_name: `Footer`,
      cmd: `toggle_footer`,
      icon: footer_icon,
      action: (args) => {
        App.toggle_footer()
      },
      info: `Show or hide the Footer`,
    },
    {
      name: `Toggle Auto Blur`,
      short_name: `Auto Blur`,
      cmd: `toggle_auto_blur`,
      icon: blur_icon,
      action: (args) => {
        App.toggle_auto_blur()
      },
      info: `Enable or disable Auto Blur`,
    },
    {
      name: `Item Menu`,
      cmd: `show_item_menu`,
      modes: [`items`],
      item: true,
      icon: menu_icon,
      action: (args) => {
        App.show_item_menu({item: args.item, e: args.e})
      },
      info: `Show the Item Menu`,
    },
    {
      name: `Item Action`,
      cmd: `item_action`,
      modes: [`items`],
      item: true,
      icon: action_icon,
      action: (args) => {
        App[`${args.mode}_action`]({item: args.item, from: args.from})
      },
      info: `Trigger the action for the selected item`,
    },
    {
      name: `Soft Action`,
      cmd: `soft_item_action`,
      modes: [`items`],
      item: true,
      icon: action_icon,
      action: (args) => {
        App[`${args.mode}_action`]({item: args.item, from: args.from, soft: true})
      },
      info: `Item action but without loading unloaded tabs`,
    },
    {
      name: `Reload Action`,
      cmd: `hard_item_action`,
      modes: [`items`],
      item: true,
      icon: action_icon,
      action: (args) => {
        App[`${args.mode}_action`]({item: args.item, from: args.from, reload: true})
      },
      info: `Item action that also triggers a reload`,
    },
    {
      name: `Hard Action`,
      cmd: `reload_item_action`,
      modes: [`items`],
      item: true,
      icon: action_icon,
      action: (args) => {
        App[`${args.mode}_action`]({item: args.item, from: args.from, hard: true})
      },
      info: `Item action that also triggers a hard reload`,
    },
    {
      name: `Select Item`,
      cmd: `select_item`,
      modes: [`items`],
      item: true,
      icon: select_icon,
      action: (args) => {
        App.select_item({item: args.item, scroll: `nearest_smooth`})
      },
      info: `Select an item`,
    },
    {
      name: `Select Range`,
      cmd: `select_item_range`,
      modes: [`items`],
      item: true,
      icon: select_icon,
      action: (args) => {
        App.select_range(args.item)
      },
      info: `Select range up to this item`,
    },
    {
      name: `Pick Item`,
      cmd: `pick_item`,
      modes: [`items`],
      item: true,
      icon: select_icon,
      action: (args) => {
        App.select_item({item: args.item, scroll: `nearest_smooth`, deselect: false})
      },
      info: `Pick an item to select multiple`,
    },
    {
      name: `Show Favorites`,
      short_name: `Favorites`,
      cmd: `show_favorites_menu`,
      icon: favorites_icon,
      action: (args) => {
        App.show_favorites_menu(args.e)
      },
      info: `Show the Favorites Menu`,
    },
    {
      name: `Filter All`,
      short_name: `All`,
      cmd: `filter_all`,
      modes: [`items`],
      icon: globe_icon,
      action: (args) => {
        App.filter_all(args.mode)
      },
      info: `Filter all items`,
    },
    {
      name: `Prev Filter`,
      cmd: `previous_filter`,
      modes: [`items`],
      icon: filter_icon,
      action: (args) => {
        App.previous_filter(args.mode)
      },
      info: `Use the previous filter used before going back to All`,
    },
    {
      name: `Open`,
      cmd: `open_items`,
      modes: [`items`],
      item: true,
      icon: open_icon,
      action: (args) => {
        App.open_items(args.item, true)
      },
      info: `Open items`,
    },
    {
      name: `View Media`,
      short_name: `View`,
      cmd: `view_media`,
      modes: [`items`],
      item: true,
      icon: media_icon,
      action: (args) => {
        App.view_media(args.item)
      },
      info: `View media item`,
    },
    {
      name: `Bookmark`,
      cmd: `bookmark_items`,
      modes: [`items`],
      item: true,
      some_no_header: true,
      icon: bookmarks_icon,
      action: (args) => {
        App.bookmark_items({item: args.item})
      },
      info: `Bookmark the selected items`,
    },
    {
      name: `Bookmark Page`,
      short_name: `Bookmark`,
      cmd: `bookmark_page`,
      icon: bookmarks_icon,
      action: (args) => {
        App.bookmark_active()
      },
      info: `Bookmark the current page`,
    },
    {
      name: `Save Folder`,
      short_name: `Save`,
      cmd: `save_bookmarks_folder_pick`,
      modes: [`bookmarks`],
      icon: bookmarks_icon,
      bookmarks_folder: true,
      action: (args) => {
        App.save_bookmarks_folder_pick(args.item, args.e)
      },
      info: `Save current bookmarks folder to use in the Tab Box`,
    },
    {
      name: `Toggle Folders`,
      short_name: `Folders`,
      cmd: `toggle_bookmark_folders`,
      modes: [`bookmarks`],
      icon: bookmarks_icon,
      action: (args) => {
        App.toggle_bookmark_folders()
      },
      info: `Toggle between showing bookmark folders or not in results`,
    },
    {
      name: `Parent Folder`,
      short_name: `Paret`,
      cmd: `go_to_bookmarks_parent_folder`,
      modes: [`bookmarks`],
      icon: bookmarks_icon,
      bookmarks_folder: true,
      action: (args) => {
        App.go_to_bookmarks_parent_folder()
      },
      info: `Go to the parent folder of the current bookmarks folder`,
    },
    {
      name: `To Folder`,
      cmd: `bookmark_items_folder`,
      modes: [`items`],
      item: true,
      some_no_header: true,
      icon: bookmarks_icon,
      action: (args) => {
        App.bookmark_items({item: args.item, pick_folder: true, e: args.e})
      },
      info: `Bookmark the selected items by picking a folder`,
    },
    {
      name: `To Folder 2`,
      short_name: `To Folder`,
      cmd: `bookmark_items_folder_2`,
      modes: [`items`],
      item: true,
      some_no_header: true,
      icon: bookmarks_icon,
      action: (args) => {
        App.bookmark_items({item: args.item, search_folder: true})
      },
      info: `Bookmark the selected items by searching a folder`,
    },
    {
      name: `Pick Folder`,
      short_name: `Folder`,
      cmd: `pick_bookmarks_folder`,
      modes: [`items`],
      icon: bookmarks_icon,
      action: (args) => {
        App.pick_bookmarks_folder(args.e)
      },
      info: `Pick a specific bookmarks folder to show`,
    },
    {
      name: `Search Folder`,
      short_name: `Folder`,
      cmd: `search_bookmarks_folder`,
      modes: [`items`],
      icon: bookmarks_icon,
      action: (args) => {
        App.search_bookmarks_folder()
      },
      info: `Search a specific bookmarks folder to show`,
    },
    {
      name: `Create Folder`,
      short_name: `Folder`,
      cmd: `create_bookmarks_folder`,
      modes: [`items`],
      icon: bookmarks_icon,
      action: (args) => {
        App.create_bookmarks_folder()
      },
      info: `Create a new bookmarks folder`,
    },
    {
      name: `Bookmark Rule`,
      short_name: `Rule`,
      cmd: `create_bookmark_rule`,
      modes: [`items`],
      item: true,
      icon: bookmarks_icon,
      action: (args) => {
        App.create_bookmark_rule(args.item, args.e)
      },
      info: `Create a bookmark rule`,
    },
    {
      name: `Copy URL`,
      short_name: `URL`,
      cmd: `copy_item_url`,
      modes: [`items`],
      item: true,
      single: true,
      icon: clipboard_icon,
      action: (args) => {
        App.copy_url(args.item)
      },
      info: `Copy the URL of an item`,
    },
    {
      name: `Copy Title`,
      short_name: `Title`,
      cmd: `copy_item_title`,
      modes: [`items`],
      item: true,
      single: true,
      icon: clipboard_icon,
      action: (args) => {
        App.copy_title(args.item)
      },
      info: `Copy the title of an item`,
    },
    {
      name: `Go Back`,
      short_name: `Back`,
      cmd: `browser_back`,
      icon: browser_icon,
      action: (args) => {
        App.browser_back(args.item)
      },
      info: `Go back in browser history`,
    },
    {
      name: `Go Forward`,
      short_name: `Forward`,
      cmd: `browser_forward`,
      icon: browser_icon,
      action: (args) => {
        App.browser_forward(args.item)
      },
      info: `Go forward in browser history`,
    },
    {
      name: `Reload Page`,
      short_name: `Reload`,
      cmd: `browser_reload`,
      icon: browser_icon,
      action: (args) => {
        App.browser_reload(args.item)
      },
      info: `Reload the current page`,
    },
    {
      name: `Hard Reload`,
      short_name: `Hard`,
      cmd: `browser_hard_reload`,
      icon: browser_icon,
      action: (args) => {
        App.browser_reload(args.item, true)
      },
      info: `Reload the current page ignoring the cache`,
    },
    {
      name: `Main Menu`,
      short_name: `Menu`,
      cmd: `show_main_menu`,
      modes: [`items`],
      icon: tabs_icon,
      action: (args) => {
        App.show_main_menu(args.mode)
      },
      info: `Show the Main Menu`,
    },
    {
      name: `Filter Menu`,
      short_name: `Filter`,
      cmd: `show_filter_menu`,
      modes: [`items`],
      icon: filter_icon,
      action: (args) => {
        App.show_filter_menu(args.mode)
      },
      info: `Show the Filter Menu`,
    },
    {
      name: `Focus Filter`,
      short_name: `Focus`,
      cmd: `focus_filter_input`,
      icon: filter_icon,
      action: (args) => {
        App.focus_filter(args.mode)
      },
      info: `Focus the filter input`,
    },
    {
      name: `Unfocus Filter`,
      short_name: `Unfocus`,
      cmd: `unfocus_filter_input`,
      icon: filter_icon,
      action: (args) => {
        App.unfocus_filter(args.mode)
      },
      info: `Unfocus the filter input`,
    },

    ...mode_menus,

    {
      name: `Actions Menu`,
      short_name: `Actions`,
      cmd: `show_actions_menu`,
      icon: menu_icon,
      action: (args) => {
        App.show_actions_menu(args.mode, args.item, args.e)
      },
      info: `Show the Actions Menu`,
    },
    {
      name: `Browser Menu`,
      short_name: `Browser`,
      cmd: `show_browser_menu`,
      icon: browser_icon,
      action: (args) => {
        App.show_browser_menu(args.e)
      },
      info: `Show the Browser Menu`,
    },
    {
      name: `Empty Menu`,
      short_name: `Empty`,
      cmd: `show_empty_menu`,
      modes: [`items`],
      icon: menu_icon,
      action: (args) => {
        App.show_empty_menu(args.item, args.e)
      },
      info: `Show the Empty Menu`,
    },
    {
      name: `Extra Menu`,
      short_name: `Extra`,
      cmd: `show_extra_menu`,
      modes: [`items`],
      item: true,
      icon: extra_icon,
      action: (args) => {
        App.show_extra_menu(args.item, args.e)
      },
      info: `Show the Extra Menu`,
    },
    {
      name: `Hover Btn Menu`,
      short_name: `Hover`,
      cmd: `show_hover_button_menu`,
      item: true,
      icon: hover_button_icon,
      action: (args) => {
        App.show_hover_button_menu(args.item, args.e)
      },
      info: `Show the Hover Menu`,
    },
    {
      name: `Pinline Menu`,
      short_name: `Pinline`,
      cmd: `show_pinline_menu`,
      icon: pinline_icon,
      action: (args) => {
        App.show_pinline_menu(args.e)
      },
      info: `Show the Pinline Menu`,
    },
    {
      name: `Tab Box Menu`,
      short_name: `Tab Box`,
      cmd: `show_tab_box_menu`,
      icon: tab_box_icon,
      action: (args) => {
        App.show_tab_box_menu(args.e)
      },
      info: `Show the Tab Box Menu`,
    },
    {
      name: `Footer Menu`,
      short_name: `Footer`,
      cmd: `show_footer_menu`,
      icon: footer_icon,
      action: (args) => {
        App.show_footer_menu(args.e)
      },
      info: `Show the Footer Menu`,
    },
    {
      name: `New Tab`,
      short_name: `New`,
      cmd: `open_new_tab`,
      icon: new_icon,
      action: (args) => {
        App.new_tab(args.item, args.from)
      },
      info: `Open a new tab`,
    },
    {
      name: `New Tab Above`,
      short_name: `New Above`,
      cmd: `open_new_tab_above`,
      icon: new_icon,
      action: (args) => {
        App.new_tab(args.item, `cmd_above`)
      },
      info: `Open a new tab above`,
    },
    {
      name: `New Tab Below`,
      short_name: `New Below`,
      cmd: `open_new_tab_below`,
      icon: new_icon,
      action: (args) => {
        App.new_tab(args.item, `cmd_below`)
      },
      info: `Open a new tab below`,
    },
    {
      name: `New Tab Top`,
      short_name: `New Top`,
      cmd: `open_new_tab_top`,
      icon: new_icon,
      action: (args) => {
        App.new_tab(args.item, `cmd_top`)
      },
      info: `Open a new tab at the top`,
    },
    {
      name: `New Tab Bottom`,
      short_name: `New Bottom`,
      cmd: `open_new_tab_bottom`,
      icon: new_icon,
      action: (args) => {
        App.new_tab(args.item, `cmd_bottom`)
      },
      info: `Open a new tab at the bottom`,
    },
    {
      name: `Unload Tab`,
      name_multiple: `Unload Tabs`,
      short_name: `Unload`,
      cmd: `unload_tabs`,
      modes: [`tabs`],
      some_loaded: true,
      item: true,
      icon: unloaded_icon,
      action: (args) => {
        App.unload_tabs(args.item)
      },
      info: `Unload tabs`,
    },
    {
      name: `Unload Others`,
      cmd: `unload_other_tabs`,
      modes: [`tabs`],
      item: true,
      icon: unloaded_icon,
      action: (args) => {
        App.unload_other_tabs(args.item)
      },
      info: `Unload all tabs except the selected one`,
    },
    {
      name: `Unload Normal`,
      cmd: `unload_normal_tabs`,
      modes: [`tabs`],
      item: true,
      icon: unloaded_icon,
      action: (args) => {
        App.unload_normal_tabs(args.item)
      },
      info: `Unload all normal tabs`,
    },
    {
      name: `Unload Pins`,
      cmd: `unload_pinned_tabs`,
      modes: [`tabs`],
      item: true,
      icon: unloaded_icon,
      action: (args) => {
        App.unload_pinned_tabs(args.item)
      },
      info: `Unload all pinned tabs`,
    },
    {
      name: `Load Tab`,
      name_multiple: `Load Tabs`,
      short_name: `Load`,
      cmd: `load_tabs`,
      modes: [`tabs`],
      some_unloaded: true,
      item: true,
      icon: loaded_icon,
      action: (args) => {
        App.load_tabs(args.item)
      },
      info: `Load tabs that are unloaded`,
    },
    {
      name: `Duplicate Tab`,
      name_multiple: `Duplicate Tabs`,
      short_name: `Duplicate`,
      cmd: `duplicate_tabs`,
      modes: [`tabs`],
      item: true,
      some_no_header: true,
      icon: duplicate_icon,
      action: (args) => {
        App.duplicate_tabs(args.item)
      },
      info: `Duplicate tabs`,
    },
    {
      name: `Change URL`,
      short_name: `URL`,
      cmd: `change_tabs_url`,
      modes: [`tabs`],
      item: true,
      some_no_header: true,
      icon: tabs_icon,
      action: (args) => {
        App.change_tabs_url(args.item)
      },
      info: `Change the URL of tabs`,
    },
    {
      name: `Make Tab New`,
      short_name: `Make New`,
      cmd: `make_tabs_new`,
      modes: [`tabs`],
      item: true,
      icon: new_icon,
      action: (args) => {
        App.make_tabs_new(args.item)
      },
      info: `Make a tab new`,
    },
    {
      name: `Obfuscate Tab`,
      name_multiple: `Obfuscate Tabs`,
      short_name: `Obfuscate`,
      cmd: `obfuscate_tabs`,
      modes: [`tabs`],
      item: true,
      some_no_header: true,
      some_no_obfuscated: true,
      icon: obfuscated_icon,
      action: (args) => {
        App.obfuscate_tabs(args.item)
      },
      info: `Hide the text of tabs for privacy reasons`,
    },
    {
      name: `Deobfuscate Tab`,
      name_multiple: `Deobfuscate Tabs`,
      short_name: `Deobfuscate`,
      cmd: `deobfuscate_tabs`,
      modes: [`tabs`],
      item: true,
      some_no_header: true,
      some_obfuscated: true,
      icon: obfuscated_icon,
      action: (args) => {
        App.deobfuscate_tabs(args.item)
      },
      info: `Restore the text of obfuscated tabs`,
    },
    {
      name: `Toggle Obfuscate`,
      short_name: `Obfuscate`,
      cmd: `toggle_obfuscate_tabs`,
      modes: [`tabs`],
      item: true,
      some_no_header: true,
      icon: obfuscated_icon,
      action: (args) => {
        App.toggle_obfuscate_tabs(args.item)
      },
      info: `Obfuscate or deobfuscate tabs`,
    },
    {
      name: `Move To Window`,
      short_name: `Window`,
      cmd: `show_windows_menu`,
      modes: [`tabs`],
      item: true,
      icon: window_icon,
      action: (args) => {
        App.show_windows_menu(args.item, args.e)
      },
      info: `Move tabs to another window`,
    },
    {
      name: `Focus Window`,
      short_name: `Window`,
      cmd: `focus_window_menu`,
      icon: window_icon,
      action: (args) => {
        App.show_focus_a_window(args.e)
      },
      info: `Focus a specific window`,
    },
    {
      name: `Move To Top`,
      short_name: `To Top`,
      cmd: `move_tabs_to_top`,
      modes: [`tabs`],
      item: true,
      icon: up_icon,
      action: (args) => {
        App.move_tabs_vertically(`up`, args.item)
      },
      info: `Move tabs to the top`,
    },
    {
      name: `Move To Bottom`,
      short_name: `To Bottom`,
      cmd: `move_tabs_to_bottom`,
      modes: [`tabs`],
      item: true,
      icon: down_icon,
      action: (args) => {
        App.move_tabs_vertically(`down`, args.item)
      },
      info: `Move tabs to the bottom`,
    },
    {
      name: `Pin Tab`,
      name_multiple: `Pin Tabs`,
      short_name: `Pin`,
      cmd: `pin_tabs`,
      modes: [`tabs`],
      item: true,
      some_unpinned: true,
      icon: pin_icon,
      action: (args) => {
        App.pin_tabs(args.item)
      },
      info: `Pin tabs`,
    },
    {
      name: `Unpin Tab`,
      name_multiple: `Unpin Tabs`,
      short_name: `Unpin`,
      cmd: `unpin_tabs`,
      modes: [`tabs`],
      item: true,
      some_pinned: true,
      icon: pin_icon,
      action: (args) => {
        App.unpin_tabs(args.item)
      },
      info: `Unpin tabs`,
    },
    {
      name: `Toggle Pin`,
      short_name: `Pin`,
      cmd: `toggle_pin_tabs`,
      modes: [`tabs`],
      item: true,
      icon: pin_icon,
      action: (args) => {
        App.toggle_pin_tabs(args.item)
      },
      info: `Pin or unpin tabs`,
    },
    {
      name: `Toggle Pins`,
      short_name: `Pins`,
      cmd: `toggle_show_pins`,
      modes: [`tabs`],
      item: true,
      icon: pin_icon,
      action: (args) => {
        App.toggle_show_pins()
      },
      info: `Hide or show pinned tabs`,
    },
    {
      name: `Pin All`,
      cmd: `pin_all_tabs`,
      modes: [`tabs`],
      item: true,
      icon: pin_icon,
      action: (args) => {
        App.pin_all_tabs(args.item)
      },
      info: `Pin all unpinned tabs`,
    },
    {
      name: `Unpin All`,
      cmd: `unpin_all_tabs`,
      modes: [`tabs`],
      item: true,
      icon: pin_icon,
      action: (args) => {
        App.unpin_all_tabs(args.item)
      },
      info: `Unpin all pinned tabs`,
    },
    {
      name: `New Pin`,
      cmd: `new_pinned_tab`,
      modes: [`tabs`],
      icon: pin_icon,
      action: (args) => {
        App.new_pin_tab(args.item)
      },
      info: `Make a new tab and pin it automatically`,
    },
    {
      name: `Toggle Unloaded`,
      short_name: `Unloaded`,
      cmd: `toggle_show_unloaded`,
      modes: [`tabs`],
      item: true,
      icon: unloaded_icon,
      action: (args) => {
        App.toggle_show_unloaded()
      },
      info: `Hide or show unloaded tabs`,
    },
    {
      name: `New Normal`,
      cmd: `new_normal_tab`,
      modes: [`tabs`],
      icon: normal_icon,
      action: (args) => {
        App.new_normal_tab()
      },
      info: `Make a new normal tab at the top of the normal tabs`,
    },
    {
      name: `Tab Up`,
      cmd: `jump_tabs_all_up`,
      icon: up_icon,
      action: (args) => {
        App.jump_tabs_all(true)
      },
      info: `Go to the tab above`,
    },
    {
      name: `Tab Down`,
      cmd: `jump_tabs_all_down`,
      icon: down_icon,
      action: (args) => {
        App.jump_tabs_all()
      },
      info: `Go to the tab below`,
    },
    {
      name: `Pin Up`,
      cmd: `jump_tabs_pin_up`,
      icon: pin_icon,
      action: (args) => {
        App.jump_tabs_pin(true)
      },
      info: `Go to the pin above`,
    },
    {
      name: `Pin Down`,
      cmd: `jump_tabs_pin_down`,
      icon: pin_icon,
      action: (args) => {
        App.jump_tabs_pin()
      },
      info: `Go to the pin below`,
    },
    {
      name: `Normal Up`,
      cmd: `jump_tabs_normal_up`,
      icon: tabs_icon,
      action: (args) => {
        App.jump_tabs_normal(true)
      },
      info: `Go to the normal tab above`,
    },
    {
      name: `Normal Down`,
      cmd: `jump_tabs_normal_down`,
      icon: tabs_icon,
      action: (args) => {
        App.jump_tabs_normal()
      },
      info: `Go to the normal tab below`,
    },
    {
      name: `Unread Up`,
      cmd: `jump_tabs_unread_up`,
      icon: unread_icon,
      action: (args) => {
        App.jump_tabs_unread(true)
      },
      info: `Go to the next unread tab above`,
    },
    {
      name: `Unread Down`,
      cmd: `jump_tabs_unread_down`,
      icon: unread_icon,
      action: (args) => {
        App.jump_tabs_unread()
      },
      info: `Go to the next unread tab`,
    },
    {
      name: `Mute Tab`,
      name_multiple: `Mute Tabs`,
      short_name: `Mute`,
      cmd: `mute_tabs`,
      icon: muted_icon,
      some_unmuted: true,
      action: (args) => {
        App.mute_tabs(args.item)
      },
      info: `Mute tabs`,
    },
    {
      name: `Unmute Tab`,
      name_multiple: `Unmute Tabs`,
      short_name: `Unmute`,
      cmd: `unmute_tabs`,
      icon: muted_icon,
      some_muted: true,
      action: (args) => {
        App.unmute_tabs(args.item)
      },
      info: `Unmute tabs`,
    },
    {
      name: `Toggle Mute`,
      short_name: `Mute`,
      cmd: `toggle_mute_tabs`,
      modes: [`tabs`],
      item: true,
      icon: muted_icon,
      action: (args) => {
        App.toggle_mute_tabs(args.item)
      },
      info: `Mute or unmute tabs`,
    },
    {
      name: `Mute Playing`,
      short_name: `Mute`,
      cmd: `mute_playing_tabs`,
      modes: [`tabs`],
      item: true,
      icon: muted_icon,
      action: (args) => {
        App.mute_playing_tabs(args.item)
      },
      info: `Mute tabs that are playing audio`,
    },
    {
      name: `Mute All`,
      cmd: `mute_all_tabs`,
      modes: [`tabs`],
      item: true,
      icon: muted_icon,
      action: (args) => {
        App.mute_all_tabs(args.item)
      },
      info: `Mute all unmuted tabs`,
    },
    {
      name: `Unmute All`,
      cmd: `unmute_all_tabs`,
      modes: [`tabs`],
      item: true,
      icon: muted_icon,
      action: (args) => {
        App.unmute_all_tabs(args.item)
      },
      info: `Unmute all muted tabs`,
    },
    {
      name: `Close Tab`,
      name_multiple: `Close Tabs`,
      short_name: `Close`,
      cmd: `close_tabs`,
      modes: [`tabs`],
      item: true,
      icon: close_icon,
      action: (args) => {
        App.close_tabs({item: args.item})
      },
      info: `Close tabs`,
    },
    {
      name: `Close Tab (Force)`,
      short_name: `Close (F)`,
      name_multiple: `Close Tabs (F)`,
      name_multiple_short: `Close (F)`,
      cmd: `close_tabs_force`,
      modes: [`tabs`],
      item: true,
      icon: close_icon,
      action: (args) => {
        App.close_tabs({item: args.item, full_force: true})
      },
      info: `Close tabs without confirmation`,
    },
    {
      name: `Close Page`,
      short_name: `Close`,
      cmd: `browser_close`,
      icon: browser_icon,
      action: (args) => {
        App.close_active_tab()
      },
      info: `Close current page`,
    },
    {
      name: `Close Menu`,
      short_name: `Close`,
      cmd: `show_close_tabs_menu`,
      icon: close_icon,
      action: (args) => {
        App.show_close_tabs_menu(args.e, args.item)
      },
      info: `Open the menu with some tab closing options`,
    },
    {
      name: `Close Btn Menu`,
      short_name: `Close`,
      cmd: `show_close_button_menu`,
      icon: close_icon,
      action: (args) => {
        App.show_close_button_menu(args.item, args.e)
      },
      info: `Open the Close Button Menu`,
    },
    {
      name: `Close Normal`,
      cmd: `close_normal_tabs`,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`normal`)
      },
      info: `Close normal tabs`,
    },
    {
      name: `Close Playing`,
      cmd: `close_playing_tabs`,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`playing`)
      },
      info: `Close playing tabs`,
    },
    {
      name: `Close Loaded`,
      cmd: `close_loaded_tabs`,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`loaded`)
      },
      info: `Close loaded tabs`,
    },
    {
      name: `Close Unloaded`,
      cmd: `close_unloaded_tabs`,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`unloaded`)
      },
      info: `Close unloaded tabs`,
    },
    {
      name: `Close Duplicates`,
      cmd: `close_duplicate_tabs`,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`duplicate`)
      },
      info: `Close duplicate tabs`,
    },
    {
      name: `Close Visible`,
      cmd: `close_visible_tabs`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`visible`)
      },
      info: `Close visible tabs`,
    },
    {
      name: `Close Others`,
      cmd: `close_other_tabs`,
      modes: [`tabs`],
      item: true,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`other`, args.item)
      },
      info: `Close other tabs`,
    },
    {
      name: `Close Domain`,
      cmd: `close_domain_tabs`,
      item: true,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`domain`, args.item)
      },
      info: `Close all tabs from the same domain`,
    },
    {
      name: `Close Domain (Other)`,
      short_name: `Close Domain (O)`,
      cmd: `close_domain_other_tabs`,
      item: true,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`domain_other`, args.item)
      },
      info: `Close all tabs from the same domain except the active one`,
    },
    {
      name: `Close Clusters`,
      short_name: `Close Clusters`,
      cmd: `close_clusters_tabs`,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`clusters`, args.item)
      },
      info: `Close all tabs that are part of groups of tabs with the same domain`,
    },
    {
      name: `Close Pins`,
      cmd: `close_pinned_tabs`,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`pinned`, args.item)
      },
      info: `Close pinned tabs`,
    },
    {
      name: `Close All`,
      cmd: `close_all_tabs`,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`all`, args.item)
      },
      info: `Close all tabs`,
    },
    {
      name: `Close Empty`,
      cmd: `close_empty_tabs`,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`empty`, args.item)
      },
      info: `Close empty tabs`,
    },
    {
      name: `Close First`,
      cmd: `close_first_tab`,
      icon: close_icon,
      action: (args) => {
        App.close_first_tab()
      },
      info: `Close the first tab`,
    },
    {
      name: `Close Last`,
      cmd: `close_last_tab`,
      icon: close_icon,
      action: (args) => {
        App.close_last_tab()
      },
      info: `Close the last tab`,
    },

    ...color_closers,

    {
      name: `Playing Up`,
      cmd: `jump_tabs_playing_up`,
      icon: playing_icon,
      action: (args) => {
        App.jump_tabs_playing(true)
      },
      info: `Jump to the next playing tab above`,
    },
    {
      name: `Playing Down`,
      cmd: `jump_tabs_playing_down`,
      icon: playing_icon,
      action: (args) => {
        App.jump_tabs_playing()
      },
      info: `Jump to the next playing tab below`,
    },
    {
      name: `Sort Tabs`,
      short_name: `Sort`,
      cmd: `sort_tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.sort_tabs()
      },
      info: `Open the Sort Tabs window`,
    },
    {
      name: `Reverse`,
      cmd: `reverse_tabs`,
      modes: [`tabs`],
      icon: tabs_icon,
      multiple: true,
      action: (args) => {
        App.sort_selected_tabs(`reverse`)
      },
      info: `Reverse the order of selected tabs`,
    },
    {
      name: `Sort Asc`,
      cmd: `sort_tabs_asc`,
      modes: [`tabs`],
      icon: tabs_icon,
      multiple: true,
      action: (args) => {
        App.sort_selected_tabs(`asc`)
      },
      info: `Sort alphabetically the selected tabs in ascending order`,
    },
    {
      name: `Sort Desc`,
      cmd: `sort_tabs_desc`,
      modes: [`tabs`],
      icon: tabs_icon,
      multiple: true,
      action: (args) => {
        App.sort_selected_tabs(`desc`)
      },
      info: `Sort alphabetically the selected tabs in descending order`,
    },
    {
      name: `Tabs Info`,
      short_name: `Info`,
      cmd: `show_tabs_info`,
      icon: tabs_icon,
      action: (args) => {
        App.show_tabs_info()
      },
      info: `Show some tab information`,
    },
    {
      name: `Show URLs`,
      short_name: `URLs`,
      cmd: `show_tab_urls`,
      icon: tabs_icon,
      action: (args) => {
        App.show_tab_urls()
      },
      info: `Show a list of open URLs`,
    },
    {
      name: `Open URLs`,
      short_name: `Open`,
      cmd: `open_tab_urls`,
      icon: tabs_icon,
      action: (args) => {
        App.open_tab_urls()
      },
      info: `Open a list of URLs`,
    },
    {
      name: `Export Tabs`,
      short_name: `Export`,
      cmd: `export_tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.export_tabs()
      },
      info: `Export the current state of tabs`,
    },
    {
      name: `Import Tabs`,
      short_name: `Export`,
      cmd: `import_tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.import_tabs()
      },
      info: `Import a state of tabs`,
    },
    {
      name: `Reopen Tab`,
      short_name: `Reopen`,
      cmd: `reopen_tab`,
      icon: rewind_icon,
      action: (args) => {
        App.reopen_tab()
      },
      info: `Reopen the latest closed tab`,
    },
    {
      name: `Insert Header`,
      short_name: `Header`,
      cmd: `insert_header`,
      modes: [`tabs`],
      item: true,
      single: true,
      icon: header_icon,
      action: (args) => {
        App.insert_header({item: args.item})
      },
      info: `Add a header tab`,
    },
    {
      name: `Insert Subheader`,
      short_name: `Subheader`,
      cmd: `insert_subheader`,
      modes: [`tabs`],
      item: true,
      single: true,
      icon: subheader_icon,
      action: (args) => {
        App.insert_header({item: args.item, full: false})
      },
      info: `Add a subheader tab`,
    },
    {
      name: `Upgrade Zone`,
      short_name: `Upgrade`,
      cmd: `upgrade_zone`,
      modes: [`tabs`],
      item: true,
      single: true,
      icon: header_icon,
      action: (args) => {
        App.upgrade_zone(args.item)
      },
      info: `Turn a subheader into a header`,
    },
    {
      name: `Downgrade Zone`,
      short_name: `Downgrade`,
      cmd: `downgrade_zone`,
      modes: [`tabs`],
      item: true,
      single: true,
      icon: subheader_icon,
      action: (args) => {
        App.downgrade_zone(args.item)
      },
      info: `Turn a header into a subheader`,
    },
    {
      name: `Select Pins`,
      short_name: `Pins`,
      cmd: `select_pinned_tabs`,
      modes: [`tabs`],
      icon: pin_icon,
      action: (args) => {
        App.select_tabs(`pins`)
      },
      info: `Select all pinned tabs`,
    },
    {
      name: `Select Normal`,
      short_name: `Normal`,
      cmd: `select_normal_tabs`,
      modes: [`tabs`],
      icon: normal_icon,
      action: (args) => {
        App.select_tabs(`normal`)
      },
      info: `Select all normal tabs`,
    },
    {
      name: `Select Unloaded`,
      short_name: `Unloaded`,
      cmd: `select_unloaded_tabs`,
      modes: [`tabs`],
      icon: unloaded_icon,
      action: (args) => {
        App.select_tabs(`unloaded`)
      },
      info: `Select all unloaded tabs`,
    },
    {
      name: `Filter Context`,
      cmd: `show_filter_context_menu`,
      modes: [`items`],
      icon: filter_icon,
      action: (args) => {
        App.show_filter_context_menu(args.mode, args.e)
      },
      info: `Show the Filter Context Menu`,
    },
    {
      name: `Deep Search`,
      short_name: `Deep`,
      cmd: `deep_search`,
      modes: [`search`],
      icon: filter_icon,
      action: (args) => {
        App.deep_search(args.mode)
      },
      info: `Do a deep search`,
    },
    {
      name: `Search Media`,
      short_name: `Media`,
      cmd: `show_search_media_menu`,
      modes: [`items`],
      icon: media_icon,
      action: (args) => {
        App.search_media(args.mode, args.e)
      },
      info: `Search for media`,
    },
    {
      name: `Forget Closed`,
      short_name: `Forget`,
      cmd: `forget_closed`,
      modes: [`closed`],
      icon: closed_icon,
      action: (args) => {
        App.forget_closed()
      },
      info: `Forget closed items`,
    },
    {
      name: `Forget Closed Item`,
      short_name: `Forget`,
      cmd: `forget_closed_item`,
      modes: [`closed`],
      item: true,
      icon: closed_icon,
      action: (args) => {
        App.forget_closed_item(args.item)
      },
      info: `Forget a single closed item`,
    },
    {
      name: `Edit Title`,
      short_name: `Title`,
      cmd: `edit_title`,
      modes: [`tabs`],
      item: true,
      icon: title_icon,
      action: (args) => {
        App.edit_title(args.item)
      },
      info: `Edit tab titles`,
    },
    {
      name: `Edit Icon`,
      short_name: `Icon`,
      cmd: `edit_icon`,
      modes: [`tabs`],
      item: true,
      icon: bot_icon,
      action: (args) => {
        App.edit_icon(args.item)
      },
      info: `Edit tab icons`,
    },
    {
      name: `Edit Tags`,
      short_name: `Tags`,
      cmd: `edit_tags`,
      modes: [`tabs`],
      item: true,
      icon: tags_icon,
      action: (args) => {
        App.edit_tags(args.item)
      },
      info: `Edit tab tags`,
    },
    {
      name: `Add Tags`,
      short_name: `Tags`,
      cmd: `add_tags`,
      modes: [`tabs`],
      item: true,
      icon: tags_icon,
      action: (args) => {
        App.add_tags(args.item)
      },
      info: `Add tags to tabs`,
    },
    {
      name: `Edit Root`,
      short_name: `Root`,
      cmd: `edit_root_url`,
      modes: [`tabs`],
      item: true,
      icon: root_icon,
      action: (args) => {
        App.edit_root_url(args.item)
      },
      info: `Edit the Root URL of a tab`,
    },
    {
      name: `Remove Root`,
      short_name: `Rm Root`,
      cmd: `remove_root_url`,
      modes: [`tabs`],
      item: true,
      icon: root_icon,
      some_custom_root: true,
      action: (args) => {
        App.remove_root_url(args.item)
      },
      info: `Remove the Root URL of a tab`,
    },
    {
      name: `Go To Root`,
      short_name: `Root`,
      cmd: `go_to_root_url`,
      modes: [`tabs`],
      some_root_possible: true,
      item: true,
      icon: root_icon,
      action: (args) => {
        App.go_to_root_url(args.item)
      },
      info: `Go to the Root URL of a tab`,
    },
    {
      name: `Random Tab`,
      short_name: `Random`,
      cmd: `go_to_random_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.random_tab(args.item)
      },
      info: `Go to a random tab`,
    },
    {
      name: `Resurrect Tab`,
      short_name: `Resurrect`,
      cmd: `resurrect_random_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.resurrect_tab(args.item)
      },
      info: `Load a random unloaded tab`,
    },
    {
      name: `Filter Clusters`,
      short_name: `Clusters`,
      cmd: `filter_tab_clusters`,
      icon: tabs_icon,
      action: (args) => {
        App.filter_tab_clusters()
      },
      info: `Filter groups of tabs that share the same domain`,
    },
    {
      name: `Show Clusters`,
      short_name: `Clusters`,
      cmd: `show_tab_clusters`,
      icon: tabs_icon,
      action: (args) => {
        App.show_tab_clusters(args.e)
      },
      info: `Show groups of tabs that share the same domain`,
    },
    {
      name: `Edit Notes`,
      short_name: `Notes`,
      cmd: `edit_notes`,
      modes: [`tabs`],
      item: true,
      icon: notes_icon,
      action: (args) => {
        App.edit_notes(args.item)
      },
      info: `Edit the notes of tabs`,
    },
    {
      name: `Add To Datastore`,
      short_name: `Info`,
      cmd: `add_to_datastore`,
      icon: data_icon,
      action: (args) => {
        App.datastore_prompt()
      },
      info: `Add text manually to the datastore`,
    },
    {
      name: `Datastore Settings`,
      short_name: `DS Settings`,
      cmd: `datastore_settings`,
      icon: data_icon,
      action: (args) => {
        App.datastore_settings()
      },
      info: `Add the current settings state to the datastore`,
    },
    {
      name: `Datastore Theme`,
      short_name: `DS Theme`,
      cmd: `datastore_theme`,
      icon: data_icon,
      action: (args) => {
        App.datastore_theme()
      },
      info: `Add the current theme state to the datastore`,
    },
    {
      name: `Datastore URLs`,
      short_name: `DS URLs`,
      cmd: `datastore_urls`,
      icon: data_icon,
      action: (args) => {
        App.datastore_urls()
      },
      info: `Add the current URLs state to the datastore`,
    },
    {
      name: `Browse Datastore`,
      short_name: `Info`,
      cmd: `browse_datastore`,
      icon: data_icon,
      action: (args) => {
        App.browse_datastore()
      },
      info: `Browse datastore items`,
    },
    {
      name: `Clear Datastore`,
      short_name: `Info`,
      cmd: `clear_datastore`,
      icon: data_icon,
      action: (args) => {
        App.clear_datastore()
      },
      info: `Clear the datastore`,
    },
    {
      name: `Export Datastore`,
      short_name: `Info`,
      cmd: `export_datastore`,
      icon: data_icon,
      action: (args) => {
        App.export_datastore()
      },
      info: `Export the datastore`,
    },
    {
      name: `Import Datastore`,
      short_name: `Info`,
      cmd: `import_datastore`,
      icon: data_icon,
      action: (args) => {
        App.import_datastore()
      },
      info: `Import the datastore`,
    },
    {
      name: `Jump Up`,
      cmd: `jump_tabs_tag_1_up`,
      icon: right_icon,
      action: (args) => {
        App.jump_tabs_tag(1, true)
      },
      info: `Jump in reverse to tabs with the 'jump' tag`,
    },
    {
      name: `Jump Down`,
      cmd: `jump_tabs_tag_1_down`,
      icon: right_icon,
      action: (args) => {
        App.jump_tabs_tag(1)
      },
      info: `Jump to tabs with the 'jump' tag`,
    },
    {
      name: `Jump 2 Up`,
      cmd: `jump_tabs_tag_2_up`,
      icon: right_icon,
      action: (args) => {
        App.jump_tabs_tag(2, true)
      },
      info: `Jump in reverse to tabs with the 'jump2' tag`,
    },
    {
      name: `Jump 2 Down`,
      cmd: `jump_tabs_tag_2_down`,
      icon: right_icon,
      action: (args) => {
        App.jump_tabs_tag(2)
      },
      info: `Jump to tabs with the 'jump2' tag`,
    },
    {
      name: `Jump 3 Up`,
      cmd: `jump_tabs_tag_3_up`,
      icon: right_icon,
      action: (args) => {
        App.jump_tabs_tag(3, true)
      },
      info: `Jump in reverse to tabs with the 'jump3' tag`,
    },
    {
      name: `Jump 3 Down`,
      cmd: `jump_tabs_tag_3_down`,
      icon: right_icon,
      action: (args) => {
        App.jump_tabs_tag(3)
      },
      info: `Jump to tabs with the 'jump3' tag`,
    },
    {
      name: `Add Jump`,
      short_name: `Jump`,
      cmd: `add_jump_tag_1`,
      modes: [`tabs`],
      item: true,
      icon: tags_icon,
      action: (args) => {
        App.add_tag_all(args.item, `jump`)
      },
      info: `Add the 'jump' tag`,
    },
    {
      name: `Remove Jump`,
      short_name: `Rm Jump`,
      cmd: `remove_jump_tag_1`,
      modes: [`tabs`],
      item: true,
      icon: tags_icon,
      action: (args) => {
        App.remove_tag_all(args.item, `jump`)
      },
      info: `Remove the 'jump' tag`,
    },
    {
      name: `Wipe Jump`,
      cmd: `wipe_jump_1`,
      modes: [`tabs`],
      icon: tags_icon,
      action: (args) => {
        App.wipe_jump(1)
      },
      info: `Remove the 'jump' tag from all items`,
    },
    {
      name: `Add Jump 2`,
      short_name: `Jump 2`,
      cmd: `add_jump_tag_2`,
      modes: [`tabs`],
      item: true,
      icon: tags_icon,
      action: (args) => {
        App.add_tag_all(args.item, `jump2`)
      },
      info: `Add the 'jump2' tag`,
    },
    {
      name: `Remove Jump 2`,
      short_name: `Rm Jump 2`,
      cmd: `remove_jump_tag_2`,
      modes: [`tabs`],
      item: true,
      icon: tags_icon,
      action: (args) => {
        App.remove_tag_all(args.item, `jump2`)
      },
      info: `Remove the 'jump2' tag`,
    },
    {
      name: `Wipe Jump 2`,
      cmd: `wipe_jump_2`,
      modes: [`tabs`],
      icon: tags_icon,
      action: (args) => {
        App.wipe_jump(2)
      },
      info: `Remove the 'jump2' tag from all items`,
    },
    {
      name: `Add Jump 3`,
      short_name: `Jump 3`,
      cmd: `add_jump_tag_3`,
      modes: [`tabs`],
      item: true,
      icon: tags_icon,
      action: (args) => {
        App.add_tag_all(args.item, `jump3`)
      },
      info: `Add the 'jump3' tag`,
    },
    {
      name: `Remove Jump 3`,
      short_name: `Rm Jump 3`,
      cmd: `remove_jump_tag_3`,
      modes: [`tabs`],
      item: true,
      icon: tags_icon,
      action: (args) => {
        App.remove_tag_all(args.item, `jump3`)
      },
      info: `Remove the 'jump3' tag`,
    },
    {
      name: `Wipe Jump 3`,
      cmd: `wipe_jump_3`,
      modes: [`tabs`],
      icon: tags_icon,
      action: (args) => {
        App.wipe_jump(3)
      },
      info: `Remove the 'jump3' tag from all items`,
    },
    {
      name: `Filter Jump`,
      cmd: `filter_jump_tag_1`,
      modes: [`items`],
      filter_mode: true,
      icon: tags_icon,
      action: (args) => {
        App.filter_jump_tag(args.mode, 1)
      },
      info: `Filter the 'jump' tag`,
    },
    {
      name: `Filter Jump 2`,
      cmd: `filter_jump_tag_2`,
      modes: [`items`],
      filter_mode: true,
      icon: tags_icon,
      action: (args) => {
        App.filter_jump_tag(args.mode, 2)
      },
      info: `Filter the 'jump2' tag`,
    },
    {
      name: `Filter Jump 3`,
      cmd: `filter_jump_tag_3`,
      modes: [`items`],
      filter_mode: true,
      icon: tags_icon,
      action: (args) => {
        App.filter_jump_tag(args.mode, 3)
      },
      info: `Filter the 'jump3' tag`,
    },
    {
      name: `Header Up`,
      cmd: `jump_tabs_header_up`,
      icon: header_icon,
      action: (args) => {
        App.jump_tabs_header(true)
      },
      info: `Jump to the next header above`,
    },
    {
      name: `Header Down`,
      cmd: `jump_tabs_header_down`,
      icon: header_icon,
      action: (args) => {
        App.jump_tabs_header()
      },
      info: `Jump to the next header below`,
    },
    {
      name: `Subheader Up`,
      cmd: `jump_tabs_subheader_up`,
      icon: header_icon,
      action: (args) => {
        App.jump_tabs_subheader(true)
      },
      info: `Jump to the next subheader above`,
    },
    {
      name: `Subheader Down`,
      cmd: `jump_tabs_subheader_down`,
      icon: header_icon,
      action: (args) => {
        App.jump_tabs_subheader()
      },
      info: `Jump to the next subheader below`,
    },
    {
      name: `Headers Up`,
      cmd: `jump_tabs_headers_up`,
      icon: header_icon,
      action: (args) => {
        App.jump_tabs_headers(true)
      },
      info: `Jump to the next header or subheader above`,
    },
    {
      name: `Headers Down`,
      cmd: `jump_tabs_headers_down`,
      icon: header_icon,
      action: (args) => {
        App.jump_tabs_headers()
      },
      info: `Jump to the next header or subheader below`,
    },
    {
      name: `Move To Header`,
      cmd: `tabs_to_header`,
      icon: header_icon,
      action: (args) => {
        App.tabs_to_zone({
          item: args.item,
          e: args.e,
          what: `header`,
        })
      },
      info: `Insert tabs inside a specific header`,
    },
    {
      name: `Move To Subheader`,
      cmd: `tabs_to_subheader`,
      icon: subheader_icon,
      action: (args) => {
        App.tabs_to_zone({
          item: args.item,
          e: args.e,
          what: `subheader`,
        })
      },
      info: `Insert tabs inside a specific subheader`,
    },
    {
      name: `Move To Zone`,
      short_name: `To Zone`,
      cmd: `tabs_to_zone`,
      modes: [`tabs`],
      item: true,
      icon: zone_icon,
      action: (args) => {
        App.tabs_to_zone({
          item: args.item,
          e: args.e,
          what: `zone`,
        })
      },
      info: `Insert tabs inside a specific zone`,
    },
    {
      name: `Move To Zone (Bottom)`,
      short_name: `To Zone (B)`,
      cmd: `tabs_to_zone_bottom`,
      modes: [`tabs`],
      item: true,
      icon: zone_icon,
      action: (args) => {
        App.tabs_to_zone({
          item: args.item,
          e: args.e,
          what: `zone`,
          position: `bottom`,
        })
      },
      info: `Insert tabs inside a specific zone and place them at the bottom`,
    },
    {
      name: `Go To Header`,
      cmd: `go_to_header`,
      icon: header_icon,
      action: (args) => {
        App.pick_zone(args.e, `header`)
      },
      info: `Go to a specific header`,
    },
    {
      name: `Go To Subheader`,
      cmd: `go_to_subheader`,
      icon: subheader_icon,
      action: (args) => {
        App.pick_zone(args.e, `subheader`)
      },
      info: `Go to a specific subheader`,
    },
    {
      name: `Go To Zone`,
      cmd: `go_to_zone`,
      icon: zone_icon,
      action: (args) => {
        App.pick_zone(args.e, `zone`)
      },
      info: `Go to a specific zone`,
    },
    {
      name: `Go To Zone (Bottom)`,
      short_name: `Go To Zone (B)`,
      cmd: `go_to_zone_bottom`,
      icon: zone_icon,
      action: (args) => {
        App.pick_zone(args.e, `zone`, `bottom`)
      },
      info: `Go to a specific zone and focus the bottom`,
    },
    {
      name: `Split Up`,
      cmd: `jump_tabs_split_up`,
      icon: header_icon,
      action: (args) => {
        App.jump_tabs_split(true)
      },
      info: `Jump to the next split above`,
    },
    {
      name: `Split Down`,
      cmd: `jump_tabs_split_down`,
      icon: header_icon,
      action: (args) => {
        App.jump_tabs_split()
      },
      info: `Jump to the next split below`,
    },
    {
      name: `Zone Up`,
      cmd: `jump_tabs_zone_up`,
      icon: header_icon,
      action: (args) => {
        App.jump_tabs_zone(true)
      },
      info: `Jump to the next zone above`,
    },
    {
      name: `Zone Down`,
      cmd: `jump_tabs_zone_down`,
      icon: header_icon,
      action: (args) => {
        App.jump_tabs_zone()
      },
      info: `Jump to the next zone below`,
    },
    {
      name: `Global Notes`,
      short_name: `Notes`,
      cmd: `edit_global_notes`,
      icon: notes_icon,
      action: (args) => {
        App.edit_global_notes()
      },
      info: `Edit the Global Notes`,
    },
    {
      name: `Split Both`,
      short_name: `Split`,
      cmd: `add_split_both`,
      modes: [`tabs`],
      item: true,
      multiple: true,
      icon: zone_icon,
      action: (args) => {
        App.edit_tab_split({item: args.item, which: `both`})
      },
      info: `Add a split above and below the selected tabs`,
    },
    {
      name: `Split Top`,
      short_name: `Top`,
      cmd: `add_split_top`,
      modes: [`tabs`],
      item: true,
      some_no_split_top: true,
      icon: zone_icon,
      action: (args) => {
        App.add_split_top(args.item)
      },
      info: `Add a split above the tab`,
    },
    {
      name: `Split Bottom`,
      short_name: `Bottom`,
      cmd: `add_split_bottom`,
      modes: [`tabs`],
      item: true,
      some_no_split_bottom: true,
      some_no_header: true,
      icon: zone_icon,
      action: (args) => {
        App.add_split_bottom(args.item)
      },
      info: `Add a split below the tab`,
    },

    ...color_removers,

    {
      name: `Remove Title`,
      short_name: `Rm Title`,
      cmd: `remove_title`,
      modes: [`tabs`],
      item: true,
      some_custom_title: true,
      icon: notepad_icon,
      action: (args) => {
        App.remove_item_title(args.item)
      },
      info: `Remove the title from tabs`,
    },
    {
      name: `Remove All Titles`,
      short_name: `Rm Titles`,
      cmd: `remove_all_titles`,
      modes: [`tabs`],
      icon: notepad_icon,
      action: (args) => {
        App.remove_edits({what: [`title`], text: `titles`})
      },
      info: `Remove all titles from tabs`,
    },
    {
      name: `Remove Icon`,
      short_name: `Rm Icon`,
      cmd: `remove_icon`,
      modes: [`tabs`],
      item: true,
      some_custom_icon: true,
      icon: bot_icon,
      action: (args) => {
        App.remove_item_icon(args.item)
      },
      info: `Remove the icon from tabs`,
    },
    {
      name: `Remove All Icons`,
      short_name: `Rm Icons`,
      cmd: `remove_all_icons`,
      modes: [`tabs`],
      icon: bot_icon,
      action: (args) => {
        App.remove_edits({what: [`icon`], text: `icons`})
      },
      info: `Remove all icons from tabs`,
    },
    {
      name: `Change Icon`,
      cmd: `change_icon`,
      modes: [`tabs`],
      item: true,
      icon: bot_icon,
      action: (args) => {
        App.change_icon(args.item)
      },
      info: `Change the icon of tabs`,
    },
    {
      name: `Remove Notes`,
      short_name: `Rm Notes`,
      cmd: `remove_notes`,
      modes: [`tabs`],
      item: true,
      some_custom_notes: true,
      icon: notes_icon,
      action: (args) => {
        App.remove_item_notes(args.item)
      },
      info: `Remove notes from tabs`,
    },
    {
      name: `Wipe Tag`,
      cmd: `wipe_tag`,
      modes: [`tabs`],
      icon: tags_icon,
      action: (args) => {
        App.wipe_tag()
      },
      info: `Remove a specific tag from all tabs`,
    },
    {
      name: `Remove Tags`,
      short_name: `Rm Tags`,
      cmd: `remove_tags`,
      modes: [`tabs`],
      item: true,
      some_custom_tags: true,
      icon: tags_icon,
      action: (args) => {
        App.remove_item_tags(args.item)
      },
      info: `Remove the tags from tabs`,
    },
    {
      name: `Remove All Tags`,
      short_name: `Rm Tags`,
      cmd: `remove_all_tags`,
      modes: [`tabs`],
      icon: tags_icon,
      action: (args) => {
        App.remove_edits({what: [`tags`], text: `tags`})
      },
      info: `Remove all tags from tabs`,
    },
    {
      name: `Remove All Notes`,
      short_name: `Rm Notes`,
      cmd: `remove_all_notes`,
      modes: [`tabs`],
      icon: notes_icon,
      action: (args) => {
        App.remove_edits({what: [`notes`], text: `notes`})
      },
      info: `Remove all notes from tabs`,
    },
    {
      name: `Remove Split`,
      short_name: `Rm Split`,
      cmd: `remove_split`,
      modes: [`tabs`],
      some_custom_split: true,
      item: true,
      icon: zone_icon,
      action: (args) => {
        App.remove_item_split(args.item)
      },
      info: `Remove the splits from tabs`,
    },
    {
      name: `Remove Top Splits`,
      short_name: `Rm Top Splits`,
      cmd: `remove_top_splits`,
      modes: [`tabs`],
      icon: zone_icon,
      action: (args) => {
        App.remove_top_splits()
      },
      info: `Remove all top splits from tabs`,
    },
    {
      name: `Remove Bottom Splits`,
      short_name: `Rm Bottom Splits`,
      cmd: `remove_bottom_splits`,
      modes: [`tabs`],
      icon: zone_icon,
      action: (args) => {
        App.remove_bottom_splits()
      },
      info: `Remove all bottom splits from tabs`,
    },
    {
      name: `Remove All Splits`,
      short_name: `Rm Splits`,
      cmd: `remove_all_splits`,
      modes: [`tabs`],
      icon: zone_icon,
      action: (args) => {
        App.remove_all_splits()
      },
      info: `Remove all splits from tabs`,
    },
    {
      name: `Remove All Zones`,
      short_name: `Rm Zones`,
      cmd: `remove_all_zones`,
      modes: [`tabs`],
      icon: zone_icon,
      action: (args) => {
        App.remove_all_zones()
      },
      info: `Remove all zones (Headers / Splits)`,
    },
    {
      name: `Close Headers`,
      cmd: `close_headers`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_headers()
      },
      info: `Close all header tabs`,
    },
    {
      name: `Select Group`,
      short_name: `Select`,
      cmd: `select_header_group`,
      modes: [`tabs`],
      item: true,
      single: true,
      some_header: true,
      icon: header_icon,
      action: (args) => {
        App.select_header_group(args.item)
      },
      info: `Select the group of a header tab`,
    },
    {
      name: `Close Group`,
      short_name: `Close`,
      cmd: `close_header_group`,
      modes: [`tabs`],
      item: true,
      single: true,
      some_header: true,
      icon: header_icon,
      action: (args) => {
        App.close_header_group(args.item)
      },
      info: `Close the group of a header tab`,
    },
    {
      name: `Close Subheaders`,
      cmd: `close_subheaders`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_subheaders()
      },
      info: `Close all subheader tabs`,
    },
    {
      name: `Replace Tag`,
      cmd: `replace_tag`,
      modes: [`tabs`],
      icon: tags_icon,
      action: (args) => {
        App.replace_tag()
      },
      info: `Replace tag with another tag among all tabs`,
    },
    {
      name: `Close Tag`,
      cmd: `close_tag_all`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_tag_all()
      },
      info: `Close tabs with this tag`,
    },
    {
      name: `Remove All Edits`,
      short_name: `Rm Edits`,
      cmd: `remove_all_edits`,
      icon: edited_icon,
      action: (args) => {
        App.remove_all_edits()
      },
      info: `Remove all edits from tabs`,
    },
    {
      name: `Remove Edits`,
      short_name: `Rm Edits`,
      cmd: `remove_item_edits`,
      modes: [`tabs`],
      item: true,
      some_edits: true,
      icon: edited_icon,
      action: (args) => {
        App.remove_item_edits(args.item)
      },
      info: `Remove all edits from specific items`,
    },
    {
      name: `Edits Info`,
      short_name: `Edits`,
      cmd: `show_edits_info`,
      modes: [`tabs`],
      item: true,
      some_edits: true,
      single: true,
      icon: edited_icon,
      action: (args) => {
        App.show_edits_info(args.item)
      },
      info: `Show the edits of an item`,
    },

    ...color_changers,
    ...media_filters,
    ...color_filters,

    {
      name: `Pick Color`,
      short_name: `color`,
      cmd: `pick_color`,
      icon: colors_icon,
      action: (args) => {
        App.show_color_picker(args.e)
      },
      info: `Pick a color to show`,
    },
    {
      name: `Filter Domain`,
      cmd: `filter_domain`,
      modes: [`items`],
      item: true,
      single: true,
      some_no_header: true,
      some_hostname: true,
      icon: filter_icon,
      action: (args) => {
        App.filter_domain(args.item)
      },
      info: `Filter same domain`,
    },
    {
      name: `Show Domain`,
      cmd: `show_same_domain`,
      modes: [`items`],
      item: true,
      single: true,
      some_no_header: true,
      some_hostname: true,
      icon: filter_icon,
      action: (args) => {
        App.show_tab_list(`domain`, args.e, args.item)
      },
      info: `Show same domain`,
    },
    {
      name: `Filter Title`,
      cmd: `filter_title`,
      modes: [`items`],
      item: true,
      single: true,
      icon: filter_icon,
      action: (args) => {
        App.filter_title(args.item)
      },
      info: `Filter same title`,
    },
    {
      name: `Show Title`,
      cmd: `show_same_title`,
      modes: [`items`],
      item: true,
      single: true,
      icon: filter_icon,
      action: (args) => {
        App.show_tab_list(`title`, args.e, args.item)
      },
      info: `Show same title`,
    },
    {
      name: `Filter Nodes`,
      short_name: `Nodes`,
      cmd: `filter_node_tabs`,
      modes: [`tabs`],
      item: true,
      single: true,
      some_nodes: true,
      icon: node_icon,
      action: (args) => {
        App.filter_nodes(args.item)
      },
      info: `Filter the tabs that were opened through this tab`,
    },
    {
      name: `Show Nodes`,
      short_name: `Nodes`,
      cmd: `show_node_tabs`,
      modes: [`tabs`],
      item: true,
      single: true,
      some_nodes: true,
      icon: node_icon,
      action: (args) => {
        App.show_tab_list(`nodes`, args.e, args.item)
      },
      info: `Show the nodes of this tab`,
    },
    {
      name: `Show Parent`,
      short_name: `Nodes`,
      cmd: `show_parent_tab`,
      modes: [`tabs`],
      item: true,
      single: true,
      some_parent: true,
      icon: parent_icon,
      action: (args) => {
        App.show_tab_list(`parent`, args.e, args.item)
      },
      info: `Show the parent of this tab`,
    },
    {
      name: `Close Nodes`,
      short_name: `Nodes`,
      cmd: `close_node_tabs`,
      modes: [`tabs`],
      item: true,
      single: true,
      some_nodes: true,
      icon: close_icon,
      action: (args) => {
        App.close_node_tabs(args.item)
      },
      info: `Close the nodes of a tab`,
    },
    {
      name: `Close Parent`,
      short_name: `Parent`,
      cmd: `close_parent_tab`,
      modes: [`tabs`],
      item: true,
      single: true,
      some_parent: true,
      icon: close_icon,
      action: (args) => {
        App.close_parent_tab(args.item)
      },
      info: `Close the parent of a tab`,
    },
    {
      name: `Focus Parent`,
      short_name: `Parent`,
      cmd: `focus_parent_tab`,
      modes: [`tabs`],
      item: true,
      single: true,
      some_parent: true,
      icon: parent_icon,
      action: (args) => {
        App.focus_parent_tab(args.item)
      },
      info: `Focus the parent tab of this item`,
    },
    {
      name: `Filter Parents`,
      short_name: `Parents`,
      cmd: `filter_all_parent_tabs`,
      modes: [`tabs`],
      icon: parent_icon,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter all tabs that are a parent`,
    },
    {
      name: `Filter All Nodes`,
      short_name: `Nodes`,
      cmd: `filter_all_node_tabs`,
      modes: [`tabs`],
      icon: node_icon,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter all tabs that are a node`,
    },
    {
      name: `Show Siblings`,
      short_name: `Siblings`,
      cmd: `show_node_tab_siblings`,
      modes: [`tabs`],
      item: true,
      single: true,
      icon: node_icon,
      action: (args) => {
        App.show_tab_list(`siblings`, args.e, args.item)
      },
      info: `Show the siblings of a tab`,
    },
    {
      name: `Filter Siblings`,
      short_name: `Siblings`,
      cmd: `filter_node_tab_siblings`,
      modes: [`tabs`],
      item: true,
      single: true,
      icon: node_icon,
      action: (args) => {
        App.filter_node_tab_siblings(args.item)
      },
      info: `Filter the siblings of a tab`,
    },
    {
      name: `Filter Color`,
      cmd: `filter_color`,
      modes: [`items`],
      item: true,
      single: true,
      color: true,
      icon: colors_icon,
      action: (args) => {
        App.filter_color({
          mode: args.mode,
          id: App.get_color(args.item),
          toggle: true,
          from: args.from,
        })
      },
      info: `Filter same color`,
    },
    {
      name: `Filter Tag`,
      cmd: `filter_tag`,
      modes: [`items`],
      some_tags: true,
      item: true,
      single: true,
      icon: tags_icon,
      action: (args) => {
        App.filter_tag_pick(args.item, args.e)
      },
      info: `Filter by picking a tag from the current item`,
    },
    {
      name: `Filter Tag Menu`,
      short_name: `Tags`,
      cmd: `show_filter_tag_menu`,
      modes: [`items`],
      icon: tags_icon,
      action: (args) => {
        App.show_filter_tag_menu(args.mode, args.e)
      },
      info: `Show the filter tag menu`,
    },
    {
      name: `Pick Tag`,
      short_name: `Tag`,
      cmd: `pick_tag`,
      icon: tags_icon,
      action: (args) => {
        App.show_filter_tag_menu(args.mode, args.e, true)
      },
      info: `Pick a tag to show`,
    },
    {
      name: `Filter All Tags`,
      short_name: `All Tags`,
      cmd: `filter_tag_all`,
      modes: [`items`],
      icon: tags_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_tag({mode: args.mode, tag: `all`, from: args.from})
      },
      info: `Filter all tags`,
    },

    ...custom_tags,

    {
      name: `Show Container`,
      short_name: `Container`,
      cmd: `show_tab_container`,
      modes: [`tabs`],
      icon: container_icon,
      single: true,
      some_container: true,
      action: (args) => {
        App.show_tab_list(`container`, args.e, args.item)
      },
      info: `Show other tabs with the same container`,
    },
    {
      name: `Filter Container`,
      short_name: `Container`,
      cmd: `filter_tab_container`,
      modes: [`tabs`],
      icon: container_icon,
      single: true,
      some_container: true,
      action: (args) => {
        App.filter_same_container(args.item)
      },
      info: `Filter tabs with the same container`,
    },
    {
      name: `Filter Icon`,
      cmd: `filter_icon`,
      modes: [`items`],
      item: true,
      single: true,
      some_icon: true,
      icon: bot_icon,
      action: (args) => {
        App.filter_by_icon(args.item)
      },
      info: `Filter by the item's icon`,
    },
    {
      name: `Filter All Icons`,
      short_name: `All Icons`,
      cmd: `filter_icon_all`,
      modes: [`items`],
      icon: bot_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_icon({mode: args.mode, icon: `all`, from: args.from})
      },
      info: `Filter all icons`,
    },
    {
      name: `Filter Icon Menu`,
      short_name: `Icons`,
      cmd: `show_filter_icon_menu`,
      modes: [`items`],
      item: true,
      icon: bot_icon,
      action: (args) => {
        App.show_filter_icon_menu(args.mode, args.e)
      },
      info: `Show the Filter Icon Menu`,
    },
    {
      name: `Pick Icon`,
      short_name: `Icon`,
      cmd: `pick_custom_icon`,
      icon: bot_icon,
      action: (args) => {
        App.show_filter_icon_menu(args.mode, args.e, true)
      },
      info: `Pick a specific icon to show`,
    },
    {
      name: `Show Icon`,
      short_name: `Icon`,
      cmd: `show_custom_icon`,
      modes: [`items`],
      icon: bot_icon,
      action: (args) => {
        App.show_custom_icon(args.item, args.e)
      },
      info: `Show a specific icon`,
    },
    {
      name: `Filter Pins`,
      short_name: `Pins`,
      cmd: `filter_pinned_tabs`,
      modes: [`tabs`],
      icon: pin_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter pinned tabs`,
    },
    {
      name: `Show Pins`,
      short_name: `Pins`,
      cmd: `show_pinned_tabs`,
      icon: pin_icon,
      action: (args) => {
        App.show_tab_list(`pins`, args.e)
      },
      info: `Show pinned tabs`,
    },
    {
      name: `Filter Normal`,
      short_name: `Normal`,
      cmd: `filter_normal_tabs`,
      modes: [`tabs`],
      icon: normal_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter normal tabs`,
    },
    {
      name: `Filter Playing`,
      short_name: `Playing`,
      cmd: `filter_playing_tabs`,
      modes: [`tabs`],
      icon: playing_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter playing tabs`,
    },
    {
      name: `Show Playing`,
      short_name: `Playing`,
      cmd: `show_playing_tabs`,
      icon: playing_icon,
      action: (args) => {
        App.show_tab_list(`playing`, args.e)
      },
      info: `Show playing tabs`,
    },
    {
      name: `Show Recent`,
      short_name: `Recent`,
      cmd: `show_recent_tabs`,
      icon: tabs_icon,
      action: (args) => {
        App.show_tab_list(`recent`, args.e)
      },
      info: `Show recent tabs`,
    },
    {
      name: `Recent Backwards`,
      short_name: `Recent`,
      cmd: `recent_tabs_backwards`,
      icon: tabs_icon,
      action: (args) => {
        App.go_to_previous_tab()
      },
      info: `Go to the next recent tab backwards`,
    },
    {
      name: `Recent Forwards`,
      short_name: `Recent`,
      cmd: `recent_tabs_forwards`,
      icon: tabs_icon,
      action: (args) => {
        App.go_to_previous_tab(true)
      },
      info: `Go to the next recent tab forwards`,
    },
    {
      name: `Filter Loaded`,
      short_name: `Loaded`,
      cmd: `filter_loaded_tabs`,
      modes: [`tabs`],
      icon: loaded_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter loaded tabs`,
    },
    {
      name: `Filter Unloaded`,
      short_name: `Unloaded`,
      cmd: `filter_unloaded_tabs`,
      modes: [`tabs`],
      icon: unloaded_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter unloaded tabs`,
    },
    {
      name: `Filter Duplicates`,
      short_name: `Duplicates`,
      cmd: `filter_duplicate_tabs`,
      modes: [`tabs`],
      icon: duplicate_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter duplicate tabs`,
    },
    {
      name: `Filter Unread`,
      short_name: `Unread`,
      cmd: `filter_unread_tabs`,
      modes: [`tabs`],
      icon: unread_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter unread tabs`,
    },
    {
      name: `Filter Obfuscated`,
      short_name: `Obfuscated`,
      cmd: `filter_obfuscated_tabs`,
      modes: [`tabs`],
      icon: obfuscated_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter obfuscated tabs`,
    },
    {
      name: `Filter Titled`,
      short_name: `Titled`,
      cmd: `filter_titled_tabs`,
      modes: [`items`],
      icon: notepad_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter tabs that have a custom title`,
    },
    {
      name: `Filter Notes`,
      short_name: `Notes`,
      cmd: `filter_notes_tabs`,
      modes: [`items`],
      icon: notes_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter tabs that have notes`,
    },
    {
      name: `Filter Roots`,
      short_name: `Roots`,
      cmd: `filter_root_tabs`,
      modes: [`items`],
      icon: root_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter tabs that have roots`,
    },
    {
      name: `Filter All Containers`,
      short_name: `Containers`,
      cmd: `filter_tab_containers_all`,
      modes: [`tabs`],
      icon: container_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter tabs that have containers`,
    },
    {
      name: `Filter Containers`,
      short_name: `Containers`,
      cmd: `show_filter_container_menu`,
      modes: [`tabs`],
      item: true,
      icon: container_icon,
      action: (args) => {
        App.show_filter_container_menu(args.mode, args.e)
      },
      info: `Show the Filter Container Menu`,
    },
    {
      name: `Open In Container`,
      short_name: `Container`,
      cmd: `open_tabs_in_container`,
      modes: [`tabs`],
      icon: container_icon,
      action: (args) => {
        App.open_in_tab_container(args.item, args.e)
      },
      info: `Open a tab in a new container`,
    },
    {
      name: `Pick Container`,
      short_name: `Container`,
      cmd: `pick_tab_container`,
      icon: container_icon,
      action: (args) => {
        App.show_filter_container_menu(args.mode, args.e, true)
      },
      info: `Pick a specific container to show`,
    },
    {
      name: `Filter Edited`,
      short_name: `Edited`,
      cmd: `filter_edited_tabs`,
      modes: [`items`],
      icon: notepad_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter tabs that are edited`,
    },
    {
      name: `Filter Header`,
      short_name: `Headers`,
      cmd: `filter_header_tabs`,
      modes: [`items`],
      icon: zone_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter header tabs`,
    },
    {
      name: `Filter No Tab`,
      short_name: `No Tab`,
      cmd: `filter_no_tab`,
      modes: [`history`, `bookmarks`, `closed`],
      icon: filter_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter items that are not open in a tab`,
    },
    {
      name: `Favorite Filters`,
      short_name: `Fav Filters`,
      cmd: `show_favorite_filters`,
      modes: [`items`],
      icon: filter_icon,
      action: (args) => {
        App.show_favorite_filters(args.mode, args.e)
      },
      info: `Show the Favorite Filters`,
    },
    {
      name: `Refine Filters`,
      cmd: `show_refine_filters`,
      modes: [`items`],
      icon: filter_icon,
      action: (args) => {
        App.show_refine_filters(args.e)
      },
      info: `Show the Refine Filters`,
    },
    {
      name: `Exact Filters`,
      cmd: `show_exact_filters`,
      modes: [`items`],
      icon: filter_icon,
      action: (args) => {
        App.show_exact_filters(args.mode, args.e)
      },
      info: `Show the Exact Filters`,
    },
    {
      name: `Custom Filters`,
      cmd: `show_custom_filters`,
      modes: [`items`],
      icon: filter_icon,
      action: (args) => {
        App.show_custom_filters(args.mode, args.e)
      },
      info: `Show the Custom Filters`,
    },
    {
      name: `Domain History`,
      cmd: `search_domain_history`,
      modes: [`items`],
      item: true,
      some_hostname: true,
      icon: history_icon,
      action: (args) => {
        App.search_domain_history(args.item)
      },
      info: `Search this domain in History mode`,
    },
    {
      name: `Domain Bookmarks`,
      cmd: `search_domain_bookmarks`,
      modes: [`items`],
      item: true,
      some_hostname: true,
      icon: bookmarks_icon,
      action: (args) => {
        App.search_domain_bookmarks(args.item)
      },
      info: `Search this domain in Bookmarks mode`,
    },
    {
      name: `Default Font`,
      short_name: `Def Font`,
      cmd: `default_font_size`,
      icon: notepad_icon,
      action: (args) => {
        App.set_default_font()
      },
      info: `Default font size`,
    },
    {
      name: `Increase Font`,
      short_name: `Font +`,
      cmd: `increase_font_size`,
      icon: plus_icon,
      action: (args) => {
        App.increase_font_size()
      },
      info: `Increase the font size`,
    },
    {
      name: `Decrease Font`,
      short_name: `Font -`,
      cmd: `decrease_font_size`,
      icon: minus_icon,
      action: (args) => {
        App.decrease_font_size()
      },
      info: `Decrease the font size`,
    },
    {
      name: `Domain Rule`,
      short_name: `Rule`,
      cmd: `edit_domain_rule`,
      modes: [`items`],
      single: true,
      some_no_header: true,
      icon: notepad_icon,
      action: (args) => {
        App.edit_domain_rule(args.item, args.e)
      },
      info: `Shortcut to edit a domain rule`,
    },
    {
      name: `Remove Domain Rule`,
      short_name: `Rm Rule`,
      cmd: `remove_domain_rule`,
      modes: [`items`],
      icon: notepad_icon,
      some_ruled: true,
      action: (args) => {
        App.remove_domain_rule(args.item)
      },
      info: `Remove a Domain Rule`,
    },
    {
      name: `Rm All Domain Rules`,
      short_name: `Rm Rules`,
      cmd: `remove_all_domain_rules`,
      icon: notepad_icon,
      action: (args) => {
        App.remove_all_domain_rules()
      },
      info: `Remove all Domain Rules`,
    },
    {
      name: `Save History`,
      short_name: `Save`,
      cmd: `save_history_pick`,
      modes: [`history`],
      filter_filled: true,
      icon: history_icon,
      action: (args) => {
        App.save_history_pick()
      },
      info: `Save current history query to use in the Tab Box`,
    },
    {
      name: `Light Colors`,
      short_name: `Light`,
      cmd: `set_light_colors`,
      icon: theme_icon,
      action: (args) => {
        App.set_light_colors()
      },
      info: `Change to the light color theme`,
    },
    {
      name: `Dark Colors`,
      short_name: `Dark`,
      cmd: `set_dark_colors`,
      icon: theme_icon,
      action: (args) => {
        App.set_dark_colors()
      },
      info: `Change to the dark color theme`,
    },
    {
      name: `Random Light`,
      short_name: `Light`,
      cmd: `set_random_light_colors`,
      icon: theme_icon,
      action: (args) => {
        App.random_colors(`light`)
      },
      info: `Set a random light color theme`,
    },
    {
      name: `Random Dark`,
      short_name: `Dark`,
      cmd: `set_random_dark_colors`,
      icon: theme_icon,
      action: (args) => {
        App.random_colors(`dark`)
      },
      info: `Set a random dark color theme`,
    },

    ...theme_nums,

    {
      name: `Cycle Opacity`,
      short_name: `Opacity`,
      cmd: `cycle_background_opacity`,
      icon: theme_icon,
      action: (args) => {
        App.cycle_background_opacity()
      },
      info: `Change background opacity in increments`,
    },
    {
      name: `Increase Opacity`,
      short_name: `Opacity +`,
      cmd: `increase_background_opacity`,
      icon: theme_icon,
      action: (args) => {
        App.cycle_background_opacity(`increase`)
      },
      info: `Increase the background opacity`,
    },
    {
      name: `Decrease Opacity`,
      short_name: `Opacity -`,
      cmd: `decrease_background_opacity`,
      icon: theme_icon,
      action: (args) => {
        App.cycle_background_opacity(`decrease`)
      },
      info: `Decrease the background opacity`,
    },
    {
      name: `Cycle Zoom`,
      short_name: `Zoom`,
      cmd: `cycle_background_zoom`,
      icon: theme_icon,
      action: (args) => {
        App.cycle_background_zoom()
      },
      info: `Change background zoom in increments`,
    },
    {
      name: `Increase Zoom`,
      short_name: `Zoom +`,
      cmd: `increase_background_zoom`,
      icon: theme_icon,
      action: (args) => {
        App.cycle_background_zoom(`increase`)
      },
      info: `Increase the background zoom`,
    },
    {
      name: `Decrease Zoom`,
      short_name: `Zoom -`,
      cmd: `decrease_background_zoom`,
      icon: theme_icon,
      action: (args) => {
        App.cycle_background_zoom(`decrease`)
      },
      info: `Decrease the background zoom`,
    },
    {
      name: `Background`,
      cmd: `set_background_image`,
      media: `image`,
      item: true,
      icon: image_icon,
      action: (args) => {
        App.change_background(args.item.url)
      },
      info: `Change the background to the selected image`,
    },
    {
      name: `Find Image`,
      cmd: `find_image`,
      icon: image_icon,
      action: (args) => {
        App.open_first_media(`image`)
      },
      info: `Open the first tab that contains an image`,
    },
    {
      name: `Find Video`,
      cmd: `find_video`,
      icon: video_icon,
      action: (args) => {
        App.open_first_media(`video`)
      },
      info: `Open the first tab that contains a video`,
    },
    {
      name: `Find Audio`,
      cmd: `find_audio`,
      icon: audio_icon,
      action: (args) => {
        App.open_first_media(`audio`)
      },
      info: `Open the first tab that contains an audio`,
    },
    {
      name: `Set Title`,
      cmd: `edit_main_title`,
      icon: main_title_icon,
      action: (args) => {
        App.edit_main_title()
      },
      info: `Edit the Title`,
    },
    {
      name: `Title Menu`,
      cmd: `show_main_title_menu`,
      icon: main_title_icon,
      action: (args) => {
        App.show_main_title_menu(args.e)
      },
      info: `Show the Title Menu`,
    },
    {
      name: `Title Left Menu`,
      short_name: `Left Menu`,
      cmd: `show_main_title_left_button_menu`,
      icon: main_title_icon,
      action: (args) => {
        App.show_main_title_left_button_menu(args.e)
      },
      info: `Show the Title Left Menu`,
    },
    {
      name: `Title Right Menu`,
      short_name: `Right Menu`,
      cmd: `show_main_title_right_button_menu`,
      icon: main_title_icon,
      action: (args) => {
        App.show_main_title_right_button_menu(args.e)
      },
      info: `Show the Title Right Menu`,
    },
    {
      name: `Red Title`,
      cmd: `color_main_title_red`,
      icon: main_title_icon,
      action: (args) => {
        App.color_main_title(`red`)
      },
      info: `Apply red color to the Title`,
    },
    {
      name: `Green Title`,
      cmd: `color_main_title_green`,
      icon: main_title_icon,
      action: (args) => {
        App.color_main_title(`green`)
      },
      info: `Apply green color to the Title`,
    },
    {
      name: `Blue Title`,
      cmd: `color_main_title_blue`,
      icon: main_title_icon,
      action: (args) => {
        App.color_main_title(`blue`)
      },
      info: `Apply blue color to the Title`,
    },
    {
      name: `Dark Title`,
      cmd: `color_main_title_dark`,
      icon: main_title_icon,
      action: (args) => {
        App.color_main_title(`dark`)
      },
      info: `Apply dark colors to the Title`,
    },
    {
      name: `Light Title`,
      cmd: `color_main_title_light`,
      icon: main_title_icon,
      action: (args) => {
        App.color_main_title(`light`)
      },
      info: `Apply light colors to the Title`,
    },
    {
      name: `Prev Title Color`,
      cmd: `previous_main_title_color`,
      icon: main_title_icon,
      action: (args) => {
        App.next_main_title_color(`prev`)
      },
      info: `Apply the previous color to the Title`,
    },
    {
      name: `Next Title Color`,
      cmd: `next_main_title_color`,
      icon: main_title_icon,
      action: (args) => {
        App.next_main_title_color(`next`)
      },
      info: `Apply the next color to the Title`,
    },
    {
      name: `Uncolor Title`,
      cmd: `uncolor_main_title`,
      icon: main_title_icon,
      action: (args) => {
        App.uncolor_main_title()
      },
      info: `Remove colors from the Title`,
    },
    {
      name: `Toggle Date`,
      short_name: `Date`,
      cmd: `toggle_main_title_date`,
      icon: main_title_icon,
      action: (args) => {
        App.toggle_main_title_date()
      },
      info: `Show or hide the date in the Title`,
    },
    {
      name: `Toggle Title`,
      short_name: `Title`,
      cmd: `toggle_main_title`,
      icon: main_title_icon,
      action: (args) => {
        App.toggle_main_title()
      },
      info: `Show or hide the Title`,
    },
    {
      name: `Copy Title`,
      cmd: `copy_main_title`,
      icon: main_title_icon,
      action: (args) => {
        App.copy_main_title()
      },
      info: `Copy the Title`,
    },
    {
      name: `Toggle Top`,
      short_name: `Top`,
      cmd: `toggle_top_panel`,
      icon: hat_icon,
      action: (args) => {
        App.toggle_top_panel()
      },
      info: `Show or hide the Top Panel`,
    },
    {
      name: `Scroll Title Left`,
      short_name: `Title Left`,
      cmd: `scroll_main_title_left`,
      icon: main_title_icon,
      action: (args) => {
        App.scroll_main_title(`left`)
      },
      info: `Scroll the Title to the left`,
    },
    {
      name: `Scroll Title Right`,
      short_name: `Title Right`,
      cmd: `scroll_main_title_right`,
      icon: main_title_icon,
      action: (args) => {
        App.scroll_main_title(`right`)
      },
      info: `Scroll the Title to the right`,
    },
    {
      name: `Title History`,
      cmd: `show_title_history`,
      icon: main_title_icon,
      action: (args) => {
        App.show_title_history()
      },
      info: `Show a list with recent main title changes`,
    },
    {
      name: `Toggle Wrap`,
      short_name: `Wrap`,
      cmd: `toggle_wrap_text`,
      icon: letters_icon,
      action: (args) => {
        App.toggle_wrap_text()
      },
      info: `Enable or disable the text wrapping of items`,
    },
    {
      name: `Toggle Auto Scroll`,
      short_name: `Auto`,
      cmd: `toggle_auto_scroll`,
      icon: mouse_icon,
      action: (args) => {
        App.toggle_auto_scroll()
      },
      info: `Enable or disable auto scroll in the item list`,
    },
    {
      name: `Toggle Tab Sort`,
      short_name: `Sort`,
      cmd: `toggle_tab_sort`,
      modes: [`tabs`],
      icon: tabs_icon,
      action: (args) => {
        App.toggle_tab_sort()
      },
      info: `Toggle the tab sort`,
    },
    {
      name: `Toggle Autoclick`,
      short_name: `Autoclick`,
      cmd: `toggle_autoclick`,
      icon: mouse_icon,
      action: (args) => {
        App.toggle_autoclick()
      },
      info: `Enable or disable Autoclick`,
    },
    {
      name: `Toggle Gestures`,
      short_name: `Gestures`,
      cmd: `toggle_gestures`,
      icon: gestures_icon,
      action: (args) => {
        App.toggle_gestures()
      },
      info: `Enable or disable Gestures`,
    },
    {
      name: `Toggle Hover Btn`,
      short_name: `Hover Btn`,
      cmd: `toggle_hover_button`,
      icon: hover_button_icon,
      action: (args) => {
        App.toggle_hover_button()
      },
      info: `Enable or disable the Hover Button`,
    },
    {
      name: `Sleep 500ms`,
      short_name: `Sleep`,
      cmd: `sleep_ms_500`,
      icon: time_icon,
      skip_palette: true,
      action: (args) => {
        // Do nothing
      },
      info: `Sleep for 500ms before doing something else`,
    },
    {
      name: `Sleep 1000ms`,
      short_name: `Sleep`,
      cmd: `sleep_ms_1000`,
      icon: time_icon,
      skip_palette: true,
      action: (args) => {
        // Do nothing
      },
      info: `Sleep for 1000ms before doing something else`,
    },

    ...custom_urls,
    ...signals,

    {
      name: `Repeat Command`,
      short_name: `Repeat`,
      cmd: `repeat_command`,
      icon: command_icon,
      action: (args) => {
        App.repeat_command()
      },
      info: `Repeat the last command`,
    },
    {
      name: `Show Stuff`,
      short_name: `Stuff`,
      cmd: `show_stuff_menu`,
      icon: shroom_icon,
      action: (args) => {
        App.show_stuff_menu(args.item, args.e)
      },
      info: `Show a menu with some selected commands`,
    },
    {
      name: `Lock Screen`,
      short_name: `Lock`,
      cmd: `lock_screen`,
      icon: lock_icon,
      action: (args) => {
        App.lock_screen()
      },
      info: `Lock the screen. Signals are not sent when locked`,
    },
    {
      name: `Password`,
      cmd: `generate_password`,
      icon: key_icon,
      action: (args) => {
        App.generate_password()
      },
      info: `Generate a random password`,
    },
    {
      name: `Flashlight`,
      cmd: `show_flashlight`,
      icon: flashlight_icon,
      action: (args) => {
        App.show_flashlight()
      },
      info: `Show a white window to illuminate`,
    },
    {
      name: `Signals`,
      cmd: `show_signals`,
      icon: signal_icon,
      action: (args) => {
        App.show_signals()
      },
      info: `Show the window to run and edit signals`,
    },
    {
      name: `Toggle Signals`,
      cmd: `toggle_signals`,
      icon: signal_icon,
      action: (args) => {
        App.toggle_signals()
      },
      info: `Enable or disable automatic signals`,
    },
    {
      name: `Open Sidebar`,
      short_name: `Sidebar`,
      cmd: `open_sidebar`,
      icon: bot_icon,
      action: (args) => {
        App.open_sidebar()
      },
      info: `Open the browser sidebar`,
    },
    {
      name: `Close Sidebar`,
      short_name: `Sidebar`,
      cmd: `close_sidebar`,
      icon: bot_icon,
      action: (args) => {
        App.close_sidebar()
      },
      info: `Close the browser sidebar`,
    },
    {
      name: `Toggle Sidebar`,
      short_name: `Sidebar`,
      cmd: `toggle_sidebar`,
      icon: bot_icon,
      action: (args) => {
        App.toggle_sidebar()
      },
      info: `Toggle the browser sidebar`,
    },
    {
      name: `Swarm`,
      cmd: `locust_swarm`,
      icon: grasshopper_icon,
      action: (args) => {
        App.locust_swarm()
      },
      info: `Decimate the crops`,
    },
    {
      name: `Breathe`,
      cmd: `breathe_effect`,
      modes: [`items`],
      icon: tree_icon,
      action: (args) => {
        App.start_breathe_effect()
      },
      info: `Let me breathe`,
    },
    {
      name: `Mirror Horizontal`,
      cmd: `mirror_horizontal`,
      modes: [`items`],
      icon: mirror_icon,
      action: (args) => {
        App.mirror(`horizontal`)
      },
      info: `The grass is meaner on the other side`,
    },
    {
      name: `Mirror Vertical`,
      cmd: `mirror_vertical`,
      modes: [`items`],
      icon: mirror_icon,
      action: (args) => {
        App.mirror(`vertical`)
      },
      info: `The grass is leaner on the other side`,
    },
    {
      name: `Fill Headers`,
      cmd: `fill_headers`,
      modes: [`tabs`],
      icon: zone_icon,
      action: (args) => {
        App.fill_headers(args.e)
      },
      info: `Insert x number of headers between the tabs`,
    },
    {
      name: `Fill Subheaders`,
      cmd: `fill_subheaders`,
      modes: [`tabs`],
      icon: zone_icon,
      action: (args) => {
        App.fill_subheaders(args.e)
      },
      info: `Insert x number of subheaders between the tabs`,
    },
    {
      name: `Restart`,
      cmd: `restart_extension`,
      icon: bot_icon,
      action: (args) => {
        App.restart_extension()
      },
      info: `Restart the extension (For debugging)`,
    },
    // Don't add icons to hidden commands
    {
      name: `!madprops`,
      cmd: `user_madprops_settings`,
      action: (args) => {
        App.user_settings(`madprops`)
      },
      skip_settings: true,
      info: `Use the preferred settings for madprops`,
    },
    {
      name: `!madprops (Force)`,
      short_name: `!madprops (F)`,
      cmd: `user_madprops_settings_force`,
      action: (args) => {
        App.user_settings(`madprops`, true)
      },
      skip_settings: true,
      info: `Use the preferred settings for madprops without confirmation`,
    },
  ]

  let infos = App.commands.map(command => command.info)
  let dup_info = infos.filter((info, index) => infos.indexOf(info) !== index)
  let cmds = App.commands.map(command => command.cmd)
  let dup_cmds = cmds.filter((cmd, index) => cmds.indexOf(cmd) !== index)

  if (dup_info.length) {
    App.error(`Duplicate Commands Info: ${dup_info}`)
  }

  if (dup_cmds.length) {
    App.error(`Duplicate Commands Cmd: ${dup_cmds}`)
  }

  App.sort_commands()
}