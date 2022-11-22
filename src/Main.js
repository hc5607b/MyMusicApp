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

var filterAll;
var filterTracks;
var filterAlbums;
var filterArtist;

var curFilter = 0;

var printTrackCount = 4;
var printAlbumCount = 4;
var printArtistCount = 4;

var curmbid;

var jsonTracks;
var jsonAlbums;
var jsonSimilar;
var jsonInfo;

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

    let filters = document.getElementsByClassName("typeSelBtn");
    filterAll = filters[0];
    filterTracks = filters[1];
    filterAlbums = filters[2];
    filterArtist = filters[3];

    // remove templates

    clearResults();
    showResults(false);
    resetFilters();

    // adding eventlisteners
    searchBox.addEventListener("keypress", function(e){if(e.key == "Enter"){search();}}, false);
    filterAll.addEventListener("click", function(e){selectFilter(filterAll)}, false);
    filterTracks.addEventListener("click", function(e){selectFilter(filterTracks)}, false);
    filterAlbums.addEventListener("click", function(e){selectFilter(filterAlbums)}, false);
    filterArtist.addEventListener("click", function(e){selectFilter(filterArtist)}, false);

    search("Iron maiden");
    // search("Deadmouse");
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
    TrackSimilar: "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&mbid=MBID&api_key=YOUR_API_KEY&format=json",
    ArtistTopAlbums: "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&mbid=MBID&api_key=YOUR_API_KEY&format=json",
    ArtistTopTracks: "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&mbid=MBID&api_key=YOUR_API_KEY&format=json",
    AtistSimilar: "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&mbid=MBID&api_key=YOUR_API_KEY&format=json"
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

