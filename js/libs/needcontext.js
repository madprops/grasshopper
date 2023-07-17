// NeedContext v3.0

// Main object
const NeedContext = {}
NeedContext.created = false

// Overridable function to perform after show
NeedContext.after_show = () => {}

// Overridable function to perform after hide
NeedContext.after_hide = () => {}

// Minimum menu width and height
NeedContext.min_width = `25px`
NeedContext.min_height = `25px`

// Set defaults
NeedContext.set_defaults = () => {
  NeedContext.open = false
  NeedContext.keydown = false
  NeedContext.mousedown = false
  NeedContext.first_mousedown = false
  NeedContext.last_x = 0
  NeedContext.last_y = 0
}

// Filter from keyboard input
NeedContext.do_filter = () => {
  let value = NeedContext.filter.value.toLowerCase()
  value = NeedContext.remove_spaces(value)
  let selected = false

  for (let el of document.querySelectorAll(`.needcontext-separator`)) {
    if (value) {
      el.classList.add(`needcontext-hidden`)
    }
    else {
      el.classList.remove(`needcontext-hidden`)
    }
  }

  for (let el of document.querySelectorAll(`.needcontext-item`)) {
    let text = el.textContent.toLowerCase()
    text = NeedContext.remove_spaces(text)

    if (text.includes(value)) {
      el.classList.remove(`needcontext-hidden`)

      if (!selected) {
        NeedContext.select_item(parseInt(el.dataset.index))
        selected = true
      }
    }
    else {
      el.classList.add(`needcontext-hidden`)
    }
  }
}

// Show based on an element
NeedContext.show_on_element = (el, items, expand = false, margin = 0) => {
  let rect = el.getBoundingClientRect()
  NeedContext.show(rect.left, rect.top + margin, items)

  if (expand) {
    document.querySelector(`#needcontext-container`).style.minWidth = `${el.clientWidth}px`
  }
}

// Show the menu
NeedContext.show = (x, y, items) => {
  if (!NeedContext.created) {
    NeedContext.create()
  }

  NeedContext.hide()

  items = items.slice(0)
  let selected_index = 0
  let c = NeedContext.container
  c.innerHTML = ``
  let index = 0
  NeedContext.items = []

  for (let item of items) {
    let el = document.createElement(`div`)
    el.classList.add(`needcontext-item`)

    if (item.separator) {
      el.classList.add(`needcontext-separator`)
    }
    else {
      el.classList.add(`needcontext-normal`)
      el.textContent = item.text
      el.dataset.index = index
      item.index = index

      if (item.title) {
        el.title = item.title
      }

      if (item.selected) {
        selected_index = index
      }

      el.addEventListener(`mousemove`, () => {
        let index = parseInt(el.dataset.index)

        if (NeedContext.index !== index) {
          NeedContext.select_item(index)
        }
      })

      index += 1
      NeedContext.items.push(item)
    }

    item.element = el
    c.append(el)
  }

  NeedContext.main.classList.remove(`needcontext-hidden`)

  if (y < 5) {
    y = 5
  }

  if (x < 5) {
    x = 5
  }

  if ((y + c.offsetHeight) + 5 > window.innerHeight) {
    y = window.innerHeight - c.offsetHeight - 5
  }

  if ((x + c.offsetWidth) + 5 > window.innerWidth) {
    x = window.innerWidth - c.offsetWidth - 5
  }

  NeedContext.last_x = x
  NeedContext.last_y = y

  x = Math.max(x, 0)
  y = Math.max(y, 0)

  c.style.left = `${x}px`
  c.style.top = `${y}px`

  NeedContext.filter.value = ``
  NeedContext.filter.focus()
  let container = document.querySelector(`#needcontext-container`)
  container.style.minWidth = NeedContext.min_width
  container.style.minHeight = NeedContext.min_height
  NeedContext.select_item(selected_index)
  NeedContext.open = true
  NeedContext.after_show()
}

// Hide the menu
NeedContext.hide = () => {
  if (NeedContext.open) {
    NeedContext.main.classList.add(`needcontext-hidden`)
    NeedContext.set_defaults()
    NeedContext.after_hide()
  }
}

// Select an item by index
NeedContext.select_item = (index) => {
  let els = Array.from(document.querySelectorAll(`.needcontext-normal`))

  for (let [i, el] of els.entries()) {
    if (i === index) {
      el.classList.add(`needcontext-item-selected`)
    }
    else {
      el.classList.remove(`needcontext-item-selected`)
    }
  }

  NeedContext.index = index
}

// Select an item above
NeedContext.select_up = () => {
  let waypoint = false
  let first_visible

  for (let i=NeedContext.items.length-1; i>=0; i--) {
    let item = NeedContext.items[i]

    if (!NeedContext.is_visible(item.element)) {
      continue
    }

    if (first_visible === undefined) {
      first_visible = item.index
    }

    if (waypoint) {
      NeedContext.select_item(item.index)
      return
    }

    if (item.index === NeedContext.index) {
      waypoint = true
    }
  }

  NeedContext.select_item(first_visible)
}

