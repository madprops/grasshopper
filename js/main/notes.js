App.edit_notes = (item) => {
  App.show_input({
    message: `Notes`,
    button: `Save`,
    action: (text) => {
      let notes = App.single_linebreak(text)

      if (item.rule_notes) {
        if (item.rule_notes === notes) {
          return
        }
      }

      if (App.apply_edit(`notes`, item, notes)) {
        App.custom_save(item.id, `custom_notes`, notes)
      }

      return true
    },
    value: App.get_notes(item),
    autosave: true,
    bottom: true,
    wrap: true,
    readonly: item.mode !== `tabs`,
  })
}

App.remove_item_notes = (item, single = false) => {
  let active

  if (single) {
    active = [item]
  }
  else {
    active = App.get_active_items({mode: item.mode, item: item})
  }

  if (active.length === 1) {
    let it = active[0]

    if (it.rule_notes && !it.custom_notes) {
      App.domain_rule_message()
      return
    }
  }

  App.remove_edits({what: [`notes`], items: active})
}

App.remove_notes = (item) => {
  App.remove_item_notes(item, true)
}