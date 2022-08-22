// Escape non alphanumeric chars
App.escape_special_chars = function (s) {
  return s.replace(/[^A-Za-z0-9]/g, "\\$&")
}

// Remove root url from the start of a url
App.pathname = function (url) {
  return new URL(url).pathname.replace(/\/$/, "").replace(/^\//, "")
}

// Get first part of a url
App.get_unit = function (curl) {
  return curl.split("/")[0].split("?")[0].split("#")[0]
}

// Open a new tab with a url
App.open_tab = function (url, close = true) {
  // Move favorite to first position
  if (App.mode === "favorites") {
    let item = App.get_favorite_by_url(url)
    
    if (item) {
      if (item[0] > 0) {
        App.move_in_array(App.favorites, item[0], 0)
        App.save_favorites()
      }
    }
  }

  browser.tabs.create({url: url, active: close})

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

// Count occurences of a character
App.count = function (s, b) {
  return s.split(b).length
}

// Get singular or plural
App.plural = function (n, singular, plural) {
  if (n === 1) {
    return `${n} ${singular}`
  } else {
    return `${n} ${plural}`
  }
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

// Move an item in an array
App.move_in_array = function (arr, from, to) {
  arr.splice(to, 0, arr.splice(from, 1)[0])
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

// Nice json string
App.nice_json = function (json) {
  return JSON.stringify(json, undefined, 2)
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