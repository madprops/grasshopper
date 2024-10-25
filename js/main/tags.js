App.tags = (item, rule = true) => {
  let tags = []

  if (rule) {
    tags.push(...App.get_rule(item, `tags`))
  }

  tags.push(...App.get_tags(item, false))
  return Array.from(new Set(tags))
}

App.edit_tab_tags = (args = {}) => {
  let def_args = {
    tags: ``,
    add: false,
  }

  App.def_args(def_args, args)
  let active = App.get_active_items({mode: args.item.mode, item: args.item})
  let s = args.tags ? `Edit tags?` : `Remove tags?`
  let tag_list = App.get_tag_list(args.tags)
  let force = App.check_force(`warn_on_edit_tabs`, active)

  App.show_confirm({
    message: `${s} (${active.length})`,
    confirm_action: () => {
      for (let it of active) {
        let tags = tag_list
        let new_tags
        let ctags = App.get_tags(it, false)

        if (ctags.length) {
          new_tags = tags.filter(x => !ctags.includes(x))

          if (args.add) {
            tags = [...ctags, ...new_tags]
          }
        }
        else {
          new_tags = tags
        }

        let rtags = App.get_rule(it, `tags`)

        if (rtags.length) {
          tags = tags.filter(x => !rtags.includes(x))
        }

        App.apply_edit({what: `tags`, item: it, value: tags, on_change: (value) => {
          App.custom_save(it.id, `tags`, value)

          if (new_tags.length) {
            App.push_to_tag_history(new_tags)
          }
        }})
      }
    },
    force,
  })
}

App.edit_tags = (item) => {
  App.edit_prompt({what: `tags`, item})
}

App.get_tag_list = (value) => {
  let cleaned = App.split_list(value)
  let unique = []

  for (let tag of cleaned) {
    if (!tag) {
      continue
    }

    if (unique.includes(tag)) {
      continue
    }

    unique.push(tag)
  }

  return unique
}

App.add_tag = (item, tag) => {
  let tags = App.get_tags(item, false).slice(0)

  if (tags.includes(tag)) {
    return
  }

  tags.push(tag)

  App.apply_edit({what: `tags`, item, value: tags, on_change: (value) => {
    App.custom_save(item.id, `tags`, value)
  }})

  App.push_to_tag_history([tag])
}

App.add_tag_all = (item, tag) => {
  let active = App.get_active_items({mode: item.mode, item})

  for (let it of active) {
    App.add_tag(it, tag)
  }
}

App.remove_tag = (item, tag) => {
  if (App.check_tag_rule(item, tag)) {
    return
  }

  let tags = App.get_tags(item, false).filter(x => x !== tag)

  App.apply_edit({what: `tags`, item, value: tags, on_change: (value) => {
    App.custom_save(item.id, `tags`, value)
  }})
}

App.remove_tag_all = (item, tag) => {
  let active = App.get_active_items({mode: item.mode, item})

  for (let it of active) {
    App.remove_tag(it, tag)
  }
}

App.wipe_tag = () => {
  let tags = App.get_all_tags(false)

  App.show_prompt({
    placeholder: `Wipe Tag`,
    suggestions: tags,
    list: tags,
    show_list: true,
    list_submit: true,
    on_submit: (tag) => {
      App.do_wipe_tag(tag)
    },
  })
}

App.do_wipe_tag = (tag) => {
  let items = App.get_tag_tabs(tag, false)

  if (!items.length) {
    return
  }

  App.show_confirm({
    message: `Wipe tag? (${tag}) (${items.length})`,
    confirm_action: () => {
      for (let item of items) {
        App.remove_tag(item, tag)
      }
    },
  })
}

App.close_tag_all = () => {
  App.show_prompt({
    placeholder: `Close Tag`,
    suggestions: App.get_all_tags(),
    list: App.get_all_tags(),
    show_list: true,
    list_submit: true,
    on_submit: (tag) => {
      let items = []

      for (let tab of App.get_items(`tabs`)) {
        let ctags = App.get_tags(tab, false)

        if (ctags) {
          if (ctags.includes(tag)) {
            items.push(tab)
            continue
          }
        }

        let rtags = App.get_rule(tab, `tags`)

        if (rtags.includes(tag)) {
          items.push(tab)
          continue
        }
      }

      if (!items.length) {
        return
      }

      App.close_tabs_method(items)
    },
  })
}

App.get_all_tags = (include_rules = true) => {
  let tags = []

  for (let tag of App.tag_history) {
    if (!tags.includes(tag)) {
      tags.push(tag)
    }
  }

  for (let item of App.get_items(`tabs`)) {
    for (let tag of App.get_tags(item, false)) {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }

    if (include_rules) {
      for (let tag of App.get_rule(item, `tags`)) {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      }
    }
  }

  return tags.slice(0, App.max_tag_picks)
}

App.add_tags = (item) => {
  App.edit_prompt({what: `tags`, item, add: true})
}

App.remove_item_tags = (item) => {
  let active = App.get_active_items({mode: item.mode, item})
  App.remove_edits({what: [`tags`], items: active, text: `tags`})
}

App.replace_tag = () => {
  let tags = App.get_all_tags(false)

  App.show_prompt({
    suggestions: tags,
    placeholder: `Original Tag`,
    list: tags,
    show_list: true,
    list_submit: true,
    on_submit: (tag_1) => {
      App.show_prompt({
        suggestions: tags,
        placeholder: `New Tag`,
        list: tags.filter(x => x !== tag_1),
        show_list: true,
        list_submit: true,
        on_submit: (tag_2) => {
          App.do_replace_tag(tag_1, tag_2)
        },
      })
    },
  })
}

