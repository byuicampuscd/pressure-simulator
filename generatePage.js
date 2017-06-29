/*eslint-env browser*/
/*global SVG startListening*/


/*Generate the Syringe SVG*/
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


var pressureSVGjs = SVG("svg-container-pressure").svg(document.getElementById("svg_pressure_wrapper_div").innerHTML);
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
/* End Generate syringe SVG*/
