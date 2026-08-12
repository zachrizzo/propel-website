from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).parent
SOURCE = Image.open(ROOT / "01-home.png").convert("RGB").crop((237, 0, 1152, 768))
FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

# This recording used a real account; remove its saved salary before compositing.
source_draw = ImageDraw.Draw(SOURCE)
source_draw.rounded_rectangle((84, 463, 431, 507), radius=10, fill="white", outline="#D1D5DB", width=2)


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT, size)


def fit(image: Image.Image) -> Image.Image:
    ratio = max(1920 / image.width, 1080 / image.height)
    resized = image.resize((round(image.width * ratio), round(image.height * ratio)), Image.Resampling.LANCZOS)
    left = (resized.width - 1920) // 2
    top = (resized.height - 1080) // 2
    return resized.crop((left, top, left + 1920, top + 1080))


def pointer(draw: ImageDraw.ImageDraw, x: int, y: int, ring: bool = True) -> None:
    if ring:
        for radius, alpha in ((54, 35), (38, 60), (22, 130)):
            draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(167, 139, 250, alpha))
    draw.polygon([(x, y), (x + 18, y + 50), (x + 30, y + 34), (x + 50, y + 55), (x + 61, y + 44), (x + 40, y + 22), (x + 59, y + 15)], fill="white", outline="#111827")


def card(index: int, focus: tuple[int, int, int, int], title: str, detail: str, cursor: tuple[int, int], cta: bool = False) -> None:
    image = fit(SOURCE.crop(focus))
    draw = ImageDraw.Draw(image, "RGBA")
    # Hide the real account's saved salary value in every walkthrough frame.
    draw.rectangle((0, 0, 1920, 140), fill=(17, 24, 39, 238))
    draw.rectangle((0, 870, 1920, 1080), fill=(17, 24, 39, 242))
    draw.text((88, 44), "PROPEL • A QUICK WALKTHROUGH", font=font(30), fill="#A78BFA")
    title_font = font(54 if len(title) < 40 else 46)
    box = draw.textbbox((0, 0), title, font=title_font)
    draw.text(((1920 - (box[2] - box[0])) // 2, 905), title, font=title_font, fill="white")
    detail_font = font(30)
    box = draw.textbbox((0, 0), detail, font=detail_font)
    draw.text(((1920 - (box[2] - box[0])) // 2, 978), detail, font=detail_font, fill="#D1D5DB")
    pointer(draw, *cursor)
    if cta:
        draw.rounded_rectangle((660, 1015, 1260, 1060), radius=22, fill="#7C3AED")
        label = "propeljobagent.com"
        label_font = font(27)
        box = draw.textbbox((0, 0), label, font=label_font)
        draw.text(((1920 - (box[2] - box[0])) // 2, 1023), label, font=label_font, fill="white")
    image.save(ROOT / f"walkthrough-{index}.png", quality=95)


# Focus rectangles are in the cropped application window's coordinates.
card(1, (0, 0, 915, 768), "1. Choose the role you want", "Start with a title and location.", (880, 620))
card(2, (30, 230, 900, 610), "2. Set the search", "Choose the sites Propel should focus on.", (800, 760))
card(3, (20, 105, 900, 575), "3. Propel handles repetitive forms", "It works from the profile you already set up.", (1000, 520))
card(4, (0, 70, 915, 480), "4. You approve the final submission", "Propel pauses whenever your decision is needed.", (1080, 450))
card(5, (0, 0, 915, 768), "Apply without the busywork", "Download Propel free today.", (1260, 690), cta=True)
