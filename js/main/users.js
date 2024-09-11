App.user_settings = (who) => {
  App.show_confirm({
    message: `Apply settings?`,
    confirm_action: () => {
      App[`user_${who}_settings`]()
      App.alert_autohide(`Welcome ${who}`)
    },
  })
}

App.user_madprops_settings = () => {
  App.set_theme(3)

  App.set_setting({setting: `load_lock`, value: true})
  App.set_setting({setting: `autohide_context`, value: true})
  App.set_setting({setting: `max_recent_tabs`, value: 20})

  App.set_setting({setting: `double_click_favorites_top`, value: `toggle_taglist`})
  App.set_setting({setting: `middle_click_favorites_top`, value: `toggle_pin_tabs`})

  App.set_setting({setting: `wheel_up_favorites_top`, value: `jump_tabs_pin_up`})
  App.set_setting({setting: `wheel_down_favorites_top`, value: `jump_tabs_pin_down`})

  App.set_setting({setting: `wheel_up_favorites_center`, value: `jump_tabs_all_up`})
  App.set_setting({setting: `wheel_down_favorites_center`, value: `jump_tabs_all_down`})

  App.set_setting({setting: `wheel_up_favorites_bottom`, value: `jump_tabs_normal_up`})
  App.set_setting({setting: `wheel_down_favorites_bottom`, value: `jump_tabs_normal_down`})

  App.set_setting({setting: `wheel_up_footer`, value: `jump_tabs_header_up`})
  App.set_setting({setting: `wheel_down_footer`, value: `jump_tabs_header_down`})
  App.set_setting({setting: `extra_menu_mode`, value: `flat`})

  App.set_setting({setting: `wheel_up_shift_items`, value: `recent_tabs_forwards`})
  App.set_setting({setting: `wheel_down_shift_items`, value: `recent_tabs_backwards`})

  App.set_setting({setting: `wheel_up_shift_favorites_top`, value: `recent_tabs_forwards`})
  App.set_setting({setting: `wheel_down_shift_favorites_top`, value: `recent_tabs_backwards`})

  let cmd = {cmd: `locust_swarm`, alt: `jump_tabs_tag_1_down`}
  App.prepend_list_setting(`favorites_menu`, cmd)

  let urls = [
    {
      name: `Mikaeli`,
      url: `https://www.youtube.com/watch?v=spdfnqS3bDg`,
    },
    {
      name: `Raven Forest`,
      url: `https://www.youtube.com/watch?v=2iCHRQJnZRM`,
    },
    {
      name: `Dead Bent`,
      url: `https://www.youtube.com/watch?v=VdCodNxbc40`,
    },
    {
      name: `Funny Bird`,
      url: `https://www.youtube.com/watch?v=SFWHQmgmW8E`,
    },
    {
      name: `Purr`,
      url: `https://www.youtube.com/watch?v=1FRQfLFzi1U`,
    },
    {
      name: `Dark Chambers`,
      url: `https://www.youtube.com/watch?v=WYjIjut8SA0`,
    },
    {
      name: `Fresh`,
      url: `https://www.youtube.com/watch?v=lkIIOaxyR0k`,
    },
  ]

  App.set_setting({ setting: `custom_urls`, value: urls })
  App.refresh_settings()
  App.clear_show()
}