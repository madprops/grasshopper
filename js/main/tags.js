App.edit_tab_tags = (args = {}) => {
  let def_args = {
    tags: ``,
    add: false,
  }

  App.def_args(def_args, args)
  let active = App.get_active_items({mode: args.item.mode, item: args.item})
  let s = args.tags ? `Edit tags?` : `Remove tags?`
  let tag_list = App.get_taglist(args.tags)
  let force = App.check_force(`warn_on_edit_tabs`, active)

  App.show_confirm({
    message: `${s} (${active.length})`,
    confirm_action: () => {
      for (let it of active) {
        let tags = tag_list
        let new_tags

        if (it.custom_tags.length) {
          new_tags = tags.filter(x => !it.custom_tags.includes(x))

          if (args.add) {
            tags = [...it.custom_tags, ...new_tags]
          }
        }
        else {
          new_tags = tags
        }

        if (it.rule_tags.length) {
          tags = tags.filter(x => !it.rule_tags.includes(x))
        }

        if (App.apply_edit(`tags`, it, tags)) {
          App.custom_save(it.id, `custom_tags`, tags)

          if (new_tags.length) {
            App.push_to_tag_history(new_tags)
          }
        }
      }
    },
    force: force,
  })
}

App.edit_tags = (item) => {
  App.edit_prompt({what: `tags`, item: item})
}

