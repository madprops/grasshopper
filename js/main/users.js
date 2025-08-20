App.user_settings = (who, force = false) => {
  function action() {
    App.def_all_settings()
    App[`user_${who}_settings`]()
    App.refresh_settings()
    App.clear_show()
    App.alert_autohide(`Welcome ${who}`)
  }

  if (force) {
    action()
    return
  }

  App.show_confirm({
    message: `Apply settings?`,
    confirm_action: () => {
      action()
    },
  })
}

App.user_madprops_settings = () => {
  let cmd, sett

  App.set_setting({setting: `sound_effects`, value: false})
  App.set_setting({setting: `click_item_tabs`, value: `soft_item_action`})
  App.set_setting({setting: `show_settings_info`, value: false})
  App.set_setting({setting: `double_shift_command`, value: `filter_loaded_tabs`})

  // General

  App.set_setting({setting: `item_height`, value: `small`})
  App.set_setting({setting: `item_border`, value: `normal`})

  // Theme

  App.set_setting({setting: `text_color`, value: `rgb(255, 255, 255)`})
  App.set_setting({setting: `background_color`, value: `rgb(77, 72, 96)`})
  App.set_setting({setting: `background_image`, value: `Background 5`})
  App.set_setting({setting: `background_effect`, value: `blur`})
  App.set_setting({setting: `background_opacity`, value: 85})
  App.set_setting({setting: `font`, value: `monospace`})
  App.set_setting({setting: `font_size`, value: 16})
  App.set_setting({setting: `window_border_sides`, value: `right`})
  App.set_setting({setting: `window_border_width`, value: 3})
  App.set_setting({setting: `window_border_color`, value: `rgba(228, 228, 228, 1)`})

  // Zones

  App.set_setting({setting: `split_width`, value: 1})
  App.set_setting({setting: `bold_header_titles`, value: true})
  App.set_setting({setting: `random_zone_titles`, value: true})

  // Pinline

  App.set_setting({setting: `pinline_icons`, value: true})
  App.set_setting({setting: `rounded_pinline`, value: true})
  App.set_setting({setting: `small_pinline`, value: true})

  // Main Title

  App.set_setting({setting: `show_main_title`, value: false})
  App.set_setting({setting: `main_title`, value: `Armentos iLadel`})
  App.set_setting({setting: `main_title_background_color`, value: `rgba(93, 93, 188, 1)`})
  App.set_setting({setting: `main_title_text_color`, value: `rgba(250, 250, 250, 1)`})
  App.set_setting({setting: `main_title_date`, value: false})

  App.set_setting({setting: `main_title_left_button_menu`, value: [
    {
      "cmd": `user_madprops_settings_force`,
    },
    {
      "cmd": `toggle_sidebar`,
    },
    {
      "cmd": `restart_extension`,
    },
  ]})

  App.set_setting({setting: `main_title_right_button_menu`, value: [
    {
      "cmd": `open_url_github_replace`,
      "middle": `open_url_github`,
    },
    {
      "cmd": `open_url_youtube_replace`,
      "middle": `open_url_youtube`,
    },
    {
      "cmd": `open_url_instagram_replace`,
      "middle": `open_url_instagram`,
    },
    {
      "cmd": `open_url_hackernews_replace`,
      "middle": `open_url_hackernews`,
    },
    {
      "cmd": `open_url_slashdot_replace`,
      "middle": `open_url_slashdot`,
    },
  ]})

  // Favorites

  sett = `favorites_menu`
  App.set_setting({setting: sett, value: []})

  cmd = {cmd: `edit_global_notes`, middle: `show_title_history`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `select_normal_tabs`, middle: `deselect_all_items`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `show_settings`, middle: `show_last_settings`, shift: `show_all_settings`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `send_signal_sig_play`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `send_signal_sig_next`, middle: `send_signal_sig_prev`, shift: `send_signal_sig_seek`, ctrl: `send_signal_sig_rewind`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `send_signal_sig_volup`, middle: `send_signal_sig_voldown`, shift: `send_signal_sig_volmax`, ctrl: `send_signal_sig_volmin`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `show_signals`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `obfuscate_tabs`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `toggle_auto_blur`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `locust_swarm`, middle: `breathe_effect`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `set_random_dark_colors`, middle: `set_random_light_colors`, shift: `set_next_theme`, ctrl: `set_previous_theme`, alt: `settings_category_theme`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `bookmark_items`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `reopen_tab`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `jump_tabs_zone_up`, middle: `jump_tabs_zone_down`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `run_custom_command_zone_bc`}
  App.append_list_setting(sett, cmd)

  cmd = {cmd: `lock_screen`}
  App.append_list_setting(sett, cmd)

  // Custom Commands

  sett = `custom_commands`

  cmd = {name: `Zone: bc`, icon: `🛤️`, action: `go_to_zone`, argument: `bc`, _id_: `zone_bc`}
  App.append_list_setting(sett, cmd)

  // Combos

  sett = `command_combos`

  cmd = {name: `On Lock`, icon: `🔒`, cmd_1: `open_new_tab_bottom`, _id_: `on_lock`}
  App.append_list_setting(sett, cmd)

  cmd = {name: `On Unlock`, icon: `🔒`, cmd_1: `recent_tabs_backwards`, cmd_2: `close_last_tab`, _id_: `on_unlock`}
  App.append_list_setting(sett, cmd)

  // Lock Screen

  App.set_setting({setting: `lock_screen_command`, value: `run_command_combo_on_lock`})
  App.set_setting({setting: `unlock_screen_command`, value: `run_command_combo_on_unlock`})
  App.set_setting({setting: `lock_screen_words`, value: 2})

  // Signals

  sett = `signals`
  let minute = 60

  cmd = {name: `Words`, url: `http://127.0.0.1:5000/words`, method: `off`, icon: `🥁`, interval: minute * 30, update_title: true, startup: true, arguments: `{"num": 2}`, _id_: `sig_words`}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Now Playing`, url: `http://127.0.0.1:5000/music-np`, method: `GET`, icon: `🥁`, update_title: true, _id_: `sig_np`}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Music Play`, url: `http://127.0.0.1:5000/music-play`, method: `POST`, icon: `🎸`, _id_: `sig_play`}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Music Next`, url: `http://127.0.0.1:5000/music-next`, method: `POST`, icon: `⏭️`, _id_: `sig_next`, update_title: true}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Music Prev`, url: `http://127.0.0.1:5000/music-prev`, method: `POST`, icon: `⏮️`, _id_: `sig_prev`, update_title: true}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Volume Up`, url: `http://127.0.0.1:5000/volume-up`, method: `POST`, icon: `🔊`, _id_: `sig_volup`}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Volume Down`, url: `http://127.0.0.1:5000/volume-down`, method: `POST`, icon: `🔉`, _id_: `sig_voldown`}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Max Volume`, url: `http://127.0.0.1:5000/volume-max`, method: `POST`, icon: `🔊`, confirm: true, _id_: `sig_volmax`}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Min Volume`, url: `http://127.0.0.1:5000/volume-min`, method: `POST`, icon: `🔉`, _id_: `sig_volmin`}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Seek`, url: `http://127.0.0.1:5000/music-seek-forwards`, method: `POST`, icon: `⏩`, _id_: `sig_seek`}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Rewind`, url: `http://127.0.0.1:5000/music-seek-backwards`, method: `POST`, icon: `⏪`, _id_: `sig_rewind`}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Save Tabs`, url: `http://127.0.0.1:5000/post-backup-tabs`, method: `POST`, icon: `📚`, feedback: true, send_tabs: true, confirm: true, _id_: `sig_post_backup_tabs`}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Load Tabs`, url: `http://127.0.0.1:5000/get-backup-tabs`, method: `GET`, icon: `📚`, import_tabs: true, _id_: `sig_get_backup_tabs`}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Save Settings`, url: `http://127.0.0.1:5000/post-backup-settings`, method: `POST`, icon: `⚡`, feedback: true, send_settings: true, confirm: true, _id_: `sig_post_backup_settings`}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Load Settings`, url: `http://127.0.0.1:5000/get-backup-settings`, method: `GET`, icon: `⚡`, import_settings: true, _id_: `sig_get_backup_settings`}
  App.append_list_setting(sett, cmd)

  cmd = {name: `Active Test`, url: `http://127.0.0.1:5000/active-test`, method: `POST`, icon: `🐵`, send_active: true, feedback: true, _id_: `sig_active_test`}
  App.append_list_setting(sett, cmd)

  // Custom URLs

  sett = `custom_urls`

  App.set_setting({setting: sett, value: []})

  cmd = {name: `Mikaeli`, url: `https://www.youtube.com/watch?v=spdfnqS3bDg`}
  App.append_list_setting(sett, cmd)

  // Browser Commands

  App.set_setting({setting: `browser_command_1`, value: `set_random_dark_colors`})
  App.set_setting({setting: `browser_command_2`, value: `restart_extension`})
  App.set_setting({setting: `popup_command_1`, value: `edit_notes`})

  // Bookmark Rules

  sett = `bookmark_rules`

  cmd = {value: `news.ycombinator.com`, folder: `tech`, mode: `starts_with_url`}
  App.append_list_setting(sett, cmd)

  cmd = {value: `github.com`, folder: `code`, mode: `starts_with_url`}
  App.append_list_setting(sett, cmd)

  // Tab Box

  App.set_setting({setting: `show_tab_box`, value: true})
  App.set_setting({setting: `tab_box_mode`, value: `special`})
  App.set_setting({setting: `tab_box_size`, value: `normal`})
  App.set_setting({setting: `tab_box_color_enabled`, value: true})
  App.set_setting({setting: `tab_box_color`, value: `rgba(47, 99, 151, 0.18)`})
  App.set_setting({setting: `tab_box_item_height`, value: `normal`})
  App.set_setting({setting: `tab_box_title`, value: false})
  App.set_setting({setting: `tab_box_border_width`, value: 3})

  // Footer

  App.set_setting({setting: `footer_colors`, value: true})
  App.set_setting({setting: `footer_background_color`, value: `rgba(92, 152, 182, 0.65)`})

  // Idle Tabs

  App.set_setting({setting: `show_idle_icon`, value: `always`})
}

