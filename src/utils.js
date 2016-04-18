var utils = {
  elementCoords: (element)=> {
    let el = element.node && element.node() || element;
    
    let boundingBox = el.getBoundingClientRect()

    return {x: boundingBox.left, y: boundingBox.top}
  },
  
  // #goodenough
  uid: function(){
    return ("00000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6)
  },
  
  uniqueClass: function(klass, uid){
    return `${klass}:${uid}`
  },
  
  autoQuadraticCurveTo: (path, startLoc, endLoc)=> {
    let controlLoc = {x: startLoc.x, y: endLoc.y}
    console.log("------", controlLoc.x, controlLoc.y)

    if(startLoc.x === endLoc.x) {
      controlLoc.x = controlLoc.x - 100
      controlLoc.y = (endLoc.y - startLoc.y)/2 + startLoc.y
    }
    
    path.quadraticCurveTo(controlLoc.x, controlLoc.y, endLoc.x, endLoc.y)
  }
  
}
export default utils