Ext.define("App.Priv",{
	extend : Object,
	constructor: function(){
		this.callParent();
		this.loadPriv();
	},
	loadPriv:function(){
		Ext.Ajax.request({
			url : "controller/auth/init-priv",
			scope: this,
			success : function(a){
				var d=Ext.decode(a.responseText);
				Ext.apply(this,d.data);
				if(Ext.isEmpty(App.Main))App.Main = Ext.create("App.Main");	

				//App.UploadEdit = Ext.create("App.UploadEdit");			
				/*
				Ext.Function.defer(function(){
					this.loadPriv();
				},10000,this);
				*/
			}
		});
	}
});
