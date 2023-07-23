App.init = async () => {
  let win = await browser.windows.getCurrent({populate: false})
  App.window_id = win.id
  App.build_default_settings()
  App.stor_get_settings()
  App.stor_get_titles()
  App.stor_get_command_history()
  App.setup_commands()
  App.setup_filter()
  App.setup_theme()
  App.setup_tabs()
  App.setup_title_editor()
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
  App.show_first_window()
  App.make_window_visible()
}

App.init()