App.get_color = (item) => {
  return item.custom_color || item.rule_color || ``
}

App.get_title = (item) => {
  let title = item.custom_title || item.rule_title || item.title || ``

  if (App.get_setting(`all_caps`)) {
    title = title.toUpperCase()
  }

  return title
}

App.get_icon = (item) => {
  return item.custom_icon || item.rule_icon || ``
}

App.get_tags = (item) => {
  let tags = []
  tags.push(...item.rule_tags)
  tags.push(...item.custom_tags)
  return Array.from(new Set(tags))
}

App.get_notes = (item) => {
  return item.custom_notes || item.rule_notes || ``
}

App.get_split = (item, what) => {
  return item[`custom_split_${what}`] || item[`rule_split_${what}`] || false
}

App.get_split_title = (item) => {
  return item[`custom_split_title`] || item[`rule_split_title`] || ``
}