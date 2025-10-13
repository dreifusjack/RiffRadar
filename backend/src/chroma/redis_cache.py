import redis
import json
import os
from typing import Optional, List, Dict
import hashlib


class RedisCache:
    def __init__(self):
        """Initialize Redis client"""
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self.client = redis.from_url(
            redis_url, decode_responses=True, socket_connect_timeout=5
        )
        self.default_ttl = 3600  # 1 hour cache

    def _generate_cache_key(self, chords: List[str], n_results: int) -> str:
        """Generate a unique cache key from chord progression"""
        # key = chords + n_results
        chord_string = ",".join(sorted(chords))
        key_input = f"{chord_string}:{n_results}"
        key_hash = hashlib.md5(key_input.encode()).hexdigest()
        return f"riffradar:query:{key_hash}"

    def get_cached_query(
        self, chords: List[str], n_results: int
    ) -> Optional[List[Dict]]:
        """Get cached query results"""
        try:
            cache_key = self._generate_cache_key(chords, n_results)
            cached_data = self.client.get(cache_key)

            if cached_data:
                return json.loads(cached_data)
            return None
        except Exception as e:
            print(f"Redis get error: {e}")
            return None

    def set_cached_query(
        self,
        chords: List[str],
        n_results: int,
        results: List[Dict],
        ttl: Optional[int] = None,
    ):
        """Cache query results"""
        try:
            cache_key = self._generate_cache_key(chords, n_results)
            ttl = ttl or self.default_ttl

            self.client.setex(cache_key, ttl, json.dumps(results))
        except Exception as e:
            print(f"Redis set error: {e}")

    def invalidate_cache(self):
        """Clear all caches (when adding new songs)"""
        try:
            keys = self.client.keys("riffradar:query:*")
            if keys:
                self.client.delete(*keys)
        except Exception as e:
            print(f"Redis invalidate error: {e}")

    def health_check(self) -> bool:
        try:
            return self.client.ping()
        except Exception:
            return False
