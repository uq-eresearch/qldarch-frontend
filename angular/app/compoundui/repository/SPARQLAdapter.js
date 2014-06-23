/** 
 * @class lore.ore.repos.SPARQLAdapter Access and store Resource Maps using a
 *  SPARQL based respository
 * @extends lore.ore.repos.RepositoryAdapter
 */
lore.ore.repos.SPARQLAdapter = Ext.extend(lore.ore.repos.RepositoryAdapter,{

	graphStoreEndPoint : "",
	graphNamePrefix : "",
	mask : null,
	maskCount : 0, 
	
    constructor : function(baseURL, graphStoreEndPoint, graphNamePrefix) {
        lore.ore.repos.SPARQLAdapter.superclass.constructor.call(this, baseURL);
        this.reposURL = baseURL;
        this.idPrefix = this.reposURL;
        this.unsavedSuffix = "#unsaved";
        this.graphStoreEndPoint = graphStoreEndPoint;
        
        var a = document.createElement('a');
        a.href = graphNamePrefix;        
        this.graphNamePrefix = a.href;
    },
    /**
     * Retrieve a set of compound objects from the SPARQL repository,
     * matching the given parameters.
     * @param {} matchuri
     * @param {} matchpred
     * @param {} matchval
     * @param {} isSearchQuery
     */
    getCompoundObjects : function(matchuri, matchpred, matchval, isSearchQuery){ 
        lore.ore.coListManager.clear((isSearchQuery? "search" : "browse"));
        if (!lore.ore.repos.SPARQLAdapter.mask && Ext.get('westPanel')) {
        	lore.ore.repos.SPARQLAdapter.mask = new Ext.LoadMask(Ext.get('westPanel'), {msg:"Loading..."});
        }
        lore.ore.repos.SPARQLAdapter.maskCount = 0;
        
        if (isSearchQuery) {
        	lore.ore.reposAdapter.getBasicObjects(matchval);
        }
        lore.ore.reposAdapter.getResourceMapObjects(matchuri, matchpred, matchval, isSearchQuery);
    },
    getBasicObjects : function(matchval){            
    	try {
	    	if (matchval == null || matchval == "") {
	    		return;
	    	}
	    	
	    	var queryURL = "/openrdf-sesame/repositories/QldarchMetadataServer?query=" 
	    	queryURL += encodeURIComponent("SELECT distinct(?item as ?hit) ?name ?type ");
	    	queryURL += encodeURIComponent("WHERE {");
	    	queryURL += encodeURIComponent("{?item a ?type.");
	    	queryURL += encodeURIComponent("?item (<http://xmlns.com/foaf/0.1/name>|<http://xmlns.com/foaf/0.1/firstName>|");
	    	queryURL += encodeURIComponent("<http://qldarch.net/ns/rdf/2012-06/terms#label>|<http://qldarch.net/ns/rdf/2012-06/terms#topicHeading>|");
	    	queryURL += encodeURIComponent("<http://qldarch.net/ns/rdf/2012-06/terms#citation>|<http://qldarch.net/ns/rdf/2012-06/terms#firmName>|");
	    	queryURL += encodeURIComponent("<http://qldarch.net/ns/rdf/2012-06/terms#eventTitle>|<http://qldarch.net/ns/rdf/2012-06/terms#awardTitle>|");
	    	queryURL += encodeURIComponent("<http://xmlns.com/foaf/0.1/lastName>|<http://www.w3.org/2004/02/skos/core#prefLabel>) ?textValue. ");
	    	queryURL += encodeURIComponent("FILTER(REGEX(?textValue, '" + matchval + "', 'i'))} ");
	    	queryURL += encodeURIComponent("OPTIONAL {");
	    	queryURL += encodeURIComponent("SELECT ?item (CONCAT(?fname, ' ', ?lname) AS ?name)");
	    	queryURL += encodeURIComponent("WHERE {");
	    	queryURL += encodeURIComponent("?item <http://xmlns.com/foaf/0.1/firstName> ?fname.");
	    	queryURL += encodeURIComponent("?item <http://xmlns.com/foaf/0.1/lastName> ?lname.");
	    	queryURL += encodeURIComponent("?item <http://xmlns.com/foaf/0.1/lastName> ?lname.");
	    	queryURL += encodeURIComponent("}");
	    	//queryURL += encodeURIComponent("GROUP BY ?item ?fname ?lname");
	    	queryURL += encodeURIComponent("}");
	    	queryURL += encodeURIComponent("OPTIONAL {?item <http://xmlns.com/foaf/0.1/name> ?name}");
	    	queryURL += encodeURIComponent("OPTIONAL {?item <http://qldarch.net/ns/rdf/2012-06/terms#citation> ?name}");
	    	queryURL += encodeURIComponent("OPTIONAL {?item <http://qldarch.net/ns/rdf/2012-06/terms#firmName> ?name}");
	    	queryURL += encodeURIComponent("OPTIONAL {?item <http://qldarch.net/ns/rdf/2012-06/terms#eventTitle> ?name}");
	    	queryURL += encodeURIComponent("OPTIONAL {?item <http://qldarch.net/ns/rdf/2012-06/terms#awardTitle> ?name}");
	    	queryURL += encodeURIComponent("OPTIONAL {?item <http://qldarch.net/ns/rdf/2012-06/terms#label> ?name}");
	    	queryURL += encodeURIComponent("OPTIONAL {?item <http://www.w3.org/2004/02/skos/core#prefLabel> ?name}");
	    	queryURL += encodeURIComponent("OPTIONAL {?item <http://qldarch.net/ns/rdf/2012-06/terms#topicHeading> ?name}");
	    	queryURL += encodeURIComponent("}");
		   	queryURL += "&output=xml&limit=9999";   
		   	lore.debug.ore("SPARQLAdapter.getBasicObjects", queryURL);

		   	if (lore.ore.repos.SPARQLAdapter.maskCount == 0) {
			   	lore.ore.repos.SPARQLAdapter.mask.show();
		   	}
		   	lore.ore.repos.SPARQLAdapter.maskCount += 1;
		   			   	
		   	var xhr = new XMLHttpRequest();                
	        xhr.overrideMimeType('text/xml');
	        var oThis = this;
	        xhr.open("GET", queryURL);
	        xhr.setRequestHeader("Accept","application/sparql-results+xml");    
	        xhr.onreadystatechange= function(){
	            if (xhr.readyState == 4) {
		    	
	            	lore.ore.repos.SPARQLAdapter.maskCount += -1;
	    		   	if (lore.ore.repos.SPARQLAdapter.maskCount <= 0) {
	    			   	lore.ore.repos.SPARQLAdapter.mask.hide();
	    		   	}
	    		   	
	            	var xmldoc = xhr.responseXML;
	                var results = {};
	                if (xmldoc) {
	                    results = xmldoc.getElementsByTagNameNS(lore.constants.NAMESPACES["sparql"], "result");
	                }
	                
	                if (results.length > 0){
	                    var coList = [];
	                    
	                    for (var i = 0; i < results.length; i++) {                    	
	                    	var bindings = results[i].getElementsByTagName("binding");
	                    	
	                    	var props = {};
	                    	props.creator = "QLDArch";
	                    	props.type = "";
	                    	props.entryType = lore.constants.BASIC_OBJECT_TYPE;
	                    	
	                        for (var j = 0; j < bindings.length; j++){  
		                         attr = bindings[j].getAttribute('name');
		                         if (attr =='hit'){
		                             var node = bindings[j].getElementsByTagName('uri'); 
		                             props.uri = lore.util.safeGetFirstChildValue(node);
		                         } else if (attr == 'type'){
		                             var node = bindings[j].getElementsByTagName('uri'); 
		                             var type = lore.util.safeGetFirstChildValue(node);

		                             while (type.indexOf("/") != -1) {
		                            	 type = type.substring(type.indexOf("/") + 1);
	                            	 }
		                             while (type.indexOf("_") != -1) {
		                            	 type = type.substring(type.indexOf("_") + 1);
	                            	 }
		                             while (type.indexOf("#") != -1) {
		                            	 type = type.substring(type.indexOf("#") + 1);
	                            	 }
		                             props.type = type;
		                         } else if (attr == 'name'){
		                             var node = bindings[j].getElementsByTagName('literal');
		                             var nodeVal = lore.util.safeGetFirstChildValue(node);
		                             if (!nodeVal){
		                                 node = bindings[j].getElementsByTagName('uri');
		                                 nodeVal = lore.util.safeGetFirstChildValue(node);
		                             }
		                             props.title = nodeVal;
		                         } 
	                        }
	                        
	                        coList.push(props);
	                    }
	                    lore.ore.coListManager.add(coList, "search");
	                }
	            } else {
	            	lore.ore.repos.SPARQLAdapter.maskCount += -1;
	    		   	if (lore.ore.repos.SPARQLAdapter.maskCount <= 0) {
	    			   	lore.ore.repos.SPARQLAdapter.mask.hide();
	    		   	}
	            }
	        };
	        xhr.send(null);
	    } catch (e) {
	        lore.debug.ore("Error: Unable to retrieve Resource Maps",e);
	        lore.ore.ui.vp.warning("Unable to retrieve Resource Maps");
	    }
    },
    getResourceMapObjects : function(matchuri, matchpred, matchval, isSearchQuery){ 
    	try {
	    	if (matchuri == null && matchpred == null && (matchval == null || matchval == "")) {
	    		return;
	    	}
	    	
	        var ra = this;
	        var escapedURL = "";
	       	var altURL = "";
	       	if (matchuri){
	       		escapedURL = encodeURIComponent(matchuri.replace(/}/g,'%257D').replace(/{/g,'%257B'));
	       	}
	       	
	       	var predicate = "?p";
	   	   	if (matchpred != null || matchpred) {
	   	   		matchpred = String(matchpred);
	   	   		if (matchpred.length != 0) {
	   	   			predicate = "<" + matchpred + ">";
	   	   		}
	   	   	}
	       	
	       	var queryURL = this.reposURL + "?query=";
	  	   	queryURL += encodeURIComponent("SELECT DISTINCT ?g ?a ?m ?t ?priv ");
	   	   	queryURL += encodeURIComponent("WHERE { GRAPH ?g {");
	   	   	queryURL += encodeURIComponent("?g <http://www.openarchives.org/ore/terms/describes> ?r.");
	   	   	if (matchuri) {
	   	   		queryURL += encodeURIComponent("?r <http://www.openarchives.org/ore/terms/aggregates> <" + matchuri + ">.");
	   	   	}
	   	   	queryURL += encodeURIComponent("?s " + predicate + " ?o .");
	   	   	queryURL += encodeURIComponent("OPTIONAL {?g <http://purl.org/dc/elements/1.1/creator> ?a}.");
	   	   	queryURL += encodeURIComponent("OPTIONAL {?g <http://purl.org/dc/terms/modified> ?m}.");
	   	   	queryURL += encodeURIComponent("OPTIONAL {?g <http://purl.org/dc/elements/1.1/title> ?t}.");
	   	   	queryURL += encodeURIComponent("OPTIONAL {?g <http://auselit.metadata.net/lorestore/isPrivate> ?priv}.");
	   	   	queryURL += encodeURIComponent("OPTIONAL {?g <http://auselit.metadata.net/lorestore/isPrivate> ?user}.");
		   
		   	if (matchval != null) {
			    matchval = String(matchval);
				if (matchval[0] == "\"" && matchval[matchval.length - 1] == "\"") {
					var temp = matchval.substring(1, matchval.length - 1);
					queryURL += encodeURIComponent("FILTER regex(str(?o), \"" + temp + "\", \"i\").");
				} else if (matchval.indexOf(" ") != -1) {
					var terms = matchval.split(" ");
					for (var i = 0; i < terms.length; i++) {
						queryURL += encodeURIComponent("FILTER regex(str(?o), \"" + terms[i] + "\", \"i\"). ");
					}
				} else {
					queryURL += encodeURIComponent("FILTER regex(str(?o), \"" + matchval + "\", \"i\").");
				}
		   	}
		   
		   	queryURL += encodeURIComponent("}}");
		   	queryURL += "&output=xml";   
		   	lore.debug.ore("SPARQLAdapter.getCompoundObjects", queryURL);
		   	
		    var oThis = this;
		   	if (lore.ore.repos.SPARQLAdapter.maskCount == 0) {
			   	lore.ore.repos.SPARQLAdapter.mask.show();
		   	}
		   	lore.ore.repos.SPARQLAdapter.maskCount += 1;
		    	
	        var xhr = new XMLHttpRequest();                
	        xhr.overrideMimeType('text/xml');
	        var oThis = this;
	        xhr.open("GET", queryURL);
	        xhr.setRequestHeader("Accept","application/sparql-results+xml");    
	        xhr.onreadystatechange= function(){
	            if (xhr.readyState == 4) {
		    	
	    		   	lore.ore.repos.SPARQLAdapter.maskCount += -1;
	    		   	if (lore.ore.repos.SPARQLAdapter.maskCount <= 0) {
	    			   	lore.ore.repos.SPARQLAdapter.mask.hide();
	    		   	}
	    		   	
			    	var xmldoc = xhr.responseXML;
	                var listname = (isSearchQuery? "search" : "browse");  
	                var result = {};
	                if (xmldoc) {
	                    result = xmldoc.getElementsByTagNameNS(lore.constants.NAMESPACES["sparql"], "result");
	                }

	                if (result.length > 0){
	                    var coList = [];
	                    var processed = {};
	                    for (var i = 0; i < result.length; i++) {
	                        var theobj = ra.parseCOFromXML(result[i]);
	                        var resultIndex = processed[theobj.uri];
	                        var existing = theobj; 
	                        if (resultIndex >= 0){
	                            existing = coList[resultIndex];
	                            if (existing && !existing.creator.match(theobj.creator)){
	                                existing.creator = existing.creator + " &amp; " + theobj.creator;
	                            }
	                        } else {
	                           if (matchval) {theobj.searchval = matchval;}
	                           coList.push(theobj);
	                           processed[theobj.uri] = coList.length - 1; 
	                        }    
	                    }
	                    lore.ore.coListManager.add(coList,listname);
	        		   	console.log(lore.ore.coListManager);
	                }
	            }
	        };
	        xhr.send(null);
	    } catch (e) {
		   	lore.ore.repos.SPARQLAdapter.maskCount += -1;
		   	if (lore.ore.repos.SPARQLAdapter.maskCount <= 0) {
			   	lore.ore.repos.SPARQLAdapter.mask.hide();
		   	}
		   	
	        lore.debug.ore("Error: Unable to retrieve Resource Maps",e);
	        lore.ore.ui.vp.warning("Unable to retrieve Resource Maps");
	    }
    },
    /**
     * Load a compound object from the SPARQL repository
     * @param {} remid
     * @param {} callback
     * @param {} failcallback
     * @return {}
     */
    loadCompoundObject : function(remid, callback, failcallback){
         Ext.Ajax.request({
        		url: this.reposURL + this.graphStoreEndPoint + "?graph=" + remid,
                headers: {
                    Accept: 'application/rdf+xml'
                },
                method: "GET",
                disableCaching: false,
                success: callback,
                failure: failcallback
            }); 
    },
    /**
     * Commit a compound object to the SPARQL repository
     * @param {} theco
     * @param {} callback
     * @return {}
     */
    saveCompoundObject : function (theco,callback){
        var remid = theco.uri;

        var sparqlData = theco.serialize('rdfquery');
        var triples = sparqlData.databank.triples();
        var trigs = "";
        for (var i = 0; i < triples.length; i++) {
        	var currentTriple = triples[i];
        	// SPARQL triplestores cannot handle rdf:about triples
        	if (currentTriple.property.value._string != "http://www.w3.org/1999/02/22-rdf-syntax-ns#about"){
                trigs += triples[i];
        	}
        }
        
        var xhr = new XMLHttpRequest();                
        xhr.overrideMimeType('text/xml');
        var oThis = this;
        xhr.open("PUT", this.reposURL + this.graphStoreEndPoint + "?graph=" + remid);
        xhr.setRequestHeader("Content-type","application/x-turtle");
        xhr.onreadystatechange= function(){
            if (xhr.readyState == 4) {
                lore.debug.ore("lorestore: RDF saved");
                lore.ore.ui.vp.info("Resource Map " + remid + " saved");
                callback(remid);
            }
        };
        xhr.send(trigs);
    },
    /**
     * Remove a graph from the SPARQL repository
     * @param {} oldURI
     * @param {} newURI
     * @return {}
     */
    loadNew : function(oldURI, newURI) {
        lore.ore.cache.remove(oldURI);
        
        controller.loadCompoundObjectFromURL(newURI);
        lore.ore.reposAdapter.loadCompoundObject(rdfURL, lore.ore.controller.loadCompoundObject, lore.ore.controller.afterLoadCompoundObjectFail);
    },
    /**
     * Remove a graph from the SPARQL repository
     * @param {} remid
     * @param {} callback
     * @return {}
     */
    deleteCompoundObject : function(remid, callback){
        lore.debug.ore("deleting from lorestore repository " + remid);
        try {
    	   	//lore.ore.am.runWithAuthorisation(function() {
            var url = this.reposURL + this.graphStoreEndPoint + "?graph=" + remid;
            
            var xhr = new XMLHttpRequest();                
            xhr.overrideMimeType('text/xml');
            var oThis = this;
            xhr.open("DELETE", url);
            xhr.onreadystatechange= function(){
                if (xhr.readyState == 4) {
                	callback(remid);
                }
            };
            xhr.send(null);
            //});
        } catch (e){
            Ext.MessageBox.hide();
            lore.debug.ore("Error in SPARQLAdapter deleting Resource Map",e);
        }        
    },
    /**
     * Performs a SPARQL query to retrieve data for Explore view
     * @param {} uri
     * @param {} title
     * @param {} isCompoundObject
     * @param {} callback
     * @return {}
     */
    getExploreData : function(uri,title,isCompoundObject, callback){
        var eid = uri.replace(/&amp;/g,'&').replace(/&amp;/g,'&');
        try {            
            var queryURL = this.reposURL + "?query=";
 		    queryURL += encodeURIComponent("SELECT DISTINCT ?something ?somerel ?sometitle ?sometype ?creator ?modified ?anotherrel ?somethingelse ");
 		    queryURL += encodeURIComponent("WHERE {");
 		    queryURL += encodeURIComponent("{GRAPH ?g {?aggre <http://www.openarchives.org/ore/terms/aggregates> <" + uri + "> . ");
 		    queryURL += encodeURIComponent("?something <http://www.openarchives.org/ore/terms/describes> ?aggre . ");
 		    queryURL += encodeURIComponent("?something a ?sometype . ");
 		    queryURL += encodeURIComponent("OPTIONAL {?something <http://purl.org/dc/elements/1.1/creator> ?creator .} ");
 		    queryURL += encodeURIComponent("OPTIONAL {?something <http://purl.org/dc/terms/modified> ?modified .} ");
 		    queryURL += encodeURIComponent("OPTIONAL {?something <http://purl.org/dc/elements/1.1/title> ?sometitle .}");
 		    queryURL += encodeURIComponent("}}");
 		    queryURL += encodeURIComponent("UNION { GRAPH ?g {?something ?somerel <" + uri + "> . ");
 		    queryURL += encodeURIComponent("FILTER isURI(?something) .");
 		    queryURL += encodeURIComponent("FILTER (?somerel != <http://www.openarchives.org/ore/terms/aggregates>) . ");
 		    queryURL += encodeURIComponent("FILTER (?somerel != <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>) . ");
 		    queryURL += encodeURIComponent("OPTIONAL {?something a ?sometype} .");
 		    queryURL += encodeURIComponent("OPTIONAL {?something <http://purl.org/dc/elements/1.1/title> ?sometitle.} ");
 		    queryURL += encodeURIComponent("}}");
 		    queryURL += encodeURIComponent("UNION {GRAPH ?g {<" + uri + "> ?somerel ?something .");
 		    queryURL += encodeURIComponent("FILTER isURI(?something). ");
 		    queryURL += encodeURIComponent("FILTER (?somerel != <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>) . ");
 		    queryURL += encodeURIComponent("FILTER (?somerel != <http://www.openarchives.org/ore/terms/describes>) . ");
 		    queryURL += encodeURIComponent("OPTIONAL {?something a ?sometype} .");
 		    queryURL += encodeURIComponent("OPTIONAL {?something <http://purl.org/dc/elements/1.1/title> ?sometitle.}");
 		    queryURL += encodeURIComponent("}}");
 		    queryURL += encodeURIComponent("UNION {GRAPH ?g {<" + uri + "> <http://www.openarchives.org/ore/terms/describes> ?aggre .");
 		    queryURL += encodeURIComponent("?aggre ?somerel ?something . ");
 		    queryURL += encodeURIComponent("FILTER isURI(?something) .");
 		    queryURL += encodeURIComponent("FILTER (?somerel != <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>) .");
 		    queryURL += encodeURIComponent("OPTIONAL {?something <http://purl.org/dc/elements/1.1/title> ?sometitle . } . ");
 		    queryURL += encodeURIComponent("OPTIONAL {?something ?anotherrel ?somethingelse . FILTER isURI(?somethingelse)} . ");
 		    queryURL += encodeURIComponent("OPTIONAL {?something a ?sometype}");
 		    queryURL += encodeURIComponent("}}}");
 		    queryURL += "&output=xml";
 		    
            if (this.exploreStylesheet){
               
               var xsltproc = new XSLTProcessor();                
            
               xsltproc.importStylesheet(this.exploreStylesheet);
               xsltproc.setParameter(null,'subj',eid);
               if (title){
                   xsltproc.setParameter(null,'title',title);
               }
               if (isCompoundObject){
                   xsltproc.setParameter(null,'isCompoundObject','y');
               }
            
               var xhr = new XMLHttpRequest();                
               xhr.overrideMimeType('text/xml');
               var oThis = this;
               xhr.open("GET", queryURL);
   	           xhr.setRequestHeader("Accept","application/sparql-results+xml");   
               xhr.onreadystatechange= function(){
                   if (xhr.readyState == 4) {
	                   	var rdfDoc = xhr.responseXML;
	                    var serializer = new XMLSerializer();
	                    var thefrag = xsltproc.transformToFragment(rdfDoc, document);
	                    var jsonobj = Ext.decode(thefrag.textContent);
	                    callback(jsonobj);
                   }
               };
               xhr.send(null);
            } else {
                lore.debug.ore("Explore view stylesheet not ready",this);
                lore.ore.ui.vp.info(" ");
            }
        } catch (ex){
            lore.debug.ore("Error in SPARQLAdapter.getExploreData",ex);
        } 
    },
    
    generateID : function() {
    	return this.graphNamePrefix + "/" + lore.draw2d.UUID.create();
    },
    /**
    * Parses Resource Map details from a SPARQL XML result
    * @param {XMLNode} XML node to be parsed
    * Returns an object with the following properties:
    *  {string} uri The identifier of the Resource Map 
    *  {string} title The (Dublin Core) title of the Resource Map 
    *  {string} creator The (Dublin Core) creator of the Resource Map 
    *  {Date} modified The date on which the Resource Map was modified (from dcterms:modified) 
    *  {string} match The value of the subject, predicate or object from the triple that matched the search 
    *  {Date} acessed The date this Resource Map was last accessed (from the browser history) 
    * */
   parseCOFromXML: function(/*Node*/result){
        var props = {};
        var bindings, node, attr, nodeVal;
        props.title = "Untitled";
        props.creator = "Anonymous";
        props.entryType = lore.constants.COMPOUND_OBJECT_TYPE;
        try {  
           bindings = result.getElementsByTagName('binding');
           for (var j = 0; j < bindings.length; j++){  
            attr = bindings[j].getAttribute('name');
            if (attr =='g'){ //graph uri
                node = bindings[j].getElementsByTagName('uri'); 
                props.uri = lore.util.safeGetFirstChildValue(node);
            } else if (attr == 'v'){
                node = bindings[j].getElementsByTagName('literal');
                nodeVal = lore.util.safeGetFirstChildValue(node);
                if (!nodeVal){
                    node = bindings[j].getElementsByTagName('uri');
                }
                props.match = lore.util.safeGetFirstChildValue(node);
            } else {
                node = bindings[j].getElementsByTagName('literal');
                nodeVal = lore.util.safeGetFirstChildValue(node);
                if (attr == 't' && nodeVal){ //title
                    props.title = nodeVal;
                } else if (attr == 'a' && nodeVal){// dc:creator
                    props.creator = nodeVal;
                } else if (attr == 'priv' && nodeVal) { // isPrivate
                    props.isPrivate = nodeVal;
                }
                else if (attr == 'm' && nodeVal){ // dcterms:modified
                    props.modified = nodeVal;
                    try {
                        var modDate = Date.parseDate(props.modified,'c') || Date.parseDate(props.modified,'Y-m-d');
                        if (modDate){
                            props.modified = modDate;
                        }
                    } catch (e){
                        lore.debug.ore("Error in parseCOFromXML converting date",e);
                    }
                } 
            }
           }
        } catch (ex) {
            lore.debug.ore("Error: Unable to process Resource Map result list", ex);
        }
        return props;
    }
});


 