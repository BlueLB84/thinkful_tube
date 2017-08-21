const STATE = {
    data: null,
    query: {
        pageToken: '',
        maxResults: 12,
        part: 'snippet',
        key: 'AIzaSyClJ6SxTfNrhYiUsnRPYrwEIhZWkTSN9Y8',
        q: ''
    },
    youtube_search_url: 'https://www.googleapis.com/youtube/v3/search'
};


function getDataFromApi(searchTerm, pageToken, callback) {
    STATE.query['q'] = searchTerm;
    if (pageToken) {
        STATE.query['pageToken'] = pageToken;
    }
    $.getJSON(STATE.youtube_search_url, STATE.query, callback);
}

function renderVideoResult(result) {
    return `
    <div class="result result--video">
        <h3>
        <a class="js-video-name" href="https://youtu.be/${result.id.videoId}" target="_blank">${result.snippet.title}</a>
        by&nbsp<a class="js-video-channel-name" href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank">${result.snippet.channelTitle}</a></h3>
        <a class="js-video-thumbnail" href="https://youtu.be/${result.id.videoId}" target="_blank"><img src="${result.snippet.thumbnails.medium.url}" class="result--img"></a>
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
        <a class="js-video-thumbnail" href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank"><img src="${result.snippet.thumbnails.medium.url}" class="result--img"></a>
    </div>
    `;
}

function renderPlaylistResult(result) {
    return `
    <div class="result result--playlist">
        <h3>
        <a class="js-video-name" href="https://www.youtube.com/playlist?list=${result.id.playlistId}" target="_blank">${result.snippet.title}</a>
        playlist by&nbsp<a class="js-video-channel-name" href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank">${result.snippet.channelTitle}</a></h3>
        <a class="js-video-thumbnail" href="https://www.youtube.com/playlist?list=${result.id.playlistId}" target="_blank"><img src="${result.snippet.thumbnails.medium.url}" class="result--img"></a>
    </div>
    `;
}

function renderButtonPrev() {
    if (STATE.data.prevPageToken !== undefined) {
        $('.buttons__prev').show();
    } else {
        $('.buttons__prev').hide();
    }
}

function renderButtonNext() {
    if (STATE.data.nextPageToken !== undefined) {
        $('.buttons__next').show();
    } else {
        $('.buttons__next').hide();
    }
}

$('.buttons__next').click(event => {
    getDataFromApi(STATE.query.q, STATE.data.nextPageToken, displayYouTubeSearchData);
})

$('.buttons__prev').click(event => {
    getDataFromApi(STATE.query.q, STATE.data.prevPageToken, displayYouTubeSearchData);
})

function displayYouTubeSearchData(data) {
    STATE.data = data;
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
    $('.js-current-query').text(`Current Search: "${STATE.query.q}"`);
    $('.js-results-total').text(`Total Results: ${STATE.data.pageInfo.totalResults}`);
    renderButtonNext();
    renderButtonPrev();
}

function handleSearchInputClear() {
    $('.js-query').on('change paste keyup', function() {
        if ($('.js-query').val() !== '') {
            $('.js-search-clear').show();
            $('.js-search-clear').css('margin-right','-14px')
        } else {
            $('.js-search-clear').hide();
        }
    });
    $('.search').on('click','.js-search-clear', function() {
        $('.js-query').val('');
        $('.js-search-clear').hide();
        $('.js-query').focus();
    });
    }

function watchSubmit() {
    handleSearchInputClear();
    $('.js-search-form').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();
        getDataFromApi(query, null, displayYouTubeSearchData);
    });
}

$(watchSubmit);