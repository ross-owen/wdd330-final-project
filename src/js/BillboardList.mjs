import {qs, renderListWithTemplate, getLocalStorage} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import SongDetails from "./SongDetails.mjs";

const cardClass = 'music-result-card';

function songCardTemplate(song, index) {
    const isFavorite = this.songs.find(fave => fave.weekOf === this.weekOf && fave.position === song.position);
    return `
    <section class="${cardClass}">
      <input class="index" type="hidden" value="${index}"/>
      <h3 id="position-${song.position}" class="${isFavorite ? 'favorite-selected': ''}">#${song.position}</h3>
      <div class="billboard-detail-holder">
        <div class="billboard-detail">
          <label>Song: <span>${song.name}</span></label>
          <label>Artist: <span>${song.artist}</span></label>
          <label>Weeks On Chart: <span>${song.weeks_on_chart}</span></label>
        </div>
        <img src="${song.image}" alt="${song.name.substring(0, 1)} : ${song.artist.substring(0, 1)}" width="120" height="120" loading="lazy"/>
      </div>
    </section>
    `;
}

export default class BillboardList {
    constructor(dateSelector, headerSelector, listSelector, buttonSelector, spinnerSelector, dialogSelector) {
        this.dateSelector = dateSelector;
        this.headerSelector = headerSelector;
        this.listSelector = listSelector;
        this.buttonSelector = buttonSelector;
        this.spinnerSelector = spinnerSelector;
        this.dialogSelector = dialogSelector;
        this.dataSource = new ExternalServices();
        this.favorites = getLocalStorage("favorites") || [];
    }

    async search() {
        const button = qs(this.buttonSelector);
        button.style.display = 'none';
        const spinner = qs(this.spinnerSelector);
        spinner.style.display = 'grid';

        try {
            const date = qs(this.dateSelector).value;
            const results = await this.dataSource.searchBillboard(date);
            if (results && results.songs) {
                this.render(date, results);
            }
        } catch (error) {
            console.log(error);
        }

        button.style.display = 'block';
        spinner.style.display = 'none';
    }

    render(date, results) {
        qs(this.headerSelector).innerHTML = results.week;
        const resultsElement = qs(this.listSelector);

        const faves = {
            songs: this.favorites,
            weekOf: results.week
        }
        renderListWithTemplate(songCardTemplate, resultsElement, results.songs, faves);

        const cards = resultsElement.getElementsByClassName(cardClass);
        for (let card of cards) {
            const song = results.songs[parseInt(qs('.index', card).value)];
            card.addEventListener('click', async () => {
                new SongDetails(song, date, results.week, this.dialogSelector).showDialog()
            });
        }
    }
}