App.get_taglist = (value) => {
  let cleaned = App.taglist(value)
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

App.remove_tag = (item, tag) => {
  if (App.check_tag_rule(item, tag)) {
    return
  }

  let tags = item.custom_tags.filter(x => x !== tag)

  if (App.apply_edit(`tags`, item, tags)) {
    App.custom_save(item.id, `custom_tags`, tags)
  }
}

App.wipe_tag = () => {
  let tags =  App.get_all_tags(false)

  App.show_prompt({
    placeholder: `Wipe Tag`,
    suggestions: tags,
    list: tags,
    show_list: true,
    list_submit: true,
    on_submit: (tag) => {
      let items = []

      for (let tab of App.get_items(`tabs`)) {
        if (tab.custom_tags) {
          if (tab.custom_tags.includes(tag)) {
            items.push(tab)
          }
        }
      }

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
        if (tab.custom_tags) {
          if (tab.custom_tags.includes(tag)) {
            items.push(tab)
            continue
          }
        }

        if (tab.rule_tags) {
          if (tab.rule_tags.includes(tag)) {
            items.push(tab)
            continue
          }
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
    for (let tag of item.custom_tags) {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }

    if (include_rules) {
      for (let tag of item.rule_tags) {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      }
    }
  }

  return tags.slice(0, App.max_tag_picks)
}

App.add_tags = (item) => {
  App.edit_prompt({what: `tags`, item: item, add: true})
}

App.remove_item_tags = (item) => {
  let active = App.get_active_items({mode: item.mode, item: item})
  App.remove_edits({what: [`tags`], items: active})
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
    if (item.custom_tags.includes(tag_1)) {
      let tags = item.custom_tags.map(x => x === tag_1 ? tag_2 : x)

      if (App.apply_edit(`tags`, item, tags)) {
        App.custom_save(item.id, `custom_tags`, tags)
        App.push_to_tag_history([tag_2])
      }
    }
  }
}

App.check_tag_rule = (item, tag) => {
  if (item.rule_tags.includes(tag)) {
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
  let rule_tags = item.rule_tags || []
  tags = tags.filter(x => !rule_tags.includes(x))

  App.show_prompt({
    suggestions: tags,
    placeholder: `Edit Tag`,
    value: tag,
    list: tags,
    show_list: true,
    list_submit: true,
    highlight: true,
    on_submit: (ans) => {
      App.do_edit_tag(item, tag, ans)
    },
  })
}

App.do_edit_tag = (item, tag_1, tag_2) => {
  if (App.check_tag_edit(tag_1, tag_2)) {
    return
  }

  if (item.rule_tags && item.rule_tags.length) {
    if (item.rule_tags.includes(tag_1)) {
      return
    }

    if (item.rule_tags.includes(tag_2)) {
      return
    }
  }

  let tags = item.custom_tags.filter(x => x !== tag_1)
  tags.push(tag_2)

  if (App.apply_edit(`tags`, item, tags)) {
    App.custom_save(item.id, `custom_tags`, tags)
    App.push_to_tag_history([tag_2])
  }
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
      icon: App.tag_icon,
      text: tag,
      action: () => {
        App.filter_tag(item.mode, tag)
      },
    })
  }

  App.show_context({items: items, e: e})
}

App.get_tag_items = (mode) => {
  function fav_sort(a, b) {
    let ai = App.tag_history.indexOf(a)
    let bi = App.tag_history.indexOf(b)
    if (ai === -1) ai = App.tag_history.length
    if (bi === -1) bi = App.tag_history.length
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
    let icon = App.tag_icon

    items.push({
      icon: icon,
      text: `All`,
      action: () => {
        App.filter_tag(mode, `all`)
      },
    })

    for (let tag of tags.slice(0, App.max_tag_picks)) {
      items.push({
        icon: icon,
        text: tag,
        action: () => {
          App.filter_tag(mode, tag)
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
  return Boolean((item.custom_tags.length) || item.rule_tags.length)
}

App.show_filter_tag_menu = (mode, e) => {
  let items = App.get_tag_items(mode)
  App.show_context({items: items, e: e})
}

App.create_taglist = () => {
  let setting = App.get_setting(`taglist`)
  let taglist = DOM.create(`div`, `taglist hidden`)
  let left_scroll = DOM.create(`div`, `taglist_left_scroll boldover`)
  left_scroll.textContent = `<`
  left_scroll.title = `Scroll the Taglist to the left`
  let right_scroll = DOM.create(`div`, `taglist_right_scroll boldover`)
  right_scroll.textContent = `>`
  right_scroll.title = `Scroll the Taglist to the right`
  let container = DOM.create(`div`, `taglist_container`)
  taglist.append(left_scroll)
  taglist.append(container)
  taglist.append(right_scroll)

  if (setting === `left` || setting === `right`) {
    taglist.classList.add(`hover`)
    taglist.classList.add(setting)
  }
  else {
    taglist.classList.add(`normal`)
  }

  DOM.ev(taglist, `wheel`, (e) => {
    if (setting === `left` || setting === `right`) {
      if (taglist.classList.contains(`overflow`)) {
        e.stopPropagation()
        e.preventDefault()
        let direction = App.wheel_direction(e)

        if (direction === `down`) {
          App.taglist_scroll(taglist, `right`)
        }
        else if (direction === `up`) {
          App.taglist_scroll(taglist, `left`)
        }
      }
    }
  })

  return taglist
}

App.check_taglist = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  if (item.tab_box) {
    if (!App.get_setting(`tab_box_taglist`)) {
      return
    }
  }

  let setting = App.get_setting(`taglist`)

  if (setting === `none`) {
    return
  }

  let taglist = DOM.el(`.taglist`, item.element)
  let mode = App.get_setting(`taglist_mode`)

  if (!App.tagged(item)) {
    item.element.classList.remove(`tagged`)
    taglist.classList.add(`hidden`)
  }
  else {
    let container = DOM.el(`.taglist_container`, taglist)
    item.element.classList.add(`using_taglist_${setting}`)
    container.innerHTML = ``
    let tags = App.tags(item).slice(0)

    if (App.get_setting(`sort_taglist`)) {
      App.sort_alpha(tags)
    }

    let cls = ``

    if (mode !== `none`) {
      if (setting === `left` || setting === `right`) {
        cls += ` linkbutton`
      }
      else if (setting === `above` || setting === `below`) {
        cls += ` doubleline`
      }
    }

    for (let tag of tags) {
      let item = DOM.create(`div`, `taglist_item${cls}`)
      item.textContent = tag
      container.append(item)
    }

    if (App.get_setting(`taglist_add`)) {
      let sep = DOM.create(`div`)
      sep.textContent = `|`
      container.append(sep)
      let add = DOM.create(`div`, `taglist_add action`)
      add.textContent = `add`
      add.title = `Add Tag`
      container.append(add)
    }

    taglist.classList.remove(`hidden`)

    if (setting === `left` || setting === `right`) {
      if (container.scrollWidth > container.clientWidth) {
        taglist.classList.add(`overflow`)
      }
      else {
        taglist.classList.remove(`overflow`)
      }
    }
  }
}

App.taglist_filter = (item, tag) => {
  App.filter_tag(item.mode, tag)
}

App.taglist_action = (item, e) => {
  let mode = App.get_setting(`taglist_mode`)
  let tag = e.target.textContent

  if (mode === `none`) {
    return
  }
  else if (mode === `menu`) {
    App.show_taglist_menu(e, item)
  }
  else if (mode === `edit`) {
    App.edit_tag(item, tag)
  }
  else if (mode === `filter`) {
    App.taglist_filter(item, tag)
  }
  else if (mode === `remove`) {
    App.remove_tag(item, tag)
  }
}

App.show_taglist_menu = (e, item) => {
  let items = []
  let tag = e.target.textContent
  let custom = App.get_tags(item, false)
  let is_custom = custom.includes(tag)

  if (is_custom) {
    items.push({
      text: `Edit`,
      action: () => {
        App.edit_tag(item, tag)
      },
    })
  }

  items.push({
    text: `Filter`,
    action: () => {
      App.filter_tag(item.mode, tag)
    },
  })

  if (is_custom) {
    items.push({
      text: `Remove`,
      action: () => {
        App.remove_tag(item, tag)
      },
    })
  }

  App.show_context({items: items, e: e})
}

App.taglist_remove = (e, item) => {
  let tag = e.target.textContent
  App.remove_tag(item, tag)
}

App.taglist_active = () => {
  if (App.get_setting(`taglist`) === `none`) {
    return false
  }

  if (App.get_setting(`taglist_mode`) === `none`) {
    return false
  }

  return true
}

App.taglist_add_active = () => {
  if (App.get_setting(`taglist`) === `none`) {
    return false
  }

  if (!App.get_setting(`taglist_add`)) {
    return false
  }

  return true
}

App.toggle_taglist = (mode) => {
  let setting = App.get_setting(`taglist`)

  if (setting === `none`) {
    return
  }

  for (let item of App.get_items(mode)) {
    let taglist = DOM.el(`.taglist`, item.element)

    if (taglist.classList.contains(`hidden`)) {
      taglist.classList.remove(`hidden`)
    }
    else {
      taglist.classList.add(`hidden`)
    }
  }
}

App.taglist_scroll = (taglist, direction) => {
  let container = DOM.el(`.taglist_container`, taglist)
  let amount = 25

  if (direction === `left`) {
    container.scrollLeft -= amount
  }
  else if (direction === `right`) {
    container.scrollLeft += amount
  }
}