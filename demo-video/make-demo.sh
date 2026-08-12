#!/usr/bin/env bash
set -euo pipefail

DIR="/Users/zachrizzo/Desktop/programming/propel-website/demo-video"
python3 "$DIR/render_cards.py"

ffmpeg -y \
  -loop 1 -t 5.8 -i "$DIR/card-1.png" \
  -loop 1 -t 5.7 -i "$DIR/card-2.png" \
  -loop 1 -t 6.0 -i "$DIR/card-3.png" \
  -loop 1 -t 4.5 -i "$DIR/card-4.png" \
  -loop 1 -t 2.1 -i "$DIR/card-5.png" \
  -i "$DIR/propel-zach2-voiceover.wav" \
  -filter_complex "[0:v][1:v][2:v][3:v][4:v]concat=n=5:v=1:a=0,fade=t=in:st=0:d=0.4,fade=t=out:st=23.6:d=0.4[v]" \
  -map "[v]" -map 5:a \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest -movflags +faststart \
  "$DIR/propel-demo-zach2.mp4"
