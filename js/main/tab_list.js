App.show_tab_list = (what, e, item) => {
  let tabs, title, title_icon
    let tabs_icon = App.get_setting_icon(`tabs_mode`)

  if (what === `recent`) {
    let max = App.get_setting(`max_recent_tabs`)
    let active = App.get_setting(`recent_active`)
    tabs = App.get_recent_tabs({max, active})
    title = `Recent`
    title_icon = App.get_setting(`tabs_mode_icon`)
  }
  else if (what === `pins`) {
    tabs = App.get_pinned_tabs()
    title = `Pinned`
    title_icon = App.get_setting(`pin_icon`)
  }
  else if (what === `playing`) {
    tabs = App.get_playing_tabs()
    title = `Playing`
    title_icon = App.get_setting(`playing_icon`)
  }
  else if (what === `nodes`) {
    tabs = App.get_tab_nodes(item)
    title = `Nodes`
    title_icon = App.get_setting(`node_icon`)
  }
  else if (what === `parent`) {
    tabs = [App.get_parent_item(item)]
    title = `Parent`
    title_icon = App.get_setting(`parent_icon`)
  }
  else if (what === `siblings`) {
    tabs = App.get_tab_siblings(item)
    title = `Siblings`
    title_icon = App.get_setting(`node_icon`)
  }
  else if (what === `domain`) {
    tabs = App.get_domain_tabs(item)
    title = `Domain`
    title_icon = App.settings_icons.filter
  }
  else if (what === `title`) {
    tabs = App.get_title_tabs(item)
    title = `Title`
    title_icon = App.settings_icons.filter
  }
  else if (what === `container`) {
    tabs = App.get_container_tabs(item.container_name)
    title = item.container_name
    title_icon = App.color_icon_square(item.container_color)
  }
  else if (what.startsWith(`container_`)) {
    let name = what.split(`_`)[1]
    tabs = App.get_container_tabs(name)
    title = name
    title_icon = App.color_icon_square(App.container_data[name].color)
  }
  else if (what.startsWith(`color_`)) {
    let color_id = what.split(`_`)[1]
    let color = App.get_color_by_id(color_id)

    if (!color) {
      return
    }

    tabs = App.get_color_tabs(color_id)
    title = color.name
    title_icon = App.color_icon(color_id)
  }
  else if (what.startsWith(`tag_`)) {
    let tag = what.split(`_`)[1]
    tabs = App.get_tag_tabs(tag)
    title = tag
    title_icon = App.get_setting(`tags_icon`)
  }
  else if (what.startsWith(`icon_`)) {
    let icon = what.split(`_`)[1]
    tabs = App.get_icon_tabs(icon)
    title = `Icon`
    title_icon = icon
  }
  else if (what === `clusters`) {
    tabs = App.get_tab_clusters()
    title = `Clusters`
    title_icon = tabs_icon
  }

  let items = []
  let playing_icon = App.get_setting(`playing_icon`)
  let muted_icon = App.get_setting(`muted_icon`)

  for (let tab of tabs) {
    let title = App.title(tab)
    let icon

    if (tab.muted) {
      icon = muted_icon
    }
    else if (tab.playing) {
      icon = playing_icon
    }

    let favicon = tab.favicon

    if (!favicon) {
      favicon = `img/favicon.jpg`
    }

    let obj = {
      image: favicon,
      icon,
      text: title,
      info: tab.url,
      action: async () => {
        await App.check_on_tabs()
        App.tabs_action({item: tab, from: `tab_list`})
      },
      middle_action: () => {
        App.close_tab_or_tabs(tab.id)
      },
      context_action: (e) => {
        App.show_item_menu({item: tab, e})
      },
      icon_action: async (e, icon) => {
        if (tab.muted) {
          await App.unmute_tab(tab.id)

          if (!tab.playing) {
            icon.innerHTML = ``
          }
          else {
            icon.innerHTML = playing_icon
          }
        }
        else if (tab.playing) {
          await App.mute_tab(tab.id)
          icon.innerHTML = muted_icon
        }
      },
    }

    if (tab.active) {
      obj.bold = true
    }

    items.push(obj)
  }

  App.show_context({
    items, e,
    title,
    title_icon,
    middle_action_remove: true,
    title_number: true,
  })
}