import {loadHeaderFooter, getLocalStorage, qs, convertToJson} from "./utils.mjs";
import {mapToSong} from "./SongDetails.mjs";
import ExternalServices from "./ExternalServices.mjs";

function getFavoriteCard(fave) {
    return `
        <h2>${fave.weekOf}</h2>
        <div class="favorite-detail">
          <label>Song:</label>
          <span>${fave.name}</span>
          <label>Artist:</label>
          <span>${fave.artist}</span>
          <label>Album:</label>
          <span>${fave.album}</span>
          <label>This Week:</label>
          <span>${fave.position}</span>
          <label>Last Week:</label>
          <span>${fave.lastWeekPosition}</span>
          <label>Peaked:</label>
          <span>${fave.peakPosition}</span>
          <label>Weeks on Chart:</label>
          <span>${fave.weeksOnChart}</span>
        </div>
        <img src="${fave.image}" width="180" height="180" alt="${fave.name}" loading="lazy"/>
        <audio controls>
          <source src="${fave.preview}">
        </audio>
    `;
}

async function loadFavorites() {
    const examples = await convertToJson(await fetch('/json/examples.json'));
    const faves = getLocalStorage("favorites") || [];
    if (faves.length > 0) {
        qs('#song-cards').innerHTML = 'Favorites';
    }
    const usedIndex = await loadFavorite(0, examples, faves, -1);
    await loadFavorite(1, examples, faves, usedIndex);
}

async function loadFavorite(index, examples, faves, usedIndex) {
    let fave;

    if (faves.length >= index) {
        const index = getRandomSong(faves, usedIndex);
        if (index >= 0) {
            fave = faves[index];
        }
    }
    if (!fave) {
        fave = examples[index];
    }

    const deezer = await new ExternalServices().getSongById(fave.trackId);
    fave = mapToSong(fave.searchDate, fave.weekOf, mapToBillboard(fave), deezer);

    qs('#fave_' + (index + 1)).innerHTML = getFavoriteCard(fave);
}

function getRandomSong(items, usedIndex) {
    if (items.length === 0) {
        return -1;
    }
    let loop = true;
    let index = 0;
    while (loop) {
        index = Math.floor(Math.random() * items.length);
        if (index !== usedIndex) {
            loop = false;
        }
    }
    return index;
}

function mapToBillboard(song) {
    return {
        position: song.position,
        image: song.image,
        last_week_position: song.lastWeekPosition,
        peak_position: song.peakPosition,
        weeks_on_chart: song.weeksOnChart
    }
}

await loadHeaderFooter();

await loadFavorites();