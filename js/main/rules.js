App.check_rules = (item) => {
  item.ruled = false

  for (let key in App.edit_props) {
    let p = item[`rule_${key}`]

    if (p === undefined) {
      item[`rule_${key}`] = App.edit_default(key)
    }
  }

  let rules = App.get_setting(`domain_rules`)

  for (let rule of rules) {
    if (App.wildcard(rule.domain, item.path, rule.exact)) {
      for (let key in App.edit_props) {
        if (key === `tags`) {
          if (rule[key].length) {
            item[`rule_${key}`] = App.taglist(rule[key])
            item.ruled = true
          }
        }
        else if (key === `color`) {
          if (rule[key] && (rule[key] !== `none`)) {
            item[`rule_${key}`] = rule[key]
            item.ruled = true
          }
        }
        else {
          if (rule[key]) {
            item[`rule_${key}`] = rule[key]
            item.ruled = true
          }
        }
      }
    }

    break
  }
}