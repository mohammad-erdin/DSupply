Ext.define("App.tool.Backup",{
	mainId:null,
	firstLoad:true,
	autoSet:true,
	title:"Backup & Restore",
	extend:"Ext.util.Observable",
	constructor : function(c){
		this.callParent([c]);
		this.initComponent();
	},
	initComponent: function(){
		var me=this;
		me.store=Ext.create('Ext.data.AyodyaStore', {
			autoLoad: true,
			fields:['filename','date'],
			proxy: {
				type: 'ajax',
				sortParam:null,
				url : 'controller/backup/getall',
				reader:{type:'json',root: 'rows',totalProperty:"total_rows"}
			},
			pageSize:20,
			listeners:{
				scope:this,
				load:function(a,b,c){
					if(b.length==0 && a.currentPage>1){
						a.currentPage=a.currentPage-1;
						a.load();
					}
				}
			}
		});
		me.Main=Ext.create("Ext.grid.Panel",{
			title:me.title,
			itemId:me.mainId,
			store:me.store,
			forceFit:true,
			columns: [
				{header: 'Nama File', dataIndex:'filename',width:300},
				{header: 'Tanggal Buat',dataIndex:'date',width:200},
				{header: '',flex:1}
			],
			dockedItems:[{
				dock:'top',
				xtype:'toolbar',
				itemId:'toptoolbar',
				items:me.createTopToolbar()
			},{
				dock:'bottom',
				xtype:'pagingtoolbar',
				store:me.store,
				itemId:'pagingtoolbar'
			}],
			listeners:{
				scope:me,
				"selectionchange":function(a,b,c){
					this.setBtn("btn-restore",a.getCount());
					this.setBtn("btn-delete",a.getCount());
				},
				"activate":function(){
					this.onRefresh(!this.firstLoad);
					this.firstLoad=false;
				}
			}
		});
	},
	createTopToolbar:function(){
		var tbar=[{
			text : "Backup",
			scope : this,
			iconCls : "icon-backup",
			handler : this.onBackup
		},{
			text : "Restore",
			scope : this,
			disabled : true,
			itemId : "btn-restore",
			iconCls : "icon-restore",
			handler : this.onRestore
		},'-',{
			text : "Hapus",
			scope : this,
			disabled : true,
			itemId : "btn-delete",
			iconCls : "icon-delete",
			handler : this.onDelete
		}];
		return tbar;
	},
	setBtn:function(n,e){
		try{
			this.Main.getDockedComponent('toptoolbar').getComponent(n).setDisabled(!e);
		}
		catch (err)
		{/*do nothing*/}
	},
	onRefresh:function(forceLoad){
		var me=this;
		if (forceLoad)me.store.loadPage(1);
		else me.Main.getDockedComponent('pagingtoolbar').doRefresh();
	},
	onBackup:function(){
		var m=this;
		Ext.Ajax.request({
			scope:m,
			method: "POST",
			url:"controller/backup/dobackup",
			success:function(a){
				a=Ext.decode(a.responseText);
				if (!a.success)Ext.Msg.alert("Error",a.msg);
				else m.onRefresh(false);
			}
		});	
	},
	doDelete : function(a){
		var m=this,
		rec = m.Main.getSelectionModel().getSelection()[0];
		if (a == "ok"){
			Ext.Ajax.request({
				scope:m,
				method: "POST",
				url : "controller/backup/delete",
				params: {filename:rec.data.filename},
				success:function(a){
					a=Ext.decode(a.responseText);
					if (!a.success)Ext.Msg.alert("Error",a.msg);
					else m.onRefresh();
				}
			});
		}else m.delAlert.close();
	},
	onDelete : function(){
		var m=this,
		rec = m.Main.getSelectionModel().getSelection()[0];
		m.delAlert=Ext.Msg.show({
			title:'Apakah anda yakin?',
			msg: 'Anda akan menghapus data '+rec.data.filename+' ?',
			buttons: Ext.Msg.OKCANCEL,
			scope : this,
			fn: this.doDelete,
			icon: Ext.window.MessageBox.QUESTION
		});
	},
	doRestore : function(a){
		var m=this,
		rec = m.Main.getSelectionModel().getSelection()[0];
		if (a == "ok"){
			m.Main.setLoading(true);
			Ext.Ajax.request({
				scope:m,
				method: "POST",
				url : "controller/backup/dorestore",
				params: {filename:rec.data.filename},
				success:function(a){
					a=Ext.decode(a.responseText);
					if (!a.success)Ext.Msg.alert("Error",a.msg);
					else m.onRefresh();
					m.Main.setLoading(false);
				}
			});
		}else m.delAlert.close();
	},
	onRestore : function(){
		var m=this,
		rec = m.Main.getSelectionModel().getSelection()[0];
		m.delAlert=Ext.Msg.show({
			title:'Apakah anda yakin?',
			msg: 'Anda akan mengembalikan data '+rec.data.filename+' ? <br> Semua data akan tertimpa dengan versi backup ini',
			buttons: Ext.Msg.OKCANCEL,
			scope : this,
			fn: this.doRestore,
			icon: Ext.window.MessageBox.QUESTION
		});
	}
});