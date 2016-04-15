import * as d3 from "./custom-d3"

var arrow = function() {  
  this.startX = 0
  this.startY = 0
  this.endX = 0
  this.endY = 0
  this.pointLength = 10
  
  this.svg = d3.select("body").append('svg:svg')
    .attr("width", 200)
    .attr("height", 200)
    .attr("fill", "none")
    
  this.arrowHead = this.svg.append("defs").append("marker")
    .attr("id", "Triangle")
    .attr("viewBox", "0 0 10 10" )
    .attr("refX", 1) 
    .attr("refY", 5)
    .attr("markerWidth", 6) 
    .attr("markerHeight", 6)
    .attr("stroke", "black")
    .attr("orient", "auto")
    .append("path").attr("d", "M 0 0 L 10 5 L 0 10 z")

  this.path = this.svg.append("path")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr('stroke-dasharray', "988.00 988.00")
    
  var that = this
  d3.select("#x").on("input", function() {
    console.log(this.value)
    that.path.attr("stroke-dashoffset", this.value)
    if(this.value < 919) {
      that.path.attr("marker-end", "url(#Triangle)")
    } else {
      that.path.attr("marker-end", "")
    }
  });
}

arrow.prototype.drawPath = function(x1, y1, x2, y2){
  this.startX = x1
  this.startY = y1
  this.endX = x2
  this.endY = y2

  this.arrowPath = d3.path()
  this.arrowPath.moveTo(this.startX, this.startY)
  this.arrowPath.lineTo(this.endX, this.endY)
}

arrow.prototype.draw = function(selector, x1, y1, x2, y2){
  this.drawPath(x1, y1, x2, y2)
  this.path.attr("d", this.arrowPath.toString())
           .attr("marker-end", "url(#Triangle)")
}

arrow.prototype.drawIn = function(selector, x1, y1, x2, y2){
  var animateValue = 1000
  this.drawPath(x1, y1, x2, y2)
  this.path.attr("stroke-dashoffset", animateValue)
  this.path.attr("d", this.arrowPath.toString())
          //  .attr("marker-end", "url(#Triangle)")
  var that = this

  var interval1 = setInterval(function(){
    animateValue -= 1
    that.path.attr("stroke-dashoffset", animateValue)
    if(animateValue < 940) {
     that.path.attr("marker-end", "url(#Triangle)")
    } else {
     that.path.attr("marker-end", "")
    }
    
    if(animateValue < 700) {
      clearInterval(interval1)
    }
  }, 10)
  
}

export {arrow}
