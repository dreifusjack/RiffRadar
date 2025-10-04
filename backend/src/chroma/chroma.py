import chromadb
from chromadb.config import Settings
from typing import List, Dict


class ChromaDBClient:
    def __init__(self, persist_directory: str = "./chroma_db"):
        """Initialize client"""
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        self.collection = self.client.get_or_create_collection(
            name="songs",
            metadata={"description": "Song chord progressions"}
        )
    
    def encode_chord_progression(self, chords: List[str]) -> List[float]:
        """
        Encode chord progression into a vector using circle of fifths + positional info
        
        Circle of fifths order: C, G, D, A, E, B, F#/Gb, C#/Db, G#/Ab, D#/Eb, A#/Bb, F
        """
        circle_of_fifths = {
            'C': 0, 'G': 1, 'D': 2, 'A': 3, 'E': 4, 'B': 5,
            'F#': 6, 'Gb': 6, 'C#': 7, 'Db': 7, 'G#': 8, 'Ab': 8,
            'D#': 9, 'Eb': 9, 'A#': 10, 'Bb': 10, 'F': 11
        }
        
        max_length = 8
        embedding_dim = max_length * 2
        
        embedding = [0.0] * embedding_dim
        
        for i, chord in enumerate(chords[:max_length]):
            root, chord_type = self._parse_chord(chord)
            
            if root in circle_of_fifths:
                # Position in embedding
                pos = i * 2
                
                # Store circle position (normalized to 0-1)
                embedding[pos] = circle_of_fifths[root] / 11.0
                
                # Store chord type (0 = major, 0.5 = minor, 0.75 = 7th, etc.)
                embedding[pos + 1] = chord_type
        
        return embedding
    
    def _parse_chord(self, chord: str) -> tuple[str, float]:
        """Parse a chord string into root note and type"""
        chord = chord.strip()
        
        # Check for minor
        if 'm' in chord.lower() and '7' not in chord:
            root = chord.replace('m', '').replace('M', '')
            return root, 0.5
        
        # Check for 7th
        if '7' in chord:
            root = chord.replace('7', '').replace('m', '').replace('M', '')
            return root, 0.75
        
        # Check for sus, add, etc.
        if 'sus' in chord.lower():
            root = chord.split('sus')[0]
            return root, 0.25
        
        # Default to major
        return chord, 0.0
    
    def add_song(self, song_id: str, song_name: str, artist: str, chords: List[str], difficulty: str = "beginner"):
        """Add a song to the collection"""
        embedding = self.encode_chord_progression(chords)
        
        self.collection.add(
            ids=[song_id],
            embeddings=[embedding],
            metadatas=[{
                "song_name": song_name,
                "artist": artist,
                "chords": ",".join(chords),
                "difficulty": difficulty
            }]
        )
    
    def query_similar_songs(self, chords: List[str], n_results: int = 5) -> List[Dict]:
        """Query for similar songs based on chord progression"""
        embedding = self.encode_chord_progression(chords)
        
        results = self.collection.query(
            query_embeddings=[embedding],
            n_results=n_results
        )
        
        songs = []
        if results['ids'] and results['ids'][0]:
            for i in range(len(results['ids'][0])):
                song = {
                    "id": results['ids'][0][i],
                    "song_name": results['metadatas'][0][i]['song_name'],
                    "artist": results['metadatas'][0][i]['artist'],
                    "chords": results['metadatas'][0][i]['chords'].split(','),
                    "difficulty": results['metadatas'][0][i]['difficulty'],
                    "similarity_score": 1 - results['distances'][0][i]  # Convert distance to similarity
                }
                songs.append(song)
        
        return songs
    
    def get_collection_count(self) -> int:
        """Get total number of songs in collection"""
        return self.collection.count()
    
    def reset_collection(self):
        """Reset the collection (useful for testing)"""
        self.client.delete_collection("songs")
        self.collection = self.client.get_or_create_collection(
            name="songs",
            metadata={"description": "Song chord progressions"}
        )