#!/usr/bin/env python3
"""
Convert PNG sprite sheets (from PixelLab) to MakeCode Arcade img`` template literals.

MakeCode Arcade 16-color palette:
  0=transparent  1=white      2=red         3=pink
  4=orange       5=yellow     6=teal        7=green
  8=blue         9=light-blue 10=purple     11=grey-lavender
  12=dark-purple 13=cream/tan 14=brown      15=black

Usage:
  python3 png_to_makecode.py <input.png> [--name varName] [--size 16] [--threshold 128]
  python3 png_to_makecode.py <input.png> --spritesheet --cols 4 --size 16

  --size: target sprite size (will resize if needed)
  --spritesheet: treat input as a spritesheet, split into individual frames
  --cols: number of columns in the spritesheet
  --threshold: alpha threshold for transparency (0-255, default 128)
"""

import sys
import math
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow required. Install with: pip3 install Pillow", file=sys.stderr)
    sys.exit(1)

# MakeCode Arcade 16-color palette (RGB)
MAKECODE_PALETTE = {
    0:  (0, 0, 0, 0),          # transparent (special)
    1:  (255, 255, 255),        # white
    2:  (255, 33, 33),          # red
    3:  (255, 147, 196),        # pink
    4:  (255, 129, 53),         # orange
    5:  (255, 231, 39),         # yellow
    6:  (0, 173, 188),          # teal
    7:  (29, 176, 0),           # green
    8:  (46, 75, 210),          # blue
    9:  (131, 175, 255),        # light-blue
    10: (123, 46, 210),         # purple
    11: (180, 180, 210),        # grey-lavender
    12: (74, 26, 93),           # dark-purple
    13: (255, 224, 165),        # cream/tan
    14: (160, 94, 28),          # brown
    15: (0, 0, 0),              # black
}

# Hex chars for MakeCode img format
HEX_CHARS = "0123456789abcdef"


def rgb_to_lab(r, g, b):
    """Convert RGB (0-255) to CIELAB for perceptually uniform color distance."""
    # Linearize sRGB
    def linearize(v):
        v = v / 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4

    rl, gl, bl = linearize(r), linearize(g), linearize(b)

    # RGB to XYZ (D65 illuminant)
    x = rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375
    y = rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750
    z = rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041

    # Normalize to D65 white point
    x /= 0.95047
    z /= 1.08883

    # XYZ to Lab
    def f(t):
        return t ** (1/3) if t > 0.008856 else 7.787 * t + 16/116

    L = 116 * f(y) - 16
    a = 500 * (f(x) - f(y))
    b_val = 200 * (f(y) - f(z))
    return (L, a, b_val)


# Pre-compute Lab values for the palette
_PALETTE_LAB = {}
for _idx in range(1, 16):
    _r, _g, _b = MAKECODE_PALETTE[_idx][:3]
    _PALETTE_LAB[_idx] = rgb_to_lab(_r, _g, _b)


def color_distance_lab(lab1, lab2):
    """Euclidean distance in CIELAB space (perceptually uniform)."""
    dL = lab1[0] - lab2[0]
    da = lab1[1] - lab2[1]
    db = lab1[2] - lab2[2]
    return math.sqrt(dL * dL + da * da + db * db)


def is_skin_tone(r, g, b):
    """Detect if an RGB color is in the skin tone range."""
    # Broad skin tone detection: warm hues, r > g > b, moderate saturation
    if r < 100:
        return False
    if r <= g or g <= b:
        return False
    # Check that it's not too saturated (pure red/orange)
    if r - b > 180 and g < 100:
        return False
    # Warmth ratio
    ratio = (r - b) / (r + 1)
    return 0.1 < ratio < 0.7


def nearest_palette_color(r, g, b):
    """Find the nearest MakeCode palette index using CIELAB distance with skin tone bias."""
    pixel_lab = rgb_to_lab(r, g, b)
    best_idx = 15  # default to black
    best_dist = float('inf')

    skin = is_skin_tone(r, g, b)

    for idx in range(1, 16):  # skip 0 (transparent)
        dist = color_distance_lab(pixel_lab, _PALETTE_LAB[idx])

        # Bias skin tones toward cream/tan (13) and brown (14), away from pink (3)
        if skin:
            if idx == 13:  # cream/tan — preferred for light skin
                dist *= 0.7
            elif idx == 14:  # brown — preferred for darker skin
                dist *= 0.75
            elif idx == 4:  # orange — acceptable for warm skin
                dist *= 0.85
            elif idx == 1:  # white — acceptable for very light skin
                dist *= 0.9
            elif idx == 3:  # pink — penalize for skin
                dist *= 1.5
            elif idx == 5:  # yellow — penalize for skin
                dist *= 1.3

        if dist < best_dist:
            best_dist = dist
            best_idx = idx
    return best_idx


