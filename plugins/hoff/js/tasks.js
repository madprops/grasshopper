App.ls_tasks = `hoff_tasks_v1`

// Program starts here
App.init = () => {
  App.tasks = App.get_local_storage(App.ls_tasks) || []
  App.setup_backup()
  App.setup_mouse()
  App.setup_keyboard()
  App.setup_popups()
  App.show_tasks()
}

// Focus first input
App.focus_first = () => {
  let el = DOM.els(`.task`)[0]

  if (el) {
    App.focus_input(el)
  }
}

// Put the tasks in the container
App.show_tasks = () => {
  let container = DOM.el(`#tasks`)
  container.innerHTML = ``

  for (let i=App.tasks.length-1; i>=0; i--) {
    let task = App.tasks[i]

    if (task) {
      let el = App.create_task_element(task)
      container.append(el)
      App.check_important(task)
    }
  }

  App.check_first()
}

// Create a task's element
App.create_task_element = (task) => {
  let el = DOM.create(`div`, `task`, `task_id_${task.id}`)
  let top = DOM.create(`div`, `task_top`)
  let bottom = DOM.create(`div`, `task_bottom`)

  //
  let info = DOM.create(`div`, `task_info`)
  App.set_info(info, task)
  top.append(info)
  el.append(top)

  //
  let check = DOM.create(`input`, `task_check`)
  check.title = `Mark as done`
  check.type = `checkbox`
  check.checked = task.done

  DOM.ev(check, `change`, () => {
    task.date = Date.now()
    App.sort_tasks()
    App.save_tasks()
    App.show_tasks()
  })

  bottom.append(check)

  //
  let move = DOM.create(`div`, `task_move`)
  move.title = `Move task`
  let move_icon = DOM.create(`object`, `icon`)
  move_icon.type = `image/svg+xml`
  move_icon.data = `img/move.svg`
  move.draggable = true

  DOM.ev(move, `dragstart`, (e) => {
    App.on_dragstart(e)
  })

  move.append(move_icon)
  bottom.append(move)

  //
  let text = DOM.create(`input`, `task_text`)
  text.type = `text`
  text.value = task.text
  text.placeholder = `Write something here`

  DOM.ev(text, `blur`, () => {
    App.on_blur(text)
  })

  DOM.ev(text, `input`, () => {
    App.on_input(text)
  })

  bottom.append(text)

  //
  let remove = DOM.create(`div`, `task_remove action`)
  remove.textContent = `x`
  bottom.append(remove)

  el.append(bottom)
  el.dataset.id = task.id
  return el
}

// Prepend a task in the container
App.prepend_task = (task) => {
  if (!task) {
    return
  }

  let container = DOM.el(`#tasks`)
  let el = App.create_task_element(task)
  container.prepend(el)
  el.focus()
  App.focus_input(el)
}

// Focus an element's input
App.focus_input = (el) => {
  DOM.el(`.task_text`, el).focus()
}

// Add a new task
App.add_task = () => {
  let d = Date.now()
  let s = App.get_random_string(5)
  let id = `${d}_${s}`

  let task = {
    id: id,
    text: ``,
    date: d,
    done: false,
  }

  App.tasks.push(task)
  App.prepend_task(task)
  App.save_tasks()
}

// Get a task by id
App.get_task_by_id = (id) => {
  for (let task of App.tasks) {
    if (id === task.id) {
      return task
    }
  }
}

// Get a task by id
App.get_task_element_by_id = (id) => {
  for (let el of DOM.els(`.task`)) {
    if (id === el.dataset.id) {
      return el
    }
  }
}

// Save tasks to local storage
App.save_tasks = () => {
  App.save_local_storage(App.ls_tasks, App.tasks)
}

