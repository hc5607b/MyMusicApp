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

var obj
$(document).ready(function(){
    searchBox = $(".searchIP");
    topResultTemp = $(".topResult");
    trackInfoTemp = $(".track")[0];
    albumInfoTemp = $(".album")[0];
    artistInfoTemp = $(".artist")[0];

    
    topResultParent = $(".topResParent");
    topTrackParent = $(".topSongRes");
    topAlbumParent = $(".topAlbumRes");
    topArtistParent = $(".topArtistRes");
    resultsParent = $(".result");

    let filters = $(".typeSelBtn");
    filterAll = filters[0];
    filterTracks = filters[1];
    filterAlbums = filters[2];
    filterArtist = filters[3];

    // adding eventlisteners for search and filters
    searchBox.keypress(function(e){if(e.keyCode == '13'){search();}});
    $(".typeSelBtn").click(function(e){selectFilter(e.target);});

    // remove templates and clear the view
    clearResults();
    showResults(false);
    resetFilters();

    search("Iron maiden");

    // filterAll.click(function(){$(this).hide();});
    // filterTracks.click(function(){selectFilter(filterTracks);});
    // filterAlbums.click(function(){selectFilter(filterAlbums);});
    // filterArtist.click(function(){selectFilter(filterArtist);});
});


// window.onload = function(){

//     // finding dom elements
//     searchBox = document.getElementsByClassName("searchIP")[0];
//     topResultTemp = document.getElementsByClassName("topResult")[0];
//     trackInfoTemp = document.getElementsByClassName("track")[0];
//     albumInfoTemp = document.getElementsByClassName("album")[0];
//     artistInfoTemp = document.getElementsByClassName("artist")[0];

//     topResultParent = document.getElementsByClassName("topResParent")[0];
//     topTrackParent = document.getElementsByClassName("topSongRes")[0];
//     topAlbumParent = document.getElementsByClassName("topAlbumRes")[0];
//     topArtistParent = document.getElementsByClassName("topArtistRes")[0];
//     resultsParent = document.getElementsByClassName("result")[0];

//     // finding dom elements with different style
//     let filters = document.getElementsByClassName("typeSelBtn");
//     filterAll = filters[0];
//     filterTracks = filters[1];
//     filterAlbums = filters[2];
//     filterArtist = filters[3];

//     // remove templates and clear the view
//     clearResults();
//     showResults(false);
//     resetFilters();

//     // adding eventlisteners for search and filters
//     searchBox.addEventListener("keypress", function(e){if(e.key == "Enter"){search();}}, false);
//     filterAll.addEventListener("click", function(e){selectFilter(filterAll)}, false);
//     filterTracks.addEventListener("click", function(e){selectFilter(filterTracks)}, false);
//     filterAlbums.addEventListener("click", function(e){selectFilter(filterAlbums)}, false);
//     filterArtist.addEventListener("click", function(e){selectFilter(filterArtist)}, false);

//     // lets make some search 
//     search("Iron maiden");
// }

/*
*       HELP FUNCTIONS
*/

// function for clearing results
function clearResults(){
    // checks if parent has children and remove them all for all categories
    while(topResultParent.children().length>0){
        topResultParent.children()[0].remove();
    }
    while(topTrackParent.children().length>0){
        topTrackParent.children()[0].remove();
    }
    while(topAlbumParent.children().length>0){
        topAlbumParent.children()[0].remove();
    }
    while(topArtistParent.children().length>0){
        topArtistParent.children()[0].remove();
    }
}

// function for switching overall results visibility
function showResults(visible){
    if(!visible && !resultsParent.hasClass("hideItem")){
        resultsParent.addClass("hideItem");
    }
    if(visible && resultsParent.hasClass("hideItem")){
        resultsParent.removeClass("hideItem");
    }
}

// structure for request urls with search words
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

// structure for request urls with mbid
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

