import {qs, setClick, loadHeaderFooter, getLocalStorage, setLocalStorage} from "./utils.mjs";
import {tempSong, favorites} from "./SongDetails.mjs";
import BillboardList from "./BillboardList.mjs";

await loadHeaderFooter();

qs('#song-detail').addEventListener('close', (e) => {
    const audioControl = qs('#play-song');
    if (audioControl) {
        audioControl.pause();
    }
});

qs('#add-favorite').addEventListener('click', (e) => {
    let faves = getLocalStorage(favorites) || [];
    if (e.target.textContent === 'Add Favorite') {
        faves.push(getLocalStorage(tempSong))
    } else {
        faves = (getLocalStorage(favorites) || []).filter((f) => f.trackId !== song.trackId);
    }
    setLocalStorage(favorites, faves);
    qs('#song-detail').close();
});

setClick('#search-button', async () => {
    await new BillboardList(
        '#date-input',
        '#week-of',
        '#search-results',
        '#search-button',
        '#search-loading',
        '#song-detail',
    ).search();
});