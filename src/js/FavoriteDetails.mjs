import {qs} from "./utils.mjs";
import {mapToSong} from "./SongDetails.mjs";
import ExternalServices from "./ExternalServices.mjs";

function getRandomSong(items, usedIndex) {
    if (items.length === 0) {
        return -1;
    }
    else if (items.length === 1) {
        return usedIndex !== 0 ? 0 : -1;
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

export default class FavoriteDetails {
    constructor(cardNumber, examples, faves, usedIndex) {
        this.song = undefined;
        this.qs = '#fave_' + cardNumber;
        this.qsSpinner = '#spinner_' + cardNumber;
        this.usedIndex = -1;

        if (faves.length >= cardNumber - 1) {
            const index = getRandomSong(faves, usedIndex);
            if (index >= 0) {
                this.song = faves[index];
                this.usedIndex = index;
            }
        }
        if (this.song === undefined) {
            this.song = examples[cardNumber - 1];
        }
    }

    async render() {
        const card = qs(this.qs);

        const deezer = await new ExternalServices().getSongById(this.song.trackId);
        const fave = mapToSong(this.song.searchDate, this.song.weekOf, mapToBillboard(this.song), deezer);

        card.innerHTML = `
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
}
