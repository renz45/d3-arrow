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
arrow2 = new d3Arrow.Arrow({color: "red"})
// arrow3 = new d3Arrow.arrow({color: "blue"})

arrow1.drawFromTo(".callout1", '.col2 h2', {visible: false})
arrow2.drawFrom(".callout1").drawTo('.col1 h2')

// redrawn if the window changes size, responsive layouts
window.onresize = function(){
  arrow1.drawFromTo(".callout1", '.col2 h2')
  arrow2.drawFromTo(".callout1", '.col1 h2')
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

// Example of hooking up a slider
var selector = document.querySelector('#x')
selector.addEventListener("input", function() {
  arrow1.animateDraw(this.value)
  arrow2.animateDraw(this.value)
});