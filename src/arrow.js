import * as d3 from "./custom-d3"
import utils from "./utils"

var arrow = function(options={color: "#444"}) {  
  this.startLoc = {}
  this.endLoc = {}
  this.uid = utils.uid()
  // we need this so that the arrow will disappear completely
  this.dashOffsetPadding = 10

  this.svg = this.createSvg()
  this.arrowHead = this.createArrowHead(this.svg, options)
  this.path = this.createPath(this.svg, options)
}

arrow.prototype.animateDraw = function(percent){
  let pathLength = this.pathLength()
  this.path.attr("stroke-dashoffset", pathLength * (percent/100))
           
  if(percent == 0) {
    this.path.attr("marker-end", `url(#${utils.uniqueClass("arrow-head", this.uid)})`)
  } else if(percent == 100){
    this.path.attr("stroke-dashoffset", pathLength + this.dashOffsetPadding + 2)
  } else {
    this.path.attr("marker-end", "")
  }
}

arrow.prototype.pathLength = function(){
  return this.path.node().getTotalLength()
}

arrow.prototype.createSvg = function(){
  return d3.select("html").append('svg:svg')
                          .attr("width", 1000)
                          .attr("id", this.uid)
                          .attr("height", 1000)
                          .attr("fill", "none")
                          .style("position", "absolute")
                          .style("top", 0)
                          .style("left", 0)
                          .style("pointer-events", "none")
}

arrow.prototype.createArrowHead = function(svg, options){
  return svg.append("defs").append("marker")
    .attr("id", utils.uniqueClass("arrow-head", this.uid))
    .attr("viewBox", "0 0 10 10" )
    .attr("refX", 6) 
    .attr("refY", 5)
    .attr("markerWidth", 3) 
    .attr("markerHeight", 8)
    .attr("stroke", "none")
    .attr("orient", "auto")
    .attr("fill", options.color)
    .append("path").attr("d", "M 0 0 L 10 5 L 0 10 z")
}

arrow.prototype.createPath = function(svg, options){
  return svg.append("path")
    .attr("stroke", options.color)
    .attr("stroke-width", 10)
    .attr("stroke-linecap", "round")
    .attr("fill", "none")
}

arrow.prototype.drawFromTo = function(startSelector, endSelector){
  let startEl = d3.select(startSelector)
  let endEl = d3.select(endSelector)
  this.startLoc = utils.elementCoords(startEl)
  this.endLoc = utils.elementCoords(endEl)
  this.draw(this.startLoc, this.endLoc)
}

arrow.prototype.draw = function(startLoc, endLoc){
  this.startLoc = startLoc
  this.endLoc = endLoc
  
  this.arrowPath = d3.path()
  // Move to the beginning of the arrow
  this.arrowPath.moveTo(this.startLoc.x, this.startLoc.y)
  
  // intelligent curve
  utils.autoQuadraticCurveTo(this.arrowPath, this.startLoc, this.endLoc)
  
  // Render the arrow as an svg path and attach the triangle marker as the arrow head
  this.path.attr("d", this.arrowPath.toString())
           .attr("marker-end", `url(#${utils.uniqueClass("arrow-head", this.uid)})`)
  
  // Set the stroke-dasharray to use in the animation of drawing the arrow
  let pathLength = this.pathLength()
  this.path.attr('stroke-dasharray', `${pathLength + this.dashOffsetPadding} ${pathLength + this.dashOffsetPadding}`)
}

export {arrow}
