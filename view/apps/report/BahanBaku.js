Ext.define("App.report.BahanBaku",{
	mainId:null,
	autoSet:true,
	title:"Laporan Bahan Baku Terpakai",
	extend:"Ext.util.Observable",
	src:"controller/report/bahan-baku",
	params:{
		//ID_Cabang:"",
		DateStart:null,
		DateEnd:null,
	},
	iframeName:'iframe-win-bahan',
	constructor:function(c){
		this.callParent([c]);
		this.initComponent();
	},
	initComponent: function(){
		var me=this;
		me.Main=Ext.create('Ext.panel.Panel', {
			itemId:me.mainId,
		    title: 'Bahan Baku',
		    layout:'fit',
		    dockedItems: [{
		        dock:'top',
		        xtype: 'toolbar',
		        items:me.createTopToolbar()
		    }],
		    items:[{
		        xtype:"component",
		        style:{border:'0'},
				id:me.iframeName,
		        autoEl:{tag:"iframe"}
		    }],
		    listeners:{
		    	activate:function(){
		    		//me.onRefresh();
		    		me.onFilter();
		    	}
		    }
		});
	},
	createTopToolbar:function(){
		var me=this;
		var tbar=[{
			scope:me,
			text:"Excel",
			iconCls:'icon-excel',
			handler:function(){me.onRefresh(true);}
		},{
			scope:me,
			text:"Print",
			iconCls:'icon-print',
			handler:function(){
				Ext.getDom(me.iframeName).focus();
				Ext.getDom(me.iframeName).contentWindow.printPage();
			}
		},{
			scope:me,
			text:"Refresh",
			iconCls:"icon-refresh",
			handler:function(){
				me.onRefresh(false);
			}
		},{
			scope:me,
			text:"Filter",
			iconCls:"icon-monitor",
			handler:me.onFilter
		}];
		return tbar;
	},
	onRefresh:function(excel){
		var me=this;
		var src=me.src+"?"+Ext.Object.toQueryString(me.params) +"&_dc="+Math.random();
		if(excel==true)src+="&excell=1";
		Ext.getDom(me.iframeName).src=src;
	},
	onFilter:function(){
		var me=this;
		if(!me.winFilter){	
			me.fmFilter = Ext.create("Ext.form.Panel", {
				border: false,
				layout: "fit",
				bodyStyle: "background-color : #DFE8F6",
				defaults: {
					margin: 3,
					labelWidth: 120,
					labelSeparator:"",
					msgTarget : "side",
					width : 300,
				},
				items: [{
			        anchor: '100%',
			        xtype: 'datefield',
					name:"DateStart",
					fieldLabel : "Tanggal Mulai",
			        maxValue: new Date(),
			        value: new Date(),
			        format:"Y-m-d"
				},{
			        anchor: '100%',
			        xtype: 'datefield',
					name:"DateEnd",
					fieldLabel : "Tanggal selesai",
			        maxValue: new Date(),
			        value: new Date(),
			        format:"Y-m-d"
				}]
			});
			me.winFilter = Ext.create("Ext.Window",{
				modal : true,
				closable : false,
				autoWidth : true,
				autoHeight : true,
				resizable : false,
				closeAction : "hide",
				title:"Filter",
				items : [me.fmFilter],
				buttons : [{
					text : "Filter",
					scope : me,
					handler : function(){
						me.winFilter.hide();
						me.params = Ext.apply(me.params,me.fmFilter.getForm().getValues());
						me.onRefresh(false);
					}
				},{
					text : "Cancel",
					scope : me,
					handler : function(){
						me.winFilter.close();
					}
				}]
			});
		}
		me.winFilter.show();
	}
});