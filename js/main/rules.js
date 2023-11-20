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
  function edit (obj) {
    App.show_settings_category(`general`, () => {
      Addlist.edit_object(`settings_domain_rules`, obj, () => {
        App.hide_window()
      })
    })
  }

  function add (value, by_title = false) {
    let obj = {}
    obj.domain = value

    if (by_title) {
      obj.by_title = true
    }

    edit(obj)
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
      add(App.get_title(item), true)
    }
  })

  App.show_context({items: items, e: e})
}