//functions.js

var AppFns = function(){

	//Object with configuration data
	var cfg = {
		finalText: "{{0}}",
		noMatch: "no-match",
		results : ["campbell", "diaz", "lopez", "berry", "jolie"],
		labels: ["Shoulders", "Bust", "Waist", "Hips"],
		warnMessage: " should be a positive integer between 1 and 100",
		multipleResults: false	
	}


	function calcBody(a,b,c,d){
		
		// Result. A vector of Matches
		var res = [];

		// Object with properties
		var vals = { "a":a, "b":b, "c":c, "d":d};
		consoler(vals); //Show me the values calculated

		// Object with % differences
		var diffs = {};

		// Calculate % differences. Generates a kind of 'Matrix'.
		// It's not really a Matrix, but an object with properties diffs["x_y"] 
		for(var p1 in vals){
			for(var p2 in vals){
			 if(p1!=p2) {
					var df = (vals[p1]/vals[p2] - 1)*100;
					diffs[p1+"_"+p2] = Math[df < 0 ? 'ceil' : 'floor'](df*100)/100; //2 digits precision
				}
			}			
		}

		// Bear in mind that (x-y)/y is not equal to -(y-x)/x. 
		// So it's not a symmetric 'matrix' : diffs["a_b"] != -diffs["b_a"]
		consoler(diffs); //Show me the values calculated


		// Possibility #5 (The Angelina Jolie) : 
		// If field A is more than 5% bigger than fields B AND D. 
		// AND 
		// If field C is more than 5% bigger than field B. 			
		if(diffs["a_b"]>5 && diffs["a_d"]>5 && diffs["c_b"]>5)
			res.push(cfg.results[4]);

		// Possibility #1 (The Naomi Campbell):
		// If field A OR field B is more than 5% bigger than field D.
		// AND 
		// If field A is at least 3% bigger than field B.
		if(diffs["a_d"]>5 || diffs["b_d"]>5 && diffs["a_b"]>=3) res.push(cfg.results[0]);

		// Possibility #4 (The Halle Berry) : 
		// If fields A AND D are within 6% of each other. 
		// AND 
		// If field C is at least 25% smaller than fields A AND D. 		
		if(Math.abs(diffs["a_d"])<=6 && Math.abs(diffs["d_a"])<=6 && 
			(diffs["c_a"]<=-25 && diffs["c_d"]<=-25)
			) res.push(cfg.results[3]);

		// Possibility #2 (The Cameron Diaz) : 
		// If fields A, B AND D are within 7% of each other. 
		// AND 
		// If field C is less than 20% smaller than fields A OR B. 
		if(Math.abs(diffs["a_b"])<=7 && Math.abs(diffs["b_a"])<=7 && 
			Math.abs(diffs["a_d"])<=7 && Math.abs(diffs["d_a"])<=7 && 
			Math.abs(diffs["b_d"])<=7 && Math.abs(diffs["d_b"])<=7 &&
			(diffs["c_a"]>-20 || diffs["c_b"]>-20)
			) res.push(cfg.results[1]);

		// Possibility #3 (The J-Lo) :
		// If field D is more than 5% bigger than fields A AND B.
		// AND
		// If field C is at least 15% smaller than field D only.

		if(diffs["d_a"]>5 && diffs["d_b"]>5 &&
			(diffs["c_d"]<=-15)
			) res.push(cfg.results[2]);

		return res;

	};

	//Shortcut for console.dir
	function consoler(msg){
		if(window["console"] && window.console["dir"]) console.dir(msg);
	};

	//Tests
	function assert(a,b,c,d,res){
		var cb = calcBody(a,b,c,d);
		consoler(cb);

		for(var c=0; c<cb.length; c++){
			if(cb[c]==res) return { "PASSED" : true };
		}
		return { "PASSED" : false };
	};

	function verboseResult(a,b,c,d){
		var r = calcBody(a,b,c,d);
		if (cfg.multipleResults)
			return r.length==0 ? cfg.noMatch : cfg.finalText.replace("{{0}}",r.join(" ")) 
		else
			return r.length==0 ? cfg.noMatch : cfg.finalText.replace("{{0}}",r[0]);
	};

	var bindToForm = function(){
		$(window).ready(function(){
			$("#formBodyCalc").submit(function(){
				var vs = [checkRetVal("shoulders"),
						checkRetVal("bust"),
						checkRetVal("waist"),
						checkRetVal("hips")];
				if(vs[0]==0 || vs[1]==0 || vs[2]==0 || vs[3]==0) return false;

				var r = verboseResult(vs[0],vs[1],vs[2],vs[3]);
				$(".js-body-shape").addClass(r);
				$(".bodyCalcContainerScroll").addClass("showResult");
				return false;
			});

			$(".js-pGoBack").click(function(){ 
				$(".js-body-shape").removeClass('no-match');
				$(".js-body-shape").removeClass('campbell');
				$(".js-body-shape").removeClass('diazh');
				$(".js-body-shape").removeClass('lopez');
				$(".js-body-shape").removeClass('berry');
				$(".js-body-shape").removeClass('jolie');
				$(".bodyCalcContainerScroll").removeClass("showResult");
			});
		})
	}();

	function checkRetVal(idForm){
		var v = $("#" + idForm).val();
		var n = Number(v);
		if(isNaN(v) || n<1 || n>100) {
			alert(idForm.toUpperCase() + cfg.warnMessage);
			return 0;
		}
		
		return v;
	}



	//Make public properties & fns
	return  { cfg : cfg,
			  calcBody : calcBody ,
			  consoler : consoler,
			  assert : assert,
			  verboseResult : verboseResult
			};

}();