Ext.define("App.grid.Cabang",{
	mainId:null,
	winAddEdit:null,
	firstLoad:true,
	autoSet:true,
	title:"Cabang",
	extend:"Ext.util.Observable",
	constructor : function(c){
		this.callParent([c]);
		this.initComponent();
	},
	initComponent: function(){
		var me=this;
		me.store=Ext.create('Ext.data.AyodyaStore', {
			autoLoad: true,
			fields:['ID_Cabang','Nama','Alamat'],
			proxy: {
				type: 'ajax',
				sortParam:null,
				url : 'controller/cabang/getall',
				reader: {
					type: 'json',
					root: 'rows',
					totalProperty:"total_rows"
				}
			},
			staticParams:{Kata:""},
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
				{header: 'ID_Cabang', dataIndex:'ID_Cabang',hidden:true},
				{header: 'Nama',dataIndex:'Nama',width:200},
				{header: 'Alamat',dataIndex:'Alamat',width:300},
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
					this.setBtn("btn-edit",a.getCount());
					this.setBtn("btn-delete",a.getCount());
				},
				"itemdblclick":me.onEdit,
				"activate":function(){
					if (!this.firstLoad){
						this.onRefresh(true);
					}
					this.firstLoad=false;
				}
			}
		});
	},
	createTopToolbar:function(){
		var tbar=[{
			text : "Tambah",
			scope : this,
			iconCls : "icon-add",
			handler : this.onAdd
		},{
			text : "Ubah",
			scope : this,
			disabled : true,
			itemId : "btn-edit",
			iconCls : "icon-edit",
			handler : this.onEdit
		},{
			text : "Hapus",
			scope : this,
			disabled : true,
			itemId : "btn-delete",
			iconCls : "icon-delete",
			handler : this.onDelete
		},'->','Filter ',{
			xtype:'textfield',
			itemId:'Kata',
			emptyText:"Pencarian Multi",
			listeners:{
				scope:this,
				change:function(a){this.store.staticParams["Kata"]=a.getValue();}
			}
		},{
			text:'Cari',
			scope:this,
			iconCls:'icon-refresh',
			handler:function(){
				this.onRefresh(true);
			}
		},'-',{
			text:'Clear',
			scope:this,
			iconCls:'icon-auto-refresh',
			handler:function(){
				this.Main.getDockedComponent('toptoolbar').getComponent('Kata').setValue();
				this.onRefresh(true)
			}
		}];
		return tbar;
	},		
	crtWinAddEdit : function(){
		this.fmAddEdit = Ext.create("Ext.form.Panel", {
			border: false,
			url: "controller/cabang/save",
			layout: "fit",
			defaults: {bodyStyle: "background-color : #DFE8F6"},
			items: [{
				xtype : "tabpanel",
				defaults: {bodyStyle: "background-color : #DFE8F6"},					
				items: [{
					title: 'Data',
					padding: 5,
					border: false,
					defaults: {
						margin: 3,
						labelWidth: 120,
						labelSeparator:"",
						msgTarget : "side",
						width : 300,
						xtype : "textfield"
					},
					items : [{
						xtype:'hidden',
						name:'ID_Cabang'
					},{
						fieldLabel : "Nama Cabang",
						allowBlank : false,
						name : "Nama"
					},{
						fieldLabel : "Alamat",
						allowBlank : false,
						name : "Alamat"
					}]
				}]
			}]
		});
		this.winAddEdit = Ext.create("Ext.Window",{
			modal : true,
			border : false,
			closable : false,
			autoWidth : true,
			autoHeight : true,
			resizable : false,
			closeAction : "hide",
			items : [this.fmAddEdit],
			buttons : [{
				text : "Save",
				scope : this,
				handler : this.onSave
			},{
				text : "Cancel",
				scope : this,
				handler : this.onCancel
			}]
		});
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
		else this.Main.getDockedComponent('pagingtoolbar').doRefresh();
	},
	onEdit : function(){
		var m=this,
		rec = m.Main.getSelectionModel().getSelection()[0];
		if (m.winAddEdit===null)m.crtWinAddEdit();
		m.fmAddEdit.getForm().setValues(rec.data);
		m.fmAddEdit.mode="edit";
		m.winAddEdit.setTitle("Ubah Data Cabang");
		m.winAddEdit.show();
	},
	onAdd : function(){
		var m=this;
		if (m.winAddEdit==null)m.crtWinAddEdit();
		m.fmAddEdit.mode="add";
		m.winAddEdit.setTitle("Tambah Data Cabang");
		m.winAddEdit.show();
	},
	onSave : function(){
		var m=this;
		m.fmAddEdit.getForm().submit({
			scope : m,
			success: function(){
				m.onRefresh(!(m.fmAddEdit.mode==="edit"));
				m.fmAddEdit.getForm().reset();
				m.winAddEdit.close();
			},
			failure : function(a,b){
				if (b.failureType=="server" && b.result.errors){
					Ext.each(b.result.errors,function(c){
						this.fmAddEdit.down("tabpanel").getComponent(0)
						.getComponent(c).markInvalid("Terdapat kesalahan pengisian");
					},this);
				}
				Ext.Msg.alert("Error","Proses penyimpanan tidak dapat dilakukan.<br>Mohon periksa kembali semua Field");
			}
		});
	},
	onCancel : function(){
		this.winAddEdit.close();
		this.fmAddEdit.getForm().reset();
	},
	doDelete : function(a){
		var m=this,
		rec = m.Main.getSelectionModel().getSelection()[0];
		if (a == "ok"){
			Ext.Ajax.request({
				scope:m,
				method: "POST",
				url : "controller/cabang/delete",
				params: {ID_Cabang:rec.data.ID_Cabang},
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
			msg: 'Anda akan menghapus data '+rec.data.Nama+' ?',
			buttons: Ext.Msg.OKCANCEL,
			scope : this,
			fn: this.doDelete,
			icon: Ext.window.MessageBox.QUESTION
		});
	}
});