App.init = async () => {
  let win = await browser.windows.getCurrent({populate: false})
  App.window_id = win.id
  App.manifest = browser.runtime.getManifest()
  App.print_intro()
  App.build_default_settings()
  App.stor_get_settings()
  App.stor_get_profiles()
  App.stor_get_command_history()
  App.setup_commands()
  App.setup_theme()
  App.setup_tabs()
  App.setup_profile_editor()
  App.setup_bookmarks()
  App.setup_history()
  App.setup_closed()
  App.setup_settings()
  App.setup_about()
  App.setup_keyboard()
  App.setup_popups()
  App.setup_media()
  App.setup_window()
  App.setup_items()
  App.setup_gestures()
  App.setup_palette()
  App.setup_modes()
  App.apply_theme()
  App.clear_all_items()

  // Tabs are always available
  await App.show_mode(`tabs`)

  // Show first mode
  // unless it's tabs
  App.show_first_mode(false)

  // And finally
  App.make_window_visible()
}

App.init()