App.proc_item_icon = (args = {}) => {
  let side_ok = args.side === App.get_setting(`${args.what}_side`)

  if (!App.icon_enabled(args.what) || !side_ok) {
    return
  }

  let cls = `${args.what} item_node hidden grower item_icon_unit ${args.cls}`
  let icon = DOM.create(`div`, cls)

  if ([
    `color_icon`,
    `custom_icon`,
    `container_icon`,
  ].includes(args.what)) {
    // Don't add content
  }
  else {
    icon.textContent = App.get_setting(args.what)
  }

  if (App.get_setting(`show_tooltips`)) {
    icon.title = args.title
  }

  icon.dataset.has_tooltips = false
  icon.dataset.icon = args.name
  args.item.element.append(icon)
}

App.add_item_icon = (item, side, name) => {
  let what = `${name}_icon`
  let obj = {item, side, what, name}

  if (name === `active`) {
    let title = `Active`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `pin`) {
    let title = `Pinned`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `normal`) {
    let title = `Normal`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `loaded`) {
    let title = `Loaded`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `unloaded`) {
    let title = `Unloaded`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `playing`) {
    let title = `Playing`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `muted`) {
    let title = `Muted`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `unread`) {
    let title = `Unread`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `loading`) {
    let title = `Loading`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `root`) {
    let title = `Go to the root URL`
    title += `\nMiddle Click: Remove Root`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `parent`) {
    let title = `Parent`
    title += `\nMiddle Click: Close Nodes`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `node`) {
    let title = `Node`
    title += `\nMiddle Click: Filter Siblings`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `image`) {
    let title = `Image`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `video`) {
    let title = `Video`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `audio`) {
    let title = `Audio`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `title`) {
    let title = `Titled`
    title += `\nMiddle Click: Remove Tags`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `tags`) {
    let title = `Tagged`
    title += `\nMiddle Click: Remove Tags`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `edited`) {
    let title = `Edited`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `notes`) {
    let title = `Notes`
    title += `\nMiddle Click: Remove Notes`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `color`) {
    let cls = `color_icon_container`
    let title = ``
    title += `\nMiddle Click: Remove Color`
    obj = {...obj, title, cls}
    App.proc_item_icon(obj)
  }
  else if (name === `custom`) {
    let title = `Custom Icon`
    title += `\nMiddle Click: Remove Icon`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
  else if (name === `container`) {
    let cls = `container_icon_container`
    let title = `Container`
    obj = {...obj, title}
    App.proc_item_icon(obj)
  }
}

App.add_icons = (item, side) => {
  let icons = App.get_setting(`item_icon_order`)

  for (let icon of icons) {
    App.add_item_icon(item, side, icon.icon)
  }
}

App.check_icons = (item) => {
  if (item.tab_box) {
    if (!App.get_setting(`tab_box_icons`)) {
      return
    }
  }

  if (App.icon_enabled(`notes`)) {
    let icon = DOM.el(`.notes_icon`, item.element)

    if (App.get_notes(item)) {
      DOM.show(icon)
    }
    else {
      DOM.hide(icon)
    }
  }

  if (App.icon_enabled(`title`)) {
    if (!item.header) {
      let icon = DOM.el(`.title_icon`, item.element)

      if (App.get_title(item)) {
        DOM.show(icon)
      }
      else {
        DOM.hide(icon)
      }
    }
  }

  if (App.icon_enabled(`tags`)) {
    let icon = DOM.el(`.tags_icon`, item.element)

    if (App.tagged(item)) {
      DOM.show(icon)
    }
    else {
      DOM.hide(icon)
    }
  }

  if (App.icon_enabled(`edited`)) {
    let icon = DOM.el(`.edited_icon`, item.element)

    if (App.edited(item)) {
      DOM.show(icon)
    }
    else {
      DOM.hide(icon)
    }
  }

  let custom_icon = App.get_icon(item)
  let custom_icon_el = DOM.el(`.custom_icon`, item.element)

  if (custom_icon) {
    custom_icon_el.innerHTML = custom_icon
    custom_icon_el.dataset.content = custom_icon
    DOM.show(custom_icon_el)
  }
  else {
    DOM.hide(custom_icon_el)
  }

  function check_media(media) {
    if (App.icon_enabled(media)) {
      let type = App.get_media_type(item)
      let icon = DOM.el(`.${media}_icon`, item.element)

      if (type === media) {
        DOM.show(icon)
      }
      else {
        DOM.hide(icon)
      }
    }
  }

  check_media(`image`)
  check_media(`video`)
  check_media(`audio`)

  if (item.mode !== `tabs`) {
    return
  }

  if (App.icon_enabled(`active`)) {
    let icon = DOM.el(`.active_icon`, item.element)

    if (item.active) {
      DOM.show(icon)
    }
    else {
      DOM.hide(icon)
    }
  }

  if (App.icon_enabled(`pin`)) {
    let icon = DOM.el(`.pin_icon`, item.element)

    if (item.pinned) {
      DOM.show(icon)
    }
    else {
      DOM.hide(icon)
    }
  }

  if (App.icon_enabled(`normal`)) {
    let icon = DOM.el(`.normal_icon`, item.element)

    if (!item.pinned) {
      DOM.show(icon)
    }
    else {
      DOM.hide(icon)
    }
  }

  if (App.icon_enabled(`loaded`)) {
    let icon = DOM.el(`.loaded_icon`, item.element)

    if (!item.unloaded) {
      DOM.show(icon)
    }
    else {
      DOM.hide(icon)
    }
  }

  if (App.icon_enabled(`unloaded`)) {
    let icon = DOM.el(`.unloaded_icon`, item.element)

    if (item.unloaded) {
      DOM.show(icon)
    }
    else {
      DOM.hide(icon)
    }
  }

  if (App.icon_enabled(`playing`)) {
    let icon = DOM.el(`.playing_icon`, item.element)

    if (item.playing && !item.muted) {
      DOM.show(icon)
    }
    else {
      DOM.hide(icon)
    }
  }

  if (App.icon_enabled(`muted`)) {
    let icon = DOM.el(`.muted_icon`, item.element)

    if (item.muted) {
      DOM.show(icon)
    }
    else {
      DOM.hide(icon)
    }
  }

  if (App.icon_enabled(`unread`)) {
    let icon = DOM.el(`.unread_icon`, item.element)

    if (item.unread) {
      DOM.show(icon)
    }
    else {
      DOM.hide(icon)
    }
  }

  if (App.icon_enabled(`root`)) {
    let icon = DOM.el(`.root_icon`, item.element)
    let auto = App.get_setting(`auto_root_icon`)
    let show = auto ? App.root_possible(item) : App.item_has_root(item)

    if (show) {
      DOM.show(icon)
    }
    else {
      DOM.hide(icon)
    }
  }

  if (App.icon_enabled(`parent`)) {
    let icon = DOM.el(`.parent_icon`, item.element)

    if (App.tab_has_nodes(item)) {
      DOM.show(icon)
    }
    else {
      DOM.hide(icon)
    }
  }

  if (App.icon_enabled(`node`)) {
    let icon = DOM.el(`.node_icon`, item.element)

    if (App.tab_has_parent(item)) {
      DOM.show(icon)
    }
    else {
      DOM.hide(icon)
    }
  }

  let container_el = DOM.el(`.container_icon`, item.element)

  if (item.container_name) {
    let c_icon = App.color_icon_2(item.container_color)
    container_el.innerHTML = ``
    container_el.append(c_icon)
    container_el.title = item.container_name
    DOM.show(container_el)
  }
  else {
    DOM.hide(container_el)
  }
}

App.check_item_icon = (item) => {
  if (App.get_setting(`item_icon`) !== `none`) {
    let ans = App.make_item_icon(item)

    if (!ans.add) {
      return
    }

    let container = DOM.el(`.item_icon_container`, item.element)

    if (ans.icon) {
      container.innerHTML = ``
      container.append(ans.icon)
      DOM.show(container)
    }
    else {
      DOM.hide(container)
    }
  }
}

App.make_item_icon = (item, normal = true) => {
  let icon, text_icon, svg_icon

  if (item.tab_box) {
    normal = false
  }

  if (!text_icon && item.header) {
    if (App.is_header(item)) {
      text_icon = App.get_setting(`header_icon`)
    }
    else {
      text_icon = App.get_setting(`subheader_icon`)
    }

    if (!text_icon) {
      svg_icon = `arrow_down`
    }
  }

  let no_favicon = App.no_favicons.includes(item.mode)
  let fetch = no_favicon && App.get_setting(`fetch_favicons`)

  if (svg_icon) {
    icon = App.get_svg_icon(svg_icon, `item_icon`)

    if (normal) {
      item.svg_icon_used = svg_icon
      item.text_icon_used = undefined
      item.favicon_used = undefined
      item.generated_icon = undefined
    }
  }
  else if (text_icon) {
    if (normal) {
      if (item.text_icon_used === text_icon) {
        return {add: false}
      }
    }

    icon = App.get_text_icon(text_icon)

    if (normal) {
      item.text_icon_used = text_icon
      item.favicon_used = undefined
      item.generated_icon = undefined
      item.svg_icon = undefined
    }
  }
  else if (item.favicon || fetch) {
    if (!item.favicon) {
      item.favicon = App.fetch_favicon_url(item)
    }

    if (normal) {
      if (item.favicon_used === item.favicon) {
        return {add: false}
      }
    }

    icon = App.make_favicon(item)

    if (normal) {
      item.favicon_used = item.favicon
      item.generated_icon = undefined
      item.text_icon_used = undefined
      item.svg_icon = undefined
    }
  }
  else if (App.get_setting(`generate_icons`)) {
    if (normal) {
      if (item.generated_icon === item.hostname) {
        return {add: false}
      }
    }

    icon = App.generate_icon(item.hostname)

    if (normal) {
      item.generated_icon = item.hostname
      item.favicon_used = undefined
      item.text_icon_used = undefined
      item.svg_icon = undefined
    }
  }
  else {
    let src = `img/favicon.jpg`
    icon = App.make_favicon(item, src)

    if (normal) {
      item.favicon_used = icon
      item.generated_icon = undefined
      item.text_icon_used = undefined
      item.svg_icon = undefined
    }
  }

  return {
    add: true,
    icon,
  }
}

App.get_svg_icon = (name, cls = `svg_icon`) => {
  let icon = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)
  icon.classList.add(cls)
  let icon_use = document.createElementNS(`http://www.w3.org/2000/svg`, `use`)
  icon_use.href.baseVal = `#${name}_icon`
  icon.append(icon_use)
  return icon
}

