var express=require("express");
var app=express();
var request=require("request");;
var bodyParser=require("body-parser");
var data={'grant_type':'client_credentials'}
var client_ID="eeef5000bed84f44a9b1c6a4513dd779";
var nodeBase64 = require('nodejs-base64-converter');
var client_secret = "b89bb772965342da96acfdffe7dc9799"; 
var auth=nodeBase64.encode(client_ID+":"+client_secret);
var headers={'Authorization':'Basic '+auth};
let c = 0;

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
	if (++c == 1){
	console.log("bhhhsa");
	request.post({url: "https://accounts.spotify.com/api/token",form:data,headers:headers,method:'POST'},
	function(err,reponse,body){
				var data=JSON.parse(body);
				access_token=data.access_token;
				console.log(access_token + "root");
				res.render("search");
		});
	}
});
	
app.get("/song", function(req, res) { 
	console.log(access_token , req.query);
	headers={'Authorization' : 'Bearer '+access_token};	
	var song=req.query.songName;
	var url="https://api.spotify.com/v1/search?q="+song+"&type=track&market=IN&offset=1&limit=20";
	request({url:url,headers:headers},function(err,reponse,body){
		if(err){
			console.log("Error!!");
		}else{
			var val=JSON.parse(body);
			console.log(val);
			res.render("results",{val:val,song:song});
		}
	});
});

app.get("/song/:id",function(req, res){
	console.log(access_token);
	headers={'Authorization' : 'Bearer '+access_token};	
	var url_audio_features="https://api.spotify.com/v1/audio-features/"+req.params.id;
	var url_track="https://api.spotify.com/v1/tracks/"+req.params.id;
	request({url:url_track,headers:headers},function(err,reponse,body){
		if(err){
			console.log("Error!!");
		}else{
			var track_details=JSON.parse(body);
			request({url:url_audio_features,headers:headers},function(err,reponse,body){
				if(err){
					console.log("Error!!");
				}else{
					var audio_features=JSON.parse(body);
					console.log(audio_features);
					res.render("show",{track_details:track_details});
				}    
			});
		}
	});
	
});
app.get("*",function(req,res){
	res.send("Page not found 404!");
});

app.listen(3009, function(){
	console.log("Song search app has started!!!");
});