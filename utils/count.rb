#!/usr/bin/env ruby

def get_lines(path)
  File.open(path, "r") do |file|
    return file.readlines.size
  end
end

def get_size(path)
  File.open(path, "r") do |file|
    return File.size(file) / 1024.0
  end
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

$total_lines = 0
$total_size = 0
$total_files = 0

def show(path)
  if path.split(".").length == 1
    lines, size, files = count_subdir(path)
  else
    lines, size = count_file(path)
    files = 1
  end

  $total_lines += lines
  $total_size += size
  $total_files += files

  msg = "\e[34m#{path}:\e[0m #{lines} lines | #{size} KB"

  if files > 1
    msg += " | #{print_files(files)}"
  end

  puts msg
end

show("js/main")
show("js/libs")
show("js/app.js")
show("js/init.js")
show("main.html")
show("css/style.css")
show("utils")

puts "\e[32mTOTAL:\e[0m #{$total_lines} lines | #{$total_size} KB | #{print_files($total_files)}"