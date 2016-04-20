class Utils {
  static elementCoords(element, options) {
    let el = element.node && element.node() || element;
    let boundingBox = el.getBoundingClientRect()
    let elementLoc = {x: boundingBox.left, y: boundingBox.top}
    let positionPercent = (options.position || 0) / 100
    let depth = options.depth || 0
    
    switch(options.orientation) {
      case "top":
        elementLoc.x = (boundingBox.left - ((boundingBox.left - boundingBox.right) / 2)) - (boundingBox.width/2 * positionPercent)
        elementLoc.y = boundingBox.top + depth
      break
      case "bottom":
        elementLoc.x = (boundingBox.left - ((boundingBox.left - boundingBox.right) / 2)) - (boundingBox.width/2 * positionPercent)
        elementLoc.y = boundingBox.bottom - depth
      break
      case "right":
        elementLoc.x = boundingBox.right - depth
        elementLoc.y = (boundingBox.top - ((boundingBox.top - boundingBox.bottom) / 2)) - (boundingBox.height/2 * positionPercent)
      break
      case "left":
      default:
        elementLoc.x = boundingBox.left + depth
        elementLoc.y = (boundingBox.top - ((boundingBox.top - boundingBox.bottom) / 2)) - (boundingBox.height/2 * positionPercent)
      break
    }
    return elementLoc
  }
  
  // #goodenough
  static uid() {
    return ("00000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6)
  }
  
  static uniqueClass(klass, uid){
    return `${klass}:${uid}`
  }
  
  static autoQuadraticCurveTo(path, startLoc, endLoc) {
    let controlLoc = {x: startLoc.x, y: endLoc.y}

    if(endLoc.x - startLoc.x  < 60) {
      controlLoc.x = controlLoc.x - 100
      controlLoc.y = (endLoc.y - startLoc.y)/2 + startLoc.y
    }
    
    path.quadraticCurveTo(controlLoc.x, controlLoc.y, endLoc.x, endLoc.y)
  }
}
export default Utils