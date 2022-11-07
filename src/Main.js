// initiating vaiables

var ApiKey = "";

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

function forgeRequest(type, artist="",album="",track=""){
    var rtn = String(type).replace("YOUR_API_KEY", ApiKey);
    if(String(type).includes("ARGART") && artist != ""){rtn = rtn.replace("ARGART", artist);}else{return -1;}
    if(String(type).includes("ARGALB") && album != ""){rtn = rtn.replace("ARGALB", album);}else{return -1;}
    if(String(type).includes("ARGTR") && track != ""){rtn = rtn.replace("ARGTR", track);}else{return -1;}
    return rtn;
}