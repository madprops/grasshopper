App.setup_messages = () => {
  browser.runtime.onMessage.addListener(async (message) => {
    if (message.action === `mirror_settings`) {
      if (App.get_setting(`mirror_settings`)) {
        await App.stor_get_settings()
        App.refresh_settings()
        App.clear_show()
      }
    }
    else if (message.action === `mirror_edits`) {
      if (App.get_setting(`mirror_edits`)) {
        let item = App.get_item_by_id(`tabs`, message.id)
        App.check_tab_session([item], true)
      }
    }
  })
}