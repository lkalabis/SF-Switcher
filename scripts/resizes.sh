#!/bin/zsh

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed. Please install it first."
    exit 1
fi

# Input image file
input_image="Logo2.png"

# Output directory
output_dir="resized_images_logo2"

# Create output directory if it doesn't exist
mkdir -p "$output_dir"

# List of sizes to generate
sizes=("16x16" "32x32" "48x48" "128x128")

# Loop through each size and create resized images
for size in "${sizes[@]}"; do
    output_file="${output_dir}/icon-${size%*x*}.png"
    
    # Resize the image
    # convert "$input_image" -resize "$size" "$output_file"
    convert "$input_image" -resize "${size}!" "$output_file"
    echo "Resized image to $size: $output_file"
done

echo "All images resized successfully!"

