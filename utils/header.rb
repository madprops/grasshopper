#!/usr/bin/env ruby
require "fileutils"

# Define the directory containing the JavaScript files
directory = "js/main"

# Ensure the directory exists
unless Dir.exist?(directory)
  puts "Directory does not exist."
  exit
end

# Define the content to be added at the top of each file
new_header = "/* global App, DOM, browser, dateFormat, Addlist, AColorPicker, Menubutton, jdenticon, ColorLib, NiceGesture, NeedContext */"

# Iterate over each JavaScript file in the directory
Dir.glob(File.join(directory, "*.js")).each do |file|
  # Read the original content of the file
  original_content = File.read(file)

  # Split the content into lines
  lines = original_content.lines

  # Check if the first line is a comment and remove it
  if lines[0].strip.start_with?("/*")
    lines.shift
  end

  # Remove leading empty lines
  lines.shift while lines.first.strip.empty?

  # Prepend the new header
  lines.unshift(new_header + "\n\n")

  # Join the lines back into a single string
  new_content = lines.join

  # Write the new content back to the file
  File.write(file, new_content)

  puts "Updated file: #{file}"
end

puts "All JavaScript files have been updated."