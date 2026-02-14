import random
from typing import List

def get_music_recommendations(weather: str, vibe: str, venue_type_categories: List[str]) -> List[str]:
    """
    Returns a list of 3 recommended music genres/tracks based on context.
    
    Args:
        weather: Current weather condition (e.g. 'Clear', 'Rain', 'Clouds')
        vibe: User's preferred vibe (e.g. 'Chill', 'Party', 'Acoustic')
        venue_type_categories: List of categories for the selected place (e.g. ['catering.cafe'])
    """
    
    # Normalize inputs
    w = weather.lower()
    v = vibe.lower()
    
    # Determine dominant venue type
    is_cafe = any('cafe' in c for c in venue_type_categories)
    is_park = any('park' in c for c in venue_type_categories)
    is_bar = any('bar' in c or 'pub' in c for c in venue_type_categories)
    is_gym = any('sport' in c or 'gym' in c for c in venue_type_categories)
    
    recommendations = []
    
    # Logic Blocks
    
    # 1. Weather Dominant
    if 'rain' in w or 'drizzle' in w:
        if is_cafe:
            recommendations = ["Lo-fi Beats", "Jazz Piano", "Acoustic Rain"]
        elif is_bar:
            recommendations = ["Smooth Jazz", "Blues", "Neo Soul"]
        else:
            recommendations = ["Melancholy Indie", "Ambient Electronic", "Chillstep"]
            
    elif 'clear' in w or 'sun' in w:
        if is_park:
            recommendations = ["Indie Pop", "Acoustic Folk", "Sunny Vibes"]
        elif is_gym:
            recommendations = ["High Tempo pop", "Electronic Dance", "Workout Mix"]
        else:
            recommendations = ["Upbeat Pop", "Summer Hits", "Feel Good"]
            
    else: # Cloudy / Default
        recommendations = ["Chill Hop", "Modern Rock", "Alternative"]

    # 2. Vibe Overrides (if strong match)
    if 'party' in v or 'energetic' in v:
         recommendations = ["EDM", "Top 40 Remixes", "House"]
    elif 'romantic' in v:
         recommendations = ["R&B", "Slow Jams", "Love Ballads"]
    elif 'focus' in v or 'work' in v:
         recommendations = ["Classical", "Instrumental", "White Noise"]

    # 3. Ensure we have unique items and exactly 3
    final_recs = list(set(recommendations))
    
    # Fallbacks if list is short
    fallbacks = ["Pop Essentials", "Daily Mix", "Top Hits"]
    for f in fallbacks:
        if len(final_recs) < 3:
            if f not in final_recs:
                final_recs.append(f)
                
    return final_recs[:3]
