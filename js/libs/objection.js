// Objection v1.0
const Objection = {}
Objection.assigner = `=`
Objection.separator = `;`
Objection.spacing = true

// Parse an objection type string into a js object
Objection.parse = (str, args = {}) => {
  args = Objection.def_args(args)
  let obj = {}

  for (let item of Objection.split(str, args.separator)) {
    let [key, value] = Objection.split(item, args.assigner)

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
Objection.stringify = (obj, args = {}) => {
  args = Objection.def_args(args)
  let items = []

  for (let key in obj) {
    let property

    if (args.spacing) {
      property = `${key} ${args.assigner} ${obj[key]}`
    }
    else {
      property = `${key}${args.assigner}${obj[key]}`
    }

    items.push(property)
  }

  let separator

  if (args.spacing) {
    separator = ` ${args.separator} `
  }
  else {
    separator = args.separator
  }

  let str = items.join(separator)
  return str
}

// Split util
Objection.split = (str, char) => {
  return str.split(char).map(x => x.trim())
}

// Fill args object
Objection.def_args = (args) => {
  let def_args = {
    assigner: Objection.assigner,
    separator: Objection.separator,
    spacing: Objection.spacing,
  }

  return Object.assign(def_args, args)
}