// function for creating request url without mbid
function forgeRequest(type, artist="",album="",track=""){
    // adding apikey to request
    var rtn = String(type).replace("YOUR_API_KEY", ApiKey);

    // lets filter what else request needs
    if(String(rtn).includes("ARGART")){if(artist == ""){return -1;}rtn = rtn.replace("ARGART", artist);}
    if(String(rtn).includes("ARGALB")){if(album == ""){return -2;}rtn = rtn.replace("ARGALB", album);}
    if(String(rtn).includes("ARGTR")){if(track == ""){return -3;}rtn = rtn.replace("ARGTR", track);}
    return rtn;
}

// function for creating request url with mbid
function forgeMbidRequest(type, mbid){
    // creates request url with apikey and given mbid
    return String(type).replace("YOUR_API_KEY", ApiKey).replace("MBID", mbid);
}

// function for apicall. takes request type and keywords as parametters
function getJson(type, artist="",album="",track=""){
    var rtn;
    // creates request url with helpfunction. passes paremmetters to helpfunction
    let _url = forgeRequest(type, artist,album,track)

    // lets create xhttp request and itit it

    $.ajax({
        url: _url,
        type: 'get',
        dataType: 'html',
        async: false,
        success:function(data){
            rtn = JSON.parse(data);
        }
    });

    // returns response
    return rtn;
}

// function for apicall. takes request type and mbid.
function mbidGetJson(type, mbid){
    // all same things as abowe. only difference is url helpfunction
    var rtn;
    let _url = forgeMbidRequest(type, mbid)
    $.ajax({
        url: _url,
        type: 'get',
        dataType: 'html',
        async: false,
        success:function(data){
            rtn = JSON.parse(data);
        }
    });
    return rtn;
}


/*
*       The Code
*/

// search with given keyword
function search(keyword = ""){
    // lets check if function was called with ot without keyword parameter
    if(keyword == ""){keyword = searchBox.val();}
    // if theres no keyword applied, cancel search
    if(keyword == ""){return;}
    // clear site for new data
    clearResults();
    showResults(false);

    // gets artist mbid and saves it to variable
    curmbid = getArtistMbid(keyword);
    console.log(curmbid);
    
    // if mbid is negative, function returned error. In this case search is cancelled and user notified
    if(curmbid < 0){showResults(false);alert("Artist not found");return;}

    // get artist data with mbid
    jsonTracks = mbidGetJson(mbidReqTypes.ArtistTopTracks, curmbid).toptracks.track;
    jsonAlbums = mbidGetJson(mbidReqTypes.ArtistTopAlbums, curmbid).topalbums.album;
    jsonSimilar = mbidGetJson(mbidReqTypes.ArtistSimilar, curmbid).similarartists.artist;
    jsonInfo = mbidGetJson(mbidReqTypes.ArtistInfo, curmbid).artist;

    // print data
    print();
}

// prints current data
function print(){
    // clears site for new data
    clearResults();

    // checks which filter is on
    switch(curFilter){
        case 0: // show all
            printTopResult();showResults(true);return;
            printAlbums();
            printTracks();
            printArtist();
            break;
        case 1: // show tracks
            printTracks();
            break;
        case 2: // show albums
            printAlbums();
            break;
        case 3: // show similar artists
            printArtist();
            break;
    }

    // makes sure that result parent is visible
    showResults(true);
}

// function for getting artis mbid
function getArtistMbid(name){
    // initiate path for mbid
    let p = ['results', 'artistmatches', 'artist', 'mbid'];

    // download data from api
    data = getJson(forgeRequest(reqTypes.ArtistSearch, name));

    // checks if api returned error
    if(data.hasOwnProperty('error')){return -1;}
    
    // temporary datapoint for checking
    temp = data;

    // go through json path
    for (let i = 0; i < p.length; i++){
        // in first round just chekc if key exits. returns -2 if not. if exits change temp to current key and skip rest of round
        if(i == 0){if(!temp.hasOwnProperty(p[i])){return -2;}else{temp = temp[p[i]]; continue;}}

        // lets check if current key is array. if it is, temp will be first member. if array is empty return -2
        if(Array.isArray(temp)){if(temp.length <= 0){return -2;}temp = temp[0];}

        // check if temp has next key from list. if not return -2. if it has temp is next key
        if(!temp.hasOwnProperty(p[i])){return -2;}else{temp = temp[p[i]];}
    }

    // if json check above succeed, check if mbid is is not empty. if it is, return -3. if not, return mbid
    if(data.results.artistmatches.artist[0].mbid.length < 10){return -3;}
    return data.results.artistmatches.artist[0].mbid;
}

