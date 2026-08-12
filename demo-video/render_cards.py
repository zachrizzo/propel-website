from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).parent
SOURCE = Image.open(ROOT / "01-home.png").convert("RGB")
FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

MESSAGES = [
    "Stop retyping the same application.",
    "Tell Propel what kind of job you want.",
    "It finds jobs and fills out the forms.",
    "You review everything before it is submitted.",
    "Download free at propeljobagent.com",
]


def fit_font(draw: ImageDraw.ImageDraw, text: str, max_width: int) -> ImageFont.FreeTypeFont:
    size = 58
    while size > 34:
        font = ImageFont.truetype(FONT, size)
        if draw.textbbox((0, 0), text, font=font)[2] <= max_width:
            return font
        size -= 2
    return ImageFont.truetype(FONT, 34)


app = SOURCE.crop((237, 0, 1152, 768)).resize((1287, 1080), Image.Resampling.LANCZOS)

for index, message in enumerate(MESSAGES, 1):
    canvas = Image.new("RGB", (1920, 1080), "#111827")
    canvas.paste(app, ((1920 - app.width) // 2, 0))
    draw = ImageDraw.Draw(canvas, "RGBA")
    # Remove the real account's saved salary value from the marketing cut.
    draw.rounded_rectangle((434, 651, 922, 711), radius=14, fill="white", outline="#D1D5DB", width=2)
    draw.rectangle((0, 0, 1920, 145), fill=(17, 24, 39, 238))
    draw.rectangle((0, 900, 1920, 1080), fill=(17, 24, 39, 238))
    brand_font = ImageFont.truetype(FONT, 32)
    draw.text((86, 48), "PROPEL JOB AGENT", font=brand_font, fill="#A78BFA")
    font = fit_font(draw, message, 1740)
    box = draw.textbbox((0, 0), message, font=font)
    x = (1920 - (box[2] - box[0])) // 2
    color = "#A78BFA" if index == len(MESSAGES) else "white"
    draw.text((x, 956), message, font=font, fill=color)
    canvas.save(ROOT / f"card-{index}.png", quality=95)
