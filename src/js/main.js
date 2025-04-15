import {loadHeaderFooter, getLocalStorage, convertToJson, qs} from "./utils.mjs";
import FavoriteDetails from "./FavoriteDetails.mjs";

async function loadFavorites() {
    const examples = await convertToJson(await fetch('/json/examples.json'));
    const faves = getLocalStorage("favorites") || [];
    if (faves.length > 0) {
        qs('#song-cards').innerHTML = 'Favorites';
    }

    const songOne = new FavoriteDetails(1, examples, faves, -1);
    await songOne.render();

    const songTwo = new FavoriteDetails(2, examples, faves, songOne.usedIndex);
    await songTwo.render();
}

await loadHeaderFooter();

await loadFavorites();