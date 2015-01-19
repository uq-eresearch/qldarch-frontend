lore.ore.ui.Viewport = Ext.extend(Ext.Viewport, {
	
    /** Display an error message to the user
     * @param {String} message The message to display */
    error : function(/*String*/message){
        var statusopts = {
                'text': message,
                'iconCls': 'error-icon',
                'clear': {
                    'wait': 3000
                }
        };
        lore.ore.ui.status.setStatus(statusopts);
    },
    /**
     * Display an information message to the user
     * @param {String} message The message to display
     */
    info : function(/*String*/message) {
        var statusopts = {
                    'text': message,
                    'iconCls': 'info-icon',
                    'clear': {
                        'wait': 3000
                    }
        };
        lore.ore.ui.status.setStatus(statusopts);
    },
    /**
     * Display a warning message to the user
     * @param {String} message The message to display
     */
    warning : function(/*String*/message){
        var statusopts = {
            'text': message,
            'iconCls': 'warning-icon',
            'clear': {
                'wait': 3000
            }
        };
        lore.ore.ui.status.setStatus(statusopts);
    },
    /**
     * Display a progress message (with loading icon) to the user
     * @param {} message The message to display
     */
    progress : function(message){
        var statusopts = {
            'text': message,
            'iconCls': 'loading-icon',
            'clear': false
        };
        lore.ore.ui.status.setStatus(statusopts);
    }
});