App.check_rules = (item) => {
  let rules = App.get_setting(`domain_rules`)
  item.rule_color = undefined
  item.rule_title = undefined
  item.rule_tags = undefined
  item.rule_notes = undefined
  item.ruled = false

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

      if (rule.tags && rule.tags.length) {
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