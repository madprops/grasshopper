#!/usr/bin/env ruby

def find_duplicate_functions(file_path)
  content = File.read(file_path)
  function_pattern = /App\.(\w+)\s*=\s*\(.*?\)\s*=>/
  functions = Hash.new(0)

  content.scan(function_pattern) do |match|
    function_name = match[0]
    functions[function_name] += 1
  end

  duplicates = functions.select { |_, count| count > 1 }
  if duplicates.empty?
    puts "No duplicate functions found."
  else
    puts "Duplicate functions found:"
    duplicates.each { |name, count| puts "#{name}: #{count} times" }
  end
end

file_path = "/home/yo/code/grasshopper/js/bundle.main.js"
find_duplicate_functions(file_path)