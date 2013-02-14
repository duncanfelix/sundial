/*! SundialJS v1.0.0 2013-11-01 by Duncan Trevithick @dunctk - MIT License */


// get today's sunlight times for London

var times = SunCalc.getTimes(new Date(), 51.5, -0.1);


// format sunrise time from the Date object

var sunriseStr = moment(times.sunrise).format('HH:mm');
var sunsetStr = moment(times.sunset).format('HH:mm');


//Get the user's longitude

navigator.geolocation.getCurrentPosition(GetLongitude);
function GetLongitude(location) {
    return(location.coords.latitude);
}


//Set the stage

var stage = new Kinetic.Stage({
	container: 'container',
	width: 600,
	height: 600
});


function getDialAngle(time) {
	var angle = (((time.getHours() * 60) + time.getMinutes()) * 0.25 ) + 90;
	return angle;
};	

var current_time = new Date();


// Seperate layer for dial elements

var dialLayer = new Kinetic.Layer();


// 'Sunny' part of the dial

var dialDaytime = new Kinetic.Shape ({
	x: stage.getWidth() / 2,
	y: stage.getHeight() / 2,
	stroke: '#f0e6a3',
	strokeWidth: 3,
	drawFunc: function(context) {
		//One minute on the dial, in radians
		var r = 0.00432;
		var riseTime = times.sunrise;
		var setTime = times.sunset;
		var riseAngle = (getDialAngle(riseTime) * r);
		var setAngle = (getDialAngle(setTime) * r * Math.PI);
		console.log(setAngle);
		console.log(riseAngle);
		context.beginPath();
		context.arc(0, 0, 250, riseAngle, setAngle);
		context.fillStrokeShape(this);
	}
});
dialDaytime.rotate(Math.PI * 0.5);

// The 'night' part of the dial

var dialBase = new Kinetic.Circle({
	x: stage.getWidth() / 2,
	y: stage.getHeight() / 2,
	radius: 250,
	stroke: '#969696',
	strokeWidth: 1
});

var dialTimeText = new Kinetic.Text({
	x: dialBase.getX(current_time) - 110,
	y: dialBase.getY(current_time) - 50,
    fontSize: 45,
    width: 220,
    fontFamily: 'Exo, sans-serif',
    fill: '#969696',
    align: 'center'
});
var dialSunriseTimeText = new Kinetic.Text({
	x: dialBase.getX(current_time) - 350,
	y: dialBase.getY(current_time) + 160,
    fontSize: 18,
    width: 200,
    fontFamily: 'Exo, sans-serif',
    fill: '#969696',
    align: 'center',
    text: sunriseStr
});
var dialSunsetTimeText = new Kinetic.Text({
	x: dialBase.getX(current_time) + 150,
	y: dialBase.getY(current_time) + 160,
    fontSize: 18,
    width: 200,
    fontFamily: 'Exo, sans-serif',
    fill: '#969696',
    align: 'center',
    text: sunsetStr
});
var dialDateText = new Kinetic.Text({
	x: dialBase.getX(current_time) - 100,
	y: dialBase.getY(current_time),
    fontSize: 18,
    width: 200,
    fontFamily: 'Exo, sans-serif',
    fill: '#969696',
    align: 'center',
    text: (moment().format('MMMM Do YYYY'))
});
var dialLocationText = new Kinetic.Text({
	x: dialBase.getX(current_time) - 100,
	y: dialBase.getY(current_time) + 30,
    fontSize: 18,
    width: 200,
    fontFamily: 'Exo, sans-serif',
    fill: '#969696',
    align: 'center',
    text: 'London, UK'
});
	
function getSunset() {
	var sunset = new Date ();
	//Placeholder data
	sunset.setDate(2013, 9, 17, 8, 0, 0);
	return(sunset);
};
function getX(time) {
	var angle = getDialAngle(time);
	var x = dialBase.getX() + dialBase.getRadius()  * Math.cos(angle * (Math.PI / 180));
	return(x);
};
function getY(time){
	var angle = getDialAngle(time);
	var y = dialBase.getY() + dialBase.getRadius()  * Math.sin(angle * (Math.PI / 180));
	return y;
};

var sun_layer = new Kinetic.Layer();
var sun_circle = new Kinetic.Circle({
	x: getX(current_time),
	y: getY(current_time),
	radius: 30,
	fill: '#f0e6a3',
	draggable: false
});




// Asign the dial elemnts to layers and draw them

dialLayer.add(dialDaytime);
dialLayer.add(dialDateText);
dialLayer.add(dialLocationText);
dialLayer.add(dialTimeText);
dialLayer.add(dialSunriseTimeText);
dialLayer.add(dialSunsetTimeText);
dialLayer.add(dialBase);		
stage.add(dialLayer);
sun_layer.add(sun_circle);
stage.add(sun_layer);
onUpdateTimeText();




//Set time to keep the dial time updated

setInterval(function() {onUpdateTimeText() }, 1000);
function onUpdateTimeText() {
	var current_time = new Date();
	dialTimeText.setText(moment().format('HH:mm:ss'));
	dialLayer.draw();
}

setInterval(function() {onUpdateSunPosition() }, 30000);
function onUpdateSunPosition() {
	var current_time = new Date();
	sun_circle.setX(getX(current_time));
	sun_circle.setY(getY(current_time));
	sun_layer.draw();
}

