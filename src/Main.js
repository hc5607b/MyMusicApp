// initiating vaiables

var ApiKey ="e05a0056d9a60887f4074642759dc724";

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
    if(String(rtn).includes("ARGART")){if(artist == ""){return -1;}rtn = rtn.replace("ARGART", artist);}
    if(String(rtn).includes("ARGALB")){if(album == ""){return -1;}rtn = rtn.replace("ARGALB", album);}
    if(String(rtn).includes("ARGTR")){if(track == ""){return -1;}rtn = rtn.replace("ARGTR", track);}
    return rtn;
}

function search(){
    
}

function selectFilter(){
    
}