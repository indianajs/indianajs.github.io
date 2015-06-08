// exports.printMsg = function() {
//   console.log("Hello World IndianaJS :)");
// }

var spatialAwareness = function(items) {
	var originalOrientation = {tiltLR: 0, tiltFB: 0, dir: 0};
	var currentOrientation = {tiltLR: 0, tiltFB: 0, dir: 0};
	var position = {x:0, y:0};

	var itemsArray = items;
	var range = 10;
	
	var initialResetDone = false;
	initDeviceOrientation(function(tiltLR,tiltFB,dir) {

		if(!initialResetDone) {
			originalOrientation.tiltLR = currentOrientation.tiltLR;
			originalOrientation.tiltFB = currentOrientation.tiltFB;
			originalOrientation.dir = currentOrientation.dir;
			initialResetDone = true;
			console.log(originalOrientation);
		}

		currentOrientation.tiltLR = tiltLR;
		currentOrientation.tiltFB = tiltFB;
		currentOrientation.dir = dir;
		var event = new CustomEvent('deviceorientation2', {detail: getOrientation()});
		document.dispatchEvent(event);
		checkFront(range);
	});

	function initDeviceOrientation(cb) {
		if (window.DeviceOrientationEvent) {
			// document.getElementById("doEvent").innerHTML = "DeviceOrientation";
			// Listen for the deviceorientation event and handle the raw data
			window.addEventListener('deviceorientation', 
		    	function(eventData) {
					// gamma is the left-to-right tilt in degrees, where right is positive
					var tiltLR = eventData.gamma;

					// beta is the front-to-back tilt in degrees, where front is positive
					var tiltFB = eventData.beta;

					// alpha is the compass direction the device is facing in degrees
					var dir = eventData.alpha;

					// call our orientation event handler
					cb(tiltLR, tiltFB, dir);
				}, false);
		} else {
			console.log("Device orientation is not supported on your device or browser.");
		}
	}
	function initKinekt(cb) {
		// checks if there is a kinekt...
		// connects to kinekt, returns data in callback on status changes
	}

	function normalizeDegree(d) {
		d = (d>=360) ? 360 - d : d;
		d = (d<0) ? 360 + d : d;
		return d;
	}

	function checkFront(range, cb) {
		var dir = getOrientation().dir;
		var foundItem = false;

		$.each(itemsArray, function(key, item) {
			var itemlocation = item.location.dir;
			var difference = Math.abs(dir - itemlocation);
			if(difference < range/2) {
				foundItem = true;
				var event = new CustomEvent('foundItemInFront', {detail: item});
				document.dispatchEvent(event);
			}
		})
	}

	function getOrientation() {
		var orientation = {}
		orientation.tiltLR = currentOrientation.tiltLR - originalOrientation.tiltLR;
		orientation.tiltFB = currentOrientation.tiltFB - originalOrientation.tiltFB;
		orientation.dir = normalizeDegree(currentOrientation.dir - originalOrientation.dir);
		return orientation;
	}
	

	return {
		registerItems : function(items) {
			if(items.constructor == Array) {
				for(var item in items) {
					if(!item.uri || !item.location) {
						console.log("ERROR: An item doesn't contain a uri or location:", item);
						return false;
					}
				}
				itemsArray = items;
				return true;
			}
			console.log("ERROR: This function can only register an array of items.")
			return false;
		},
		getPosition : function() {
			return position;
		},
		getOrientation : function() {
			var orientation = {}
			orientation.tiltLR = currentOrientation.tiltLR - originalOrientation.tiltLR;
			orientation.tiltFB = currentOrientation.tiltFB - originalOrientation.tiltFB;
			orientation.dir = normalizeDegree(currentOrientation.dir - originalOrientation.dir);
			return orientation;
		},
		isInFront : function(item) {

		},
		buildRadar : function(divselector) {
			var width = window.innerWidth,
				height = window.innerHeight,
				radius = Math.min(width, height),
				radarRadius = Math.round(radius/3),
				itemradius = radarRadius/10;

			var spacetime = d3.select(divselector);
			var svg = spacetime.append("svg")
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			svg.append("circle")
				.attr("r", radius/20)
				.style("fill", "rgba(255, 204, 0, 1.0)");

			svg.append("circle")
				.attr("r", radarRadius)
				.style("fill", "none")
				.style("stroke", "rgba(0, 0, 0, 1)");


			$.each(items, function(key, val){
				var x = -radarRadius*Math.sin((val.location.dir-getOrientation().dir)*Math.PI/180);
				var y = -radarRadius*Math.cos((val.location.dir-getOrientation().dir)*Math.PI/180);
				// console.log(x,y)
				svg.append("circle")
					.attr("class", "radarItems")
					.attr("uri", val.uri)
					.attr("r", itemradius)
					.attr("transform", "translate("+x+"," + y + ")")
					.style("stroke", "black")
					.style("fill", val.color);
			});
		}
	}
}
