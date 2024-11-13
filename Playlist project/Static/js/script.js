async function fetchGenres() {
    const response = await fetch('/genres');
    const data = await response.json();
    const genreSelect = document.getElementById('vibe');
    genreSelect.innerHTML = '';
    data.genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreSelect.appendChild(option);
    });
}

async function fetchArtistSuggestions(query) {
    const response = await fetch(`/search_artist?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    const suggestionsDiv = document.getElementById('artist-suggestions');
    suggestionsDiv.innerHTML = '';
    data.artists.forEach(artist => {
        const div = document.createElement('div');
        div.textContent = artist;
        div.onclick = () => {
            const artistsInput = document.getElementById('artists');
            const currentValue = artistsInput.value;
            const artistsArray = currentValue.split(',').map(a => a.trim());
            artistsArray[artistsArray.length - 1] = artist;
            artistsInput.value = artistsArray.join(', ') + ', ';
            suggestionsDiv.style.display = 'none';
        };
        suggestionsDiv.appendChild(div);
    });
    suggestionsDiv.style.display = data.artists.length ? 'block' : 'none';
}

document.getElementById('artists').addEventListener('input', function() {
    const query = this.value.split(',').pop().trim();
    if (query.length > 1) fetchArtistSuggestions(query);
    else document.getElementById('artist-suggestions').style.display = 'none';
});

document.getElementById('vibe-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const response = await fetch('/get_playlist', { method: 'POST', body: formData });
    const data = await response.json();
    const playlistDiv = document.getElementById('playlist');
    playlistDiv.innerHTML = '';

    data.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.textContent = track.name;
        if (track.preview_url) {
            const audio = document.createElement('audio');
            audio.src = track.preview_url;
            audio.controls = true;
            trackElement.appendChild(audio);
        }
        playlistDiv.appendChild(trackElement);
    });
});

fetchGenres();
