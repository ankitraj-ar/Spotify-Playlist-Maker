from flask import Flask, render_template, request, jsonify
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

app = Flask(__name__, static_folder='static', template_folder='templates')

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id="", #can't show id and secret
    client_secret="" #can't show id and secret
))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/genres')
def genres():
    genres = sp.recommendation_genre_seeds()
    return jsonify(genres=genres['genres'])

@app.route('/search_artist')
def search_artist():
    query = request.args.get('query', '')
    results = sp.search(q=query, type='artist', limit=5)
    artists = [artist['name'] for artist in results['artists']['items']]
    return jsonify(artists=artists)

@app.route('/get_playlist', methods=['POST'])
def get_playlist():
    vibe = request.form.get('vibe')
    artist_names = request.form.get('artists').split(',')
    song_count = 10

    valid_genres = sp.recommendation_genre_seeds()
    if vibe not in valid_genres['genres']:
        return jsonify({'error': f'Invalid genre: {vibe}'})

    artist_ids = []
    for name in artist_names:
        name = name.strip()
        if name:
            results = sp.search(q=f'artist:{name}', type='artist', limit=1)
            artists = results['artists']['items']
            if artists:
                artist_ids.append(artists[0]['id'])
            else:
                return jsonify({'error': f'No artist found for "{name}"'})

    recommendations = sp.recommendations(seed_artists=artist_ids, seed_genres=[vibe], limit=song_count)
    playlist = [{'name': track['name'], 'preview_url': track['preview_url']} for track in recommendations['tracks'] if track['preview_url']]
    return jsonify(playlist)

if __name__ == '__main__':
    app.run(debug=True)