App.do_replace_tag = (tag_1, tag_2) => {
  if (App.check_tag_edit(tag_1, tag_2)) {
    return
  }

  for (let item of App.get_items(`tabs`)) {
    let ctags = App.get_tags(item, false)

    if (ctags.includes(tag_1)) {
      let tags = ctags.map(x => x === tag_1 ? tag_2 : x)

      App.apply_edit({what: `tags`, item, value: tags, on_change: (value) => {
        App.custom_save(item.id, `tags`, value)
        App.push_to_tag_history([tag_2])
      }})
    }
  }
}

App.check_tag_rule = (item, tag) => {
  if (App.get_rule(item, `tags`).includes(tag)) {
    App.domain_rule_message()
    return true
  }

  return false
}

App.edit_tag = (item, tag) => {
  if (App.check_tag_rule(item, tag)) {
    return
  }

  let tags = App.get_all_tags()
  let rtags = App.get_rule(item, `tags`)
  tags = tags.filter(x => !rtags.includes(x))

  App.show_prompt({
    suggestions: tags,
    placeholder: `Edit Tag`,
    value: tag,
    list: tags,
    show_list: true,
    list_submit: true,
    on_submit: (ans) => {
      App.do_edit_tag(item, tag, ans)
    },
  })
}

App.do_edit_tag = (item, tag_1, tag_2) => {
  if (App.check_tag_edit(tag_1, tag_2)) {
    return
  }

  let rtags = App.get_rule(item, `tags`)

  if (rtags.length) {
    if (rtags.includes(tag_1)) {
      return
    }

    if (rtags.includes(tag_2)) {
      return
    }
  }

  let tags = App.get_tags(item, false).filter(x => x !== tag_1)
  tags.push(tag_2)

  App.apply_edit({what: `tags`, item, value: tags, on_change: (value) => {
    App.custom_save(item.id, `tags`, value)
    App.push_to_tag_history([tag_2])
  }})
}

App.check_tag_edit = (tag_1, tag_2) => {
  if (!tag_1 || !tag_2) {
    return true
  }

  if (tag_1 === tag_2) {
    return true
  }

  if (tag_1.includes(` `) || tag_2.includes(` `)) {
    return true
  }

  return false
}

App.push_to_tag_history = (tags) => {
  if (!tags.length) {
    return
  }

  for (let tag of tags) {
    if (!tag) {
      continue
    }

    App.tag_history = App.tag_history.filter(x => x !== tag)
    App.tag_history.unshift(tag)
    App.tag_history = App.tag_history.slice(0, App.tag_history_max)
  }

  App.stor_save_tag_history()
}

App.filter_tag_pick = (item, e) => {
  if (!App.tagged(item)) {
    return
  }

  let items = []

  for (let tag of App.tags(item)) {
    items.push({
      icon: App.get_setting(`tags_icon`),
      text: tag,
      action: () => {
        App.filter_tag({mode: item.mode, tag})
      },
    })
  }

  App.show_context({items, e})
}

App.get_tag_items = (mode, show = false) => {
  function fav_sort(a, b) {
    let ai = App.tag_history.indexOf(a)
    let bi = App.tag_history.indexOf(b)

    if (ai === -1) {
      ai = App.tag_history.length
    }

    if (bi === -1) {
      bi = App.tag_history.length
    }

    return ai - bi
  }

  let items = []
  let tags = []

  for (let tab of App.get_items(`tabs`)) {
    for (let tag of App.tags(tab)) {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }
  }

  if (tags.length) {
    tags.sort(fav_sort)
    let icon = App.get_setting(`tags_icon`)

    if (!show) {
      items.push({
        icon,
        text: `All`,
        action: () => {
          App.filter_tag({mode, tag: `all`})
        },
        middle_action: () => {
          App.filter_tag({mode, tag: `all`, from: App.refine_string})
        },
      })
    }

    for (let tag of tags.slice(0, App.max_tag_picks)) {
      items.push({
        icon,
        text: tag,
        action: (e) => {
          if (show) {
            App.show_tab_list(`tag_${tag}`, e)
          }
          else {
            App.filter_tag({mode, tag})
          }
        },
        middle_action: (e) => {
          if (show) {
            //
          }
          else {
            App.filter_tag({mode, tag, from: App.refine_string})
          }
        },
      })
    }
  }
  else {
    items.push({
      text: `No tags in use`,
      action: () => {
        App.alert(`You can add tags to tabs`)
      },
    })
  }

  return items
}

App.tagged = (item) => {
  let tags = App.get_tags(item)
  return Boolean(tags.length)
}

App.show_filter_tag_menu = (mode, e, show = false) => {
  let items = App.get_tag_items(mode, show)
  App.show_context({items, e, title: `Tags`})
}

App.get_tagged_items = (mode) => {
  let items = []

  for (let item of App.get_items(mode)) {
    if (App.get_tags(item).length) {
      items.push(item)
    }
  }

  return items
}

App.get_tag_tabs = (tag, rule = true) => {
  let tabs = []

  for (let item of App.get_items(`tabs`)) {
    let tags = App.get_tags(item, rule)

    if (tags.length) {
      if (tags.includes(tag)) {
        tabs.push(item)
      }
    }
  }

  return tabs
}

App.remove_tags = (item) => {
  App.show_confirm({
    message: `Remove tags?`,
    confirm_action: () => {
      App.edit_tab_tags({item})
    },
  })
}