// Show remove tasks dialog
App.remove_tasks_dialog = () => {
  let buttons = [
    [`Undo Remove`, () => {
      App.undo_remove()
    }, false],
    [`Remove Done`, () =>{
      App.remove_done_tasks()
    }, false],
    [`Remove All`, () => {
      App.remove_all_tasks()
    }, false],
  ]

  App.show_dialog(`Remove Tasks`, buttons)
}

// Remove tasks that are marked as done
App.remove_done_tasks = () => {
  let done = App.get_done_tasks()

  if (done.length > 0) {
    App.backup_tasks()
    App.tasks = App.tasks.filter(x => !x.done)
    App.save_tasks()
    App.show_tasks()
  }
}

// Remove all tasks
App.remove_all_tasks = () => {
  if (App.tasks.length > 0) {
    App.backup_tasks()
    App.tasks = []
    App.add_task()
    App.save_tasks()
    App.show_tasks()
  }
}

// Get a random int number from a range
App.get_random_int = (min, max, exclude = undefined) => {
  let num = Math.floor(Math.random() * (max - min + 1) + min)

  if (exclude !== undefined) {
    if (num === exclude) {
      if (num + 1 <= max) {
        num = num + 1
      }
      else if (num - 1 >= min) {
        num = num - 1
      }
    }
  }

  return num
}

// Get a random string of a certain length
App.get_random_string = (n) => {
  let text = ``

  let possible = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`

  for (let i = 0; i < n; i++) {
    text += possible[App.get_random_int(0, possible.length - 1)]
  }

  return text
}

// Remove a task
App.remove_task = (el) => {
  App.backup_tasks()
  let id = el.dataset.id
  App.tasks = App.tasks.filter(x => x.id !== id)
  el.remove()
  App.save_tasks()
}

// Get tasks that are marked as done
App.get_done_tasks = () => {
  let done = []

  for (let task of App.tasks) {
    if (task.done) {
      done.push(task)
    }
  }

  return done
}

// On dragstart event
App.on_dragstart = (e) => {
  App.drag_y = e.clientY
  App.drag_element = e.target.closest(`.task`)

  if (!App.drag_element) {
    e.preventDefault()
    return false
  }

  e.dataTransfer.setDragImage(new Image(), 0, 0)
}

// On dragover event
App.on_dragover = (e) => {
  if (!e.target.closest(`.task`)) {
    return
  }

  let direction = e.clientY > App.drag_y ? `down` : `up`
  let el = e.target.closest(`.task`)

  if (el === App.drag_element) {
    e.preventDefault()
    return false
  }

  App.drag_y = e.clientY

  if (direction === `down`) {
    el.after(App.drag_element)
  }
  else {
    el.before(App.drag_element)
  }
}

// On dragend event
App.on_dragend = (e) => {
  App.reorder_tasks()
}

// Update tasks array based on element order
App.reorder_tasks = () => {
  let ids = []
  let els = DOM.els(`.task`)
  els.reverse()

  for (let el of els) {
    ids.push(el.dataset.id)
  }

  App.tasks.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
  App.save_tasks()
}

// Show some information
App.show_info = () => {
  let s = ``
  s += `This is a simple TODO list.\n`
  s += `Tasks are saved in local storage.\n`
  s += `No network requests are made.`
  App.show_alert(s)
}

// Clear input or remove task if empty
App.clear_input = () => {
  let input = App.get_focused_input()

  if (input) {
    if (input.value) {
      input.value = ``
    }
    else {
      if (App.tasks.length > 1) {
        App.remove_task(input.closest(`.task`))
        App.focus_first()
      }
    }
  }
}

// Get input that is focused
App.get_focused_input = () => {
  for (let input of DOM.els(`.task_text`)) {
    if (input === document.activeElement) {
      return input
    }
  }
}

// Check if no tasks - Focus first task
// If no task add one - Always at least 1 task
App.check_first = () => {
  if (App.tasks.length === 0) {
    App.add_task()
  }

  App.focus_first()
}

// Check if first task is empty
App.first_task_empty = () => {
  return App.tasks[0].text === ``
}

// Move up or down to the next input
App.move_input = (direction) => {
  let items = [DOM.el(`#filter`)].concat(DOM.els(`.task_text`))
  let waypoint = false

  if (direction === `up`) {
    items.reverse()
  }

  for (let input of items) {
    if (waypoint) {
      input.focus()
      return
    }

    if (input === document.activeElement) {
      waypoint = true
    }
  }
}

