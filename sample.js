// arrow1 = new d3Arrow.arrow()
// arrow2 = new d3Arrow.arrow()
// arrow3 = new d3Arrow.arrow()
// arrow4 = new d3Arrow.arrow()
// 
// arrow5 = new d3Arrow.arrow()
// arrow6 = new d3Arrow.arrow()
// arrow7 = new d3Arrow.arrow()
// arrow8 = new d3Arrow.arrow()
// 
// arrow1.drawIn("body", 100, 100, 50, 100)
// arrow2.drawIn("body", 100, 100, 100, 50)
// arrow3.drawIn("body", 100, 100, 150, 100)
// arrow4.drawIn("body", 100, 100, 100, 150)
// 
// arrow5.draw("body", 100, 100, 50, 50)
// arrow6.draw("body", 100, 100, 150, 150)
// arrow7.draw("body", 100, 100, 50, 150)
// arrow8.draw("body", 100, 100, 150, 50)

arrow1 = new d3Arrow.Arrow()
arrow2 = new d3Arrow.Arrow({color: "red", startingArrow: true})
arrow3 = new d3Arrow.Arrow({color: "blue", startingArrow: true})
arrow4 = new d3Arrow.Arrow({color: "green", startingArrow: true})
arrow5 = new d3Arrow.Arrow({color: "purple", startingArrow: true})
arrow6 = new d3Arrow.Arrow({color: "orange", startingArrow: true})
arrow7 = new d3Arrow.Arrow({color: "teal", startingArrow: true})
arrow8 = new d3Arrow.Arrow({color: "pink", startingArrow: true})
arrow9 = new d3Arrow.Arrow({color: "magenta", startingArrow: true})
arrow10 = new d3Arrow.Arrow({color: "gold", startingArrow: true})
arrow11 = new d3Arrow.Arrow({color: "aqua", startingArrow: true})
arrow12 = new d3Arrow.Arrow({color: "gray", startingArrow: true})
arrow13 = new d3Arrow.Arrow({color: "lavender", startingArrow: true})

arrow1.drawFrom(".test-1 .callout1", {orientation: "left"}).drawTo('.test-1 .col2 h2', {visible: false, orientation: "bottom", position: 0, depth: 0})
arrow2.drawFrom(".test-1 .callout1").drawTo('.test-1 .col1 h2')
arrow3.drawFrom(".test-1 .callout1", {orientation: "right"}).drawTo('.test-1 .col2 h2',{orientation: "right"})
arrow4.drawFrom(".test-2 .col1 h2", {orientation: "left"}).drawTo(".test-2 .col2 h2", {orientation: "right"})
arrow5.drawFrom(".test-2 .callout1", {orientation: "bottom"}).drawTo(".test-2 .col2 h2", {orientation: "top"})
arrow6.drawFrom(".test-2 .callout1", {orientation: "bottom", position: -75}).drawTo(".test-2 .col1 h2", {orientation: "top", position: 0})
arrow7.drawFrom(".test-2 .col1 h2", {orientation: "bottom"}).drawTo(".test-2 .col2 h2", {orientation: "bottom"})
arrow8.drawFrom(".test-1 .col2 h2", {orientation: "bottom"}).drawTo(".test-1 .col1 h2", {orientation: "bottom"})
arrow9.drawFrom('.test-2 .col2 h2', {orientation: "right"}).drawTo(".test-2 .callout1", {orientation: "right"})
arrow10.drawFrom('.test-2 .col1 h2', {orientation: "left"}).drawTo(".test-2 .callout1", {orientation: "left"})
arrow11.drawFrom(".test-3 .col2 h2", {orientation: "top"}).drawTo(".test-3 .col1 h2", {orientation: "top"})
arrow12.drawFrom(".test-1 .col1 h2", {orientation: "top"}).drawTo(".test-1 .col2 h2", {orientation: "top"})
arrow13.drawFrom(".test-3 .col2 h2", {orientation: "right"}).drawTo(".test-3 .col1 h2", {orientation: "left"})

// redrawn if the window changes size, responsive layouts
window.onresize = function(){
  arrow1.redraw()
  arrow2.redraw()
  arrow3.redraw()
  arrow4.redraw()
  arrow5.redraw()
  arrow6.redraw()
  arrow7.redraw()
  arrow8.redraw()
  arrow9.redraw()
  arrow10.redraw()
  arrow11.redraw()
  arrow12.redraw()
  arrow13.redraw()
}

// Example of animating in an arrow
var animateCount = 0
var timer = window.setInterval(function(){
  arrow1.animateDraw(animateCount)

  animateCount += 1
  
  if(animateCount > 100){
    window.clearInterval(timer)
  }
}, 5)
// 
// // Example of hooking up a slider
var selector = document.querySelector('#x')
selector.addEventListener("input", function() {
  arrow1.animateDraw(this.value)
  arrow2.animateDraw(this.value)
  arrow3.animateDraw(this.value)
  arrow4.animateDraw(this.value)
  arrow5.animateDraw(this.value)
  arrow6.animateDraw(this.value)
  arrow7.animateDraw(this.value)
  arrow8.animateDraw(this.value)
  arrow9.animateDraw(this.value)
  arrow10.animateDraw(this.value)
  arrow11.animateDraw(this.value)
  arrow12.animateDraw(this.value)
  arrow13.animateDraw(this.value)
});