App.get_text_icon = (text_icon) => {
  let icon = DOM.create(`div`, `item_icon`)
  icon.textContent = text_icon
  return icon
}

App.make_favicon = (item, src = ``) => {
  let icon = DOM.create(`img`, `item_icon`)
  icon.loading = `lazy`

  DOM.ev(icon, `error`, () => {
    if (App.get_setting(`generate_icons`)) {
      let icon_2 = App.generate_icon(item.hostname)
      icon.replaceWith(icon_2)
    }
  })

  icon.src = src || item.favicon
  return icon
}

App.generate_icon = (hostname) => {
  let icon = DOM.create(`canvas`, `item_icon`)
  icon.width = App.icon_size
  icon.height = App.icon_size
  jdenticon.update(icon, hostname || `hostname`)
  return icon
}

App.edit_tab_icon = (args = {}) => {
  let def_args = {
    icon: ``,
  }

  App.def_args(def_args, args)
  let active = App.get_active_items({mode: args.item.mode, item: args.item})
  let s = args.icon ? `Edit icon?` : `Remove icon?`
  let force = App.check_force(`warn_on_edit_tabs`, active)

  App.show_confirm({
    message: `${s} (${active.length})`,
    confirm_action: () => {
      for (let it of active) {
        App.apply_edit({what: `icon`, item: it, value: args.icon, on_change: (value) => {
          App.custom_save(it.id, `icon`, value)
          App.push_to_icon_history([value])
        }})
      }
    },
    force,
  })
}

