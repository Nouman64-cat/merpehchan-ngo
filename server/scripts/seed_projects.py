"""One-time seed of the `projects` collection from the old static programs copy.

Run with the venv active from the `server/` directory:

    python -m scripts.seed_projects

Inserts 4 Project documents (no images/team members — add those through the
admin panel afterward) so the public Projects page isn't empty right after
the Programs -> Projects migration ships. Safe to re-run: it skips any title
that already exists in the collection.
"""

import asyncio
from datetime import date, datetime, timezone

from app.config import get_settings
from motor.motor_asyncio import AsyncIOMotorClient

SEED_PROJECTS = [
    {
        "title": "Free Healthcare",
        "description": (
            "Free medical camps, mobile clinics, and community health services for "
            "families who would otherwise go without care.\n\n"
            "Access to a doctor shouldn't depend on income. Meri Pehchan runs free "
            "health camps and mobile clinics in underserved neighborhoods, bringing "
            "basic diagnostics, consultations, and medicine directly to people who "
            "can't afford private care.\n\n"
            "Our community clinics focus on the everyday health needs that get "
            "postponed the longest — maternal and child health checks, chronic "
            "disease management, and preventive screenings — because a small delay "
            "in treatment can turn into a much larger crisis for a low-income family."
        ),
        "areas": ["Healthcare"],
    },
    {
        "title": "Women Empowerment",
        "description": (
            "Sewing and tailoring skill-share classes that give women a path to "
            "their own income and independence.\n\n"
            "In many of the communities we work in, women face real barriers to "
            "earning an independent income. Our skill-share classes teach sewing "
            "and tailoring — practical, marketable trades that women can turn into "
            "steady work from home or in a local shop.\n\n"
            "Beyond the skill itself, these classes create a space where women "
            "build confidence, support each other, and start to see a future "
            "that isn't entirely dependent on someone else's income."
        ),
        "areas": ["Women Empowerment"],
    },
    {
        "title": "Widows, Divorced Women & Orphan Care",
        "description": (
            "Education, healthcare, food, and everyday care for orphaned children "
            "and the women raising them.\n\n"
            "Losing a parent, a spouse, or a marriage often means losing a "
            "household's only income at the same time. Meri Pehchan supports "
            "widows, divorced women, and orphaned children with the essentials "
            "that keep a family from falling further behind — school fees and "
            "supplies, healthcare, nutritious food, clothing, and, for children, "
            "the toys and small comforts of a normal childhood.\n\n"
            "To date, this program has reached over 2,000 children with "
            "consistent, ongoing support rather than one-off aid, because "
            "rebuilding stability takes more than a single donation."
        ),
        "areas": ["Widow & Orphan Care"],
    },
    {
        "title": "Community Services",
        "description": (
            "Food packages, Ramadan and holiday support, wheelchairs, and "
            "counseling for families in crisis.\n\n"
            "Some needs are seasonal, some are urgent, and some are just about "
            "being there. We distribute food packages and Ramadan relief to "
            "families facing food insecurity, organize holiday gifts for children "
            "who would otherwise go without, and provide wheelchairs and mobility "
            "aids to people who need them.\n\n"
            "We also offer counseling support, recognizing that poverty and "
            "hardship take a toll that goes beyond the physical, and that people "
            "navigating a crisis need more than material aid to get through it."
        ),
        "areas": ["Community Services"],
    },
]


async def main() -> None:
    settings = get_settings()
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.mongodb_db_name]
    collection = db["projects"]

    today = date.today().isoformat()
    now = datetime.now(timezone.utc)
    inserted = 0

    for index, seed in enumerate(SEED_PROJECTS):
        existing = await collection.find_one({"title": seed["title"]})
        if existing:
            print(f"Skipping '{seed['title']}' — already exists.")
            continue

        doc = {
            "title": seed["title"],
            "description": seed["description"],
            "date": today,
            "areas": seed["areas"],
            "team_member_ids": [],
            "youtube_url": None,
            "images": [],
            "display_order": index,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        }
        await collection.insert_one(doc)
        inserted += 1
        print(f"Inserted '{seed['title']}'.")

    print(f"\nDone. Inserted {inserted} project(s).")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
