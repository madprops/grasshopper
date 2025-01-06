App.obfuscate_tabs = (item) => {
  let items = App.get_active_items({mode: item.mode, item})
  let force = App.check_warn(`warn_on_obfuscate_tabs`, items)

  App.show_confirm({
    message: `Obfuscate tabs? (${items.length})`,
    confirm_action: () => {
      for (let it of items) {
        App.obfuscate_tab(it)
      }
    },
    force,
  })
}

App.obfuscate_tab = (item) => {
  if (App.get_obfuscated(item)) {
    return
  }

  App.apply_edit({what: `obfuscated`, item, value: true, on_change: (value) => {
    App.custom_save(item.id, `obfuscated`, value)
  }})
}

App.deobfuscate_tabs = (item) => {
  let items = App.get_active_items({mode: item.mode, item})
  let force = App.check_warn(`warn_on_deobfuscate_tabs`, items)

  if (items.length === 1) {
    if (item.rule_obfuscated) {
      App.domain_rule_message()
      return
    }
  }

  App.show_confirm({
    message: `Deobfuscate tabs? (${items.length})`,
    confirm_action: () => {
      for (let it of items) {
        App.deobfuscate_tab(it)
      }
    },
    force,
  })
}

App.deobfuscate_tab = (item) => {
  if (!App.get_obfuscated(item)) {
    return
  }

  App.apply_edit({what: `obfuscated`, item, value: false, on_change: (value) => {
    App.custom_save(item.id, `obfuscated`, value)
  }})
}

App.toggle_obfuscate_tabs = (item) => {
  if (App.get_obfuscated(item)) {
    App.deobfuscate_tabs(item)
  }
  else {
    App.obfuscate_tabs(item)
  }
}

App.get_obfuscated_text = (item) => {
  return `Obfuscated`
}