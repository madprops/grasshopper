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

App.get_text_edit = (item, rule, prop) => {
  let value = item[`custom_${prop}`]

  if (!value && rule) {
    value = item[`rule_${prop}`]
  }

  return value || ``
}

App.get_list_edit = (item, rule, prop) => {
  let value = item[`custom_${prop}`]

  if (!value.length && rule) {
    value = item[`rule_${prop}`]
  }

  return value || []
}

App.get_bool_edit = (item, rule, prop) => {
  let value = item[`custom_${prop}`]

  if ((value === undefined) && rule) {
    value = item[`rule_${prop}`]
  }

  return value || false
}

//

App.get_color = (item, rule = true) => {
  return App.get_text_edit(item, rule, `color`)
}

App.get_title = (item, rule = true) => {
  return App.get_text_edit(item, rule, `title`)
}

App.get_icon = (item, rule = true) => {
  return App.get_text_edit(item, rule, `title`)
}

App.get_notes = (item, rule = true) => {
  return App.get_text_edit(item, rule, `notes`)
}

App.get_tags = (item, rule = true) => {
  return App.get_list_edit(item, rule, `tags`)
}

App.get_split = (item, what, rule = true) => {
  return App.get_bool_edit(item, rule, `split_${what}`)
}