App.edit_icon = (item) => {
  App.edit_prompt({what: `icon`, item})
}

App.get_all_icons = (include_rules = true) => {
  let icons = []

  for (let icon of App.icon_history) {
    if (!icons.includes(icon)) {
      icons.push(icon)
    }
  }

  for (let item of App.get_items(`tabs`)) {
    if (item.custom_icon) {
      if (!icons.includes(item.custom_icon)) {
        icons.push(item.custom_icon)
      }
    }

    if (include_rules) {
      if (item.rule_icon) {
        if (!icons.includes(item.rule_icon)) {
          icons.push(item.rule_icon)
        }
      }
    }
  }

  return icons
}

App.push_to_icon_history = (icons) => {
  if (!icons.length) {
    return
  }

  for (let icon of icons) {
    if (!icon) {
      continue
    }

    App.icon_history = App.icon_history.filter(x => x !== icon)
    App.icon_history.unshift(icon)
    App.icon_history = App.icon_history.slice(0, App.icon_history_max)
  }

  App.stor_save_icon_history()
}

App.remove_item_icon = (item) => {
  let active = App.get_active_items({mode: item.mode, item})

  if (active.length === 1) {
    let it = active[0]

    if (it.rule_icon && !it.custom_icon) {
      App.domain_rule_message()
      return
    }
  }

  App.remove_edits({what: [`icon`], items: active, text: `icons`})
}

