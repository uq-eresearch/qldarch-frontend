Ext.ns('lore');

lore.AuthManager = Ext.extend(Ext.util.Observable, {
    // TODO: check authorities independently: for now we do not support accounts without both roles
    ANNO_AUTHORITY: "ROLE_ANNOTATOR",
    ORE_AUTHORITY: "ROLE_ORE",
    constructor: function() {
        this.addEvents(
            /**
             * @event signedin
             * Fires when the user has successfully signed into the server
             */
            'signedin',
            /**
             * @event signedin
             * Fires when the user has signed out from the server.
             */
            'signedout',
            /**
             * @event cancel
             * Fires when user cancels logging in
             */
            'cancel',
            /**
             * @event error
             * Fires when authorisation cannot be established due to error
             */
            'error');
        // Tracks signed in state, to prevent superfluous event firing
        this.signedIn = false; 
    },
    /**
     * Load login, logout and registration urls from Emmet service
     * @param {} prefs Preferences (must contain a url property)
     * @param {} callback Function to call after urls have been loaded
     */
    reloadEmmetUrls: function(prefs, callback) {
        this.prefs = prefs;
        var emmetUrl = prefs.url + '/emmet.svc';
        lore.debug.ui("reloadEmmetUrls " + emmetUrl);
        // check whether login url is defined (if not, network may not have been enabled on load)
        if (this.EMMET_URL == emmetUrl && this.LOGIN_URL) {
            return;
        } else {
            this.EMMET_URL = emmetUrl;
        }

        Ext.Ajax.request({
            url: this.EMMET_URL,
            success: function(response){
                this.parseEmmetUrlsResponse(response, callback)
            },
            method: 'GET',
            params: {action: 'fetchEmmetUrls',
                     format: 'json'},
            scope: this

        });
    },
    /**
     * Get login, logout and registration urls from response
     * @param {} response
     * @param {} callback
     */
    parseEmmetUrlsResponse: function(response, callback) {
        var jsObject = Ext.decode(response.responseText);
        var emmetUrls = jsObject.emmetUrls;
        this.LOGOUT_URL = emmetUrls['emmet.logout.url'];
        this.LOGIN_URL = emmetUrls['emmet.login.url'];
        this.REGISTER_URL = emmetUrls['emmet.register.url'];

        this.isAuthenticated();
        if (this.LOGIN_URL){
            if (callback && typeof callback == 'function'){
                callback();
            }    
        } else {
            lore.debug.ui("Unable to get Emmet URLs",[this,response]);
        }
        
    },


    /**
     * Run the supplied callback function if the user is currently authorised
     */
    isAuthenticated : function(callback) {
        //lore.debug.ui("isAuthenticated",this);
        if (this.EMMET_URL){
            Ext.Ajax.request({
               url: this.EMMET_URL,
               success: this.checkAuthentication,
               failure: this.fireError.createDelegate(this),
               method: 'GET',
               params: { action: 'fetchAuthentication',
                         format: 'json' },
               callIfAuthorised: callback,
               scope: this
            });
        } else {
            lore.debug.ui("isAuthenticated: No emmet url defined!",this);
        }
    },

    /**
     * Run the supplied callback function if the user is *not* currently authorised
     */
    ifNotAuthenticated : function(callback) {
        lore.debug.ui("ifNotAuthenticated",this);
        if (this.EMMET_URL){
            Ext.Ajax.request({
               url: this.EMMET_URL,
               success: this.checkAuthentication,
               failure: this.fireError.createDelegate(this),
               method: 'GET',
               params: { action: 'fetchAuthentication',
                         format: 'json' },
               callIfNotAuthorised: callback,
               scope: this
            });
        } else {
             lore.debug.ui("ifNotAuthenticated: No emmet url defined!",this);
        }
    },

    // private
    checkAuthentication : function(xhr, options) {
        try {
            var principal = Ext.decode(xhr.responseText).userAuthentication.principal;
            lore.debug.ui("checkAuthentication: ", principal);
            var authorities = principal.authorities;
            var authorised = this.hasAuthority(authorities, "ROLE_USER") &&
                this.hasAuthority(authorities, "ROLE_ORE");
            
            if (principal.username) {
            	principal.userName = principal.username;
            }
            
            if (authorised) {
                this.fireSignedIn(principal.username);
                if (typeof options.callIfAuthorised == 'function') {
                    options.callIfAuthorised(principal);
                }
                return;
            }
        } catch (e) {
            lore.debug.ui("Error AuthManager:checkAuthentication failed", e);
        }
        lore.debug.ui("User is not authorised",principal);
        this.fireSignedOut();
        if (typeof options.callIfNotAuthorised == 'function') {
            options.callIfNotAuthorised();
        }
    },

    // private
    hasAuthority : function(authorities, requiredAuthority) {
        if (authorities) {
            for (var i = 0; i < authorities.length; i++) {
                if (authorities[i].authority == requiredAuthority) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * Checks whether the user is currently authorised,
     * if so, runs the callback function, if not
     * displays a loginwindow, and if successful runs the function.
     * If not, the function is not run.
     */
    runWithAuthorisation : function(callback) {
        var t = this;
        this.isAuthenticated(function(principal) {
            if (typeof callback == 'function') {
                callback(principal);
            }
        });
        
        this.ifNotAuthenticated(function(principal) {
        	Ext.Msg.show({
    		   msg: 'Unable to complete action. Please log in.',
    		   buttons: Ext.Msg.OK
    		});
        });
    },

    /**
     * If the user is not already authorised, open a login dialog for them to do so
     */
    displayLoginWindow : function() {
    	var oThis = this;
    	
    	var loginwindow = window.open(oThis.LOGIN_URL, 
				'openid_popup', 'width=410, height=460, left=150, top=50');
    	
    	loginwindow.addEventListener("beforeunload", function() {
            oThis.fireEvent("cancel");
            oThis.isAuthenticated();
	    }, false);
    	
    	window.handleOpenIDResponse = function() {
            oThis.isAuthenticated();
    	}
    	
        this.isAuthenticated(function () {
            window.open('', 'openid_popup').close();
        });
    },
    
    logout : function() {
        var oThis = this;
        var doLogout = function(){
            Ext.Ajax.request({
                url: oThis.LOGOUT_URL,
                success: oThis.isAuthenticated,
                method: 'GET',
                scope: oThis
             });
        }
        if (!this.LOGOUT_URL){
            this.reloadEmmetUrls(this.prefs, doLogout);
        } else {
            doLogout();
        }
    },
    
    fireSignedIn : function(userName) {
        if (!this.signedIn) {
            this.signedIn = true;
            this.fireEvent('signedin', userName);
        }
    },
    
    fireSignedOut : function() {
        if (this.signedIn) {
            this.signedIn = false;
            this.fireEvent('signedout');
        }  
    },
    fireError : function(){
        this.fireSignedOut();
        this.fireEvent('error');
    }

});
