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
  
  // startLoc and endLoc are objects that contain x, y, orientation
  // orientation is one of the following: top, bottom, left, right
  // orientation is used to customize the curve based on the face its pointing
  static autoCurveTo(path, startLoc, endLoc, options) {
    // How close x or y values of each start/end point need to be before a default
    // curve is generated. So if the start and end points are directly vertical or horizonal
    // to each other, this creates a slight curve
    let verticalCurvePadding = 50
    let samePlaneTolerance = 15
    let cStartLoc = {x: startLoc.x, y: endLoc.y}
    let cEndLoc = {x: endLoc.x, y: startLoc.y}
    
    switch(startLoc.orientation) {
      case "top":
        if(Math.abs(endLoc.y - startLoc.y) < samePlaneTolerance){
          cStartLoc = {x: startLoc.x, y: endLoc.y - verticalCurvePadding}
        }else{
          cStartLoc = {x: startLoc.x, y: endLoc.y}
        }
      break
      case "bottom":
        if(Math.abs(endLoc.y - startLoc.y) < samePlaneTolerance){
          cStartLoc = {x: startLoc.x, y: endLoc.y + verticalCurvePadding}
        }else{
          cStartLoc = {x: startLoc.x, y: endLoc.y}
        }
      break
      case "right":
        if(Math.abs(endLoc.x - startLoc.x) < samePlaneTolerance){
          cStartLoc = {x: endLoc.x + verticalCurvePadding, y: startLoc.y}
        }else{
          cStartLoc = {x: endLoc.x, y: startLoc.y}
        }
      break
      case "left":
      default:
        if(Math.abs(endLoc.x - startLoc.x) < samePlaneTolerance){
          cStartLoc = {x: endLoc.x - verticalCurvePadding, y: startLoc.y}
        }else{
          cStartLoc = {x: endLoc.x, y: startLoc.y}
        }
      break
    }

    switch(endLoc.orientation) {
      case "top":
        if(Math.abs(endLoc.y - startLoc.y) < samePlaneTolerance){
          cEndLoc = {x: endLoc.x, y: startLoc.y - verticalCurvePadding}
        }else{
          cEndLoc = {x: endLoc.x, y: startLoc.y}
        }
      break
      case "bottom":
        if(Math.abs(endLoc.y - startLoc.y) < samePlaneTolerance){
          cEndLoc = {x: endLoc.x, y: startLoc.y + verticalCurvePadding}
        }else{
          cEndLoc = {x: endLoc.x, y: startLoc.y}
        }
      break
      case "right":
        if(Math.abs(endLoc.x - startLoc.x) < samePlaneTolerance){
          cEndLoc = {x: startLoc.x + verticalCurvePadding, y: endLoc.y}
        }else{
          cEndLoc = {x: startLoc.x, y: endLoc.y}
        }
      break
      case "left":
      default:
        if(Math.abs(endLoc.x - startLoc.x) < samePlaneTolerance){
          cEndLoc = {x: startLoc.x - verticalCurvePadding, y: endLoc.y}
        }else{
          cEndLoc = {x: startLoc.x, y: endLoc.y}
        }
      break
    }

    path.bezierCurveTo(cStartLoc.x, cStartLoc.y, cEndLoc.x, cEndLoc.y, endLoc.x, endLoc.y)
  }
}
export default Utils