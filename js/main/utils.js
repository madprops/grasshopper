App.image_extensions = [`jpg`, `jpeg`, `png`, `gif`, `webp`, `bmp`]
App.video_extensions = [`mp4`, `webm`]

App.create_debouncer = (func, delay) => {
  let timer
  let obj = {}

  function clear () {
    clearTimeout(timer)
  }

  function run (...args) {
    func(...args)
  }

  obj.call = (...args) => {
    clear()

    timer = setTimeout(() => {
      run(...args)
    }, delay)
  }

  obj.now = (...args) => {
    clear()
    run(...args)
  }

  obj.cancel = () => {
    clear()
  }

  return obj
}

App.remove_protocol = (url) => {
  return url.replace(/^https?:\/\//, ``)
}

App.copy_to_clipboard = (text, what = ``) => {
  navigator.clipboard.writeText(text)

  if (what) {
    App.show_feedback(`${what} copied to clipboard`)
  }
}

App.plural = (n, singular, plural) => {
  if (n === 1) {
    return singular
  }
  else {
    return plural
  }
}

App.get_hostname = (url) => {
  let url_obj

  try {
    url_obj = new URL(url)
  }
  catch (err) {
    return ``
  }

  return url_obj.hostname
}

App.urls_equal = (u1, u2) => {
  return App.remove_slashes_end(u1) === App.remove_slashes_end(u2)
}

App.remove_slashes_end = (s) => {
  return s.replace(/\/+$/g, ``)
}

App.remove_hash = (url) => {
  return url.split(`#`)[0]
}

App.format_url = (url) => {
  return App.remove_slashes_end(App.remove_hash(url))
}

App.capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

App.nice_date = (date = Date.now()) => {
  return dateFormat(date, `dd/mmm/yy | h:MM tt`)
}

App.is_image = (src) => {
  let extension = App.get_extension(src).toLowerCase()
  return extension && App.image_extensions.includes(extension)
}

App.is_video = (src) => {
  let extension = App.get_extension(src).toLowerCase()
  return extension && App.video_extensions.includes(extension)
}

App.is_url = (s) => {
  return s.startsWith(`http://`) || s.startsWith(`https://`)
}

App.get_extension = (s) => {
  if (App.is_url(s)) {
    let u = new URL(s)
    let url = u.origin + u.pathname
    let url_2 = url.split(`//`).slice(1).join(`//`)
    let matches = url_2.match(/\/.*\.(\w+)(?=$|[#?])/)

    if (matches) {
      return matches[1]
    }
  }
  else {
    let matches = s.match(/\.(\w+)(?=$|[#?])/)

    if (matches) {
      return matches[1]
    }
  }

  return ``
}

App.get_template = (id) => {
  let template = DOM.el(`#template_${id}`)

  if (template) {
    return template.innerHTML.trim()
  }
}

App.log = (message, mode = `normal`) => {
  if (mode === `error`) {
    console.error(message)
  }
  else {
    console.info(`🟢 ${message}`)
  }
}

App.find_duplicates = (objects, property) => {
  let frequency_map = objects.reduce((map, obj) => {
    map[obj[property]] = (map[obj[property]] || 0) + 1
    return map
  }, {})

  return objects.filter(obj => frequency_map[obj[property]] > 1)
}

App.get_excess = (objects, property) => {
  let items = {}
  let excess = []

  for (let obj of objects) {
    if (items[obj[property]]) {
      excess.push(obj)
    }
    else {
      items[obj[property]] = obj
    }
  }

  return excess
}

App.element_is_visible = (el) => {
  let container_rect = el.parentElement.getBoundingClientRect()
  let rect = el.getBoundingClientRect()
  let top_visible = rect.top >= container_rect.top - 2
  let bottom_visible = rect.bottom <= container_rect.bottom + 2
  return top_visible && bottom_visible
}

App.focused_with_class = (cls) => {
  return document.activeElement.classList.contains(cls)
}

App.reload_extension = () => {
  browser.runtime.reload()
}

App.remove_spaces = (text) => {
  return text.replace(/\s/g, ``)
}

App.string_similarity = (s1, s2) => {
  let longer = s1
  let shorter = s2

  if (s1.length < s2.length) {
    longer = s2
    shorter = s1
  }

  let longer_length = longer.length

  if (longer_length == 0) {
    return 1.0
  }

  return (longer_length - App.string_similarity_distance(longer, shorter)) / parseFloat(longer_length)
}

App.string_similarity_distance = (s1, s2) => {
  s1 = s1.toLowerCase()
  s2 = s2.toLowerCase()

  let costs = new Array()

  for (let i=0; i<=s1.length; i++) {
    let last_value = i

    for (let j = 0; j <= s2.length; j++) {
      if (i == 0) {
        costs[j] = j
      }
      else {
        if (j > 0) {
          let new_value = costs[j - 1]

          if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
            new_value = Math.min(Math.min(new_value, last_value),
              costs[j]) + 1
          }

          costs[j - 1] = last_value
          last_value = new_value
        }
      }
    }

    if (i > 0) {
      costs[s2.length] = last_value
    }
  }

  return costs[s2.length]
}

App.single_space = (s) => {
  return s.replace(/\s+/g, ` `).trim()
}

App.wheel_direction = (e) => {
  if (e.deltaY > 0) {
    return `down`
  }
  else {
    return `up`
  }
}

App.single_linebreak = (s) => {
  return s.replace(/[\n\r]+/g, `\n`).replace(/ +/g, ` `).trim()
}

App.contains_number = (str) => {
  return /\d/.test(str)
}

App.escape_regex = (s) => {
  return s.replace(/[^A-Za-z0-9]/g, `\\$&`)
}

App.get_favicon_url = (url) => {
  return `https://www.google.com/s2/favicons?sz=${App.favicon_size}&domain=${url}`
}