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
    let value = rule.by_title ? item.title : item.path

    if (App.is_regex(rule.domain)) {
      let regstr = rule.domain.slice(1, -1)
      let flag = rule.exact ? `` : `i`
      let regex = new RegExp(regstr, flag)
      match = regex.test(value)
    }
    else if (App.wildcard(rule.domain, value, rule.exact)) {
      match = true
    }

    if (match) {
      for (let key in App.edit_props) {
        if (key === `tags`) {
          if (rule[key].length) {
            item[`rule_${key}`] = App.taglist(rule[key])
            item.ruled = true
            item.rule = rule
          }
        }
        else if (key === `color`) {
          if (rule[key] && (rule[key] !== `none`)) {
            item[`rule_${key}`] = rule[key]
            item.ruled = true
            item.rule = rule
          }
        }
        else {
          if (rule[key]) {
            item[`rule_${key}`] = rule[key]
            item.ruled = true
            item.rule = rule
          }
        }
      }

      break
    }
  }
}

App.domain_rule_message = () => {
  App.alert_autohide(`This is set by a domain rule`)
}

App.edit_domain_rule = (item, e) => {
  function add (value) {
    App.show_settings_category(`general`, () => {
      Addlist.resolve(`settings_domain_rules`, value, () => {
        App.hide_window()
      })
    })
  }

  function edit (rule, edit = false) {
    App.show_settings_category(`general`, () => {
      Addlist.edit_object(`settings_domain_rules`, rule, () => {
        App.hide_window()
      })
    })
  }

  if (item.ruled) {
    edit(item.rule)
    return
  }

  let items = []

  items.push({
    text: `By URL`,
    action: () => {
      add(item.hostname || item.path)
    }
  })

  items.push({
    text: `By Title`,
    action: () => {
      add(App.get_title(item))
    }
  })

  App.show_context({items: items, e: e})
}