App.save_memory = () => {
  App.stor_save_memory()
}

App.setup_memory = () => {
  if (App.memory.last_command) {
    App.last_command = App.clone(App.memory.last_command)
  }
}

App.mem_last_command = () => {
  App.memory.last_command = App.clone(App.last_command)
  App.save_memory()
}