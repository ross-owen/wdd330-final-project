import {convertToJson} from "./utils.mjs";

const billboardUrl = import.meta.env.VITE_BILLBOARD_URL;
const billboardApiKey = import.meta.env.VITE_BILLBOARD_API_KEY;
const deezerUrl = import.meta.env.VITE_DEEZER_URL;
const deezerApiKey = import.meta.env.VITE_DEEZER_API_KEY;

export default class ExternalServices {
    constructor() {
    }

    async searchBillboard(dateString) {
        const url = `${billboardUrl}chart.php?id=hot-100&week=${dateString}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': `${billboardApiKey}`,
                'x-rapidapi-host': 'billboard-charts-api.p.rapidapi.com'
            }
        };
        const response = await fetch(url, options);
        return await convertToJson(response);
    }

    async searchDeezer(title, artist) {
        const q = `${title} ${artist}`;
        const url = `${deezerUrl}search?q=${encodeURIComponent(q)}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': `${deezerApiKey}`,
                'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        };

        const response = await fetch(url, options);
        if (response.ok) {
            const result = await response.json();
            if (result.data && result.data.length > 0) {
                let id = result.data[0].id;
                let found = result.data.find((s) =>
                    s.title.toUpperCase() === title.toUpperCase()
                    && s.artist.name.toUpperCase() === artist.toUpperCase()
                );
                if (found) {
                    id = found.id;
                }
                return await this.getSongById(id);
            }
        }
    }

    async getSongById(id) {
        const url = `${deezerUrl}track/${id}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': `${deezerApiKey}`,
                'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw Error(`searchDeezer returned a non-ok response code 'getSongById': ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }
}
