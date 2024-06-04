App.edit_notes = (item) => {
  App.show_input({
    message: `Tab Notes`,
    button: `Save`,
    action: (text) => {
      let notes = App.single_linebreak(text)

      if (item.rule_notes) {
        if (item.rule_notes === notes) {
          return
        }
      }

      App.apply_edit({what: `notes`, item: item, value: notes, on_change: (value) => {
        App.custom_save(item.id, `custom_notes`, value)
      }})

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

App.edit_global_notes = () => {
  App.show_input({
    message: `Global Notes`,
    button: `Save`,
    action: (text) => {
      App.notes = text
      App.stor_save_notes()
      return true
    },
    value: App.notes,
    autosave: true,
    bottom: true,
    wrap: true,
  })
}