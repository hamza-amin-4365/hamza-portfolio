// const client = "b868f9c8993841ddb6687390d4dcccde";
// const secret = "162458c431fc472283cd0def76fe487d";
// const refresh = "AQCXndOEy_HbK_7GGDLUhz7IPO34z6LONfnqAtlKvqm0oJmeCcxJZqh7IcaoEM8_VnG8g0RlK_eUNyNPX4VupKoJNHKBOmu5Ipo_mhnnGFf11wWmxStDLQXajlgtwjUrEuQ";

const client = "6b5157bf3245407e8ad12b2c23b1dd82";
const secret = "70822fc7b0e846f5badc5b25c1c0539d";
const refresh = "AQBMV5JWks9b5qSORs-G6vBb0y56nKyUgKeaOTvJXz6Yxmn0Y8VDtNMzmqHJJ5nydTtW-pkTYg9QbcqD7sAobfVS9C6LDuxyotfNbAjBL1jN_eEmF0iEzOYIfuM-6cTYDpOdyGxB944cfyyXoY1i42MNX82MzzYljq8RqyDQdade9vqi1h2ZtPMp8rD1DUSmrbsCazHNBI8b5oyC7m3aLNQ1ln4X0fl7hGVtnjROoUaWTNdGNNsjALr-9g"

const basic = btoa(`${client}:${secret}`);
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const getAccessToken = async () => {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh,
        }),
    });
    const data = await response.json();
    return data.access_token;
}

const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

const getTopTracks = async () => {
    const access_token = await getAccessToken();

    const response = await fetch(TOP_TRACKS_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
};

const init = async () => {
    try {
        const response = await getTopTracks();
        console.log(response);

        if (response) {
            document.body.innerHTML += `
            <a id="spotifyWrapper" href="${response.item.external_urls.spotify}" class="shadow-md p-2  flex bg-[#1a1a1a] flex-row items-center gap-3  rounded-md md:w-[350px] w-[90vw] fixed bottom-5 md:left-5 md:m-0">
                <img id="songCover" class="rounded md:size-[65px] size-[60px]" src="${response.item.album.images[0].url}" />
                <div class="flex flex-col gap-1 w-full">
                <p id="artistName" class="text-xs text-white opacity-50">Currently listening to</p>
                    <div class="flex flex-row gap-3 w-[95%] md:max-w-[17rem] max-w-[18rem] overflow-hidden items-center">
                        <div id="playingWrapper">
                            <span class="playingBar"></span>
                            <span class="playingBar"></span>
                            <span class="playingBar"></span>
                        </div>
                        <div class="overflow-hidden" id="songNameWrapper">
                        <p id="songName" class="text-sm text-white ${response.item.name.length > 60 ? "scrolling-text-longer" : response.item.name.length > 30 ? "scrolling-text" : " "} font-medium ">${response.item.name}</p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <p id="artistName" class="md:text-sm text-xs  text-white opacity-70">${response.item.artists.map((artist) => artist.name).join(', ')}</p>
                    </div>
                </div>
            </a>
        `;
        }
    } catch (error) {
        console.log(error);
    }
}

init();
setInterval(() => {
    init();
    document.getElementById("spotifyWrapper").remove();
}, 3 * 60 * 1000);