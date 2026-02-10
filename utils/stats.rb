#!/usr/bin/env ruby

$total_lines = 0
$total_size = 0
$total_files = 0
$separator = "\e[36m | \e[0m"

def get_lines(path)
  lines = 0
  File.foreach(path) { lines += 1 }
  return lines
end

def get_size(path)
  return File.size(path) / 1024.0
end

def count_subdir(path)
  lines = 0
  size = 0
  files = 0

  Dir.chdir(path) do
    Dir.glob("*").each do |file|
      lines += get_lines(file)
      size += get_size(file)
      files += 1
    end
  end

  return lines, size.round(1), files
end

def count_file(path)
  lines = get_lines(path)
  size = get_size(path)
  return lines, size.round(1)
end

def print_files(files)
  word = files == 1 ? "file" : "files"
  return "#{files} #{word}"
end

def show(path, name = nil)
  is_subdir = path.split(".").length == 1

  if is_subdir
    lines, size, files = count_subdir(path)
  else
    lines, size = count_file(path)
    files = 1
  end

  $total_lines += lines
  $total_size += size
  $total_files += files

  if name == nil
    name = path
  end

  msg = [
    "\e[34m#{name}\e[0m",
    "#{lines} lines",
    "#{size} KB",
  ]

  if files > 1
    msg.push("#{print_files(files)}")
  end

  puts msg.join($separator)
end

def total
  msg = [
    "\e[32mTotal\e[0m",
    "#{$total_lines} lines",
    "#{$total_size.round(1)} KB",
    "#{print_files($total_files)}",
  ]

  puts msg.join($separator)
end

def intro
  puts "\e[32mGrasshopper Stats\e[0m 🦗\n"
end

intro()

show("js/main")
show("js/libs")
show("js/app.js", "app.js")
show("js/init.js", "init.js")
show("js/content.js", "content.js")
show("js/overrides.js", "overrides.js")
show("background")
show("main.html")
show("more/signals", "signals")
show("utils")
show("css")

total()