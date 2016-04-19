import * as d3 from "./custom-d3"
import utils from "./utils"

class Arrow {
  constructor(options={color: "#444"}) {
    this.startLoc = {}
    this.endLoc = {}
    this.uid = utils.uid()
    // we need this so that the arrow will disappear completely
    this.dashOffsetPadding = 10
    this.svgPadding = 20

    this.svg = this.createSvg()
    this.arrowHead = this.createArrowHead(this.svg, options)
    this.path = this.createPath(this.svg, options)
  }
  
  animateDraw(percentVal) {
    let percent = 100 - percentVal    
    let pathLength = this.pathLength()
    this.path.attr("stroke-dashoffset", pathLength * (percent/100))
             
    if(percent == 0) {
      this.path.attr("marker-end", `url(#${utils.uniqueClass("arrow-head", this.uid)})`)
    } else if(percent == 100) {
      this.path.attr("stroke-dashoffset", pathLength + this.dashOffsetPadding + 2)
    } else {
      this.path.attr("marker-end", "")
    }
  }

  pathLength() {
    return this.path.node().getTotalLength()
  }
  
  // reuse the same svg for all arrows when possible
  createSvg() {
    return d3.select("html").append('svg:svg')
                            .attr("width", 1000)
                            .attr("id", "d3-arrow")
                            .attr("height", 1000)
                            .attr("fill", "none")
                            .style("position", "absolute")
                            .style("top", 0)
                            .style("left", 0)
                            .style("pointer-events", "none")
                            .style("border", "1px dashed red")
  }

  createArrowHead(svg, options) {
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

  createPath(svg, options) {
    return svg.append("path")
      .attr("stroke", options.color)
      .attr("stroke-width", 10)
      .attr("stroke-linecap", "round")
      .attr("fill", "none")
  }

  drawFromTo(startSelector, endSelector, options) {
    let startEl = d3.select(startSelector)
    let endEl = d3.select(endSelector)
    
    this.startLoc = utils.elementCoords(startEl)
    this.endLoc = utils.elementCoords(endEl)
    this.draw(this.startLoc, this.endLoc, options)
  }
  
  drawFrom(selector) {
    let startEl = d3.select(selector)
    this.startLoc = utils.elementCoords(startEl)
    return this
  }
  
  drawTo(selector, options) {
    let endEl = d3.select(selector)
    this.endLoc = utils.elementCoords(endEl)
    this.draw(this.startLoc, this.endLoc, options)
  }
  
  resizeSvgToFitPath(path) {
    let pathNode = path.node()
    let pathBounds = pathNode.getBoundingClientRect()
    let svgNode = this.svg.node()
    let svgBounds = svgNode.getBoundingClientRect()
    
    this.svg.attr("width", pathBounds.width + this.svgPadding * 2)
    this.svg.attr("height", pathBounds.height + this.svgPadding * 2)
    this.svg.style("left", pathBounds.left - this.svgPadding)
    this.svg.style("top", pathBounds.top - this.svgPadding)
    
    this.path.attr("transform", `translate(${-pathBounds.left + this.svgPadding},${-pathBounds.top + this.svgPadding})`)
  }

  draw(startLoc, endLoc, options={visible: true}) {
    this.arrowPath = d3.path()
    
    // Move to the beginning of the arrow
    this.arrowPath.moveTo(startLoc.x, startLoc.y)
    
    // intelligent curve
    utils.autoQuadraticCurveTo(this.arrowPath, startLoc, endLoc)
    
    // Render the arrow as an svg path and attach the triangle marker as the arrow head
    this.path.attr("d", this.arrowPath.toString())
    
    // Resize the svg to be a bounding box rather then 0 based full screen
    this.resizeSvgToFitPath(this.path)
    
    if(!options.visible){
      this.animateDraw(0)
    } else {
      this.path.attr("marker-end", `url(#${utils.uniqueClass("arrow-head", this.uid)})`)
    }
    // Set the stroke-dasharray to use in the animation of drawing the arrow
    let pathLength = this.pathLength()
    this.path.attr('stroke-dasharray', `${pathLength + this.dashOffsetPadding} ${pathLength + this.dashOffsetPadding}`)
  }
}

export {Arrow}