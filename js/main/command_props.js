App.setup_commands = () => {
  let pin_icon = App.get_setting(`pin_icon`) || App.pin_icon
  let normal_icon = App.get_setting(`normal_icon`) || App.mode_icons.tabs
  let playing_icon = App.get_setting(`playing_icon`) || App.audio_icon
  let loaded_icon = App.get_setting(`loaded_icon`) || App.mode_icons.tabs
  let unloaded_icon = App.get_setting(`unloaded_icon`) || App.sleeping_icon
  let muted_icon = App.get_setting(`muted_icon`) || App.muted_icon
  let unread_icon = App.get_setting(`unread_icon`) || App.circle_icon
  let notes_icon = App.get_setting(`notes_icon`) || App.notepad_icon
  let header_icon = App.get_setting(`header_icon`) || App.zone_icon
  let subheader_icon = App.get_setting(`subheader_icon`) || App.zone_icon
  let image_icon = App.get_setting(`image_icon`) || App.settings_icons.media
  let time_icon = App.time_icon
  let title_icon = App.settings_icons.title
  let command_icon = App.command_icon
  let settings_icon = App.settings_icons.general
  let theme_icon = App.settings_icons.theme
  let filter_icon = App.settings_icons.filter
  let media_icon = App.settings_icons.media
  let tab_box_icon = App.settings_icons.tab_box
  let favorites_icon = App.settings_icons.favorites
  let tabs_icon =  App.mode_icons.tabs
  let bookmarks_icon = App.mode_icons.bookmarks
  let closed_icon = App.mode_icons.closed
  let browser_icon = App.browser_icon
  let clipboard_icon = App.clipboard_icon
  let notepad_icon = App.notepad_icon
  let bot_icon = App.bot_icon
  let up_icon = App.up_arrow_icon
  let down_icon = App.down_arrow_icon
  let left_icon = App.left_arrow_icon
  let close_icon = App.close_icon
  let tag_icon = App.tag_icon
  let zone_icon = App.zone_icon
  let globe_icon = App.globe_icon
  let color_filters = []
  let color_changers = []
  let color_removers = []
  let color_closers = []

  color_filters.push({
    name: `Filter All Colors`,
    short_name: `All Colors`,
    cmd: `filter_color_all`,
    modes: [`items`],
    icon: theme_icon,
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
      name: name,
      short_name: color.name,
      cmd: `filter_color_${color.id}`,
      modes: [`items`],
      icon: icon,
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
      name: name,
      short_name: color.name,
      cmd: `show_color_${color.id}`,
      modes: [`items`],
      icon: icon,
      action: (args) => {
        App.show_tab_list(`color_${color.id}`, args.e)
      },
      info: `Show color (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `Color ${color.name}`
    short = color.name

    color_changers.push({
      name: name,
      short_name: short,
      cmd: `color_${color.id}`,
      some_no_color_id: color.id,
      modes: [`tabs`],
      item: true,
      icon: icon,
      action: (args) => {
        App.edit_tab_color({item: args.item, color: color.id})
      },
      info: `Add a custom color to tabs (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `Toggle ${color.name}`
    short = color.name

    color_changers.push({
      name: name,
      short_name: short,
      cmd: `toggle_color_${color.id}`,
      modes: [`tabs`],
      item: true,
      icon: icon,
      action: (args) => {
        App.edit_tab_color({item: args.item, color: color.id, toggle: true})
      },
      info: `Toggle color on or off (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `Remove ${color.name}`

    color_removers.push({
      name: name,
      cmd: `remove_color_${color.id}`,
      modes: [`tabs`],
      some_custom_color_id: color.id,
      some_custom_color: true,
      icon: icon,
      action: (args) => {
        App.remove_color(color.id)
      },
      info: `Remove color from tabs (${color.name})`,
    })

    icon = App.color_icon(color.id)
    name = `Close ${color.name}`

    color_closers.push({
      name: name,
      cmd: `close_color_${color.id}`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_color(color.id)
      },
      info: `Close tabs with this color (${color.name})`,
    })
  }

  color_filters.push({
    name: `Filter Color Menu`,
    short_name: `Colors`,
    cmd: `show_filter_color_menu`,
    modes: [`items`],
    item: true,
    icon: theme_icon,
    action: (args) => {
      App.show_filter_color_menu(args.mode, args.e)
    },
    info: `Show the filter color menu`,
  })

  color_changers.push({
    name: `Color Menu`,
    short_name: `Color`,
    cmd: `show_color_menu`,
    modes: [`tabs`],
    item: true,
    icon: theme_icon,
    action: (args) => {
      App.show_color_menu(args.item, args.e)
    },
    info: `Show the colors menu`,
  })

  color_removers.push({
    name: `Remove Color`,
    cmd: `remove_color`,
    modes: [`tabs`],
    item: true,
    some_custom_color: true,
    icon: theme_icon,
    action: (args) => {
      App.edit_tab_color({item: args.item})
    },
    info: `Remove the custom color of tabs`,
  })

  color_removers.push({
    name: `Remove All Colors`,
    cmd: `remove_all_colors`,
    modes: [`tabs`],
    item: true,
    icon: theme_icon,
    action: (args) => {
      App.remove_edits({what: [`color`]})
    },
    info: `Remove all colors from tabs`,
  })

  color_closers.push({
    name: `Replace Color`,
    cmd: `replace_color`,
    modes: [`tabs`],
    icon: theme_icon,
    action: (args) => {
      App.replace_color(args.e)
    },
    info: `Replace a color with another one`,
  })

  color_closers.push({
    name: `Close Color`,
    cmd: `close_color_all`,
    modes: [`tabs`],
    icon: close_icon,
    action: (args) => {
      App.close_color_all(args.e)
    },
    info: `Show the close color menu`,
  })

  let media_filters = []

  for (let media of App.media_types) {
    let cap = App.capitalize(media)
    let icon = App.get_setting(`${media}_icon`) || command_icon
    let name = `Filter ${cap}`.trim()

    media_filters.push({
      name: name,
      short_name: cap,
      cmd: `filter_media_${media}`,
      modes: [`items`],
      icon: icon,
      filter_mode: true,
      action: (args) => {
        App.filter_cmd(args.mode, args.self.cmd, args.from)
      },
      info: `Filter media (${media})`,
    })
  }

  let show_modes = []

  for (let mode of App.modes) {
    let icon = App.mode_icons[mode]
    let name = `Show ${App.get_mode_name(mode)}`

    show_modes.push({
      name: name,
      cmd: `show_mode_${mode}`,
      icon: icon,
      action: (args) => {
        App.show_mode({mode: mode, reuse_filter: true})
      },
      info: `Show mode: ${mode}`,
    })
  }

  let settings_categories = []

  for (let category in App.setting_catprops) {
    let icon = App.settings_icons[category]
    let c_name = App.category_string(category)
    let name = `Settings (${c_name})`

    settings_categories.push({
      name: name,
      cmd: `settings_category_${category}`,
      icon: icon,
      action: (args) => {
        App.show_settings_category(category)
      },
      info: `Show settings (${c_name})`,
    })
  }

  App.commands = [
    {
      name: `Go To Top`,
      cmd: `go_to_top`,
      modes: [`items`],
      icon: up_icon,
      action: (args) => {
        App.goto_top()
      },
      info: `Go to the top of the list`,
    },
    {
      name: `Go To Bottom`,
      cmd: `go_to_bottom`,
      modes: [`items`],
      icon: down_icon,
      action: (args) => {
        App.goto_bottom()
      },
      info: `Go to the bottom of the list`,
    },
    {
      name: `Step Back`,
      cmd: `step_back`,
      modes: [`items`],
      icon: left_icon,
      action: (args) => {
        App.step_back()
      },
      info: `Do the Step Back action. What it does depend on the current state`,
    },
    {
      name: `Select All`,
      cmd: `select_all_items`,
      modes: [`items`],
      icon: command_icon,
      action: (args) => {
        App.select_all(args.mode, true)
      },
      info: `Select all items`,
    },
    {
      name: `Deselect All`,
      cmd: `dselect_all_items`,
      modes: [`items`],
      icon: command_icon,
      action: (args) => {
        App.deselect_all(args.mode, true)
      },
      info: `Deselect all items`,
    },
    {
      name: `Select Up`,
      cmd: `select_items_up`,
      modes: [`items`],
      icon: command_icon,
      action: (args) => {
        App.select_to_edge(args.mode, `up`)
      },
      info: `Select all items above this item`,
    },
    {
      name: `Select Down`,
      cmd: `select_items_down`,
      modes: [`items`],
      icon: command_icon,
      action: (args) => {
        App.select_to_edge(args.mode, `down`)
      },
      info: `Select all items below this item`,
    },
    {
      name: `Copy Tabs`,
      cmd: `copy_tabs`,
      modes: [`tabs`],
      item: true,
      icon: clipboard_icon,
      action: (args) => {
        App.copy_tabs(args.item)
      },
      info: `Copy tabs to paste later at another position`,
    },
    {
      name: `Paste Tabs`,
      cmd: `paste_tabs`,
      modes: [`tabs`],
      item: true,
      icon: clipboard_icon,
      action: (args) => {
        App.paste_tabs(args.item)
      },
      info: `Paste tabs at the current position`,
    },
    {
      name: `Previous Mode`,
      cmd: `show_previous_mode`,
      modes: [`items`],
      icon: command_icon,
      action: (args) => {
        App.cycle_modes(true)
      },
      info: `Go to the previous mode`,
    },
    {
      name: `Next Mode`,
      cmd: `show_next_mode`,
      modes: [`items`],
      icon: command_icon,
      action: (args) => {
        App.cycle_modes()
      },
      info: `Go to the next mode`,
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
      cmd: `export_settings`,
      icon: settings_icon,
      action: (args) => {
        App.export_settings()
      },
      info: `Export settings`,
    },
    {
      name: `Import Settings`,
      cmd: `import_settings`,
      icon: settings_icon,
      action: (args) => {
        App.import_settings()
      },
      info: `Import settings`,
    },
    {
      name: `All Settings`,
      cmd: `show_all_settings`,
      icon: settings_icon,
      action: (args) => {
        App.show_all_settings()
      },
      info: `Show all settings`,
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
      name: `Export Theme`,
      cmd: `export_theme`,
      icon: theme_icon,
      action: (args) => {
        App.export_theme()
      },
      info: `Export theme`,
    },
    {
      name: `Import Theme`,
      cmd: `import_theme`,
      icon: theme_icon,
      action: (args) => {
        App.import_theme()
      },
      info: `Import theme`,
    },
    {
      name: `Previous Theme`,
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
      cmd: `show_background_menu`,
      icon: theme_icon,
      action: (args) => {
        App.show_background_menu(args.e)
      },
      info: `Show the background menu`,
    },
    {
      name: `Show About`,
      cmd: `show_about`,
      icon: bot_icon,
      action: (args) => {
        App.show_about()
      },
      info: `Show the About window`,
    },
    {
      name: `Show Palette`,
      cmd: `show_palette`,
      icon: command_icon,
      action: (args) => {
        App.show_palette()
      },
      info: `Show the Palette`,
    },
    {
      name: `Toggle Favorites`,
      cmd: `toggle_favorites`,
      modes: [`items`],
      icon: favorites_icon,
      action: (args) => {
        App.toggle_favorites(args.mode)
      },
      info: `Show or hide the Favorites bar or button`,
    },
    {
      name: `Favorites Autohide`,
      cmd: `toggle_favorites_autohide`,
      modes: [`items`],
      icon: favorites_icon,
      action: (args) => {
        App.toggle_favorites_autohide()
      },
      info: `Enable or disable Favorites autohide`,
    },
    {
      name: `Toggle Tab Box`,
      cmd: `toggle_tab_box`,
      modes: [`tabs`],
      icon: tab_box_icon,
      action: (args) => {
        App.toggle_tab_box()
      },
      info: `Show or hide the Tab Box`,
    },
    {
      name: `Toggle Taglist`,
      cmd: `toggle_taglist`,
      modes: [`items`],
      icon: tag_icon,
      action: (args) => {
        App.toggle_taglist(args.mode)
      },
      info: `Show or hide the Taglist`,
    },
    {
      name: `Toggle Footer`,
      cmd: `toggle_footer`,
      modes: [`items`],
      icon: command_icon,
      action: (args) => {
        App.toggle_footer()
      },
      info: `Show or hide the Footer`,
    },
    {
      name: `Toggle Auto Blur`,
      cmd: `toggle_auto_blur`,
      icon: command_icon,
      action: (args) => {
        App.toggle_auto_blur()
      },
      info: `Enable or disable Auto Blur`,
    },
    {
      name: `Cycle Clock`,
      cmd: `cycle_clock`,
      icon: time_icon,
      action: (args) => {
        App.cycle_clock()
      },
      info: `Cycle clock modes`,
    },
    {
      name: `Fullscreen`,
      cmd: `toggle_fullscreen`,
      icon: command_icon,
      action: (args) => {
        App.toggle_fullscreen()
      },
      info: `Hide some interface components`,
    },
    {
      name: `Item Menu`,
      cmd: `show_item_menu`,
      modes: [`items`],
      item: true,
      icon: command_icon,
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
      icon: command_icon,
      action: (args) => {
        App[`${args.mode}_action`](args.item, `click`)
      },
      info: `Trigger the action for the selected item`,
    },
    {
      name: `Show Favorites`,
      short_name: `Favorites`,
      cmd: `show_favorites_menu`,
      modes: [`items`],
      icon: favorites_icon,
      action: (args) => {
        App.show_favorites_menu(args.e)
      },
      info: `Show the Favorites menu`,
    },
    {
      name: `Filter All`,
      cmd: `filter_all`,
      modes: [`items`],
      icon: globe_icon,
      action: (args) => {
        App.filter_all(args.mode)
      },
      info: `Filter all items`,
    },
    {
      name: `Previous Filter`,
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
      icon: command_icon,
      action: (args) => {
        App.open_items(args.item, true)
      },
      info: `Open items`,
    },
    {
      name: `View`,
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
        App.bookmark_items(args.item)
      },
      info: `Bookmark this item`,
    },
    {
      name: `Bookmark Page`,
      cmd: `bookmark_page`,
      icon: bookmarks_icon,
      action: (args) => {
        App.bookmark_active()
      },
      info: `Bookmark the current page`,
    },
    {
      name: `Copy URL`,
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
      cmd: `browser_back`,
      icon: browser_icon,
      action: (args) => {
        App.browser_back()
      },
      info: `Go back in browser history`,
    },
    {
      name: `Go Forward`,
      cmd: `browser_forward`,
      icon: browser_icon,
      action: (args) => {
        App.browser_forward()
      },
      info: `Go forward in browser history`,
    },
    {
      name: `Reload Page`,
      cmd: `browser_reload`,
      icon: browser_icon,
      action: (args) => {
        App.browser_reload()
      },
      info: `Reload the current page`,
    },
    {
      name: `Browser Menu`,
      cmd: `show_browser_menu`,
      icon: browser_icon,
      action: (args) => {
        App.show_browser_menu(args.e)
      },
      info: `Show the browser menu`,
    },
    {
      name: `New`,
      cmd: `open_new_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.new_tab()
      },
      info: `Open a new tab`,
    },
    {
      name: `Unload`,
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
      name: `Load`,
      cmd: `load_tabs`,
      modes: [`tabs`],
      some_unloaded: true,
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.load_tabs(args.item)
      },
      info: `Load tabs that are unloaded`,
    },
    {
      name: `Duplicate`,
      cmd: `duplicate_tabs`,
      modes: [`tabs`],
      item: true,
      some_no_header: true,
      icon: tabs_icon,
      action: (args) => {
        App.duplicate_tabs(args.item)
      },
      info: `Duplicate tabs`,
    },
    {
      name: `To Window`,
      cmd: `show_windows_menu`,
      modes: [`tabs`],
      item: true,
      icon: tabs_icon,
      action: (args) => {
        App.show_windows_menu(args.item, args.e)
      },
      info: `Move tabs to another window`,
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
      name: `Pin`,
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
      name: `Unpin`,
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
      cmd: `toggle_pin_tabs`,
      modes: [`tabs`],
      item: true,
      some_loaded: true,
      icon: pin_icon,
      action: (args) => {
        App.toggle_pin_tabs(args.item)
      },
      info: `Pin or unpin tabs`,
    },
    {
      name: `Toggle Pins`,
      cmd: `toggle_show_pins`,
      modes: [`tabs`],
      item: true,
      some_loaded: true,
      icon: pin_icon,
      action: (args) => {
        App.toggle_show_pins(args.item)
      },
      info: `Hide or show pins`,
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
      name: `Mute`,
      cmd: `mute_tabs`,
      modes: [`tabs`],
      some_unmuted: true,
      some_no_header: true,
      item: true,
      icon: muted_icon,
      action: (args) => {
        App.mute_tabs(args.item)
      },
      info: `Mute tabs`,
    },
    {
      name: `Unmute`,
      cmd: `unmute_tabs`,
      modes: [`tabs`],
      some_muted: true,
      some_no_header: true,
      item: true,
      icon: muted_icon,
      action: (args) => {
        App.unmute_tabs(args.item)
      },
      info: `Unmute tabs`,
    },
    {
      name: `Toggle Mute`,
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
      name: `Unmute All`,
      cmd: `mute_all_tabs`,
      modes: [`tabs`],
      item: true,
      icon: muted_icon,
      action: (args) => {
        App.unmute_all_tabs(args.item)
      },
      info: `Unmute all muted tabs`,
    },
    {
      name: `Close`,
      cmd: `close_tabs`,
      modes: [`tabs`],
      item: true,
      icon: close_icon,
      action: (args) => {
        App.close_tabs(args.item)
      },
      info: `Close tabs`,
    },
    {
      name: `Close Menu`,
      cmd: `show_close_tabs_menu`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.show_close_tabs_menu(args.e, args.item)
      },
      info: `Open the menu with some tab closing options`,
    },
    {
      name: `Close Normal`,
      cmd: `close_normal_tabs`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`normal`)
      },
      info: `Close normal tabs`,
    },
    {
      name: `Close Playing`,
      cmd: `close_playing_tabs`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`playing`)
      },
      info: `Close playing tabs`,
    },
    {
      name: `Close Loaded`,
      cmd: `close_loaded_tabs`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`loaded`)
      },
      info: `Close loaded tabs`,
    },
    {
      name: `Close Unloaded`,
      cmd: `close_unloaded_tabs`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`unloaded`)
      },
      info: `Close unloaded tabs`,
    },
    {
      name: `Close Duplicates`,
      cmd: `close_duplicate_tabs`,
      modes: [`tabs`],
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
      name: `Close Pins`,
      cmd: `close_pinned_tabs`,
      modes: [`tabs`],
      item: true,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`pinned`, args.item)
      },
      info: `Close pinned tabs`,
    },
    {
      name: `Close All`,
      cmd: `close_all_tabs`,
      modes: [`tabs`],
      item: true,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`all`, args.item)
      },
      info: `Close all tabs`,
    },
    {
      name: `Close Empty`,
      cmd: `close_empty_tabs`,
      modes: [`tabs`],
      item: true,
      icon: close_icon,
      action: (args) => {
        App.close_tabs_popup(`empty`, args.item)
      },
      info: `Close empty tabs`,
    },
    {
      name: `Close First`,
      cmd: `close_first_tab`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_first_tab()
      },
      info: `Close the first tab`,
    },
    {
      name: `Close Last`,
      cmd: `close_last_tab`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_last_tab()
      },
      info: `Close the last tab`,
    },

    ...color_closers,

    {
      name: `Go To Playing`,
      cmd: `go_to_playing_tab`,
      icon: tabs_icon,
      action: (args) => {
        App.go_to_playing_tab()
      },
      info: `Go the tab emitting sound`,
    },
    {
      name: `Sort All`,
      cmd: `sort_tabs`,
      modes: [`items`],
      icon: tabs_icon,
      action: (args) => {
        App.sort_tabs()
      },
      info: `Open the sort tabs window`,
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
      name: `Show Info`,
      cmd: `show_tabs_info`,
      modes: [`items`],
      icon: tabs_icon,
      action: (args) => {
        App.show_tabs_info()
      },
      info: `Show some tab info`,
    },
    {
      name: `Show URLs`,
      cmd: `show_tab_urls`,
      modes: [`items`],
      icon: tabs_icon,
      action: (args) => {
        App.show_tab_urls()
      },
      info: `Show a list of open URLs`,
    },
    {
      name: `Open URLs`,
      cmd: `open_tab_urls`,
      modes: [`items`],
      icon: tabs_icon,
      action: (args) => {
        App.open_tab_urls()
      },
      info: `Open a list of URLs`,
    },
    {
      name: `Reopen`,
      cmd: `reopen_tab`,
      icon: tabs_icon,
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
      icon: header_icon,
      action: (args) => {
        App.insert_header(args.item)
      },
      info: `Add a header tab`,
    },
    {
      name: `Insert Subheader`,
      short_name: `Subheader`,
      cmd: `insert_subheader`,
      modes: [`tabs`],
      item: true,
      icon: subheader_icon,
      action: (args) => {
        App.insert_header(args.item, false)
      },
      info: `Add a subheader tab`,
    },
    {
      name: `Select Pins`,
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
      icon: notepad_icon,
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
      icon: tag_icon,
      action: (args) => {
        App.edit_tags(args.item)
      },
      info: `Edit tab tags`,
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
      info: `Edit tab notes`,
    },
    {
      name: `Global Notes`,
      cmd: `edit_global_notes`,
      icon: notes_icon,
      action: (args) => {
        App.edit_global_notes()
      },
      info: `Edit global notes`,
    },
    {
      name: `Add Tags`,
      short_name: `Tags`,
      cmd: `add_tags`,
      modes: [`tabs`],
      item: true,
      icon: tag_icon,
      action: (args) => {
        App.add_tags(args.item)
      },
      info: `Add tags to tabs`,
    },
    {
      name: `Split Both`,
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
      cmd: `add_split_top`,
      modes: [`tabs`],
      item: true,
      some_no_split_top: true,
      icon: zone_icon,
      action: (args) => {
        App.edit_tab_split({item: args.item, which: `top`})
      },
      info: `Add a split above the tab`,
    },
    {
      name: `Split Bottom`,
      cmd: `add_split_bottom`,
      modes: [`tabs`],
      item: true,
      some_no_split_bottom: true,
      some_no_header: true,
      icon: zone_icon,
      action: (args) => {
        App.edit_tab_split({item: args.item, which: `bottom`})
      },
      info: `Add a split below the tab`,
    },

    ...color_removers,

    {
      name: `Remove Title`,
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
      cmd: `remove_all_titles`,
      modes: [`tabs`],
      icon: notepad_icon,
      action: (args) => {
        App.remove_edits({what: [`title`]})
      },
      info: `Remove all titles from tabs`,
    },
    {
      name: `Remove Icon`,
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
      cmd: `remove_all_icons`,
      modes: [`tabs`],
      icon: bot_icon,
      action: (args) => {
        App.remove_edits({what: [`icon`]})
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
      icon: tag_icon,
      action: (args) => {
        App.wipe_tag()
      },
      info: `Remove a specific tag from all tabs`,
    },
    {
      name: `Remove Tags`,
      cmd: `remove_tags`,
      modes: [`tabs`],
      item: true,
      some_custom_tags: true,
      icon: tag_icon,
      action: (args) => {
        App.remove_item_tags(args.item)
      },
      info: `Remove the tags from tabs`,
    },
    {
      name: `Remove All Tags`,
      short_name: `All Tags`,
      cmd: `remove_all_tags`,
      modes: [`tabs`],
      icon: tag_icon,
      action: (args) => {
        App.remove_edits({what: [`tags`]})
      },
      info: `Remove all tags from tabs`,
    },
    {
      name: `Remove All Notes`,
      cmd: `remove_all_notes`,
      modes: [`tabs`],
      icon: notes_icon,
      action: (args) => {
        App.remove_edits({what: [`notes`]})
      },
      info: `Remove all notes from tabs`,
    },
    {
      name: `Remove Split`,
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
      name: `Remove All Splits`,
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
        App.close_headers(args.item)
      },
      info: `Close all header tabs`,
    },
    {
      name: `Close Subheaders`,
      cmd: `close_subheaders`,
      modes: [`tabs`],
      icon: close_icon,
      action: (args) => {
        App.close_subheaders(args.item)
      },
      info: `Close all subheader tabs`,
    },
    {
      name: `Replace Tag`,
      cmd: `replace_tag`,
      modes: [`tabs`],
      icon: tag_icon,
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
      cmd: `remove_all_edits`,
      modes: [`tabs`],
      icon: notepad_icon,
      action: (args) => {
        App.remove_all_edits()
      },
      info: `Remove all edits from tabs`,
    },
    {
      name: `Remove Edits`,
      cmd: `remove_item_edits`,
      modes: [`tabs`],
      item: true,
      some_edits: true,
      icon: notepad_icon,
      action: (args) => {
        App.remove_item_edits(args.item)
      },
      info: `Remove all edits from specific items`,
    },

    ...color_changers,
    ...media_filters,
    ...color_filters,

    {
      name: `Filter Domain`,
      cmd: `filter_domain`,
      modes: [`items`],
      item: true,
      single: true,
      some_no_header: true,
      icon: filter_icon,
      action: (args) => {
        App.filter_domain(args.item)
      },
      info: `Filter same domain`,
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
      name: `Filter Root`,
      cmd: `filter_root`,
      modes: [`tabs`],
      item: true,
      single: true,
      icon: filter_icon,
      action: (args) => {
        App.filter_root(args.item)
      },
      info: `Filter the tabs that were opened through this tab`,
    },
    {
      name: `Filter Color`,
      cmd: `filter_color`,
      modes: [`items`],
      item: true,
      single: true,
      color: true,
      icon: theme_icon,
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
      icon: tag_icon,
      action: (args) => {
        App.filter_tag_pick(args.item, args.e)
      },
      info: `Filter by picking a tag from the current item`,
    },
    {
      name: `Filter Tags`,
      short_name: `Tags`,
      cmd: `show_filter_tag_menu`,
      modes: [`items`],
      icon: tag_icon,
      action: (args) => {
        App.show_filter_tag_menu(args.mode, args.e)
      },
      info: `Show the filter tag menu`,
    },
    {
      name: `Show Tag`,
      short_name: `Tag`,
      cmd: `show_tag`,
      modes: [`items`],
      icon: tag_icon,
      action: (args) => {
        App.show_filter_tag_menu(args.mode, args.e, true)
      },
      info: `Show the filter tag menu for showing instead of filtering`,
    },
    {
      name: `Filter All Tags`,
      short_name: `All Tags`,
      cmd: `filter_tag_all`,
      modes: [`items`],
      item: true,
      icon: tag_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_tag({mode: args.mode, tag: `all`, from: args.from})
      },
      info: `Filter all tags`,
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
      item: true,
      icon: bot_icon,
      filter_mode: true,
      action: (args) => {
        App.filter_icon({mode: args.mode, icon: `all`, from: args.from})
      },
      info: `Filter all icons`,
    },
    {
      name: `Filter Icons`,
      short_name: `Icons`,
      cmd: `show_filter_icon_menu`,
      modes: [`items`],
      item: true,
      icon: bot_icon,
      action: (args) => {
        App.show_filter_icon_menu(args.mode, args.e)
      },
      info: `Show the filter icon menu`,
    },
    {
      name: `Show Icon`,
      short_name: `Icon`,
      cmd: `show_icon`,
      modes: [`items`],
      icon: bot_icon,
      action: (args) => {
        App.show_filter_icon_menu(args.mode, args.e, true)
      },
      info: `Filter a specific icon`,
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
      modes: [`items`],
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
      modes: [`items`],
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
      modes: [`items`],
      icon: tabs_icon,
      action: (args) => {
        App.show_tab_list(`recent`, args.e)
      },
      info: `Show recent tabs`,
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
      icon: tabs_icon,
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
      name: `Domain Rule`,
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
      name: `Light Colors`,
      cmd: `set_light_colors`,
      icon: theme_icon,
      action: (args) => {
        App.set_light_colors()
      },
      info: `Change to the light color theme`,
    },
    {
      name: `Dark Colors`,
      cmd: `set_dark_colors`,
      icon: theme_icon,
      action: (args) => {
        App.set_dark_colors()
      },
      info: `Change to the dark color theme`,
    },
    {
      name: `Random Light`,
      cmd: `set_random_light_colors`,
      icon: theme_icon,
      action: (args) => {
        App.random_colors(`light`)
      },
      info: `Set a random light color theme`,
    },
    {
      name: `Random Dark`,
      cmd: `set_random_dark_colors`,
      icon: theme_icon,
      action: (args) => {
        App.random_colors(`dark`)
      },
      info: `Set a random dark color theme`,
    },
    {
      name: `Cycle Opacity`,
      cmd: `cycle_background_opacity`,
      icon: theme_icon,
      action: (args) => {
        App.cycle_background_opacity()
      },
      info: `Change background opacity in increments`,
    },
    {
      name: `Increase Opacity`,
      cmd: `increase_background_opacity`,
      icon: theme_icon,
      action: (args) => {
        App.cycle_background_opacity(`increase`)
      },
      info: `Increase the background opacity`,
    },
    {
      name: `Decrease Opacity`,
      cmd: `decrease_background_opacity`,
      icon: theme_icon,
      action: (args) => {
        App.cycle_background_opacity(`decrease`)
      },
      info: `Decrease the background opacity`,
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
      name: `Set Title`,
      cmd: `edit_main_title`,
      icon: title_icon,
      action: (args) => {
        App.edit_main_title()
      },
      info: `Edit the main title`,
    },
    {
      name: `Red Title`,
      cmd: `color_main_title_red`,
      icon: title_icon,
      action: (args) => {
        App.color_main_title(`red`)
      },
      info: `Apply red color to the main title`,
    },
    {
      name: `Green Title`,
      cmd: `color_main_title_green`,
      icon: title_icon,
      action: (args) => {
        App.color_main_title(`green`)
      },
      info: `Apply green color to the main title`,
    },
    {
      name: `Blue Title`,
      cmd: `color_main_title_blue`,
      icon: title_icon,
      action: (args) => {
        App.color_main_title(`blue`)
      },
      info: `Apply blue color to the main title`,
    },
    {
      name: `Uncolor Title`,
      cmd: `uncolor_main_title`,
      icon: title_icon,
      action: (args) => {
        App.uncolor_main_title()
      },
      info: `Remove colors from the main title`,
    },
    {
      name: `Toggle Date`,
      cmd: `toggle_main_title_date`,
      icon: title_icon,
      action: (args) => {
        App.toggle_main_title_date()
      },
      info: `Show or hide the date in the main title`,
    },
    {
      name: `Open URL One`,
      cmd: `open_url_one`,
      icon: browser_icon,
      action: (args) => {
        App.open_setting_url(1)
      },
      info: `Open the first URL defined in settings`,
    },
    {
      name: `Open URL Two`,
      cmd: `open_url_two`,
      icon: browser_icon,
      action: (args) => {
        App.open_setting_url(2)
      },
      info: `Open the second URL defined in settings`,
    },
    {
      name: `Open URL Three`,
      cmd: `open_url_three`,
      icon: browser_icon,
      action: (args) => {
        App.open_setting_url(3)
      },
      info: `Open the third URL defined in settings`,
    },
    {
      name: `Open Sidebar`,
      cmd: `open_sidebar`,
      icon: bot_icon,
      action: (args) => {
        App.open_sidebar()
      },
      info: `Open the browser sidebar`,
    },
    {
      name: `Close Sidebar`,
      cmd: `close_sidebar`,
      icon: bot_icon,
      action: (args) => {
        App.close_sidebar()
      },
      info: `Close the browser sidebar`,
    },
    {
      name: `Restart`,
      cmd: `restart_extension`,
      icon: bot_icon,
      action: (args) => {
        App.restart_extension()
      },
      info: `Restart the extension (For debugging)`,
    }
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