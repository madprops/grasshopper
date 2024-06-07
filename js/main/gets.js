/* global App, DOM, browser, dateFormat, Addlist, AColorPicker, Menubutton, jdenticon, ColorLib, NiceGesture, NeedContext */

App.title = (item) => {
  let title = App.get_title(item) || item.title || ``

  if (App.get_setting(`all_caps`)) {
    title = title.toUpperCase()
  }

  return title
}

App.tags = (item, rule = true) => {
  let tags = []

  if (rule) {
    tags.push(...item.rule_tags)
  }

  tags.push(...item.custom_tags)
  return Array.from(new Set(tags))
}

//

App.get_text_edit = (item, prop, rule) => {
  let value = item[`custom_${prop}`]

  if (!value && rule) {
    value = item[`rule_${prop}`]
  }

  return value || ``
}

App.get_list_edit = (item, prop, rule) => {
  let value = item[`custom_${prop}`]

  if (!value.length && rule) {
    value = item[`rule_${prop}`]
  }

  return value || []
}

App.get_bool_edit = (item, prop, rule) => {
  let value = item[`custom_${prop}`]

  if ((value === undefined) && rule) {
    value = item[`rule_${prop}`]
  }

  return value || false
}

//

App.get_edit = (item, prop, rule = true) => {
  if ([`color`, `title`, `icon`, `notes`].includes(prop)) {
    return App.get_text_edit(item, prop, rule)
  }
  else if ([`tags`].includes(prop)) {
    return App.get_list_edit(item, prop, rule)
  }
  else if ([`split_top`, `split_bottom`].includes(prop)) {
    return App.get_bool_edit(item, prop, rule)
  }
}

//

App.get_color = (item, rule = true) => {
  return App.get_edit(item, `color`, rule)
}

App.get_title = (item, rule = true) => {
  return App.get_edit(item, `title`, rule)
}

App.get_icon = (item, rule = true) => {
  return App.get_edit(item, `icon`, rule)
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