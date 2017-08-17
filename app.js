const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromApi(searchTerm, callback) {
    const query = {
        maxResults: 15,
        part: 'snippet',
        key: 'AIzaSyClJ6SxTfNrhYiUsnRPYrwEIhZWkTSN9Y8',
        q: `${searchTerm}`
    }
    $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function renderVideoResult(result) {
    return `
    <div class="result result--video">
        <h3>
        <a class="js-video-name" href="https://youtu.be/${result.id.videoId}" target="_blank">${result.snippet.title}</a>
        by&nbsp<a class="js-video-channel-name" href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank">${result.snippet.channelTitle}</a></h3>
        <a class="js-video-thumbnail" href="https://youtu.be/${result.id.videoId}" target="_blank"><img src="${result.snippet.thumbnails.default.url}"></a>
        <p>${result.snippet.description}</p>
    </div>
    `;
}

function renderChannelResult(result) {
    return `
    <div class="result result--channel">
        <h3>
        <a class="js-video-name" href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank">${result.snippet.title} YouTube Channel</a>
        </h3>
        <a class="js-video-thumbnail" href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank"><img src="${result.snippet.thumbnails.default.url}"></a>
    </div>
    `;
}

function renderPlaylistResult(result) {
    return `
    <div class="result result--playlist">
        <h3>
        <a class="js-video-name" href="https://www.youtube.com/playlist?list=${result.id.playlistId}" target="_blank">${result.snippet.title}</a>
        playlist by&nbsp<a class="js-video-channel-name" href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank">${result.snippet.channelTitle}</a></h3>
        <a class="js-video-thumbnail" href="https://www.youtube.com/playlist?list=${result.id.playlistId}" target="_blank"><img src="${result.snippet.thumbnails.default.url}"></a>
    </div>
    `;
}

function displayYouTubeSearchData(data) {
    const results = data.items.map((item, index) => {
        if(item.id.videoId) {
            return renderVideoResult(item);
        }
        if(item.id.channelId) {
            return renderChannelResult(item);
        }
        if(item.id.playlistId) {
            return renderPlaylistResult(item);
        }
    })
    $('.js-search-results').html(results);
}

function watchSubmit() {
    $('.js-search-form').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();
        queryTarget.val("");
        getDataFromApi(query, displayYouTubeSearchData);
    });
}

$(watchSubmit);