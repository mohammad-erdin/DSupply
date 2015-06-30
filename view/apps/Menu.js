Ext.define("App.Menu",{
	extend : "Ext.panel.Panel",
	constructor: function(){
		this.items = [{
			xtype:'panel',
			title:"Beranda",
			autoScroll:true,
			itemId:"home",
		}]
		this.callParent();
	}
});
