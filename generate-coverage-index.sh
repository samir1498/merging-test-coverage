#!/bin/bash

# Base directory containing coverage reports
coverage_dir="coverage"

# Output file for index.html
index_file="$coverage_dir/index.html"

# Function to generate link based on directory name
generate_link() {
  local dir_name="$1"
  local report_file="index.html" # Replace with actual report file name if different
  echo "<li><a href=\"$dir_name/$report_file\" style=\"text-decoration: none; color: #333;\">$dir_name Coverage</a></li>"
}

# Function to check if directory exists and has index.html
check_dir_and_report() {
  local dir_path="$1"
  if [[ -d "$dir_path" && -f "$dir_path/index.html" ]]; then
    return 0 # Directory exists and has index.html
  else
    return 1 # Directory does not exist or does not have index.html
  fi
}

# Start building index.html content
content="<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"UTF-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
  <title>Coverage Reports</title>
  <style>
    body {
      font-family: sans-serif;
      margin: 2rem;
    }
    
    h1 {
      margin-bottom: 1rem;
    }
    
    ul {
      list-style: none;
      padding: 0;
    }
    
    li {
      margin-bottom: 0.5rem;
    }
    
    a {
      text-decoration: none;
      color: #333;
    }
  </style>
</head>
<body>
  <h1>Coverage Reports</h1>
  <ul>"

# Loop through subdirectories and generate links (with directory and report check)
for dir in "$coverage_dir"/*; do
  if check_dir_and_report "$dir"; then
    dir_name=$(basename "$dir")
    content+=$(generate_link "$dir_name")
  fi
done

# Complete the index.html content
content+="
  </ul>
</body>
</html>"

# Write content to the index file
echo "$content" >"$index_file"

echo "Generated index.html file!"
