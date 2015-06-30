Ext.define("App.Store",{
	extend : Object,
	constructor:function(){
		var m=this;
		m.Sex=Ext.create("Ext.data.ArrayStore",{
			fields:["key","value"],
			data :[
				["L", "Laki-Laki"],
				["P", "Perempuan"]
			]
		});
		m.StatusSupply=Ext.create("Ext.data.ArrayStore",{
			fields:["key","value"],
			data :[
				["In", "Masuk"],
				["Out", "Terpakai"]
			]
		});
	}
});