// print top result box
function printTopResult(){
    let inst = topResultTemp;
    // console.log(inst);
    // add values from current variables
    inst.find(".topTitle").html(jsonInfo.name);
    inst.find(".topJoker").html(jsonInfo.topJoker);
    inst.find(".topImg").attr('src', jsonInfo.image[3]['#text']);
    // inst.getElementsByClassName("topImg")[0].src = jsonInfo.image[3]['#text'];
    // inst.getElementsByClassName("topJoker")[0].innerHTML = jsonInfo.topJoker;
        
    // console.log(topResultParent);
    // print html under given parent
    topResultParent.append(inst);
    // creates instace of top result template
    // let inst = topResultTemp;

    // // add values from current variables
    // inst.getElementsByClassName("topTitle")[0].innerHTML = jsonInfo.name;
    // inst.getElementsByClassName("topImg")[0].src = jsonInfo.image[3]['#text'];
    // inst.getElementsByClassName("topJoker")[0].innerHTML = jsonInfo.stats.listeners;
        
    // // print html under given parent
    // $(topResultParent).append(inst);
}

// prints tracks
function printTracks(){
    var addedTr = 0; // track count
    var trI = -1; // index for tracks
    let maxRes = printTrackCount; // amount of tracks to show

    // check if theres less results than default print amount is
    if(Object.keys(jsonTracks).length < maxRes){maxRes = Object.keys(jsonTracks).length;}

    // loop until theres enought tracks shown
    while(addedTr < maxRes){
        trI++;

        // current track data as json
        let tr = jsonTracks[trI];
        
        // creates instace of template
        let inst = trackInfoTemp;

        // add values from current variables
        inst.getElementsByClassName("trImg")[0].src = tr.image[2]['#text'];
        inst.getElementsByClassName("trName")[0].innerHTML = tr.name;
        inst.getElementsByClassName("trArtist")[0].innerHTML = tr.artist.name;
        inst.getElementsByClassName("trLen")[0].innerHTML = tr.listeners;
        
        addedTr++;

        // print html under given parent
        topTrackParent.insertAdjacentHTML('beforeend', inst.outerHTML);
    }
}

// prints albums. Functionality is same as above
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

// prints albums. Functionality is same as above
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

/*
 *      Filter Settings 
 */


// removes css hides from all elements
function showAll(){
    if($(".topRow").hasClass("hideItem")){$(".topRow").removeClass("hideItem");}
    // if(document.getElementsByClassName("topRow")[0].classList.contains("hideItem")){document.getElementsByClassName("topRow")[0].classList.remove("hideItem");}

    if($(".lst3").hasClass("hideItem")){$(".lst3").removeClass("hideItem");}
    // if(document.getElementsByClassName("lst3")[0].classList.contains("hideItem")){document.getElementsByClassName("lst3")[0].classList.remove("hideItem");}

    if($(".topAlbumRes").hasClass("hideItem")){$(".topAlbumRes").removeClass("hideItem");}
    // if(document.getElementsByClassName("topAlbumRes")[0].classList.contains("hideItem")){document.getElementsByClassName("topAlbumRes")[0].classList.remove("hideItem");}

    if($(".lst4").hasClass("hideItem")){$(".lst4").removeClass("hideItem");}
    // if(document.getElementsByClassName("lst4")[0].classList.contains("hideItem")){document.getElementsByClassName("lst4")[0].classList.remove("hideItem");}

    if($(".topArtistRes").hasClass("hideItem")){$(".topArtistRes").removeClass("hideItem");}
    // if(document.getElementsByClassName("topArtistRes")[0].classList.contains("hideItem")){document.getElementsByClassName("topArtistRes")[0].classList.remove("hideItem");}

    if($(".topRow").hasClass("fixTracksShow")){$(".topRow").removeClass("fixTracksShow");}
    // if(document.getElementsByClassName("topRow")[0].classList.contains("fixTracksShow")){document.getElementsByClassName("topRow")[0].classList.remove("fixTracksShow");}

    if($(".topResParent").hasClass("hideItem")){$(".topResParent").removeClass("hideItem");}
    // if(document.getElementsByClassName("topResParent")[0].classList.contains("hideItem")){document.getElementsByClassName("topResParent")[0].classList.remove("hideItem");}

    if($(".lst1").hasClass("hideItem")){$(".lst1").removeClass("hideItem");}
    // if(document.getElementsByClassName("lst1")[0].classList.contains("hideItem")){document.getElementsByClassName("lst1")[0].classList.remove("hideItem");}
}

