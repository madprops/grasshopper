App.open_blank_tab = () => {
  browser.tabs.create({
    url: App.blank_url
  })
}

App.start_blank = (item) => {
  let word_1 = App.capitalize(App.random_word(4))
  let word_2 = App.capitalize(App.random_word(4))
  let title = `${word_1} ${word_2}`

  if (App.apply_edit(`title`, item, title)) {
    App.custom_save(item.id, `custom_title`, title)
  }

  let color = App.random_choice(App.colors)

  if (App.apply_edit(`color`, item, color)) {
    App.custom_save(item.id, `custom_color`, color)
  }
}