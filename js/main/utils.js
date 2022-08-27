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
  if (item.type === "favorites" || App.config.favorite_on_visit) {    
    App.add_favorite(item)
  }

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

// Check if an element is overflowing
App.is_overflowing = function (el) {
  return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
}