// If no input focused then focus the first one
App.check_focus = () => {
  if (!App.input_focused() && !App.filter_focused()) {
    App.focus_first()
  }
}

// On input blur
App.on_blur = (el) => {
  App.update_input(el, true)
}

// On input event
App.do_on_input = (el) => {
  App.update_input(el)
}

// Update input
App.update_input = (el, reflect = false) => {
  let value = el.value.trim()

  if (reflect) {
    el.value = value
  }

  let id = el.closest(`.task`).dataset.id
  let task = App.get_task_by_id(id)

  if (task && task.text.trim() !== value) {
    task.text = value
    task.date = Date.now()
    let info = DOM.el(`.task_info`, el.closest(`.task`))
    App.set_info(info, task)
    App.check_important(task)
    App.save_tasks()
  }
}

// Check if a task input is focused
App.input_focused = () => {
  return document.activeElement.classList.contains(`task_text`)
}

// Check if filter is focused
App.filter_focused = () => {
  return document.activeElement === DOM.el(`#filter`)
}

// Filter tasks
App.do_filter = () => {
  let value = DOM.el(`#filter`).value.trim().toLowerCase()
  let words = value.split(` `).filter(x => x !== ``)

  for (let task of App.tasks) {
    let el = DOM.el(`#task_id_${task.id}`)
    let text = task.text.toLowerCase()
    let info = DOM.el(`.task_info`, el).textContent.toLowerCase()
    let match = words.every(x => text.includes(x) || info.includes(x))

    if (match) {
      el.classList.remove(`hidden`)
    }
    else {
      el.classList.add(`hidden`)
    }
  }
}

// Clear the filter
App.clear_filter = () => {
  DOM.el(`#filter`).value = ``
  App.do_filter()
}

// Set a task's header info
App.set_info = (el, task) => {
  if (task.text) {
    el.textContent = App.nice_date(task.date)
  }
  else {
    el.textContent = `Empty Task`
  }
}

// Toggle done checkbox
App.toggle_check = (e, id) => {
  let check = e.target.closest(`.task_check`)
  let task = App.get_task_by_id(id)
  task.done = check.checked
  App.save_tasks()
}

// Sort tags based on state and date
App.sort_tasks = () => {
  App.tasks.sort((a, b) => {
    if (b.done === a.done) {
      return b.date > a.date ? -1 : 1
    }
    else {
      return b.done - a.done
    }
  })
}

// Setup backup
App.setup_backup = () => {
  App.lock_backup = App.create_debouncer(() => {
    App.backup_locked = false
  }, 1234)
}

// Backup tasks
App.backup_tasks = () => {
  if (App.backup_locked) {
    App.lock_backup()
    return
  }

  App.tasks_backup = App.tasks.slice(0)
  App.backup_locked = true
  App.lock_backup()
}

// Restore tasks from backup
App.undo_remove = () => {
  if (App.tasks_backup) {
    App.tasks = App.tasks_backup.slice(0)
    App.tasks_backup = undefined
    App.save_tasks()
    App.show_tasks()
  }
}

App.check_important = (task) => {
  let important = false
  let text = DOM.el(`.task_text`, DOM.el(`#task_id_${task.id}`))

  if (text.value.trim().endsWith(`!`)) {
    let check = DOM.el(`.task_check`, DOM.el(`#task_id_${task.id}`))

    if (!check.checked) {
      important = true
    }
  }

  if (important) {
    text.classList.add(`important`)
  }
  else {
    text.classList.remove(`important`)
  }
}

App.init()
