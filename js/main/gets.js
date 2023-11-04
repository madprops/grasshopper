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

App.get_tags = (item) => {
  let tags = []
  tags.push(...item.rule_tags)
  tags.push(...item.custom_tags)
  return Array.from(new Set(tags))
}

App.get_notes = (item) => {
  return item.custom_notes || item.rule_notes || ``
}