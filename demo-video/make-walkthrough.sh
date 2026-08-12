#!/usr/bin/env bash
set -euo pipefail

DIR="/Users/zachrizzo/Desktop/programming/propel-website/demo-video"
python3 "$DIR/render_walkthrough.py"

ffmpeg -y \
  -loop 1 -t 4.3 -i "$DIR/walkthrough-1.png" \
  -loop 1 -t 4.3 -i "$DIR/walkthrough-2.png" \
  -loop 1 -t 4.3 -i "$DIR/walkthrough-3.png" \
  -loop 1 -t 4.3 -i "$DIR/walkthrough-4.png" \
  -loop 1 -t 4.2 -i "$DIR/walkthrough-5.png" \
  -i "$DIR/propel-walkthrough-zach2.wav" \
  -filter_complex "[0:v][1:v][2:v][3:v][4:v]concat=n=5:v=1:a=0,fade=t=in:st=0:d=0.35,fade=t=out:st=21:d=0.35[v]" \
  -map "[v]" -map 5:a \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest -movflags +faststart \
  "$DIR/propel-walkthrough-zach2.mp4"
