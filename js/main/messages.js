App.setup_messages = () => {
	browser.runtime.onMessage.addListener(async (message) => {
		if (message.action === `mirror_settings`) {
			await App.stor_get_settings()
			App.refresh_settings()
			App.clear_show()
		}
		else if (message.action === `tab_edited`) {
			let item = App.get_item_by_id(`tabs`, message.id)
			App.check_tab_session([item])
		}
	})
}