/** 
 * @class lore.ore.ui.CompoundObjectDataView Displays a summary of a Resource Map eg in browse, history, search lists
 * @extends Ext.DataView
 */
lore.ore.ui.CompoundObjectDataView = Ext.extend(Ext.DataView, {
    initComponent : function(){
        Ext.apply(this, { 
            plugins: new Ext.DataView.DragSelector({dragSafe:true}),
            tpl :  new Ext.XTemplate(               
                '<tpl for=".">',
                '<tpl if="!entryType.match(lore.constants.COMPOUND_OBJECT_TYPE)"><div class="coListing" onclick="lore.ore.controller.addQLDArchResource(\'{uri}\')"></tpl>',
                '<tpl if="entryType.match(lore.constants.COMPOUND_OBJECT_TYPE)"><div class="coListing" onclick="lore.ore.controller.loadCompoundObjectFromURL(\'{uri}\')"></tpl>',
                    '<table><tr valign="top"><td>{[this.genNumber(values.uri)]}</td><td>',
                    '<div style="float:left;padding:2px;">',
                    '<tpl if="lore.ore.reposAdapter && uri.match(lore.ore.reposAdapter.idPrefix) && !(entryType.match(lore.constants.BASIC_OBJECT_TYPE) || entryType.match(lore.constants.HUNI_OBJECT_TYPE))"><img src="' + lore.constants.baseUrl + 'skin/icons/oaioreicon-sm.png"></tpl>',
                    '<tpl if="lore.ore.reposAdapter && !uri.match(lore.ore.reposAdapter.idPrefix) && !(entryType.match(lore.constants.BASIC_OBJECT_TYPE) || entryType.match(lore.constants.HUNI_OBJECT_TYPE))"><img src="' + lore.constants.baseUrl + 'skin/icons/oaioreicon-grey.png"></tpl>',
                    '<tpl if="entryType.match(lore.constants.BASIC_OBJECT_TYPE) || entryType.match(lore.constants.HUNI_OBJECT_TYPE)"><img src="' + lore.constants.baseUrl + 'skin/icons/object.png"></tpl>',
                    '<tpl if="isPrivate"><img style="float:left;position:absolute;left:11px" src="' + lore.constants.baseUrl + 'skin/icons/eye.png"></tpl>',
                    '</div>',
                    '<div style="padding-left: 20px;">{title}</div>',
                    '<tpl if="description"><div class="descriptionText">{description}</div></tpl>',
                    '<div class="detailText">',
                        '<tpl if="typeof modified != \'undefined\' && modified != null">Last modified {[fm.date(values.modified,\'j M Y, g:ia\')]}</tpl>',
                        '<tpl if="typeof accessed != \'undefined\' && accessed != null">Last accessed {[fm.date(values.accessed,\'j M Y, g:ia\')]}</tpl>',
                        '<tpl if="type">{type}</tpl>',
                    '</div>',
                    '</td></tr></table>',
                '</div>',
                '</tpl>',
                {
                    dv: this,
                    genNumber: function(uri){
                        var idx = this.dv.store.find('uri',uri);
                        return this.dv.store.lastOptions.params.start + idx + 1;
                    }
                }
            ),
            loadingText: "Loading Resource Maps...",
            singleSelect: true,
            autoScroll: false,
            style: "overflow-y:auto;overflow-x:hidden",
            itemSelector : "div.coListing"
        });
        lore.ore.ui.CompoundObjectDataView.superclass.initComponent.call(this,arguments); 
        this.on('contextmenu',this.onContextMenu,this);
        
        // When data is loaded, refresh view to reset numbering
        this.store.on("load", 
            function(){
    			if (typeof this.getTemplateTarget() != 'undefined') {
    				this.refresh();
    			}
                // auto raise browse view when results are loaded
                if (this.id == 'cobview'){
                    if (!this.parentPanel) {
                        this.parentPanel = this.findParentByType('panel');
                    }
                    if (this.parentPanel){
                        Ext.getCmp("propertytabs").activate(this.parentPanel.id);
                    }
                }
            },
            this
        );
    },
    onContextMenu: function (e, node, obj){ 
        var elem = e.getTarget(this.itemSelector, 10);
        this.sel = this.getRecord(elem);
        try{
            if (!this.contextMenu){
                var cm = new Ext.menu.Menu({
                    id : this.id + "-context-menu",
                    showSeparator: false
                });
                this.contextMenu = cm;
                cm.remoteMsg = new Ext.form.Label({
                        text : "Resource Map is not from default repository",
                        cls: 'underlined'
                 });
                cm.add(cm.remoteMsg);
                cm.localLoad = new Ext.menu.Item({
                    text: "Edit Resource Map",
                       iconCls: "edit-icon",
                       scope: this,
                       handler: function(obj,evt) {
                            lore.ore.controller.loadCompoundObjectFromURL(this.sel.data.uri);
                        }
                    });
                 cm.remoteLoad = new Ext.menu.Item({
                    text: "View Resource Map in editor (read-only)",
                       iconCls: "edit-icon",
                       scope: this,
                       handler: function(obj,evt) {
                            lore.ore.controller.loadCompoundObjectFromURL(this.sel.data.uri);
                        }
                    });
                 
                 cm.add(cm.localLoad);
                 cm.add(cm.remoteLoad);
                 cm.localDelete = new Ext.menu.Item({
                    text : "Delete Resource Map",
                    iconCls: "delete-icon",
                    scope: this,
                    handler : function(obj,evt) {
                        lore.ore.controller.deleteCompoundObjectFromRepository(this.sel.data.uri, this.sel.data.title);
                    }
                 });
                 
                 cm.add(cm.localDelete);
                                  
                 cm.addResourceMap = new Ext.menu.Item({
                	 text : "Add as nested Resource Map",
                     iconCls: "add-icon",
                     scope: this,
                     handler : function(obj, evt) {
                         lore.ore.ui.graphicalEditor.addFigure({url:this.sel.data.uri,
                             props:{
                             "rdf:type_0": lore.constants.RESOURCE_MAP,
                             "dc:title_0": this.sel.data.title}});
                     }
                  });
                 
                 cm.add(cm.addResourceMap);
                 
                 cm.addBasic = new Ext.menu.Item({
                     text : "Add as basic object",
                     iconCls: "add-icon",
                     scope: this,
                     handler : function(obj,evt) {
                         lore.ore.controller.addQLDArchResource(this.sel.data.uri);
                     }
                  });
                  
                  cm.add(cm.addBasic);
                  
                  cm.addCompound = new Ext.menu.Item({
                      text : "Add with relations",
                      iconCls: "add-icon",
                      scope: this,
                      handler : function(obj,evt) {
                          lore.ore.controller.addFromCorbiculaURL(this.sel.data.uri, false);
                      }
                   });
                   
                   cm.add(cm.addCompound);
                   
                   cm.addResource = new Ext.menu.Item({
                       text : "Add to graphical editor",
                       iconCls: "add-icon",
                       scope: this,
                       handler : function(obj,evt) {      
                    	   var objProps = {
  		                	   //"rdf:type_0" : lore.constants.BASIC_OBJECT_TYPE,
   		                       "dc:title_0" : this.sel.data.title
   		                   };
   		                   if (this.sel.data.latitude){
   		                	   objProps["dc:latitude_0"] = this.sel.data.latitude;
   		                   }
   		                   if (this.sel.data.longitude){
   		                	   objProps["dc:longitude_0"] = this.sel.data.longitude;
   		                   }
   		                   if (this.sel.data.date_begin) {
   		                	   objProps["dc:date_begin_0"] = this.sel.data.date_begin;
   		                   }
   		                   if (this.sel.data.date_end) {
   		                	   objProps["dc:date_end_0"] = this.sel.data.date_end;
   		                   }
                           lore.ore.ui.graphicalEditor.addFigure({
	   		            		url : this.sel.data.uri,
	   		                	h: 60, 
	   		                	w: 180,
	   		                	oh: 170, 
	   		                	//rdftype : lore.constants.BASIC_OBJECT_TYPE,
	   		                	props : objProps
                           });
                       }
                    });
                    
                    cm.add(cm.addResource);
                   
                   cm.showBrowser = new Ext.menu.Item({
                       text : "View resource in browser",
                       iconCls: "launch-icon",
                       scope: this,
                       handler : function(obj,evt) {
                    	   lore.util.launchTab(this.sel.data.uri, window);  
                       }
                    });
                    
                    cm.add(cm.showBrowser);
                 
                 if (this.id == 'cohview'){
                    cm.add({
                       text: "Do not show in history",
                       icon: lore.constants.baseUrl + "skin/icons/ore/cross.png",
                       iconCls: "no-icon",
                       scope: this,
                       handler: function(obj,evt) {
                            if (lore.ore.historyManager){
                                lore.ore.historyManager.deleteFromHistory(this.sel.data.uri);
                            }
                        }
                    });
                 }
                 
                 
                 cm.on('beforeshow',function(menu){
                    if(lore.ore.reposAdapter && this.sel.data.uri.match(lore.ore.reposAdapter.idPrefix)){
                        menu.addResourceMap.show();
                        menu.localLoad.show();
                        menu.localDelete.show();
                        menu.remoteMsg.hide();
                        menu.remoteLoad.hide();
                        menu.addBasic.hide();
                        menu.addCompound.hide();
                        menu.addResource.hide();
                        menu.showBrowser.hide();
                    } else if(this.sel.data.entryType == lore.constants.COMPOUND_OBJECT_TYPE){
                        menu.addResourceMap.show();
                        menu.localDelete.hide();
                        menu.localLoad.hide();
                        menu.remoteLoad.show();
                        menu.remoteMsg.show();
                        menu.addBasic.hide();
                        menu.addCompound.hide();
                        menu.addResource.hide();
                        menu.showBrowser.hide();
                    } else if(this.sel.data.entryType == lore.constants.HUNI_OBJECT_TYPE){
                        menu.addResourceMap.hide();
                        menu.localDelete.hide();
                        menu.localLoad.hide();
                        menu.remoteLoad.hide();
                        menu.remoteMsg.hide();
                        menu.addBasic.hide();
                        menu.addCompound.hide();
                        menu.addResource.show();
                        menu.showBrowser.show();
                    } else {
                        menu.addResourceMap.hide();
                        menu.localDelete.hide();
                        menu.localLoad.hide();
                        menu.remoteLoad.hide();
                        menu.remoteMsg.hide();
                        menu.addBasic.show();
                        menu.addCompound.hide();
                        menu.addResource.hide();
                        menu.showBrowser.hide();
                    }
                 },this);
                        
            }
            this.contextMenu.showAt(e.xy);
        } catch (ex){
            lore.debug.ore("Error in onContextMenu",ex);
        }
    }
});
Ext.reg('codataview', lore.ore.ui.CompoundObjectDataView);

lore.ore.ui.CompoundObjectDragZone = function(dataview, config){
    this.dataview = dataview;
    lore.ore.ui.CompoundObjectDragZone.superclass.constructor.call(this, dataview.getEl(), config);
};
Ext.extend(lore.ore.ui.CompoundObjectDragZone, Ext.dd.DragZone, {
    containerScroll: true,
    ddGroup: "coDD",
    getDragData: function(evt) {
        var dataview = this.dataview;
        try{
            var sourceEl = evt.getTarget(dataview.itemSelector, 10);
            if (sourceEl) {
                var dragData = {
                    ddel: sourceEl,
                    draggedRecord: dataview.getRecord(sourceEl)
                };
                return dragData;
            }
        } catch (e){
            lore.debug.ore("Error in get drag data",e);
        }
        return false;
    }
});