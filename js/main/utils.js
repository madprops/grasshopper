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
  browser.tabs.create({url: url, active: close})

  if (close) {
    window.close()
  }
}

// Centralized function to get localStorage objects
App.get_local_storage = function (ls_name) {
  let obj

  if (localStorage[ls_name]) {
    try {
      obj = JSON.parse(localStorage.getItem(ls_name))
    } catch (err) {
      localStorage.removeItem(ls_name)
      obj = null
    }
  } else {
    obj = null
  }

  return obj
}

// Centralized function to save localStorage objects
App.save_local_storage = function (ls_name, obj) {
  localStorage.setItem(ls_name, JSON.stringify(obj))
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

// Get hours diff between from now
App.get_hours = function (hours) {
  return (Date.now() - hours) / 1000 / 60 / 60
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