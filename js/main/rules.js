App.check_rules = (item, rule) => {
  item.ruled = false

  for (let key in App.edit_props) {
    item[`rule_${key}`] = App.edit_default(key)
  }

  let rules

  if (rule) {
    rules = [rule]
  }
  else {
    rules = App.get_setting(`domain_rules`)
  }

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
      App.copy_rule(item, rule)
      return true
    }
  }

  return false
}

App.copy_rule = (item, rule) => {
  for (let key in App.edit_props) {
    if (key === `tags`) {
      if (rule[key].length) {
        item[`rule_${key}`] = App.split_list(rule[key])
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
    else if (rule[key]) {
      item[`rule_${key}`] = rule[key]
      item.ruled = true
      item.rule = rule
    }
  }
}

App.domain_rule_message = () => {
  App.alert(`This is set by a domain rule`)
}

App.refresh_rules = (mode) => {
  for (let item of App.get_items(mode)) {
    App.check_rules(item)
    App.refresh_item_element(item)
  }

  App.refresh_tab_box()
}

App.edit_domain_rule = (item, e) => {
  function edit (obj, edit = true) {
    App.start_domain_rules()

    Addlist.edit_object(`settings_domain_rules`, obj, edit, () => {
      App.refresh_rules(item.mode)
    })
  }

  function add (value, by_title = false) {
    let obj = {}
    obj.domain = value

    if (by_title) {
      obj.by_title = true
    }

    edit(obj, false)
  }

  App.rules_item = item

  if (item.ruled) {
    edit(item.rule)
    return
  }

  add(item.hostname || item.path)
}

App.start_domain_rules = () => {
  if (App.domain_rules_ready) {
    return
  }

  App.debug(`Start domain rules`)
  let [popobj, regobj] = App.get_setting_addlist_objects()
  let id = `settings_domain_rules`
  let props = App.setting_props.domain_rules

  App.create_popup(Object.assign({}, popobj, {
    id: `addlist_${id}`,
    after_hide: () => {
      App.rules_item = undefined
    },
    element: Addlist.register(Object.assign({}, regobj, {
      id,
      keys: [
        `domain`,
        `by_title`,
        `exact`,
        `color`,
        `title`,
        `icon`,
        `tags`,
        `notes`,
        `split_top`,
        `split_bottom`,
      ],
      pk: `domain`,
      widgets: {
        domain: `text`,
        color: `menu`,
        title: `text`,
        icon: `text`,
        tags: `text`,
        notes: `textarea`,
        split_top: `checkbox`,
        split_bottom: `checkbox`,
        exact: `checkbox`,
        by_title: `checkbox`,
      },
      on_check: {
        by_title: (checked) => {
          let item = App.rules_item

          if (!item) {
            return
          }

          let input = DOM.el(`#addlist_widget_settings_domain_rules_domain`)

          if (checked) {
            let title = item.title
            input.value = title
          }
          else {
            input.value = item.hostname || item.path
          }
        },
      },
      labels: {
        domain: `Domain`,
        color: `Color`,
        title: `Title`,
        icon: `Icon`,
        tags: `Tags`,
        notes: `Notes`,
        split_top: `Split Top`,
        split_bottom: `Split Bottom`,
        exact: `Exact Match`,
        by_title: `By Title`,
      },
      sources: {
        color: () => {
          return App.color_values()
        },
      },
      process: {
        domain: (value) => {
          if (App.is_regex(value)) {
            return value
          }

          return App.get_path(value)
        }
      },
      validate: (values) => {
        if (!values.domain) {
          return false
        }

        if (
          !values.color &&
          !values.title &&
          !values.icon &&
          !values.tags &&
          !values.split_top &&
          !values.split_bottom &&
          !values.notes
        ) {
          return false
        }

        return true
      },
      tooltips: {
        domain: `The domain root to match
        Wildcards (*) are allowed
        Regex is allowed by using /this/`,
        exact: `Match exact URL instead of startsWith
        If in regex mode it makes the case sensitive`,
        by_title: `Match by title instead of URL`,
        color: `Add this color to matches`,
        title: `Add this title to matches`,
        icon: `Add this icon to matches`,
        tags: `Add these tags to matches`,
        notes: `Add these notes to matches`,
        split_top: `Add a split top to matches`,
        split_bottom: `Add a split bottom to matches`,
      },
      list_text: (items) => {
        return items.domain
      },
      title: props.name,
    }))
  }))

  App.domain_rules_ready = true
}