App.fetch_favicon_url = (item) => {
  return `https://www.google.com/s2/favicons?sz=64&domain=${item.hostname}`
}

App.get_icon_items = (mode, show = false) => {
  function icon_sort(a, b) {
    let ai = App.icon_history.indexOf(a)
    let bi = App.icon_history.indexOf(b)

    if (ai === -1) {
      ai = App.icon_history.length
    }

    if (bi === -1) {
      bi = App.icon_history.length
    }

    return ai - bi
  }

  let items = []
  let icons = []

  for (let tab of App.get_items(`tabs`)) {
    let icon = App.get_icon(tab)

    if (icon) {
      if (!icons.includes(icon)) {
        icons.push(icon)
      }
    }
  }

  if (icons.length) {
    icons.sort(icon_sort)

    if (!show) {
      items.push({
        text: `All`,
        action: () => {
          App.filter_icon({mode, icon: `all`})
        },
        middle_action: () => {
          App.filter_icon({mode, icon: `all`, from: App.refine_string})
        },
      })
    }

    for (let icon of icons.slice(0, App.max_icon_picks)) {
      items.push({
        text: icon,
        action: (e) => {
          if (show) {
            App.show_tab_list(`icon_${icon}`, e)
          }
          else {
            App.filter_icon({mode, icon})
          }
        },
        middle_action: (e) => {
          if (show) {
            //
          }
          else {
            App.filter_icon({mode, icon, from: App.refine_string})
          }
        },
      })
    }
  }
  else {
    items.push({
      text: `No icons in use`,
      action: () => {
        App.alert(`You can add icons to tabs`)
      },
    })
  }

  return items
}

App.filter_by_icon = (item) => {
  let icon = App.get_icon(item)

  if (icon) {
    App.filter_icon({mode: item.mode, icon})
  }
}

App.custom_icon_menu_items = (item, e) => {
  let items = []
  let icon = App.get_icon(item)

  items.push({
    text: `Show`,
    icon,
    action: () => {
      App.show_tab_list(`icon_${icon}`, e)
    },
  })

  items.push({
    text: `Filter`,
    icon,
    action: () => {
      App.filter_by_icon(item)
    },
  })

  if (item.mode !== `tabs`) {
    return items
  }

  App.sep(items)

  items.push({
    text: `Change`,
    action: () => {
      App.change_icon(item)
    },
  })

  if (item.custom_icon) {
    items.push({
      text: `Remove`,
      action: () => {
        App.remove_item_icon(item)
      },
    })
  }

  return items
}

