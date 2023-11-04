App.check_rules = (item) => {
  item.ruled = false

  for (let key in App.edit_props) {
    item[`rule_${key}`] = App.edit_default(key)
  }

  if (item.mode !== `tabs`) {
    return
  }

  let rules = App.get_setting(`domain_rules`)

  for (let rule of rules) {
    let match = false

    if (rule.exact) {
      match = item.path === rule.domain
    }
    else {
      match = item.path.startsWith(rule.domain)
    }

    if (match) {
      if (rule.color && rule.color !== `none`) {
        item.rule_color = rule.color
        item.ruled = true
      }

      if (rule.title) {
        item.rule_title = rule.title
        item.ruled = true
      }

      if (rule.tags.length) {
        item.rule_tags = App.taglist(rule.tags)
        item.ruled = true
      }

      if (rule.notes) {
        item.rule_notes = rule.notes
        item.ruled = true
      }
    }
  }
}