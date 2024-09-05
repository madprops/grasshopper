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

  if not duplicates.empty?
    duplicates.each { |name, count| puts "#{name}: #{count} times" }
  end
end

file_path = "js/bundle.main.js"
find_duplicate_functions(file_path)