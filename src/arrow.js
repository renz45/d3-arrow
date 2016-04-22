import * as d3 from "./custom-d3"
import utils from "./utils"

class Arrow {
  constructor(options={color: "#444"}) {
    this.startLoc = {}
    this.endLoc = {}
    this.uid = utils.uid()
    this.svgPadding = 20
    this.svg = this.createSvg()
    this.arrowHead = this.createArrowHead(this.svg, options)
    this.path = this.createPath(this.svg, options)
    
    this.arrowDashOffset = 30
    
    if(options.startingArrow){
      this.startingArrow = this.createArrowHead(this.svg, options)
      this.startingArrow.attr("id", utils.uniqueClass("start-arrow-head", this.uid))
    }
  }
  
  animateDraw(percentVal) {
    this.currentAnimateDraw = percentVal
    let percent = percentVal
    let pathLength = this.pathLength()
    let dashLength = (pathLength * (percent/100))
    
    this.path.attr("stroke-dashoffset", 10)
    
    if(this.startingArrow) {
      if(dashLength > pathLength - this.arrowDashOffset) {
        dashLength = pathLength - this.arrowDashOffset
        percent = 100
      }

      this.path.attr('stroke-dasharray', `0 ${this.arrowDashOffset} ${dashLength} ${pathLength + 10}`)
    } else {
      this.path.attr('stroke-dasharray', `0 0 ${dashLength} ${pathLength + 10}`)
    }
    
    if(percent == 100) {
      this.path.attr("marker-end", `url(#${utils.uniqueClass("arrow-head", this.uid)})`)
    } else if(percent == 0) {
      if(this.startingArrow) {
        this.path.attr("marker-start","")
        this.path.attr("stroke-dashoffset", this.arrowDashOffset + 5)
      }
    } else {
      this.path.attr("marker-end", "")
    }
    
    if(percent > 0 && this.startingArrow){
      this.path.attr("marker-start", `url(#${utils.uniqueClass("start-arrow-head", this.uid)})`)
    }
  }

  pathLength() {
    return this.path.node().getTotalLength()
  }

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
  }

  createArrowHead(svg, options) {
    let marker = svg.append("defs").append("marker")
    marker.attr("id", utils.uniqueClass("arrow-head", this.uid))
      .attr("viewBox", "0 0 10 10" )
      .attr("refX", 8) 
      .attr("refY", 5)
      .attr("markerWidth", 30) 
      .attr("markerHeight", 80)
      .attr("markerUnits", "userSpaceOnUse")
      .attr("stroke", "none")
      .attr("orient", "auto")
      .attr("fill", options.color)
      .append("path").attr("d", "M 0 0 L 10 5 L 0 10 z")
    return marker
  }

  createPath(svg, options) {
    return svg.append("path")
      .attr("stroke", options.color)
      .attr("stroke-width", 10)
      .attr("stroke-linecap", "round")
      .attr("fill", "none")
  }
  
  drawFrom(selector, options={orientation: "left"}) {
    this.drawFromOptions = options
    this.startEl = d3.select(selector)
    this.startLoc = utils.elementCoords(this.startEl, options)
    this.startLoc.orientation = options.orientation
    return this
  }
  
  drawTo(selector, options={orientation: "left"}) {
    this.drawToOptions = options
    this.endEl = d3.select(selector)
    this.endLoc = utils.elementCoords(this.endEl, this.drawToOptions)
    this.endLoc.orientation = options.orientation
    
    this.draw(this.startLoc, this.endLoc, this.drawToOptions)
  }
  
  redraw(){
    let currentAnimateDraw = this.currentAnimateDraw || 100
    let startOrientation = this.startLoc.orientation
    let endOrientation = this.endLoc.orientation

    this.startLoc = utils.elementCoords(this.startEl, this.drawFromOptions)
    this.endLoc = utils.elementCoords(this.endEl, this.drawToOptions)
    this.startLoc.orientation = startOrientation
    this.endLoc.orientation = endOrientation
    
    this.draw(this.startLoc, this.endLoc, this.drawToOptions)
    this.animateDraw(currentAnimateDraw)
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
  
  calcSlope(p1, p2) {
    let slope = Math.atan( (p2.y - p1.y)/(p2.x - p1.x) ) * 180/Math.PI

    // account for negative angles
    if((slope <= 0 && (p2.x - p1.x) < 0) || (slope > 0 && (p2.x - p1.x) < 0)){
      slope += 180
    }
    return slope
  }

  draw(startLoc, endLoc, options) {
    this.arrowPath = d3.path()
    if(options.visible === undefined) {
      options.visible = true
    }

    // Move to the beginning of the arrow
    this.arrowPath.moveTo(startLoc.x, startLoc.y)

    // intelligent curve
    utils.autoCurveTo(this.arrowPath, startLoc, endLoc)
    
    // Render the arrow as an svg path and attach the triangle marker as the arrow head
    this.path.attr("d", this.arrowPath.toString())
    
    // Resize the svg to be a bounding box rather then 0 based full screen
    this.resizeSvgToFitPath(this.path)
    
    if(!options.visible){
      this.animateDraw(0)
    } else {
      let pathLength = this.pathLength()
      let pathNode = this.path.node()
      let p1 = pathNode.getPointAtLength(pathLength - 20)
      let p2 = pathNode.getPointAtLength(pathLength)

      this.arrowHead.attr("orient", this.calcSlope(p1, p2))

      if(this.startingArrow) {
        let p3 = pathNode.getPointAtLength(20)
        let p4 = pathNode.getPointAtLength(1)

        this.startingArrow.attr("orient", this.calcSlope(p3, p4))
      }
      
      this.animateDraw(100)
    }
  }
}

export {Arrow}