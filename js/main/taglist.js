App.create_taglist = () => {
  let position = App.get_setting(`taglist_position`)
  let taglist = DOM.create(`div`, `taglist`)
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

  if (position === `left` || position === `right`) {
    taglist.classList.add(`hover`)
    taglist.classList.add(position)
  }
  else {
    taglist.classList.add(`normal`)
  }

  DOM.ev(taglist, `wheel`, (e) => {
    if (position === `left` || position === `right`) {
      if (DOM.class(taglist, [`overflow`])) {
        e.stopPropagation()
        e.preventDefault()
        let direction = App.wheel_direction(e)

        if (direction === `up`) {
          App.taglist_scroll(taglist, `left`)
        }
        else if (direction === `down`) {
          App.taglist_scroll(taglist, `right`)
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

  let position = App.get_setting(`taglist_position`)

  if (position === `none`) {
    return
  }

  let taglist = DOM.el(`.taglist`, item.element)
  let mode = App.get_setting(`taglist_mode`)

  if (!App.tagged(item)) {
    item.element.classList.remove(`tagged`)
    DOM.hide(taglist)
  }
  else {
    let container = DOM.el(`.taglist_container`, taglist)
    item.element.classList.add(`using_taglist_${position}`)
    container.innerHTML = ``
    let tags = App.tags(item).slice(0)

    if (App.get_setting(`sort_taglist`)) {
      App.sort_alpha(tags)
    }

    let cls = ``

    if (mode !== `none`) {
      if (position === `left` || position === `right`) {
        cls += ` linkbutton`
      }
      else if (position === `above` || position === `below`) {
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

    DOM.show(taglist)

    if (position === `left` || position === `right`) {
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
  App.filter_tag({mode: item.mode, tag})
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
  let tags_icon = App.get_setting(`tags_icon`)

  items.push({
    text: `Show`,
    icon: tags_icon,
    action: () => {
      App.show_tab_list(`tag_${tag}`, e)
    },
  })

  items.push({
    text: `Filter`,
    icon: tags_icon,
    action: () => {
      App.filter_tag({mode: item.mode, tag})
    },
  })

  App.sep(items)

  if (is_custom) {
    items.push({
      text: `Edit`,
      icon: tags_icon,
      action: () => {
        App.edit_tag(item, tag)
      },
    })
  }

  if (is_custom) {
    items.push({
      text: `Remove`,
      icon: tags_icon,
      action: () => {
        App.remove_tag(item, tag)
      },
    })
  }

  App.show_context({items, e})
}

App.taglist_remove = (e, item) => {
  let tag = e.target.textContent
  App.remove_tag(item, tag)
}

App.taglist_enabled = () => {
  if (!App.get_setting(`show_taglist`)) {
    return false
  }

  return true
}

App.taglist_add_enabled = () => {
  if (!App.taglist_enabled()) {
    return false
  }

  if (!App.get_setting(`taglist_add`)) {
    return false
  }

  return true
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

App.set_show_taglist = (what) => {
  App.set_setting({setting: `show_taglist`, value: what})
  App.check_refresh_settings()
}

App.init_taglist = () => {
  if (App.get_setting(`show_taglist`)) {
    App.show_taglist()
  }
  else {
    App.hide_taglist()
  }
}

App.show_taglist = (set = false) => {
  App.main_add(`show_taglist`)

  if (set) {
    App.set_show_taglist(true)
  }
}

App.hide_taglist = (set = false) => {
  App.main_remove(`show_taglist`)

  if (set) {
    App.set_show_taglist(false)
  }
}

App.toggle_taglist = () => {
  if (App.get_setting(`show_taglist`)) {
    App.hide_taglist(true)
  }
  else {
    App.show_taglist(true)
  }
}