
const decode = (encoded) => atob(encoded);
const client = decode('NmI1MTU3YmYzMjQ1NDA3ZThhZDEyYjJjMjNiMWRkODI=');
const secret = decode("NzA4MjJmYzdiMGU4NDZmNWJhZGM1YjI1YzFjMDUzOWQ=");
const refresh = decode("QVFDV0JVWFJybFVVVWljNG11OEMtRWp0R2tvcmhQMmpQbjdKMDNSbGZQeC1ZVDRQaWY5bDltdXViZW90ZGMzLWtkUm81bUxMTWtZWTZMZVpkY2hTZlRjNkhZZl9WSUhEM2tVRWNpeEJGNmVSRVpkalJkMWJLRWhWbHhBUE1KcHlaREE=");

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