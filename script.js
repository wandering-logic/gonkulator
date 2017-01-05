document.addEventListener("DOMContentLoaded", function(){
    var shiftOut = function(value) {
        if (value.length > 9) {
            return (value.substr(value.length-9,9));
	}
	else {
	    return (value);
	}
    };
    var number = "";
    var newnumber = "";
    var operator = "";
    var totaldiv = document.getElementById('total');
    var shiftKey = false;
    var myTimer;
    var myKeyPressed = null;
    totaldiv.textContent = '0';
    var keysList = document.getElementsByClassName('ckey');
    keyPress = function(thisKey, thisEvent) {
	myKeyPressed = thisKey;
	myTimer = setTimeout(function(){
	    shiftKey = !shiftKey;
	    console.log("doink!");
	    window.navigator.vibrate(30);
	}, 750);
	window.navigator.vibrate(40);
	thisEvent.preventDefault();
    }
    keyLeave = function(thisKey, thisEvent) {
	myKeyPressed = null;
	clearTimeout(myTimer);
	thisEvent.preventDefault();
    }
    keyRelease = function(thisKey, thisEvent) {
	clearTimeout(myTimer);
	if (thisKey === myKeyPressed) {
	    var value = totaldiv.textContent;
	    value += thisKey.textContent;
	    if (shiftKey) { value += "x"; }
	    shiftKey = false;
	    totaldiv.textContent = shiftOut(value);
	}
	thisEvent.preventDefault();
    }
    for (var i = 0; i < keysList.length; i++) {
	var key = keysList[i];
	key.addEventListener("pointerdown", function(thisEvent){
	    console.log("pointerdown: ", this.textContent);
	    keyPress(this, thisEvent);
	});
	key.addEventListener("pointerleave", function(thisEvent){
	    console.log("pointerleave: ", this.textContent);
	    keyLeave(this, thisEvent);
	});
	key.addEventListener("pointerup", function(thisEvent){
	    console.log("pointerup: ", this.textContent);
	    keyRelease(this, thisEvent);
	});
/*	key.addEventListener("touchstart", function(thisEvent){
	    console.log("touchstart: ", this.textContent);
	    keyPress(this, thisEvent);
	});
	key.addEventListener("touchleave", function(thisEvent){
	    console.log("touchleave: ", this.textContent);
	    keyLeave(this, thisEvent);
	});
	key.addEventListener("touchend", function(thisEvent){
	    console.log("touchend: ", this.textContent);
	    keyRelease(this, thisEvent);
	}); */
	key.addEventListener("mousedown", function(thisEvent){
	    console.log("mousedown: ", this.textContent);
	    keyPress(this, thisEvent);
	});
	key.addEventListener("mouseleave", function(thisEvent){
	    console.log("mouseleave: ", this.textContent);
	    keyLeave(this, thisEvent);
	});
	key.addEventListener("mouseup", function(thisEvent){
	    console.log("mouseup: ", this.textContent);
	    keyRelease(this, thisEvent);
	});
    }
});
/*    $("#operators a").not("#equals").click(function(){
	operator = $(this).text();
	newnumber = number;
	number = "";
	totaldiv.text("0");
    });
    $("#clear,#clearall").click(function(){
	number = "";
	totaldiv.text("0");
	if ($(this).attr("id") === "clearall") {
	    newnumber = "";
	}
    }); */
/*    $("#equals").click(function(){
	if (operator === "+"){
	    number = (parseInt(number, 10) + parseInt(newnumber,10)).toString(10);
	} else if (operator === "-"){
	    number = (parseInt(newnumber, 10) - parseInt(number,10)).toString(10);
	} else if (operator === "/"){
	    number = (parseInt(newnumber, 10) / parseInt(number,10)).toString(10);
	} else if (operator === "*"){
	    number = (parseInt(newnumber, 10) * parseInt(number,10)).toString(10);
	}
	totaldiv.text(number);
	testNumLength(number);
	number = "";
	newnumber = "";
    });
*/

