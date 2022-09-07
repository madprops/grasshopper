// Remove end char
App.remove_slashes = function (s) {
  return App.remove_slashes_end(App.remove_slashes_start(s))
}

// Remove slashes from start
App.remove_slashes_start = function (s) {
  return s.replace(/^\/+/g, "")
}

// Remove slashes from ending
App.remove_slashes_end = function (s) {
  return s.replace(/\/+$/g, "")
}

// Open a new tab with a url
App.open_tab = async function (item, close = true) {
  App.add_recent(item)
  browser.tabs.create({url: item.url, active: close})

  if (close) {
    window.close()
  }
}

// Select a single element
App.el = function (query, root = document) {
  return root.querySelector(query)
}

// Select an array of elements
App.els = function (query, root = document) {
  return Array.from(root.querySelectorAll(query))
}

// Print a message
App.log = function (s) {
  console.log(s)
}

// Centralized function to create debouncers
App.create_debouncer = function (func, delay) {
  return (function () {
    let timer

    return function (...args) {
      clearTimeout(timer)

      timer = setTimeout(function () {
        func(...args)
      }, delay)
    }
  })()
}

// Locale number
App.locale_number = function (n) {
  n = parseInt(n)
  return n.toLocaleString()
}

// Only numbers
App.only_numbers = function (s) {
  s = s.toString()
  return parseInt(s.replace(/\D/g, ""))
}

// Create an html element
App.create = function (type, classes = "", id = "") {
  let el = document.createElement(type)

  if (classes) {
    let classlist = classes.split(" ").filter(x => x != "")
  
    for (let cls of classlist) {
      el.classList.add(cls)
    }
  }

  if (id) {
    el.id = id
  }

  return el
}

// Add an event listener
App.ev = function (element, action, callback, extra) {
  element.addEventListener(action, callback, extra)
}

// Remove hash from url
App.remove_hash = function (url) {
  return url.split("#")[0]
}

// Get storage
App.get_storage = async function (name, def) {
  App.log(`Getting: ${name}`)
  let ans = await browser.storage.sync.get(name) 

  if (ans[name]) {
    return ans[name]
  } else {
    return def
  }
}

// Save storage
App.save_storage = async function (name, value) {
  App.log(`Saving: ${name}`)
  let o = {}
  o[name] = value
  await browser.storage.sync.set(o)
}

// Copy text to the clipboard
App.copy_to_clipboard = function (text) {
  navigator.clipboard.writeText(text)
}

// Remove duplicate objects
App.remove_duplicates = function (list) {
  let urls = []
  let new_list = []

  for (let item of list) {
    if (!urls.includes(item.url)) {
      new_list.push(item)
      urls.push(item.url)
    }
  }

  return new_list
}

// The way to format urls
App.format_url = function (url) {
  return App.remove_slashes_end(App.remove_hash(url))
}

// Turn object into an easily editable list
App.to_easy_data = function (list) {
  let items = []

  for (let item of list) {
    let props = []
    props.push(`title: ${item.title}`)
    props.push(`url: ${item.url}`)
    items.push(props.join("\n"))
  }

  return items.join("\n\n")
}

// Turn easy data into an object
App.from_easy_data = function (datastring) {
  let s = datastring.trim()

  if (!s) {
    return []
  }

  let items = datastring.split("\n\n")
  let obs = []

  for (let item of items) {
    let it = item.trim()

    if (!it) {
      continue
    }

    let o = {}

    for (let line of it.split("\n")) {
      let [key, ...value] = line.split(":")
      key = key.trim()
      value = value.join(":").trim()
      o[key] = value
    }

    obs.push(o)
  }

  return obs
}