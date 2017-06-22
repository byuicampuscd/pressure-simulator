var svgInfo = {
    pressure: {
        svgID: "svg_pressure",
        divID: "svg-container-pressure",
        image: {
            width: 750
        }
    },
    gauge: {
        svgID: "gauge",
        divID: "svg-container-pressure",
        image: {
            width: 200
        }
    },
    syringe: {
        svgID: "syringe",
        divID: "svg-container-air",
        image: {
            width: 200
        }
    }
};

for (var item in svgInfo) {
    svgInfo[item].element = document.getElementById(svgInfo[item].svgID);
}

var pressureSVGjs = SVG("svg-container-pressure")
    .svg(document.getElementById("svg_pressure").outerHTML);
var gaugeSVGjs = pressureSVGjs.select('#' + svgInfo.gauge.svgID).first();
var syringeSVGjs = pressureSVGjs.select('#' + svgInfo.syringe.svgID).first();

var dimensions = svgInfo.pressure.element.getAttribute('viewBox').split(' ');
svgInfo.pressure.viewbox = {};
svgInfo.pressure.viewbox.height = dimensions[3];
svgInfo.pressure.viewbox.width = dimensions[2];
svgInfo.pressure.viewbox.ratio = dimensions[3] / dimensions[2];
svgInfo.pressure.image.height = svgInfo.pressure.image.width * svgInfo.pressure.viewbox.ratio;

var container = document.getElementById(svgInfo.pressure.divID);
container.style.width = svgInfo.pressure.image.width + "px";
container.style.height = svgInfo.pressure.image.height + "px";

var svgsyringe = document.getElementById("svg_ball_container");


// Store the outmost svgs in SVG.js form
/*var gaugeSVGjs = SVG('svg-container-pressure')
    .svg(document.getElementById("svg_pressure_gauge").outerHTML);
var syringeSVGjs = SVG('svg-container-air')
    .svg(svgsyringe.outerHTML);
var thermometerSVGjs = SVG('svg-container-thermometer')
    .svg(document.getElementById("svg_thermometer").outerHTML);

// These should be better handled, but here to make initial MVC setup work
const BALL_CONTAINER_IMAGE_WIDTH = 250; // The ratio is maintained below

// Calculated sizes from the indicated width above
var temp = svgsyringe.getAttribute('viewBox').split(' ');
const BALL_CONTAINER_VIEWBOX_HEIGHT = temp[3];
const BALL_CONTAINER_VIEWBOX_WIDTH = temp[2];
const BALL_CONTAINER_IMAGE_RATIO = temp[3] / temp[2]; // ViewBox Height/Width
const BALL_CONTAINER_IMAGE_HEIGHT = BALL_CONTAINER_IMAGE_WIDTH *
    BALL_CONTAINER_IMAGE_RATIO;

// Container element for the svg tag
var drawingContainer = document.getElementById('svg-container-air');
drawingContainer.style.width = BALL_CONTAINER_IMAGE_WIDTH + "px";
drawingContainer.style.height = BALL_CONTAINER_IMAGE_HEIGHT + "px";
*/

// Startup methods and updates should be added, view and controller properly set up
