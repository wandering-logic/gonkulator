document.addEventListener("DOMContentLoaded", function(){
    var testNumLength = function(number) {
        if (number.length > 9) {
            totaldiv.text(number.substr(number.length-9,9));
            if (number.length > 15) {
                number = "";
                totaldiv.text("Err");
            }
        } 
    };
    var number = "";
    var newnumber = "";
    var operator = "";
    var totaldiv = document.getElementById('total');				 
    var shiftKey = false;
    var myTimer;
    totaldiv.textContent = '0';
    var keysList = document.getElementsByClassName('digit');
    for (var i = 0; i < keysList.length; i++) {
	keysList[i].addEventListener("onmousedown", function(){
	    window.navigator.vibrate(30);
	    myTimer = setTimeout(function(){
		shiftKey = !shiftKey;
		window.navigator.vibrate(20);
	    }, 500);
	}).addEventListener("onmouseleave", function(){
	    clearTimeout(myTimer);
	}, false).addEventListener("onmouseup", function(){
	    number += $(this).text();
	    if (shiftKey) { number += "x"; }
	    totaldiv.text(number);
	    testNumLength(number);
	});
    }
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
});