App.custom_icon_menu = (item, e) => {
  let items = App.custom_icon_menu_items(item, e)
  App.show_context({items, e})
}

App.change_icon = (item) => {
  App.edit_prompt({what: `icon`, item})
}

App.show_filter_icon_menu = (mode, e, show = false) => {
  let items = App.get_icon_items(mode, show)
  App.show_context({items, e, title: `Icons`})
}

App.get_iconed_items = (mode) => {
  let items = []

  for (let item of App.get_items(mode)) {
    if (App.get_icon(item)) {
      items.push(item)
    }
  }

  return items
}

App.get_icon_tabs = (icon) => {
  let tabs = []

  for (let item of App.get_items(`tabs`)) {
    let item_icon = App.get_icon(item)

    if (item_icon) {
      if (item_icon === icon) {
        tabs.push(item)
      }
    }
  }

  return tabs
}

App.icon_enabled = (what) => {
  if (what.endsWith(`_icon`)) {
    what = what.split(`_icon`)[0]
  }

  let icon

  if ([`color`, `custom`, `container`].includes(what)) {
    icon = true
  }
  else {
    icon = Boolean(App.get_setting(`${what}_icon`))
  }

  let show = App.get_setting(`show_${what}_icon`)
  return icon && (show !== `never`)
}

App.custom_icon_click = (item, e) => {
  let icon = App.get_icon(item)
  let cmd = App.get_custom_icon_command(icon)

  if (cmd) {
    App.run_command({cmd, from: `custom_icon`, item, e})
  }
  else {
    App.custom_icon_menu(item, e)
  }
}

App.get_custom_icon_command = (icon) => {
  let custom_cmds = App.get_setting(`custom_icon_commands`)
  let cmd

  for (let item of custom_cmds) {
    if (item.icon === icon) {
      cmd = item.cmd
      break
    }
  }

  return cmd
}

App.item_icon_click = (item, target, e) => {
  let el = DOM.parent(target, [`.item_icon_unit`])

  if (!el) {
    return false
  }

  let icon = el.dataset.icon

  if (!icon) {
    return false
  }

  if (icon === `color`) {
    App.color_icon_click(item, e)
    return true
  }
  else if (icon === `custom`) {
    App.custom_icon_click(item, e)
    return true
  }

  let cmd = App.get_setting(`${icon}_icon_command`)

  if (!cmd || cmd === `none`) {
    return false
  }

  App.run_command({cmd, item, from: `icon_click`, e})
  return true
}

App.update_icon_tooltips = (item, target) => {
  let el = DOM.parent(target, [`.item_icon_unit`])

  if (!el) {
    return
  }

  if (App.boolstring(el.dataset.has_tooltips)) {
    return
  }

  el.dataset.has_tooltips = true
  let icon = el.dataset.icon

  if (!icon) {
    return
  }

  let cmd

  if (App.media_icons.includes(icon)) {
    let sett = App.get_setting(`view_${icon}_${item.mode}`)

    if ([`icon`, `item`].includes(sett)) {
      let iname = App.capitalize(icon)
      el.title = `Click: View ${iname}`
      return
    }
  }
  else if (icon === `color`) {
    let color = el.dataset.color
    cmd = App.get_color_icon_command(color)
  }
  else if (icon === `custom`) {
    let content = el.dataset.content
    cmd = App.get_custom_icon_command(content)
  }
  else {
    cmd = App.get_setting(`${icon}_icon_command`)
  }

  if (cmd && (cmd !== `none`)) {
    let cmd_name = App.get_cmd_name(cmd)
    el.title += `\nClick: ${cmd_name}`
  }
  else if (icon === `color`) {
    el.title += `\nClick: Show Menu`
  }
  else if (icon === `custom`) {
    el.title += `\nClick: Show Menu`
  }
}