// Select an item below
NeedContext.select_down = () => {
  let waypoint = false
  let first_visible

  for (let i=0; i<NeedContext.items.length; i++) {
    let item = NeedContext.items[i]

    if (!NeedContext.is_visible(item.element)) {
      continue
    }

    if (first_visible === undefined) {
      first_visible = item.index
    }

    if (waypoint) {
      NeedContext.select_item(item.index)
      return
    }

    if (item.index === NeedContext.index) {
      waypoint = true
    }
  }

  NeedContext.select_item(first_visible)
}

// Do the selected action
NeedContext.select_action = async (e, index = NeedContext.index) => {
  let x = NeedContext.last_x
  let y = NeedContext.last_y
  let item = NeedContext.items[index]

  function show_below (items) {
    if (e.clientY) {
      y = e.clientY
    }

    NeedContext.show(x, y, items)
  }

  NeedContext.hide()

  if (item.action) {
    item.action(e)
  }
  else if (item.items) {
    show_below(item.items)
  }
  else if (item.get_items) {
    let items = await item.get_items()
    show_below(items)
  }
}

// Check if item is hidden
NeedContext.is_visible = (el) => {
  return !el.classList.contains(`needcontext-hidden`)
}

// Remove all spaces from text
NeedContext.remove_spaces = (text) => {
  return text.replace(/[\s-]+/g, ``)
}

// Prepare css and events
NeedContext.init = () => {
  let style = document.createElement(`style`)

  let css = `
    #needcontext-main {
      position: fixed;
      z-index: 999999999;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    .needcontext-hidden {
      display: none;
    }

    #needcontext-container {
      z-index: 2;
      position: absolute;
      background-color: white;
      color: black;
      font-size: 16px;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      gap: 3px;
      user-select: none;
      border: 1px solid #2B2F39;
      border-radius: 5px;
      cursor: pointer;
      padding-top: 6px;
      padding-bottom: 6px;
      max-height: 80vh;
      overflow: auto;
      text-align: left;
      max-width: 98%;
    }

    #needcontext-filter {
      opacity: 0;
    }

    .needcontext-item {
      white-space: nowrap;
    }

    .needcontext-normal {
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 3px;
      padding-bottom: 3px;
    }

    .needcontext-separator {
      border-top: 1px solid currentColor;
      margin-left: 10px;
      margin-right: 10px;
      margin-top: 3px;
      margin-bottom: 3px;
      opacity: 0.7;
    }

    .needcontext-item-selected {
      background-color: rgba(0, 0, 0, 0.18);
    }
  `

  style.innerText = css
  document.head.appendChild(style)

  document.addEventListener(`mousedown`, (e) => {
    if (!NeedContext.open || !e.target) {
      return
    }

    NeedContext.first_mousedown = true

    if (e.target.closest(`#needcontext-container`)) {
      NeedContext.mousedown = true
    }
  })

  document.addEventListener(`mouseup`, (e) => {
    if (!NeedContext.open || !e.target) {
      return
    }

    if (!e.target.closest(`#needcontext-container`)) {
      if (NeedContext.first_mousedown) {
        NeedContext.hide()
      }
    }
    else if (NeedContext.mousedown) {
      NeedContext.select_action(e)
    }

    NeedContext.mousedown = false
  })

  document.addEventListener(`keydown`, (e) => {
    if (!NeedContext.open) {
      return
    }

    NeedContext.keydown = true

    if (e.key === `ArrowUp`) {
      NeedContext.select_up()
      e.preventDefault()
    }
    else if (e.key === `ArrowDown`) {
      NeedContext.select_down()
      e.preventDefault()
    }
  })

  document.addEventListener(`keyup`, (e) => {
    if (!NeedContext.open) {
      return
    }

    if (!NeedContext.keydown) {
      return
    }

    e.stopPropagation()
    NeedContext.keydown = false

    if (e.key === `Escape`) {
      NeedContext.hide()
      e.preventDefault()
    }
    else if (e.key === `Enter`) {
      NeedContext.select_action(e)
      e.preventDefault()
    }
    else if (e.key === `Backspace`) {
      NeedContext.filter.value = ``
      NeedContext.do_filter()
      e.preventDefault()
    }
  })

  NeedContext.set_defaults()
}

// Create elements
NeedContext.create = () => {
  NeedContext.main = document.createElement(`div`)
  NeedContext.main.id = `needcontext-main`
  NeedContext.main.classList.add(`needcontext-hidden`)
  NeedContext.container = document.createElement(`div`)
  NeedContext.container.id = `needcontext-container`
  NeedContext.filter = document.createElement(`input`)
  NeedContext.filter.id = `needcontext-filter`
  NeedContext.filter.type = `text`
  NeedContext.filter.autocomplete = `off`
  NeedContext.filter.spellcheck = false
  NeedContext.filter.placeholder = `Filter`

  NeedContext.filter.addEventListener(`input`, (e) => {
    NeedContext.do_filter()
  })

  NeedContext.main.addEventListener(`contextmenu`, (e) => {
    e.preventDefault()
  })

  NeedContext.main.append(NeedContext.filter)
  NeedContext.main.append(NeedContext.container)
  document.body.appendChild(NeedContext.main)
  NeedContext.created = true
}

// Start
NeedContext.init()