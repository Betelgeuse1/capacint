# Using defusedxml to avoid xml attacks
from defusedxml.ElementTree import parse
from xml.etree.ElementTree import Element, ElementTree
from numpy import array as np_array
from PIL import Image
import sys

def clean(files):
    pass # Run a command that will suppress the tmp folder used 
    # as the ppm files storage

# Merge all the svgs files into a unique svg
def merge_svgs(files):
    xmls = [parse(filename) for filename in files]

    new_root = Element('svg')
    w, h = 0, 0
    for document in xmls:
        root = document.getroot()

        tw, th = root.get('width'), root.get('height')
        w, h = max(w, tw), max(h, th)

        childs = root.findall('./')
        new_root.extend(childs)

    new_root.set('width', w)
    new_root.set('height', h)
    ElementTree(new_root).write('result.svg')

# Use PIL to go through all pixels and check their rgb value 
# FIXME: Problem... This will be massively power consuming i think. Might need to use either another way or use multithreading along side a fastest language than python
def color_detection(image):
    img = Image.open(image)
    pixels = np_array(img)
    colors = []
    for row in pixels:
        for pixel in row:
            colors.append(tuple(pixel))

    print(set(colors))
# Create ppm for each color detected by color_detection
def transform_into_ppms(image):
    colors = color_detection(image)
    for color in colors:
        pass # Create the corresponding ppm using ppmcolormask and named it after the color name
    
    # Return the colors list because we used them as filename
    return colors

def trace(image):
    files = transform_into_ppms(image)
    for file in files:
        pass # Trace all the ppms using potrace command

    merge_svgs(files)
    # Delete all the files created for the conversion 
    clean(files)

# Transform the given image into bitmap using mkbitmap 
if __name__ == '__main__':
    image = sys.argv[1]
    color_detection(image)