// hides only tracks
function hideTracks(){
    if(!document.getElementsByClassName("topRow")[0].classList.contains("hideItem")){document.getElementsByClassName("topRow")[0].classList.add("hideItem");}
}

// shows tracks. There was some display options which need to be done here
function showTracks(){
    if(!document.getElementsByClassName("topResParent")[0].classList.contains("hideItem")){document.getElementsByClassName("topResParent")[0].classList.add("hideItem");}
    if(!document.getElementsByClassName("lst1")[0].classList.contains("hideItem")){document.getElementsByClassName("lst1")[0].classList.add("hideItem");}
    if(!document.getElementsByClassName("topRow")[0].classList.contains("fixTracksShow")){document.getElementsByClassName("topRow")[0].classList.add("fixTracksShow");}
}

// hides only albums
function hideAlbums(){
    if(!document.getElementsByClassName("lst3")[0].classList.contains("hideItem")){document.getElementsByClassName("lst3")[0].classList.add("hideItem");}
    if(!document.getElementsByClassName("topAlbumRes")[0].classList.contains("hideItem")){document.getElementsByClassName("topAlbumRes")[0].classList.add("hideItem");}
}

// hides only artists
function hideArtists(){
    if(!document.getElementsByClassName("lst4")[0].classList.contains("hideItem")){document.getElementsByClassName("lst4")[0].classList.add("hideItem");}
    if(!document.getElementsByClassName("topArtistRes")[0].classList.contains("hideItem")){document.getElementsByClassName("topArtistRes")[0].classList.add("hideItem");}
}

// resets filters to default (show all)
function resetFilters(){
    if(curFilter == 0){return;}
    $(filterAll).addClass("typeSelBtnSelected");
    $(filterTracks).removeClass("typeSelBtnSelected");
    $(filterAlbums).removeClass("typeSelBtnSelected");
    $(filterArtist).removeClass("typeSelBtnSelected");
}

// function for changing filter graphics
function updateFilterGraph(){
    // list of all filter elements
    let fs = [filterAll, filterTracks, filterAlbums, filterArtist];

    for(let i = 0; i < fs.length; i++){
        // if filter i is current filter, change visuals and skip round
        if(curFilter == i){$(fs[i]).addClass("typeSelBtnSelected"); continue;}
        // cahges visuals to not selected
        $(fs[i]).removeClass("typeSelBtnSelected");
    }
}

// selects sender filter
function selectFilter(sender){
    // show all in site
    showAll();

    switch(sender.textContent){ // KORJAA
        case "All": // show all, set print amounts
            curFilter = 0;
            printAlbumCount = 4;
            printArtistCount = 4;
            printTrackCount = 4;
            break;
        case "Tracks": // hide all but tracks and set print amount for tracks
            curFilter = 1;
            printTrackCount = 15;
            hideAlbums();
            hideArtists();
            showTracks();
            break;
        case "Albums": // hide all but albums and set print amount for albums
            curFilter = 2;
            printAlbumCount = 15;
            hideTracks();
            hideArtists();
            break;
        case "Artists": // hide all but artists and set print amount for artists
            curFilter = 3;
            printArtistCount = 15;
            hideTracks();
            hideAlbums();
            break;
    }

    // updates filters to show right way
    updateFilterGraph();

    // print results
    print();
}