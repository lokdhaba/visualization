$(document).ready(function(){
		function getUrlVars()
			{
			
				//var url = "http:localhost:1234\?type=ae&state=Bihar&year=2016&viz=charts&dis=women";
				var vars = [], hash;
				var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
				//var hashes = url.slice(url.indexOf('?') + 1).split('&');
				for(var i = 0; i < hashes.length; i++)
				{
					hash = hashes[i].split('=');
					//vars.push(hash[0]);
					vars[hash[0]] = hash[1];
				}
				//console.log(vars);
				return vars;
			}
		var arr = {};
		arr = getUrlVars();
		if(arr['type'] != 'undefined') {
		
			var type = arr['type'].split('_');
			if (type[1] == 'maps' && type[0] == 'GE') {
				showGeMapVizualisation(type[0], arr['state'], arr['year'], arr['dis'], arr['party'] );
			} else if (type[1] == 'charts' && type[0] == 'GE') {
				showGeChartsVizualisation(type[0], arr['state'], '2014', arr['dis'], arr['party'] );
			} else if (type[1] == 'maps' && type[0] == 'AE') {
				showAeMapVizualisation(type[0], arr['state'], arr['year'], arr['dis'], arr['party'] );
			} else if (type[1] == 'charts' && type[0] == 'AE') {
				showAeChartsVizualisation(type[0], arr['state'], '2015', arr['dis'], arr['party'] );
			}
			//showAeChartsVizualisation(arr['type'], arr['state'], '2015', arr['dis'], '' );
			$("#graph_area6").addClass('svg-container');
			$("#graph_area6 svg").addClass('svg-content-responsive');
		}
		
		console.log(arr);
		if(arr.length > 0) {
			console.log(arr);
		} else {
			console.log('no val');
		}
})
/*
eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('$(u).k(b(){b a(){4 7=[],3;4 5=h.f.e.n(h.f.e.m(\'?\')+1).9(\'&\');l(4 i=0;i<5.c;i++){3=5[i].9(\'=\');7[3[0]]=3[1]}o 7}4 2={};2=a();g(2[\'d\']!=\'t\'){s(2[\'d\'],2[\'p\'],\'q\',2[\'r\'],\'\')}6.8(2);g(2.c>0){6.8(2)}j{6.8(\'w v\')}})',33,33,'||arr|hash|var|hashes|console|vars|log|split|getUrlVars|function|length|type|href|location|if|window||else|ready|for|indexOf|slice|return|state|2015|dis|showAeChartsVizualisation|undefined|document|val|no'.split('|'),0,{}))
*/	
