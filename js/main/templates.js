App.start_templates_addlist = () => {
  if (App.template_addlist_ready) {
    return
  }

  let {popobj, regobj} = App.get_setting_addlist_objects()
  let id = `settings_templates`
  let props = App.setting_props.templates

  App.create_popup({...popobj, id: `addlist_${id}`,
    after_hide: () => {
      App.rules_item = undefined
    },
    element: Addlist.register({...regobj, id,
      keys: [
        `name`,
        `color`,
        `title`,
        `icon`,
        `tags`,
        `root`,
        `notes`,
        `split_top`,
        `split_bottom`,
      ],
      pk: `name`,
      widgets: {
        name: `text`,
        color: `menu`,
        title: `text`,
        root: `text`,
        icon: `text`,
        tags: `text`,
        notes: `textarea`,
        split_top: `checkbox`,
        split_bottom: `checkbox`,
      },
      labels: {
        name: `Name`,
        color: `Color`,
        title: `Title`,
        icon: `Icon`,
        tags: `Tags`,
        notes: `Notes`,
        split_top: `Split Top`,
        split_bottom: `Split Bottom`,
        root: `Root`,
      },
      sources: {
        color: () => {
          return App.color_values()
        },
      },
      process: {
        root: (value) => {
          if (value) {
            return App.fix_url(value)
          }

          return value
        },
      },
      validate: (values) => {
        if (!values.name) {
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
          !values.notes
        ) {
          return false
        }

        return true
      },
      tooltips: {
        name: `Name of the template`,
        color: `Add this color to matches`,
        title: `Add this title to matches`,
        icon: `Add this icon to matches`,
        tags: `Add these tags to matches`,
        notes: `Add these notes to matches`,
        split_top: `Add a split top to matches`,
        split_bottom: `Add a split bottom to matches`,
        root: `Make this the root URL for matches`,
      },
      list_text: (items) => {
        return items.name
      },
      title: props.name,
    })})

  App.template_addlist_ready = true
}

App.apply_template = (template, item) => {
  function save(it, name) {
    let key = `custom_${name}`
    let value = template[name] || undefined

    if (value === undefined) {
      return
    }

    if (name === `tags`) {
      value = App.split_list(value)
    }

    it[key] = value
    browser.sessions.setTabValue(it.id, key, it[key])
  }

  let active = App.get_active_items({mode: `tabs`, item})

  if (!active.length) {
    return
  }

  for (let it of active) {
    save(it, `color`)
    save(it, `title`)
    save(it, `root`)
    save(it, `icon`)
    save(it, `tags`)
    save(it, `notes`)
    save(it, `split_top`)
    save(it, `split_bottom`)

    App.update_item({mode: `tabs`, id: it.id, info: it})
  }
}