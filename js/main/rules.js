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
    let match = false

    if (App.is_regex(rule.domain)) {
      let regstr = rule.domain.slice(1, -1)
      let flag = rule.exact ? `` : `i`
      let regex = new RegExp(regstr, flag)
      match = regex.test(item.path)
    }
    else if (App.wildcard(rule.domain, item.path, rule.exact)) {
      match = true
    }

    if (match) {
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

      break
    }
  }
}

App.domain_rule_message = () => {
  App.alert_autohide(`This is set by domain rules`)
}

App.edit_domain_rule = (item) => {
  App.show_settings_category(`general`, () => {
    Addlist.resolve(`settings_domain_rules`, item.hostname)
  })
}