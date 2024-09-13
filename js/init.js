App.init = async () => {
  let win = await browser.windows.getCurrent({populate: false})
  App.window_id = win.id
  App.manifest = browser.runtime.getManifest()
  App.header_url = browser.extension.getURL("header/index.html")
  App.extension_id = browser.runtime.id
  App.print_intro()
  App.build_settings()
  await App.stor_compat_check()
  await App.stor_get_settings()
  await App.stor_get_command_history()
  await App.stor_get_tag_history()
  await App.stor_get_title_history()
  await App.stor_get_icon_history()
  await App.stor_get_first_time()
  await App.stor_get_notes()
  await App.check_init_mode()
  App.setup_commands()
  App.setup_tabs()
  App.setup_closed()
  App.setup_settings()
  App.setup_tab_box()
  App.setup_active_trace()
  App.setup_keyboard()
  App.setup_window()
  App.setup_gestures()
  App.setup_filter()
  App.setup_modes()
  App.setup_scroll()
  App.setup_items()
  App.setup_theme()
  App.setup_favorites()
  App.setup_playing()
  App.setup_messages()
  App.setup_mouse()
  App.do_apply_theme()
  App.setup_pinline()
  App.setup_footer()
  App.setup_recent_tabs()
  App.setup_context()
  await App.clear_show()
  App.make_window_visible()
  App.check_first_time()
  App.start_clock()
  App.start_main_title_date()
  App.start_date = App.now()
}

App.init()