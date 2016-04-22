#d3-arrow
Small Animated arrow library using D3. It uses a custom d3 build (see `.src/custom-d3.js`)
so it only uses what it needs from d3. The `sample.js` and `index.html` are purely
used for visual QA.

#How to use

###Instantiate the arrow object:

```javascript
arrow = new d3Arrow.Arrow()
```

The constructor can take two options:

#Class Methods
## constructor(options)
* options
  * color[string] - (default: black) hex/css color code, controls the color of the drawn arrow.
  * startingArrow[boolean] - (default: false) controls if there is a starting arrow (double ended arrow)
  * parent[string] - (default: html) css selector of the element where the svg arrow is placed.
    This might need to be set to something other then html if you want arrows to scroll properly


#instance Methods
##drawFrom(selector, options): 
  This method controls where an arrow starts.

* selector[String] - css selector of the element that the start of the arrow will be bound to.
* options
  * orientation[top|bottom|left|right] - (default: left) Controls which side of the element the arrow
    starts from. By default the starting of the arrow will be centered on that side.
  * position[float] - Position indicates where along the given orientation an arrow's start
    is located. For top and bottom orientations center is 0 while far left is 100, far
    right is -100. For left and right orientations far top is 100 while far bottom is -100
  * depth[float] - This indicates how far into the element the arrow's starting point is.
    regardless of side, a positive value for this option will take the arrow start point 
    into the element, while a negative value brings it out of the element.

##drawTo(selector, options): 
  This method controls where an arrow ends.

* selector[String] - css selector of the element that the end of the arrow will be bound to.
* options
  * orientation[top|bottom|left|right] - (default: left) Controls which side of the element the arrow
    ends at. By default the ending of the arrow will be centered on that side.
  * position[float] - (default: 0)Position indicates where along the given orientation an arrow's end
    is located. For top and bottom orientations center is 0 while far left is 100, far
    right is -100. For left and right orientations far top is 100 while far bottom is -100
  * depth[float] - (default: 0) This indicates how far into the element the arrow's ending point is.
    regardless of side, a positive value for this option will take the arrow end point 
    into the element, while a negative value brings it out of the element.
  * visible[boolean] - (default: true) Indicates if an arrow starts out visible or hidden.
    If you wish to animated the arrow in, this should be set to false to prevent flickering.
  
##redraw():
This method redraws the arrow using the original options given to `drawTo` and `drawFrom`.
This is useful for implementing responsive arrows. Example:

```javascript
var arrow = new d3Arrow.Arrow()
arrow.drawFrom(".box1").drawTo(".box2")

window.onresize = function(){
  arrow.redraw()
}
```

## animateDraw(drawPercent)
This method is used to draw in the arrow.

* drawPercent[integer] - This value indicates how drawn the arrow is. 0 indicates
  that the arrow is essentially undrawn and hidden, while 100 is fully drawn. To
  animate drawing in the arrow simply iterate through values 0-100 and pass them
  to this method. For example:
  
  ```javascript
  var arrow = new d3Arrow.Arrow()
  arrow.drawFrom(".box1").drawTo(".box2", {visible: false})

  var animateCount = 0
  var timer = window.setInterval(function(){
    arrow.animateDraw(animateCount)

    animateCount += 1
    if(animateCount > 100){
      window.clearInterval(timer)
    }
  }, 5)
  ```

#todo
* size scaling
* svg filters for different arrow looks