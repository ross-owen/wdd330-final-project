import {setLocalStorage, getLocalStorage, alertMessage, qs} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export const favorites = 'favorites';
export const tempSong = 'tempSong';

export function mapToSong(searchDate, weekOf, billboard, deezer) {
    return {
        searchDate: searchDate,
        weekOf: weekOf,
        position: billboard.position,
        image: billboard.image,
        lastWeekPosition: billboard.last_week_position,
        peakPosition: billboard.peak_position,
        weeksOnChart: billboard.weeks_on_chart,
        trackId: deezer.id,
        name: deezer.title,
        artist: deezer.artist.name,
        album: deezer.album.title,
        releaseDate: deezer.release_date,
        preview: deezer.preview
    };
}

function setImageSrc(img, src) {
    var image = new Image();
    image.onload = () => {
        if (src.endsWith('fallback.gif')) {
            img.src = '/images/placeholder.png';
        } else {
            img.src = src;
        }
    };
    image.onerror = () => {
        img.src = '/images/placeholder.png';
    };
    image.src = src;
}

export default class SongDetails {
    constructor(billboard, searchDate, weekOf, dialogSelector) {
        this.billboard = billboard;
        this.searchDate = searchDate;
        this.weekOf = weekOf;
        this.dialogSelector = dialogSelector;
        this.dataSource = new ExternalServices();
    }

    async showDialog() {
        const dialog = document.querySelector(this.dialogSelector);

        const songWrapper = dialog.querySelector('.song-detail-wrapper');
        songWrapper.classList.add('hidden');

        const spinnerWrapper = dialog.querySelector('.spinner-holder');
        spinnerWrapper.style.display = 'flex';
        const spinner = dialog.querySelector('#dialog-loading');
        spinner.style.display = 'grid';

        dialog.showModal();

        const deezer = await this.dataSource.searchDeezer(this.billboard.name, this.billboard.artist);
        if (!deezer) {
            dialog.close();
            alertMessage(`Unable to locate a sample of this song: ${this.billboard.name} by ${this.billboard.artist}`);
        } else {
            const song = mapToSong(this.searchDate, this.weekOf, this.billboard, deezer);
            this.render(song);
        }

        spinner.style.display = 'none';
        spinnerWrapper.style.display = 'none';
        songWrapper.classList.remove('hidden');
    }

    render(song) {
        document.getElementById('week').innerHTML = `#${song.position} for the ${song.weekOf}`;
        document.getElementById('title').innerHTML = song.name;
        document.getElementById('artist').innerHTML = song.artist;
        document.getElementById('album').innerHTML = song.album;
        document.getElementById('release-date').innerHTML = song.releaseDate;
        document.getElementById('this-week').innerHTML = song.position;
        document.getElementById('last-week').innerHTML = song.lastWeekPosition;
        document.getElementById('peaked-at').innerHTML = song.peakPosition;
        document.getElementById('weeks-on-chart').innerHTML = song.weeksOnChart;
        setImageSrc(document.getElementById('song-image'), song.image);
        this.setFavoriteButtonText(song);

        const playSong = document.getElementById('play-song');
        if (playSong) {
            playSong.remove();
        }
        const audio = document.createElement('audio');
        audio.id = 'play-song';
        audio.controls = true;
        audio.autoplay = true;
        const source = document.createElement('source');
        source.src = song.preview;
        audio.appendChild(source);

        document.getElementById('audio-visual').appendChild(audio);

    }

    setFavoriteButtonText(song) {
        setLocalStorage(tempSong, song);
        const button = qs('#add-favorite');

        const isFavorite = (getLocalStorage(favorites) || []).find((f) => f.trackId === song.trackId);
        if (isFavorite) {
            button.textContent = 'Remove Favorite';
        } else {
            button.textContent = 'Add Favorite';
        }
    }
}
