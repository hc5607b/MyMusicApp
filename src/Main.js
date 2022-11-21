// creating vaiables
var ApiKey ="e05a0056d9a60887f4074642759dc724";
var searchBox;
var topResultTemp;
var trackInfoTemp;
var albumInfoTemp;
var artistInfoTemp;

var topResultParent;
var topTrackParent;
var topAlbumParent;
var topArtistParent;

var resultsParent;

window.onload = function(){
    // initiating variables
    searchBox = document.getElementsByClassName("searchIP")[0];
    topResultTemp = document.getElementsByClassName("topResult")[0];
    trackInfoTemp = document.getElementsByClassName("track")[0];
    albumInfoTemp = document.getElementsByClassName("album")[0];
    artistInfoTemp = document.getElementsByClassName("artist")[0];

    topResultParent = document.getElementsByClassName("topResParent")[0];
    topTrackParent = document.getElementsByClassName("topSongRes")[0];
    topAlbumParent = document.getElementsByClassName("topAlbumRes")[0];
    topArtistParent = document.getElementsByClassName("topArtistRes")[0];
    resultsParent = document.getElementsByClassName("result")[0];

    // remove templates

    clearResults();
    // showResults(false);

    // adding eventlisteners
    searchBox.addEventListener("keypress", function(e){if(e.key == "Enter"){search();}}, false);

    search("Iron maiden");
}

// help functions

function clearResults(){
    while(topResultParent.children.length>0){
        topResultParent.children[0].remove();
    }
    while(topTrackParent.children.length>0){
        topTrackParent.children[0].remove();
    }
    while(topAlbumParent.children.length>0){
        topAlbumParent.children[0].remove();
    }
    while(topArtistParent.children.length>0){
        topArtistParent.children[0].remove();
    }
}

function showResults(visible){
    if(!visible && !resultsParent.className.includes("hideItem")){
        resultsParent.classList.add("hideItem");
    }
    if(visible && resultsParent.className.includes("hideItem")){
        resultsParent.classList.remove("hideItem");
    }
}

const reqTypes = {
    AlbumSerach: "http://ws.audioscrobbler.com/2.0/?method=album.search&album=ARGALB&api_key=YOUR_API_KEY&format=json",
    AlbumInfo: "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=YOUR_API_KEY&artist=ARGART&album=ARGALB&format=json",
    ArtistSearch: "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=ARGART&api_key=YOUR_API_KEY&format=json",
    ArtistInfo: "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=ARGART&api_key=YOUR_API_KEY&format=json",
    ArtistSimilar: "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=ARGART&api_key=YOUR_API_KEY&format=json",
    TrackSearch: "http://ws.audioscrobbler.com/2.0/?method=track.search&track=ARGTR&api_key=YOUR_API_KEY&format=json",
    TrackInfo: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=YOUR_API_KEY&artist=ARGART&track=ARGTR&format=json",
    TrackSimilar: "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=ARGART&track=ARGTR&api_key=YOUR_API_KEY&format=json"
}
const mbidReqTypes = {
    AlbumInfo: "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=YOUR_API_KEY&mbid=MBID&format=json",
    ArtistInfo: "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=MBID&api_key=YOUR_API_KEY&format=json",
    ArtistSimilar: "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&mbid=MBID&api_key=YOUR_API_KEY&format=json",
    TrackInfo: "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=YOUR_API_KEY&mbid=MBID&format=json",
    TrackSimilar: "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&mbid=MBID&api_key=YOUR_API_KEY&format=json"
}

function forgeRequest(type, artist="",album="",track=""){
    var rtn = String(type).replace("YOUR_API_KEY", ApiKey);
    if(String(rtn).includes("ARGART")){if(artist == ""){return -1;}rtn = rtn.replace("ARGART", artist);}
    if(String(rtn).includes("ARGALB")){if(album == ""){return -2;}rtn = rtn.replace("ARGALB", album);}
    if(String(rtn).includes("ARGTR")){if(track == ""){return -3;}rtn = rtn.replace("ARGTR", track);}
    return rtn;
}

function forgeMbidRequest(type, mbid){
    return String(type).replace("YOUR_API_KEY", ApiKey).replace("MBID", mbid);
}

function getJson(type, artist="",album="",track=""){
    var rtn;
    let url = forgeRequest(type, artist,album,track)
    console.log(url);
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            rtn = JSON.parse(req.responseText);
        }
    }
    req.open("GET", url, false);
    req.send();
    return rtn;
}

// the code

function search(keyword = ""){
    if(keyword == ""){keyword = searchBox.value;}
    if(keyword == ""){return;}

    clearResults();

    printTracks(getJson(reqTypes.TrackSearch, "","",keyword));
    printAlbums(getJson(reqTypes.AlbumSerach, "",keyword,""));
    printArtist(getJson(reqTypes.ArtistSearch, keyword,"",""));
}

function printTracks(json){
    var addedTr = 0;
    var trI = -1;
    if(Object.keys(json.results.trackmatches.track).length < 5){maxRes = Object.keys(json.results.trackmatches.track).length;}
    // console.log(maxRes);

    while(addedTr < 4){
        trI++;
        let tr = json.results.trackmatches.track[trI];
        
        let inst = trackInfoTemp;
        inst.getElementsByClassName("trImg")[0].src = tr.image[2]['#text'];
        inst.getElementsByClassName("trName")[0].innerHTML = tr.name;
        inst.getElementsByClassName("trArtist")[0].innerHTML = tr.artist;
        inst.getElementsByClassName("trLen")[0].innerHTML = tr.listeners;
        
        addedTr++;
        topTrackParent.insertAdjacentHTML('beforeend', inst.outerHTML);
    }
}

function printAlbums(json){
    var addedTr = 0;
    var trI = -1;
    if(Object.keys(json.results.albummatches.album).length < 5){maxRes = Object.keys(json.results.albummatches.album).length;}
    // console.log(maxRes);

    while(addedTr < 4){
        trI++;
        let tr = json.results.albummatches.album[trI];
        
        let inst = albumInfoTemp;
        inst.getElementsByClassName("albImg")[0].src = tr.image[2]['#text'];
        inst.getElementsByClassName("albName")[0].innerHTML = tr.name;
        inst.getElementsByClassName("albArtist")[0].innerHTML = tr.artist;
        
        addedTr++;
        topAlbumParent.insertAdjacentHTML('beforeend', inst.outerHTML);
    }
}

function printArtist(json){
    var addedTr = 0;
    var trI = -1;
    if(Object.keys(json.results.artistmatches.artist).length < 5){maxRes = Object.keys(json.results.artistmatches.artist).length;}
    // console.log(maxRes);

    while(addedTr < 4){
        trI++;
        let tr = json.results.artistmatches.artist[trI];
        
        let inst = artistInfoTemp;
        inst.getElementsByClassName("artImg")[0].src = tr.image[2]['#text'];
        inst.getElementsByClassName("artName")[0].innerHTML = tr.name;
        
        addedTr++;
        topArtistParent.insertAdjacentHTML('beforeend', inst.outerHTML);
    }
}

function selectFilter(){
    
}