def png_to_makecode_img(img, alpha_threshold=128):
    """Convert a PIL Image to a MakeCode img`` string."""
    img = img.convert("RGBA")
    w, h = img.size

    lines = []
    for y in range(h):
        row = []
        for x in range(w):
            r, g, b, a = img.getpixel((x, y))
            if a < alpha_threshold:
                row.append(".")
            else:
                idx = nearest_palette_color(r, g, b)
                row.append(HEX_CHARS[idx])
        lines.append(" ".join(row))

    return lines


def format_as_makecode(lines, var_name=None):
    """Format palette-mapped lines as a MakeCode img`` literal."""
    body = "\n".join(f"        {line}" for line in lines)
    if var_name:
        return f"    export const {var_name}: Image = img`\n{body}\n    `"
    else:
        return f"img`\n{body}\n`"


def split_spritesheet(img, cols, sprite_size):
    """Split a spritesheet into individual sprite frames."""
    w, h = img.size
    cell_w = w // cols
    cell_h = h  # assume single row, or compute rows
    rows = max(1, h // cell_w)  # assume square cells if not specified
    cell_h = h // rows

    frames = []
    for r in range(rows):
        for c in range(cols):
            box = (c * cell_w, r * cell_h, (c + 1) * cell_w, (r + 1) * cell_h)
            frame = img.crop(box)
            if sprite_size and (cell_w != sprite_size or cell_h != sprite_size):
                frame = frame.resize((sprite_size, sprite_size), Image.NEAREST)
            frames.append(frame)
    return frames


def process_single(input_path, var_name=None, target_size=None, alpha_threshold=128):
    """Process a single PNG file."""
    img = Image.open(input_path).convert("RGBA")
    if target_size:
        img = img.resize((target_size, target_size), Image.NEAREST)

    lines = png_to_makecode_img(img, alpha_threshold)
    return format_as_makecode(lines, var_name)


def process_spritesheet(input_path, cols, target_size=None, base_name="sprite", alpha_threshold=128):
    """Process a spritesheet PNG into multiple img`` literals."""
    img = Image.open(input_path).convert("RGBA")
    frames = split_spritesheet(img, cols, target_size)

    results = []
    for i, frame in enumerate(frames):
        lines = png_to_makecode_img(frame, alpha_threshold)
        name = f"{base_name}Frame{i}" if len(frames) > 1 else base_name
        results.append(format_as_makecode(lines, name))

    return "\n\n".join(results)


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Convert PNG to MakeCode Arcade img`` literal")
    parser.add_argument("input", help="Input PNG file path")
    parser.add_argument("--name", default=None, help="Variable name for the output")
    parser.add_argument("--size", type=int, default=None, help="Target sprite size (resize)")
    parser.add_argument("--threshold", type=int, default=128, help="Alpha threshold for transparency")
    parser.add_argument("--spritesheet", action="store_true", help="Treat as spritesheet")
    parser.add_argument("--cols", type=int, default=4, help="Columns in spritesheet")

    args = parser.parse_args()

    if not Path(args.input).exists():
        print(f"Error: {args.input} not found", file=sys.stderr)
        sys.exit(1)

    if args.spritesheet:
        result = process_spritesheet(args.input, args.cols, args.size, args.name or "sprite", args.threshold)
    else:
        result = process_single(args.input, args.name, args.size, args.threshold)

    print(result)


if __name__ == "__main__":
    main()


def auto_crop_and_resize(img, target_size):
    """Crop transparent border, then resize to target_size maintaining aspect ratio."""
    img = img.convert("RGBA")
    bbox = img.getbbox()
    if bbox is None:
        return img.resize((target_size, target_size), Image.NEAREST)
    cropped = img.crop(bbox)
    # Scale to fit target while maintaining aspect ratio
    cw, ch = cropped.size
    scale = min(target_size / cw, target_size / ch)
    new_w = max(1, int(cw * scale))
    new_h = max(1, int(ch * scale))
    scaled = cropped.resize((new_w, new_h), Image.NEAREST)
    # Center on target canvas
    result = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
    ox = (target_size - new_w) // 2
    oy = target_size - new_h  # bottom-align
    result.paste(scaled, (ox, oy))
    return result
