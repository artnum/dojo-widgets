define([
	"dojo/_base/lang",
	"dojo/Deferred",
	"dojo/request/xhr"
], function(
	djLang,
	djDeferred,
	djXhr
){
return { 
		_options: function() {
			var options =  { handleAs: 'json', cacheTimeout: 240 };
			if(arguments[0]) {
				if(arguments[0].query) {
					options.query = arguments[0].query;	
				}
				if(arguments[0].headers) {
					options.headers = arguments[0].headers;	
				}
				if(arguments[0].data) {
					options.data = arguments[0].data;	
				}
				if(arguments[0].cacheTimeout) {
					options.data = arguments[0].cacheTimeout;	
				}
			}

			return options;
		},

		get: function (url) {
			var def = new djDeferred();
			var options = this._options(arguments[1]);
			options.method = 'GET';

			djXhr(url, options).then(function (r) {
				def.resolve(r);
			});

			return def.promise;
		},

		post: function (url) {
			var def = new djDeferred();
			var options = this._options(arguments[1]);
			options.method = 'POST';

			djXhr(url, options).then( function (r) {
				def.resolve(r);
			});

			return def.promise;			
		},

		put: function (url) {
			var def = new djDeferred();
			var options = this._options(arguments[1]);
			options.method = 'PUT';

			djXhr(url, options).then( function (r) {
				def.resolve(r);	
			});

			return def.promise;
		},

		del: function (url) {
			var def = new djDeferred();
			var options = this._options(arguments[1]);
			options.method = 'DELETE';

			djXhr(url, options).then( function (r) {
				def.resolve(r);
			});

			return def.promise;
		},

		head: function(url) {
			var xhr = new XMLHttpRequest();
			var def = new djDeferred();

			window.setTimeout( function () {
				xhr.onreadystatechange = function (event) {
					if(this.readyState === XMLHttpRequest.DONE) {
						if(this.status === 200) {
							var hArtnum = /X-Artnum-([^\:]+)\:([^\r\n]*)/;
							var hGeneric = /([^\:]+)\:([^\r\n]*)/;
							var headers = this.getAllResponseHeaders();
							var result = new Object();
							headers.split(/[\r\n]/).forEach( function (header) {
								if(hArtnum.test(header)) {
									var s = hArtnum.exec(header);
									result[s[1]] = s[2];
								} else if(hGeneric.test(header)) {
									var s = hGeneric.exec(header);
									result[s[1]] = s[2];
								}
							});
							def.resolve(result);	
						} else {
							def.resolve(null);
						}
					}
				}

				xhr.open('HEAD', url, true);
				xhr.send();
			}, 0);

			return def.promise;
		}
	};
});
