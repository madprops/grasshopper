App.init = async () => {
  let win = await browser.windows.getCurrent({populate: false})
  App.window_id = win.id
  App.manifest = browser.runtime.getManifest()
  App.print_intro()
  App.build_settings()
  App.stor_get_settings()
  App.stor_get_profiles()
  App.stor_get_command_history()
  App.stor_get_first_time()
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
  App.setup_dialog()
  App.setup_media()
  App.setup_window()
  App.setup_items()
  App.setup_gestures()
  App.setup_palette()
  App.setup_filter()
  App.setup_modes()
  App.apply_theme()
  await App.clear_show()
  App.make_window_visible()
  App.check_first_time()
  App.start_date = App.now()
}

App.init()