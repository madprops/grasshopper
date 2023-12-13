App.show_tab_list = (what, e) => {
  let tabs, title

  if (what === `recent`) {
    let max = App.get_setting(`max_recent_tabs`)
    let active = App.get_setting(`recent_active`)
    tabs = App.get_recent_tabs({max: max, active: active})
    title = `Recent Tabs`
  }
  else if (what === `pins`) {
    tabs = App.get_pinned_tabs()
    title = `Pinned Tabs`
  }
	else if (what === `playing`) {
		tabs = App.get_playing_tabs()
    title = `Playing Tabs`
	}
	else if (what.startsWith(`color_`)) {
		let color_id = what.split(`_`)[1]
    let color = App.get_color_by_id(color_id)

    if (!color) {
      return
    }

		tabs = App.get_color_tabs(color_id)
    title = color.name
	}
	else if (what.startsWith(`tag_`)) {
		let tag = what.split(`_`)[1]
		tabs = App.get_tag_tabs(tag)
    title = `Tag: ${tag}`
	}
	else if (what.startsWith(`icon_`)) {
		let icon = what.split(`_`)[1]
		tabs = App.get_icon_tabs(icon)
    title = `Icon: ${icon}`
	}

	let items = []
  let playing_icon = App.get_setting(`playing_icon`) || App.audio_icon

  for (let tab of tabs) {
    let title = App.title(tab)

    if (tab.audible) {
      title = `${playing_icon} ${title}`
    }

    let obj = {
      image: tab.favicon,
      text: title,
      action: async () => {
        await App.check_on_tabs()
        App.tabs_action(tab, `tab_list`)
      },
      alt_action: () => {
        // App.close_tab_or_tabs(tab.id)
      },
      context_action: (e) => {
        App.show_item_menu({item: tab, e: e})
      },
    }

    if (tab.active) {
      obj.bold = true
    }

    items.push(obj)
  }

  App.show_context({
    items: items, e: e,
    title: title,
    alt_action_remove: true,
  })
}