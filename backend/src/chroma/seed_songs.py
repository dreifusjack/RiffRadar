"""
Script to seed the ChromaDB database with songs from songs_data.json
Run this from the backend directory: python seed_songs.py
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.chroma.chroma_client import ChromaDBClient

sys.path.insert(0, str(Path(__file__).parent))

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def load_songs_from_json(filepath: str = "src/chroma/songs_data.json") -> list:
    """Load songs from JSON file"""
    try:
        with open(filepath, "r") as f:
            songs = json.load(f)
        logger.info(f"Loaded {len(songs)} songs from {filepath}")
        return songs
    except FileNotFoundError:
        logger.error(f"File {filepath} not found!")
        return []
    except json.JSONDecodeError as e:
        logger.error(f"Error parsing JSON: {e}")
        return []


def seed_database(reset: bool = False):
    """Seed the ChromaDB database with songs"""

    # Initialize ChromaDB client
    db = ChromaDBClient()

    current_count = db.get_collection_count()
    if current_count > 0 and not reset:
        logger.info(f"Database already has {current_count} songs, skipping seed")
        return

    if reset:
        logger.warning("Resetting database...")
        db.reset_collection()

    # Load songs from JSON
    songs = load_songs_from_json()

    if not songs:
        logger.error("No songs to seed!")
        return

    # Add each song to the database
    logger.info("Starting to seed database...")
    successful = 0
    failed = 0

    for song in songs:
        try:
            db.add_song(
                song_id=song["song_id"],
                song_name=song["song_name"],
                artist=song["artist"],
                chords=song["chords"],
                difficulty=song["difficulty"],
            )
            successful += 1
        except Exception as e:
            logger.error(f"Failed to add {song['song_name']}: {e}")
            failed += 1

    # Print summary
    logger.info("\n" + "=" * 50)
    logger.info("SEEDING COMPLETE")
    logger.info("=" * 50)
    logger.info(f"Successfully added: {successful} songs")
    logger.info(f"Failed: {failed} songs")
    logger.info(f"Total in database: {db.get_collection_count()} songs")
    logger.info("=" * 50 + "\n")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Seed ChromaDB with songs")
    parser.add_argument(
        "--reset", action="store_true", help="Reset the database before seeding"
    )

    args = parser.parse_args()

    seed_database(reset=args.reset)