function mbidGetJson(type, mbid){
    var rtn;
    let url = forgeMbidRequest(type, mbid)
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

function search(keyword = "", mbid=""){
    if(keyword == "" && mbid == ""){keyword = searchBox.value;}
    if(keyword == "" && mbid == ""){return;}

    clearResults();
    showResults(false);

    curmbid = getArtistMbid(keyword);
    console.log(curmbid);
    if(curmbid == -1){showResults(false);alert("Artist not found");return;}

    jsonTracks = mbidGetJson(mbidReqTypes.ArtistTopTracks, curmbid).toptracks.track;
    jsonAlbums = mbidGetJson(mbidReqTypes.ArtistTopAlbums, curmbid).topalbums.album;
    jsonSimilar = mbidGetJson(mbidReqTypes.ArtistSimilar, curmbid).similarartists.artist;
    jsonInfo = mbidGetJson(mbidReqTypes.ArtistInfo, curmbid).artist;

    print();

}

function print(){
    clearResults();
    switch(curFilter){
        case 0:
            printTopResult();
            printAlbums();
            printTracks();
            printArtist();
            break;
        case 1:
            printTracks();
            break;
        case 2:
            printAlbums();
            break;
        case 3:
            printArtist();
            break;
    }
    showResults(true);
}

function getArtistMbid(name){
    data = getJson(forgeRequest(reqTypes.ArtistSearch, name));
    if(data.hasOwnProperty('error')){return -1;}
    if(data.results.artistmatches.artist[0].mbid.length < 10){return -1;}
    return data.results.artistmatches.artist[0].mbid;
}

function printTopResult(){
    let inst = topResultTemp;
    inst.getElementsByClassName("topTitle")[0].innerHTML = jsonInfo.name;
    inst.getElementsByClassName("topImg")[0].src = jsonInfo.image[3]['#text'];
    inst.getElementsByClassName("topJoker")[0].innerHTML = jsonInfo.stats.listeners;
    // inst.getElementsByClassName("trArtist")[0].innerHTML = tr.artist.name;
        
    topResultParent.insertAdjacentHTML('beforeend', inst.outerHTML);
}

function printTracks(){
    var addedTr = 0;
    var trI = -1;
    let maxRes = printTrackCount;
    if(Object.keys(jsonTracks).length < maxRes){maxRes = Object.keys(jsonTracks).length;}

    while(addedTr < maxRes){
        trI++;
        let tr = jsonTracks[trI];
        
        let inst = trackInfoTemp;
        inst.getElementsByClassName("trImg")[0].src = tr.image[2]['#text'];
        inst.getElementsByClassName("trName")[0].innerHTML = tr.name;
        inst.getElementsByClassName("trArtist")[0].innerHTML = tr.artist.name;
        inst.getElementsByClassName("trLen")[0].innerHTML = tr.listeners;
        
        addedTr++;
        topTrackParent.insertAdjacentHTML('beforeend', inst.outerHTML);
    }
}

function printAlbums(){
    var addedTr = 0;
    var trI = -1;
    let maxRes = printAlbumCount;
    if(Object.keys(jsonAlbums).length < printAlbumCount){maxRes = Object.keys(jsonAlbums).length;}

    while(addedTr < maxRes){
        trI++;
        let tr = jsonAlbums[trI];
        
        let inst = albumInfoTemp;
        inst.getElementsByClassName("albImg")[0].src = tr.image[2]['#text'];
        inst.getElementsByClassName("albName")[0].innerHTML = tr.name;
        inst.getElementsByClassName("albArtist")[0].innerHTML = tr.artist.name;
        
        addedTr++;
        topAlbumParent.insertAdjacentHTML('beforeend', inst.outerHTML);
    }
}

function printArtist(){
    var addedTr = 0;
    var trI = -1;
    let maxRes = printArtistCount;
    if(Object.keys(jsonSimilar).length < printArtistCount){maxRes = Object.keys(jsonSimilar).length;}

    while(addedTr < maxRes){
        trI++;
        let tr = jsonSimilar[trI];
        
        let inst = artistInfoTemp;
        inst.getElementsByClassName("artImg")[0].src = tr.image[2]['#text'];
        inst.getElementsByClassName("artName")[0].innerHTML = tr.name;
        
        addedTr++;
        topArtistParent.insertAdjacentHTML('beforeend', inst.outerHTML);
    }
}

// filter settings


function showAll(){
    if(document.getElementsByClassName("topRow")[0].classList.contains("hideItem")){document.getElementsByClassName("topRow")[0].classList.remove("hideItem");}
    if(document.getElementsByClassName("lst3")[0].classList.contains("hideItem")){document.getElementsByClassName("lst3")[0].classList.remove("hideItem");}
    if(document.getElementsByClassName("topAlbumRes")[0].classList.contains("hideItem")){document.getElementsByClassName("topAlbumRes")[0].classList.remove("hideItem");}
    if(document.getElementsByClassName("lst4")[0].classList.contains("hideItem")){document.getElementsByClassName("lst4")[0].classList.remove("hideItem");}
    if(document.getElementsByClassName("topArtistRes")[0].classList.contains("hideItem")){document.getElementsByClassName("topArtistRes")[0].classList.remove("hideItem");}
    if(document.getElementsByClassName("topRow")[0].classList.contains("fixTracksShow")){document.getElementsByClassName("topRow")[0].classList.remove("fixTracksShow");}
    if(document.getElementsByClassName("topResParent")[0].classList.contains("hideItem")){document.getElementsByClassName("topResParent")[0].classList.remove("hideItem");}
    if(document.getElementsByClassName("lst1")[0].classList.contains("hideItem")){document.getElementsByClassName("lst1")[0].classList.remove("hideItem");}
}

function hideTracks(){
    if(!document.getElementsByClassName("topRow")[0].classList.contains("hideItem")){document.getElementsByClassName("topRow")[0].classList.add("hideItem");}
}

function showTracks(){
    if(!document.getElementsByClassName("topResParent")[0].classList.contains("hideItem")){document.getElementsByClassName("topResParent")[0].classList.add("hideItem");}
    if(!document.getElementsByClassName("lst1")[0].classList.contains("hideItem")){document.getElementsByClassName("lst1")[0].classList.add("hideItem");}
    if(!document.getElementsByClassName("topRow")[0].classList.contains("fixTracksShow")){document.getElementsByClassName("topRow")[0].classList.add("fixTracksShow");}
}

function hideAlbums(){
    if(!document.getElementsByClassName("lst3")[0].classList.contains("hideItem")){document.getElementsByClassName("lst3")[0].classList.add("hideItem");}
    if(!document.getElementsByClassName("topAlbumRes")[0].classList.contains("hideItem")){document.getElementsByClassName("topAlbumRes")[0].classList.add("hideItem");}
}

function hideArtists(){
    if(!document.getElementsByClassName("lst4")[0].classList.contains("hideItem")){document.getElementsByClassName("lst4")[0].classList.add("hideItem");}
    if(!document.getElementsByClassName("topArtistRes")[0].classList.contains("hideItem")){document.getElementsByClassName("topArtistRes")[0].classList.add("hideItem");}
}

function resetFilters(){
    if(curFilter == 0){return;}
    filterAll.classList.add("typeSelBtnSelected");
    filterTracks.classList.remove("typeSelBtnSelected");
    filterAlbums.classList.remove("typeSelBtnSelected");
    filterArtist.classList.remove("typeSelBtnSelected");
}

function updateFilterGraph(){
    let fs = [filterAll, filterTracks, filterAlbums, filterArtist];
    for(let i = 0; i < fs.length; i++){
        if(curFilter == i){fs[i].classList.add("typeSelBtnSelected"); continue;}
        fs[i].classList.remove("typeSelBtnSelected");
    }
}

function selectFilter(sender){
    showAll();
    switch(sender.textContent){
        case "All":
            curFilter = 0;
            printAlbumCount = 4;
            printArtistCount = 4;
            printTrackCount = 4;
            break;
        case "Tracks":
            curFilter = 1;
            printTrackCount = 15;
            hideAlbums();
            hideArtists();
            showTracks();
            break;
        case "Albums":
            curFilter = 2;
            printAlbumCount = 15;
            hideTracks();
            hideArtists();
            break;
        case "Artists":
            curFilter = 3;
            printArtistCount = 15;
            hideTracks();
            hideAlbums();
            break;
    }
    updateFilterGraph();
    print();
}