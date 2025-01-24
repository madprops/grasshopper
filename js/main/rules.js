App.check_rules = (item, rule) => {
  let rules

  if (rule) {
    rules = [rule]
  }
  else {
    rules = App.get_setting(`domain_rules`)
  }

  App.undefine_rules(item)

  for (let rule of rules) {
    let match = false
    let value = rule.by_title ? item.title : item.path

    if (App.is_regex(rule.domain)) {
      let regstr = rule.domain.slice(1, -1)
      let flag = rule.exact ? `` : `i`

      try {
        let regex = new RegExp(regstr, flag)
        match = regex.test(value)
      }
      catch (error) {
        match = false
      }
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

App.undefine_rules = (item) => {
  for (let key in App.edit_props) {
    item[`rule_${key}`] = undefined
  }

  item.ruled = false
  item.rule = undefined
}

App.domain_rule_message = () => {
  App.alert(`This is set by a domain rule`)
}

App.refresh_rules = (mode) => {
  for (let item of App.get_items(mode)) {
    App.check_rules(item)
    App.refresh_item_element(item)
  }

  App.update_tab_box()
}

App.edit_domain_rule = (item, e) => {
  function edit(obj, edit = true) {
    App.start_domain_rules_addlist()

    Addlist.edit_object(`settings_domain_rules`, obj, edit, () => {
      App.refresh_rules(item.mode)
    })
  }

  function add(value, by_title = false) {
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

App.start_domain_rules_addlist = () => {
  if (App.domain_rules_addlist_ready) {
    return
  }

  App.debug(`Start domain rules`)
  let {popobj, regobj} = App.get_setting_addlist_objects()
  let id = `settings_domain_rules`
  let props = App.setting_props.domain_rules

  App.create_popup({...popobj, id: `addlist_${id}`,
    after_hide: () => {
      App.rules_item = undefined
    },
    element: Addlist.register({...regobj, id,
      keys: [
        `domain`,
        `by_title`,
        `exact`,
        `color`,
        `title`,
        `icon`,
        `tags`,
        `root`,
        `notes`,
        `split_top`,
        `split_bottom`,
        `obfuscated`,
      ],
      pk: `domain`,
      widgets: {
        domain: `text`,
        color: `menu`,
        title: `text`,
        root: `text`,
        icon: `text`,
        tags: `text`,
        notes: `textarea`,
        split_top: `checkbox`,
        split_bottom: `checkbox`,
        obfuscated: `checkbox`,
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
        obfuscated: `Obfuscated`,
        exact: `Exact Match`,
        by_title: `By Title`,
        root: `Root`,
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
        },
        root: (value) => {
          if (value) {
            return App.fix_url(value)
          }

          return value
        },
      },
      validate: (values) => {
        if (!values.domain) {
          return false
        }

        if (
          !values.color &&
          !values.title &&
          !values.root &&
          !values.icon &&
          !values.tags &&
          !values.split_top &&
          !values.split_bottom &&
          !values.obfuscated &&
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
        obfuscated: `Obfuscate the visuals of matches`,
        root: `Make this the root URL for matches`,
      },
      list_icon: (item) => {
        return item.icon || App.notepad_icon
      },
      list_text: (item) => {
        return item.domain
      },
      title: props.name,
      buttons: [
        {
          text: `Template`,
          tooltip: `Create a domain rule from a template`,
          action: (e) => {
            App.domain_rule_from_template(e)
          },
        },
      ],
    })})

  App.domain_rules_addlist_ready = true
}

App.remove_domain_rule = (item) => {
  let mode = App.active_mode
  let active = App.get_active_items({mode, item})

  if (!active.length) {
    return
  }

  let rules = []

  for (let it of active) {
    if (it.ruled) {
      rules.push(it.rule)
    }
  }

  if (!rules.length) {
    return
  }

  App.show_confirm({
    message: `Remove Domain Rule? (${rules.length})`,
    confirm_action: () => {
      let all_rules = App.get_setting(`domain_rules`)
      let keep = []

      for (let rul of all_rules) {
        if (rules.includes(rul)) {
          continue
        }

        keep.push(rul)
      }

      App.set_setting({setting: `domain_rules`, value: keep})
      App.refresh_rules()
    },
  })
}

App.remove_all_domain_rules = () => {
  App.show_confirm({
    message: `Remove Domain Rules?`,
    confirm_action: () => {
      App.set_setting({setting: `domain_rules`, value: []})
      App.refresh_rules()
    },
  })
}

App.get_rule = (item, prop, def = true) => {
  let value = item[`rule_${prop}`]

  if ((value === undefined) && def) {
    value = App.edit_default(prop)
  }

  return value
}

App.domain_rule_from_template = (e) => {
  let items = []

  for (let template of App.get_setting(`templates`)) {
    items.push({
      text: template.name,
      icon: template.cmd_icon || App.template_icon,
      action: () => {
        App.fill_domain_rules_from_template(template)
      },
    })
  }

  App.show_context({items, e})
}

App.fill_domain_rules_from_template = (template) => {
  for (let key in App.edit_props) {
    let props = App.edit_props[key]
    let value = template[key]
    let el = DOM.el(`#addlist_widget_settings_domain_rules_${key}`)

    if (key === `color`) {
      let color = App[`addlist_menubutton_settings_domain_rules_${key}`]
      color.set(value || `none`)
    }
    else if (props.type === `bool`) {
      el.checked = Boolean(value)
    }
    else {
      el.value = value || ``
    }
  }
}