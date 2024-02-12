#!/bin/zsh

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed. Please install it first."
    exit 1
fi

# Check if filenames are provided as arguments
if [ "$#" -eq 0 ]; then
    echo "Usage: $0 <input_image1> <input_image2> ..."
    exit 1
fi

# Output directory
output_dir="resized_images"

# Create output directory if it doesn't exist
mkdir -p "$output_dir"

# List of sizes to generate
sizes=("1280x800")

# Loop through each provided filename
for input_image in "$@"; do
    # Check if the file exists
    if [ ! -f "$input_image" ]; then
        echo "Error: File '$input_image' not found."
        continue
    fi
    
    # Loop through each size and create resized images
    for size in "${sizes[@]}"; do
        output_file="${output_dir}/$(basename "$input_image" .png)-${size}.png"
        
        # Resize the image
        convert "$input_image" -resize "${size}!" "$output_file"
        echo "Resized image to $size: $output_file"
    done
done

echo "All images resized successfully!"

