var orientationoffset = {tiltLR: 0, tiltFB: 0, dir: 0};
var currentorientation = {tiltLR: 0, tiltFB: 0, dir: 0};

var items = [
  {uri: "microwave",
    location: {dir: 10},
    color: "blue"
  },
  {uri: "flower",
    location: {dir: 90},
    color: "red"
  },
  {uri: "lamp",
    location: {dir: -90},
    color: "white",
    controlON: "http://cumulus.teco.edu:81/21345gjphtnch87/ON",
    controlOFF: "http://cumulus.teco.edu:81/21345gjphtnch87/OFF"
  },
  {uri: "coffeemachine",
    location: {dir: 170},
    color: "black"
  },
  {uri: "fridge",
    location: {dir: 160},
    color: "gray"
  }
];

function generatePattern(svgparent, size, image, id){
    svgparent.append("defs")
      .append('pattern')
        .attr('id', id)
        .attr('patternUnits', 'objectBoundingBox')
        .attr('width', 50)
        .attr('height', 50)
       .append("image")
        .attr("xlink:href", image)
        .attr('width', size)
        .attr('height', size);
  }
function generateCircle(svgparent, radius) {
  svgparent.append("circle")
    .attr("r", radius)
    .style("fill", "none")
    .style("stroke", "#ff6f00")
    .attr("class", "svgshadow");
}
function initRadar(divSelector) {
  $(divSelector).html('');
  var spacetime = d3.select(divSelector);

  var svgWidth = 370;
  var svgHeight = 370;

  var width = svgWidth,
      height = svgHeight,
      radius = Math.min(width, height);
      radarradius = Math.round(radius/2.5);
      itemradius = Math.round(radarradius/8);

  var svg = spacetime.append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var w = width/7;
  var center = svg.append("g")
      .append("svg:a")
      .attr("id", "radarButton")
      .attr("class", "page-scroll")
      .attr("xlink:href", "#pagecontent");
  center.append("svg:image")
      .attr("xlink:href", "img/arrow.png")
      .attr("x", -w/2)
      .attr("y", -w/2)
      .attr("width", w)
      .attr("height", w);

  generateCircle(svg, radarradius);
  generateCircle(svg, radarradius*5/6);
  generateCircle(svg, radarradius*2/3);
  generateCircle(svg, radarradius/2);

  svg.append("circle")
    .attr("r", radarradius/3)
    .attr("id", "selectionCircle")
    .style("stroke", "#ff6f00")
    .attr("fill","none");

  generatePattern(svg, 50, "img/flower.png", 'flowerpattern');
  generatePattern(svg, 100, "img/flower.png", 'flowerpatternFull');

  generatePattern(svg, 50, "img/microwave.png", 'microwavepattern');
  generatePattern(svg, 100, "img/microwave.png", 'microwavepatternFull');

  generatePattern(svg, 50, "img/lamp.png", 'lamppattern');
  generatePattern(svg, 100, "img/lamp.png", 'lamppatternFull');
  
  generatePattern(svg, 50, "img/coffeemachine.jpg", 'coffeemachinepattern');
  generatePattern(svg, 100, "img/coffeemachine.jpg", 'coffeemachinepatternFull');

  generatePattern(svg, 50, "img/fridge.jpg", 'fridgepattern');
  generatePattern(svg, 100, "img/fridge.jpg", 'fridgepatternFull');


  $.each(items, function(key, val){
    var x = radarradius*Math.sin((val.location.dir-getLocation().dir)*Math.PI/180);
    var y = -radarradius*Math.cos((val.location.dir-getLocation().dir)*Math.PI/180);
    // console.log(x,y)
    svg.append("circle")
      .attr("class", "items " + val.uri)
      .attr("r", itemradius)
      .attr("transform", "translate("+x+"," + y + ")")
      .style("stroke", "black")
      .attr("fill","url(#"+val.uri+"pattern)");
  });
}
var showItems = false;

function toggleShowSelectedItem() {
  showItems = !showItems
  if(showItems) $('.br_to_lengthenpage').hide();
  else $('.br_to_lengthenpage').show();
}
var vibrating = false;

function updatePositions(items, direction) {
  var radartarget = null;
  var guard = false;

  $.each(items, function(key, val){
    var degree = val.location.dir;
    var actualDirection = degree+direction;
    // console.log(getLocation().dir,actualDirection)
    // $('#radartarget1').html(Math.round(getLocation().dir) + " " + Math.round(actualDirection));
    var x = radarradius*Math.sin(actualDirection*Math.PI/180);
    var y = -radarradius*Math.cos(actualDirection*Math.PI/180);
    d3.select("."+val.uri)
      .attr("transform", "translate("+x+", "+y+")");
  });
}
function showItem(uri) {
  $.each(items, function(key, value) {
    if(uri == 'all' || uri == value.uri) {
      document.getElementById(value.uri).style.display = 'block';
    } else {
      document.getElementById(value.uri).style.display = 'none';
    }
  })
}

function getLocation() {
  var location = {};
  location.dir = currentorientation.dir - orientationoffset.dir;
  return location;
}

function turnDirection() {
  currentorientation.dir += 10;
  if(currentorientation.dir > 180) 
      currentorientation.dir = currentorientation.dir-360;
  updatePositions();
}
function resetOrientation() {
  orientationoffset.tiltLR = currentorientation.tiltLR;
  orientationoffset.tiltFB = currentorientation.tiltFB;
  orientationoffset.dir = currentorientation.dir;
}
// var initialResetDone = false;

// function init() {
//   if (window.DeviceOrientationEvent) {
//     // Listen for the deviceorientation event and handle the raw data
//     window.addEventListener('deviceorientation', function(eventData) {
//       // gamma is the left-to-right tilt in degrees, where right is positive
//       var tiltLR = eventData.gamma;
      
//       // beta is the front-to-back tilt in degrees, where front is positive
//       var tiltFB = eventData.beta;
      
//       // alpha is the compass direction the device is facing in degrees
//       var dir = eventData.alpha;
      
//       currentorientation.tiltLR = tiltLR;
//       currentorientation.tiltFB = tiltFB;
//       currentorientation.dir = (dir<0) ? 360+dir : dir;
//       if(!initialResetDone) {
//         resetOrientation();
//         initialResetDone = true;
//       }
//       // if(dir < orientationoffset.dir) {
//       //   dir = 360 - (orientationoffset.dir - dir);
//       // } else {
//       //   dir = dir - orientationoffset.dir;
//       // }
//       // call our orientation event handler

//       count++;
//       if(count % 10===1) {
//         updatePositions();
//       }
//       }, false);
//   } else {
//     console.log("Device orientation is not supported on your device or browser.");
//   }
// }