App.user_auver_settings = () => {
  App.user_madprops_settings()

  App.set_setting({setting: `text_color`, value: `rgb(222, 255, 219)`})
  App.set_setting({setting: `background_color`, value: `rgb(94, 94, 106)`})
  App.set_setting({setting: `background_image`, value: `Background 5`})
  App.set_setting({setting: `background_effect`, value: `rotate_2_blur`})
  App.set_setting({setting: `background_opacity`, value: 90})
  App.set_setting({setting: `font`, value: `Antic Slab`})
  App.set_setting({setting: `font_size`, value: 18})
  App.set_setting({setting: `window_border_sides`, value: `full`})
  App.set_setting({setting: `window_border_width`, value: 6})
  App.set_setting({setting: `window_border_color`, value: `rgba(129, 194, 182, 1)`})
  App.set_setting({setting: `window_border_glow`, value: `rgba(254, 212, 149, 1)`})
  App.set_setting({setting: `window_border_glow_speed`, value: 4})
  App.set_setting({setting: `enable_window_border_glow`, value: true})
  App.set_setting({setting: `tab_box_item_height`, value: `small`})
  App.set_setting({setting: `tab_box_border_width`, value: 5})
  App.set_setting({setting: `tab_box_color_enabled`, value: true})
  App.set_setting({setting: `tab_box_color`, value: `rgba(81, 125, 138, 0.537)`})
}

