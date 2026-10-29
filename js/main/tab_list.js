App.show_tab_list = async (args = {}) => {
  let tabs, title, title_icon

  if (args.what === `recent`) {
    let max = App.get_setting(`max_recent_tabs`)
    let active = App.get_setting(`recent_active`)
    tabs = App.get_recent_tabs({max, active})
    title = `Recent`
    title_icon = App.get_setting(`tabs_mode_icon`)
  }
  else if (args.what === `pins`) {
    tabs = App.get_pinned_tabs()
    title = `Pinned`
    title_icon = App.get_setting(`pin_icon`)
  }
  else if (args.what === `playing`) {
    tabs = App.get_playing_tabs()
    title = `Playing`
    title_icon = App.get_setting(`playing_icon`)
  }
  else if (args.what === `unread`) {
    tabs = App.get_unread_tabs()
    title = `Unread`
    title_icon = App.get_setting(`unread_icon`)
  }
  else if (args.what === `nodes`) {
    tabs = App.get_tab_nodes(args.item)
    title = `Nodes`
    title_icon = App.get_setting(`node_icon`)
  }
  else if (args.what === `parent`) {
    tabs = [App.get_parent_item(args.item)]
    title = `Parent`
    title_icon = App.get_setting(`parent_icon`)
  }
  else if (args.what === `siblings`) {
    tabs = App.get_tab_siblings(args.item)
    title = `Siblings`
    title_icon = App.get_setting(`node_icon`)
  }
  else if (args.what === `domain`) {
    tabs = App.get_domain_tabs(args.item)
    title = `Domain`
    title_icon = App.settings_icons.filter
  }
  else if (args.what === `title`) {
    tabs = App.get_title_tabs(args.item)
    title = `Title`
    title_icon = App.settings_icons.filter
  }
  else if (args.what === `container`) {
    if (args.value) {
      if (args.value === `allthecontainers`) {
        tabs = App.get_container_tabs()
        title = `Containers`
        title_icon = App.container_icon
      }
      else {
        tabs = App.get_container_tabs(args.value)
        title = args.value
        title_icon = App.color_icon_square(App.container_data[args.value].color)
      }
    }
    else {
      tabs = App.get_container_tabs(args.item.container_name)
      title = args.item.container_name
      title_icon = App.color_icon_square(args.item.container_color)
    }
  }
  else if (args.what === `group`) {
    if (args.value) {
      if (args.value === `allthegroups`) {
        tabs = App.get_group_tabs()
        title = `Groups`
        title_icon = App.group_icon
      }
      else if (args.value === `nogrouphere`) {
        tabs = []
        title = `Groups`
        title_icon = App.group_icon
      }
      else {
        tabs = App.get_group_tabs(parseInt(args.value))
        let group = await App.get_group_by_id(args.value)
        title = group?.title || `Group`
        title_icon = App.group_icon
      }
    }
  }
  else if (args.what === `color`) {
    if (args.value) {
      if (args.value === `allthecolors`) {
        tabs = App.get_color_tabs()
        title = `Colors`
        title_icon = App.color_picker_icon
      }
      else {
        let color = App.get_color_by_id(args.value)

        if (!color) {
          return
        }

        tabs = App.get_color_tabs(args.value)
        title = color.name
        title_icon = App.color_icon(args.value)
      }
    }
  }
  else if (args.what === `colors`) {
    tabs = App.get_color_tabs()
    title = `Colors`
    title_icon = App.settings_icons.colors
  }
  else if (args.what === `tag`) {
    if (args.value) {
      if (args.value === `allthetags`) {
        tabs = App.get_tag_tabs()
        title = `Tags`
        title_icon = App.get_setting(`tags_icon`)
      }
      else {
        tabs = App.get_tag_tabs(args.value)
        title = args.value
        title_icon = App.get_setting(`tags_icon`)
      }
    }
  }
  else if (args.what === `icon`) {
    if (args.value) {
      if (args.value === `alltheicons`) {
        tabs = App.get_icon_tabs()
        title = `Icons`
        title_icon = App.bot_icon
      }
      else {
        tabs = App.get_icon_tabs(args.value)
        title = `Icon`
        title_icon = args.value
      }
    }
  }
  else if (args.what === `title`) {
    if (args.value) {
      tabs = App.get_tabs_by_title(args.value)
      title = `Custom`
      title_icon = App.get_setting(`tabs_mode_icon`)
    }
  }
  else if (args.what === `clusters`) {
    tabs = App.get_tab_clusters()
    title = `Clusters`
    title_icon = App.cluster_icon
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
    items,
    title,
    title_icon,
    e: args.e,
    middle_action_remove: true,
    title_number: true,
  })
}

App.tab_list_by_title = (title, e) => {
  App.show_tab_list({what: `title`, value: title, e})
}