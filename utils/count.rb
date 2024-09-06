#!/usr/bin/env ruby

# Get total line numbers of a file
def get_lines(file_path)
  total_lines = 0

  File.open(file_path, "r") do |file|
    total_lines += file.readlines.size
  end

  total_lines
end

# Change directory to subdir and get total line numbers of all files
def subdir_lines(subdir_path, ext)
  total_lines = 0

  Dir.chdir(subdir_path) do
    Dir.glob("*.#{ext}").each do |file|
      total_lines += get_lines(file) if File.file?(file)
    end
  end

  total_lines
end

main_path = "js/main"
libs_path = "js/libs"
app_file = "js/app.js"
main_file = "main.html"
css_file = "css/style.css"

lines_main_path = subdir_lines(main_path, "js")
lines_libs_path = subdir_lines(libs_path, "js")
lines_app_file = get_lines(app_file)
lines_main_file = get_lines(main_file)
lines_css_file = get_lines(css_file)

puts "#{main_path}: #{lines_main_path}"
puts "#{libs_path}: #{lines_libs_path}"
puts "#{app_file}: #{lines_app_file}"
puts "#{main_file}: #{lines_main_file}"
puts "#{css_file}: #{lines_css_file}"

# Sum all lines
total_lines = lines_main_path + lines_libs_path +
lines_app_file + lines_main_file + lines_css_file

puts "TOTAL: #{total_lines}"