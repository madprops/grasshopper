// Objection v1.0
const Objection = {}
Objection.assigner = `=`
Objection.separator = `;`
Objection.spacing = true

// Parse an objection type string into a js object
Objection.parse = (str) => {
  let obj = {}

  for (let item of Objection.split(str, Objection.separator)) {
    let [key, value] = Objection.split(item, Objection.assigner)

    if (!key || !value) {
      continue
    }

    if (value === `true`) {
      value = true
    }
    else if (value === `false`) {
      value = false
    }
    else if (!isNaN(value)) {
      value = Number(value)
    }

    obj[key] = value
  }

  return obj
}

// Transform a js object into an objection type string
Objection.stringify = (obj) => {
  let items = []

  for (let key in obj) {
    let property

    if (Objection.spacing) {
      property = `${key} = ${obj[key]}`
    }
    else {
      property = `${key}=${obj[key]}`
    }

    items.push(property)
  }

  let separator

  if (Objection.spacing) {
    separator = ` ${Objection.separator} `
  }
  else {
    separator = Objection.separator
  }

  let str = items.join(separator)
  return str
}

// Split util
Objection.split = (str, char) => {
  return str.split(char).map(x => x.trim())
}