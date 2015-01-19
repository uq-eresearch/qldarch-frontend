try {
    // Set up JavaScript namespaces
    lore = {
        /* General LORE user interface functionality */
        ui : {},
        /* Resource Maps */
        ore: {
            /* Text mining */  
            textm: {}, 
            /* Resource Map-related user interface */
            ui: {
                /* Graphical Editor */
                graph: {}
            },
            /* Model classes for Resource Maps */
            model: {},
            /* Repository access for Resource Maps */
            repos: {}
        },
        debug : {},
        /* Global functions and properties  */
        global: {}
    };
} catch (e) {
    window.top.alert(
        "Unable to load LORE. Please provide the following details to the development team:\n\n" 
        + e + " " + e.stack
    );
}