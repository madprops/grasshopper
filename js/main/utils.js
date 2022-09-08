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
App.open_tab = function (item, close = true) {
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

// Get local storage
App.get_storage = function (name, def) {
  let obj

  if (localStorage[name]) {
    try {
      obj = JSON.parse(localStorage.getItem(name))
    } catch (err) {
      localStorage.removeItem(name)
      obj = def
    }
  } else {
    obj = def
  }

  return obj
}

// Save local storage
App.save_storage = function (name, obj) {
  localStorage.setItem(name, JSON.stringify(obj))
}

// The way to format urls
App.format_url = function (url) {
  return App.remove_slashes_end(App.remove_hash(url))
}

// Remove protocol like https://
App.remove_protocol = function (url) {
  return url.replace(/^https?:\/\//, "")
}