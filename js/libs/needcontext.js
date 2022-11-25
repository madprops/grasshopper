// needcontext v2.0

// Main object
const NeedContext = {}
NeedContext.created = false

// Overridable function to perform after show
NeedContext.after_show = function () {}

// Overridable function to perform after hide
NeedContext.after_hide = function () {}

// Set defaults
NeedContext.set_defaults = function () {
  NeedContext.open = false
  NeedContext.keydown = false
  NeedContext.mousedown = false
  NeedContext.first_mousedown = false
  NeedContext.last_x = 0
  NeedContext.last_y = 0
}

// Filter from keyboard input
NeedContext.filter = function (key) {
  let selected = false

  for (let [i, item] of NeedContext.items.entries()) {
    if (item.separator || !item.text.toLowerCase().startsWith(key)) {
      item.element.classList.add("needcontext-hidden")
    } else {
      item.element.classList.remove("needcontext-hidden")

      if (!selected) {
        NeedContext.select_item(i)
      }

      selected = true
    }
  }

  if (!selected) {
    for (let item of NeedContext.items) {
      item.element.classList.remove("needcontext-hidden")
    }

    NeedContext.select_item(0)
  }
}

// Show based on an element
NeedContext.show_on_element = function (el, items, expand = false, margin = 0) {
  let rect = el.getBoundingClientRect()
  NeedContext.show(rect.left, rect.top + margin, items)

  if (expand) {
    document.querySelector("#needcontext-container").style.minWidth = `${el.clientWidth}px`
  }
}

// Show the menu
NeedContext.show = function (x, y, items) {
  if (!NeedContext.created) {
    NeedContext.create()
  }

  NeedContext.hide()

  items = items.slice(0)
  let selected_index = 0
  let c = NeedContext.container
  c.innerHTML = ""
  let index = 0
  
  for (let item of items) {
    let el = document.createElement("div")
    
    if (item.separator) {
      el.classList.add("needcontext-separator")
    } else {
      el.classList.add("needcontext-item")
      el.textContent = item.text
      el.dataset.index = index
      item.index = index
  
      if (item.title) {
        el.title = item.title
      }
  
      if (item.selected) {
        selected_index = index
      }
  
      el.addEventListener("mouseenter", function () {
        NeedContext.select_item(parseInt(el.dataset.index))
      })

      index += 1
    }

    item.element = el
    c.append(el)
  }

  NeedContext.main.classList.remove("needcontext-hidden")
  
  if (y < 5) {
    y = 5
  }

  if (x < 5) {
    x = 5
  }

  if ((y + c.offsetHeight) + 5 > document.body.clientHeight) {
    y = document.body.clientHeight - c.offsetHeight - 5
  }

  if ((x + c.offsetWidth) + 5 > document.body.clientWidth) {
    x = document.body.clientWidth - c.offsetWidth - 5
  }

  NeedContext.last_x = x
  NeedContext.last_y = y

  c.style.left = `${x}px`
  c.style.top = `${y}px`

  document.querySelector("#needcontext-container").style.minWidth = "unset"

  NeedContext.items = items
  NeedContext.select_item(selected_index)
  NeedContext.open = true
  NeedContext.after_show()
}

// Hide the menu
NeedContext.hide = function () {
  if (NeedContext.open) {
    NeedContext.main.classList.add("needcontext-hidden")
    NeedContext.set_defaults()
    NeedContext.after_hide()
  }
}

// Select an item by index
NeedContext.select_item = function (index) {
  let els = Array.from(document.querySelectorAll(".needcontext-item"))

  for (let [i, el] of els.entries()) {
    if (i === index) {
      el.classList.add("needcontext-item-selected")
    } else {
      el.classList.remove("needcontext-item-selected")
    }
  }

  NeedContext.index = index
}

// Select an item above
NeedContext.select_up = function () {
  let waypoint = false
  let first_visible

  for (let i=NeedContext.items.length-1; i>=0; i--) {
    let item = NeedContext.items[i]

    if (item.separator) {
      continue
    }

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
NeedContext.select_down = function () {
  let waypoint = false
  let first_visible

  for (let i=0; i<NeedContext.items.length; i++) {
    let item = NeedContext.items[i]

    if (item.separator) {
      continue
    }

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
NeedContext.select_action = async function (e, index = NeedContext.index) {
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
  } else if (item.items) {
    show_below(item.items)
  } else if (item.get_items) {
    let items = await item.get_items()
    show_below(items)
  }
}

// Check if item is hidden
NeedContext.is_visible = function (el) {
  return !el.classList.contains("needcontext-hidden")
}

// Prepare css and events
NeedContext.init = function () {
  let style = document.createElement("style")

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
      z-index: 2
      position: relative;
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
    }

    .needcontext-item {
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

  document.addEventListener("mousedown", function (e) {
    if (!NeedContext.open || !e.target) {
      return
    }
    
    NeedContext.first_mousedown = true

    if (e.target.closest("#needcontext-container")) {
      NeedContext.mousedown = true
    }
  })  

  document.addEventListener("mouseup", function (e) {
    if (!NeedContext.open || !e.target) {
      return
    }

    if (!e.target.closest("#needcontext-container")) {
      if (NeedContext.first_mousedown) {
        NeedContext.hide()
      }
    } else if (NeedContext.mousedown) {
      NeedContext.select_action(e)
    }

    NeedContext.mousedown = false
  })

  document.addEventListener("keydown", function (e) {
    if (!NeedContext.open) {
      return
    }

    e.stopPropagation()
    NeedContext.keydown = true
    
    if (e.key === "ArrowUp") {
      NeedContext.select_up()
    } else if (e.key === "ArrowDown") {
      NeedContext.select_down()
    }

    e.preventDefault()
  })

  document.addEventListener("keyup", function (e) {
    if (!NeedContext.open) {
      return
    }

    if (!NeedContext.keydown) {
      return
    }

    e.stopPropagation()
    NeedContext.keydown = false

    if (e.key === "Escape") {
      NeedContext.hide()
    } else if (e.key === "Enter") {
      NeedContext.select_action(e)
    } else if (e.key.match(/^[a-z0-9]{1}$/i)) {
      NeedContext.filter(e.key)
    } else if (e.key === "Backspace") {
      NeedContext.filter("")
    }

    e.preventDefault()
  })

  NeedContext.set_defaults()
}

// Create elements
NeedContext.create = function () {
  NeedContext.main = document.createElement("div")
  NeedContext.main.id = "needcontext-main" 
  NeedContext.main.classList.add("needcontext-hidden") 

  NeedContext.container = document.createElement("div")
  NeedContext.container.id = "needcontext-container"
  
  NeedContext.main.addEventListener("contextmenu", function (e) {
    e.preventDefault()
  })
  
  NeedContext.main.append(NeedContext.container)
  document.body.appendChild(NeedContext.main)
  NeedContext.created = true
}

// Start
NeedContext.init()