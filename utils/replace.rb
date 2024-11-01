#!/usr/bin/env ruby
require 'fileutils'

# Check if the correct number of arguments is provided
if ARGV.length != 2
  puts "Usage: ruby replace_script.rb <search_string> <replace_string>"
  exit
end

# Retrieve command-line arguments
search_string = ARGV[0]
replace_string = ARGV[1]

# Iterate over all JavaScript files in the directory
Dir.glob(File.join('js/main', '**', '*.js')).each do |file_path|
  # Read the file content
  file_content = File.read(file_path)

  # Replace the search_string with the replace_string
  updated_content = file_content.gsub(search_string, replace_string)

  # Write the updated content back to the file
  File.write(file_path, updated_content)

  puts "Updated: #{file_path}"
end