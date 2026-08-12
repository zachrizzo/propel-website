#!/usr/bin/env bash
set -euo pipefail

DIR="/Users/zachrizzo/Desktop/programming/propel-website/demo-video"
SOURCE="$DIR/propel-live-applications-take1.mov"
AUDIO="$DIR/propel-live-long-zach2.wav"
OUTPUT="$DIR/propel-live-screen-recording-v2.mp4"

# The source is a clean 2304x1536 capture of the entire Propel app.  Keep that
# as the master framing, then use two deliberate detail shots that line up
# with the moments when an application row is expanded.
ffmpeg -y -i "$SOURCE" -i "$AUDIO" \
  -filter_complex "
    [0:v]fps=30,split=4[base1][detail1][base2][detail2];
    [base1]trim=start=0:end=1.0,setpts=PTS-STARTPTS,
      scale=1620:1080:force_original_aspect_ratio=decrease,
      pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x0d1020,setsar=1[b1];
    [detail1]trim=start=1.0:end=4.0,setpts=PTS-STARTPTS,
      crop=1920:1080:400:200,scale=1920:1080,setsar=1[d1];
    [base2]trim=start=4.0:end=7.0,setpts=PTS-STARTPTS,
      scale=1620:1080:force_original_aspect_ratio=decrease,
      pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x0d1020,setsar=1[b2];
    [detail2]trim=start=7.0:end=10.371,setpts=PTS-STARTPTS,
      crop=1920:1080:400:300,scale=1920:1080,setsar=1[d2];
    [b1][d1][b2][d2]concat=n=4:v=1:a=0,
      tpad=stop_mode=clone:stop_duration=4,trim=duration=13.76,setpts=PTS-STARTPTS[v]
  " \
  -map "[v]" -map 1:a -t 13.76 \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart "$OUTPUT"

echo "$OUTPUT"
