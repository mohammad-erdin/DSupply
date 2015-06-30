Ext.define("App.Main",{
	extend:"Ext.util.Observable",
	constructor:function(){
		this.callParent();
		this.init();
	},
	init:function(){
		App.Store=Ext.create("App.Store");
		Ext.tip.QuickTipManager.init();
		Ext.Function.defer(function(){
			this.createViewport();
		},1000,this);
	},
	home:function(){
		App.Main.contentPanel.getLayout().setActiveItem("home");
	},
	setContent:function(appName){
		var me=this;
		me.viewport.setLoading(true,true);
		if(!Ext.ClassManager.isCreated(appName)){
			ap = Ext.create(appName,{
				mainId:appName
			});
			if (!Ext.isEmpty(ap.Main) && ap.autoSet)
				me.contentPanel.add(ap.Main);
		}
		try{
			me.contentPanel.getLayout().setActiveItem(appName);
		}catch(r){App.Utils.handleError();}
		me.viewport.setLoading(false);
	},
	showWindow:function(appName){
		var app,
			me=this;
		app=appName.split(".");
		if (Ext.isEmpty(App.window))App.window={};
		if(!Ext.ClassManager.isCreated(appName)){
			App.window[app[2]] = Ext.create(appName,{
				mainContent:me.contentPanel
			});
		}
		App.window[app[2]].show();
	},
	createViewport:function(){
		this.contentMenu = Ext.create("Ext.Panel",{
			id:'content-Menu',
			region:'west',
			width:220,
			split:true,
			layout:"anchor",
			bodyStyle:{
				background:'#DFE8F6',
				padding:'5px'
			},
			defaults:{
				anchor:'-1px',
				xtype:"contentmenu",
				style:"margin-bottom:5px",
				frame:true,
				width:true,
				collapsed:true,
				autoWidth:false,
				autoHeight:true,
				collapsible:true,
				titleCollapse:true
			},
			items:[{
				title:"Actions",
				collapsed:false,
				items:[{
					id:"action-home",
					iconCls:"icon-monitor",
					text:"Home",
					handler:function(){
						App.Main.home();
					}
				},{
					text:"Monitoring",
					id:"action-monitor",
					iconCls:"icon-monitor",
					handler:function(){
						App.Main.setContent("App.grid.Monitoring");
					}
				},{
					id:"action-suply",
					iconCls:"icon-monitor",
					text:"Supply",
					handler:function(){
						App.Main.setContent("App.grid.Supply");
					}
				}]
			},{
				title:"Data Master",
				collapsed:false,
				items:[{
					id:"action-cabang",
					iconCls:"icon-monitor",
					text:"Cabang",
					handler:function(){
						App.Main.setContent("App.grid.Cabang");
					}
				},{
					id:"action-bahan",
					iconCls:"icon-monitor",
					text:"Bahan Baku",
					handler:function(){
						App.Main.setContent("App.grid.BahanBaku");
					}
				},{
					id:"action-karyawan",
					iconCls:"icon-monitor",
					text:"Karyawan",
					handler:function(){
						App.Main.setContent("App.grid.Karyawan");
					}
				}]
			},{
				title:"Absensi",
				collapsed:false,
				items:[{
					id:"action-cari",
					iconCls:"icon-monitor",
					text:"Cari Karyawan",
					handler:function(){
						//App.Main.setContent("App.grid.Cabang");
					}
				},{
					id:"action-absen",
					iconCls:"icon-monitor",
					text:"Absensi Karyawan",
					handler:function(){
						App.Main.setContent("App.grid.Absensi");
					}
				}]
			},{
				title:"Report",
				collapsed:false,
				items:[{
					id:"action-report-monitor",
					iconCls:"icon-monitor",
					text:"Monitoring",
					handler:function(){
						App.Main.setContent("App.report.Monitoring");
					}
				},{
					id:"action-report-bahan",
					iconCls:"icon-monitor",
					text:"Bahan Baku",
					handler:function(){
						App.Main.setContent("App.report.BahanBaku");
					}
				}]
			},{
				title:"Tools",
				collapsed:false,
				autoHeight:true,
				collapsible:false,
				items:[{
					id:"action-backup",
					iconCls:"icon-monitor",
					text:"Backup & Restore",
					handler:function(){
						App.Main.setContent("App.tool.Backup");
					}					
				},{
					id:"action-logout",
					iconCls:"icon-logout",
					text:"Logout",
					handler:function(){
						App.Login.logout();
					}
				}]
			}]
		});

		this.contentPanel = new Ext.Panel( {
			id:'content-panel',
			region:'center',
			layout:'card',
			activeItem:0,
			split:true,
			border:false,
			frame:false,
			items:[{
				title:"Beranda",
				autoScroll:true,
				itemId:"home",
				loader:{
					url:'controller/home/show',
					autoLoad:true
				}
			}]
		});

		this.viewport = Ext.create('Ext.container.Viewport', {
			layout:'border',
			items:[{
				region:'north',
				height:60,
				border:false,
				padding:8,
				bodyStyle:"background-color:#DFE8F6",
				contentEl:"header"
			},this.contentMenu,this.contentPanel]
		});
		App.Utils.removeLoading();
	}
});
