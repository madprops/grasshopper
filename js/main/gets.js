App.title = (item) => {
  let title = App.get_title(item) || item.title || ``

  if (App.get_setting(`all_caps`)) {
    title = title.toUpperCase()
  }

  return title
}

App.tags = (item, rule = true) => {
  let tags = []
  let rtags = App.get_rule(item, `tags`)
  let ctags = App.get_tags(item, false)

  if (rule) {
    tags.push(...rtags)
  }

  tags.push(...ctags)
  return Array.from(new Set(tags))
}

//

App.get_edit = (item, prop, rule = true) => {
  let value = item[`custom_${prop}`]

  if ((value === undefined) && rule) {
    value = item[`rule_${prop}`]
  }

  return value ?? App.edit_default(prop)
}

App.get_color = (item, rule = true) => {
  return App.get_edit(item, `color`, rule)
}

App.get_title = (item, rule = true) => {
  return App.get_edit(item, `title`, rule)
}

App.get_root = (item, rule = true) => {
  return App.get_edit(item, `root`, rule)
}

App.get_icon = (item, rule = true) => {
  App.get_edit(item, `icon`, rule)
}

App.get_notes = (item, rule = true) => {
  return App.get_edit(item, `notes`, rule)
}

App.get_tags = (item, rule = true) => {
  return App.get_edit(item, `tags`, rule)
}

App.get_split_top = (item, rule = true) => {
  return App.get_edit(item, `split_top`, rule)
}

App.get_split_bottom = (item, rule = true) => {
  return App.get_edit(item, `split_bottom`, rule)
}

App.get_split = (item, what, rule = true) => {
  if (what === `top`) {
    return App.get_split_top(item, rule)
  }
  else if (what === `bottom`) {
    return App.get_split_bottom(item, rule)
  }
}