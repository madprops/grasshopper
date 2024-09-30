App.edit_tab_root = (args = {}) => {
  let def_args = {
    root: ``,
  }

  App.def_args(def_args, args)
  let active = App.get_active_items({mode: args.item.mode, item: args.item})
  let s = args.root ? `Edit root?` : `Remove root?`
  let force = App.check_force(`warn_on_edit_tabs`, active)

  App.show_confirm({
    message: `${s} (${active.length})`,
    confirm_action: () => {
      for (let it of active) {
        App.apply_edit({what: `root`, item: it, value: args.root, on_change: (value) => {
          App.custom_save(it.id, `root`, value)
        }})
      }
    },
    force,
  })
}

App.edit_root_url = (item) => {
  App.edit_prompt({what: `root`, item, value: ``, url: true})
}

App.get_all_roots = (include_rules = true) => {
  let roots = []

  for (let item of App.get_items(`tabs`)) {
    if (item.custom_root) {
      if (!roots.includes(item.custom_root)) {
        roots.push(item.custom_root)
      }
    }

    if (include_rules) {
      if (item.rule_root) {
        if (!roots.includes(item.rule_root)) {
          roots.push(item.rule_root)
        }
      }
    }
  }

  return roots
}

App.go_to_root_url = (item) => {
  let active = App.get_active_items({mode: item.mode, item})

  for (let it of active) {
    it.root = it.custom_root || it.rule_root || ``

    if (!it.root) {
      continue
    }

    App.change_url(it, it.root)
  }
}

App.remove_root_url = (item) => {
  let active = App.get_active_items({mode: item.mode, item})

  if (active.length === 1) {
    let it = active[0]

    if (it.rule_root && !it.custom_root) {
      App.domain_rule_message()
      return
    }
  }

  App.remove_edits({what: [`root`], items: active, text: `roots`})
}

App.root_possible = (item) => {
  let root = App.get_root(item)

  if (!root) {
    return false
  }

  return !App.urls_match(item.url, root)
}

App.item_has_root = (item) => {
  return Boolean(App.get_root(item))
}