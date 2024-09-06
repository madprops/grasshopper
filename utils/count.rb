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

def count_subdir(path, ext)
  lines = 0
  size = 0

  Dir.chdir(path) do
    Dir.glob("*.#{ext}").each do |file|
      lines += get_lines(file) if File.file?(file)
      size += get_size(file) if File.file?(file)
    end
  end

  return lines, size.round(1)
end

def count_file(path)
  lines = get_lines(path)
  size = get_size(path)
  return lines, size.round(1)
end

main_path = "js/main"
libs_path = "js/libs"
app_file = "js/app.js"
init_file = "js/init.js"
main_file = "main.html"
css_file = "css/style.css"

lines_main_path, size_main_path = count_subdir(main_path, "js")
lines_libs_path, size_libs_path = count_subdir(libs_path, "js")
lines_app_file, size_app_file = count_file(app_file)
lines_init_file, size_init_file = count_file(init_file)
lines_main_file, size_main_file = count_file(main_file)
lines_css_file, size_css_file = count_file(css_file)

puts "#{main_path}: #{lines_main_path} lines | #{size_main_path} KB"
puts "#{libs_path}: #{lines_libs_path} lines | #{size_libs_path} KB"
puts "app.js: #{lines_app_file} lines | #{size_app_file} KB"
puts "init.js: #{lines_init_file} lines| #{size_init_file} KB"
puts "main.html: #{lines_main_file} lines| #{size_main_file} KB"
puts "style.css: #{lines_css_file} lines | #{size_css_file} KB"

total_lines = lines_main_path + lines_libs_path +
lines_app_file + lines_init_file + lines_main_file + lines_css_file

total_size = size_main_path + size_libs_path + size_app_file +
size_init_file + size_main_file + size_css_file

puts "TOTAL: #{total_lines} lines | #{total_size} KB"