App.user_pauver_settings = () => {
  App.user_madprops_settings()

  App.set_setting({setting: `text_color`, value: `rgb(223, 233, 255)`})
  App.set_setting({setting: `background_color`, value: `rgb(65, 65, 75)`})
  App.set_setting({setting: `background_image`, value: `Background 5`})
  App.set_setting({setting: `background_effect`, value: `rotate_2_blur`})
  App.set_setting({setting: `background_opacity`, value: 70})
  App.set_setting({setting: `font`, value: `Bitcount`})
  App.set_setting({setting: `font_size`, value: 18})
  App.set_setting({setting: `background_zoom`, value: 2})
  App.set_setting({setting: `window_border_sides`, value: `right`})
  App.set_setting({setting: `window_border_width`, value: 3})
  App.set_setting({setting: `window_border_color`, value: `rgba(96, 111, 149, 1)`})
  App.set_setting({setting: `window_border_glow_speed`, value: 4})
  App.set_setting({setting: `tab_box_item_height`, value: `small`})
  App.set_setting({setting: `tab_box_border_width`, value: 5})
  App.set_setting({setting: `tab_box_color_enabled`, value: true})
  App.set_setting({setting: `tab_box_color`, value: `rgba(65, 65, 151, 0.16)`})
  App.set_setting({setting: `tab_box_glass`, value: true})
}