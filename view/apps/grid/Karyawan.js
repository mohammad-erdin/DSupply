Ext.define("App.grid.Karyawan",{
	mainId:null,
	winAddEdit:null,
	firstLoad:true,
	autoSet:true,
	title:"Karyawan",
	extend:"Ext.util.Observable",
	constructor : function(c){
		this.callParent([c]);
		this.initComponent();
	},
	initComponent: function(){
		var me=this;
		me.store=Ext.create('Ext.data.AyodyaStore', {
			autoLoad: true,
			fields:['NIK','Nama','Jenkel','Alamat','Telp','UserLogin','ID_Cabang','Nama_Cabang','Pimpinan'],
			proxy: {
				type: 'ajax',
				sortParam:null,
				url : 'controller/karyawan/getall',
				reader: {
					type: 'json',
					root: 'rows',
					totalProperty:"total_rows"
				}
			},
			staticParams:{ID_Cabang:"",NIK:"",Nama:"",Jenkel:"",Alamat:"",Telp:"",Pimpinan:""},
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

		me.storeCabang=Ext.create("Ext.data.Store",{
			fields:["key","value"],
			proxy:{
				type:'ajax',
				url:'controller/cabang/getref',
				reader:{type:'json',root:'rows'}
			},
			autoLoad:true
		});

		me.Main=Ext.create("Ext.grid.Panel",{
			title:me.title,
			itemId:me.mainId,
			store:me.store,
			forceFit:true,
			columns: [
				{header: 'NIK', dataIndex:'NIK'},
				{header: 'Nama',dataIndex:'Nama',width:200},
				{header: 'Jenkel',dataIndex:'Jenkel',width:100,renderer:function(v){
					return App.Utils.comboRender(v,App.Store.Sex,"key","value");
				}},
				{header: 'Alamat',dataIndex:'Alamat',width:200},
				{header: 'Telpon',dataIndex:'Telp',width:150},
				{header: 'Cabang',dataIndex:'Nama_Cabang',width:200},
				{header: 'Pimpinan',dataIndex:'Pimpinan',width:200,renderer:function(v){
					return v=="P"?"Pimpinan":"Karyawan";
				}},
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
						me.storeCabang.load();	
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
			emptyText:"Pencarian Multi",
			listeners:{
				scope:this,
				change:function(a){
					this.store.staticParams["NIK"]=a.getValue();
					this.store.staticParams["Nama"]=a.getValue();
					this.store.staticParams["Alamat"]=a.getValue();
					this.store.staticParams["Telp"]=a.getValue();
				}
			}
		},{
			xtype:"combo",
			itemId:'ID_Cabang',
			forceSelection:true,
			emptyText: "-Filter Cabang-",
			displayField:'value',
			valueField:'key',
			listeners : {
				scope:this,
				focus:function(a){a.expand();},
				change:function(a){this.store.staticParams["ID_Cabang"]=a.getValue();}
			},
			store:this.storeCabang	
		},{
			text:'Cari',
			scope:this,
			iconCls:'icon-refresh',
			handler:function(){
				this.onRefresh(true);
			}
		},'-',{
			text :"Pencarian Lanjut",
			scope :this,
			itemId:'cari',
			iconCls:'icon-refresh',
			handler:this.onCari
		},'-',{
			text:'Clear',
			scope:this,
			iconCls:'icon-auto-refresh',
			handler:function(){
				this.store.staticParams = {ID_Cabang:"",NIK:"",Nama:"",Jenkel:"",Alamat:"",Telp:"",Pimpinan:""};
				this.onRefresh(true)
			}
		}];
		return tbar;
	},
	crtWinAddEdit : function(){
		var me=this;
		me.fmAddEdit = Ext.create("Ext.form.Panel", {
			border: false,
			url: "controller/karyawan/save",
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
						name:'Act'
					},{
						fieldLabel : "NIK",
						allowBlank : false,
						name : "NIK",
						itemId:'NIK',
						maxLength:6
					},{
						fieldLabel : "Nama Lengkap",
						allowBlank : false,
						name : "Nama"
					},{
						xtype: 'radiogroup',
						fieldLabel: 'Jenis Kelamin',
						allowBlank:false,
						name:'Jenkel',
						columns:1,
						items: [
							{boxLabel: 'Laki-laki', name: 'Jenkel', inputValue: "L"},
							{boxLabel: 'Perempuan', name: 'Jenkel', inputValue: "P"}
						]
					},{
						fieldLabel : "Alamat",
						allowBlank : false,
						name : "Alamat"
					},{
						fieldLabel : "Telepon",
						allowBlank : false,
						name : "Telp"
					},{
						xtype:"combo",
						fieldLabel:"Cabang",
						name:"ID_Cabang",
						queryMode:"local",
						forceSelection:true,
						emptyText: "-Pilih Cabang-",
						displayField:'value',
						valueField:'key',
						listeners : {focus:function(a){a.expand();}},
						store:me.storeCabang
					},{
						xtype: 'radiogroup',
						fieldLabel: 'Pimpinan',
						allowBlank:false,
						name:'Pimpinan',
						columns:1,
						items: [
							{boxLabel: 'Pimpinan', name: 'Pimpinan', inputValue: "P"},
							{boxLabel: 'Karyawan', name: 'Pimpinan', inputValue: "K"}
						]
					}]
				},{
					title:'Login',
					padding:5,
					border:false,
					defaults:{
						margin: 3,
						labelWidth: 120,
						labelSeparator:"",
						msgTarget : "side",
						width : 300,
						xtype : "textfield"
					},
					items:[{
						xtype: 'radiogroup',
						fieldLabel: 'Ijinkan Login ?',
						allowBlank:false,
						name:'UserLogin',
						columns:1,
						items: [
							{boxLabel: 'Ya', name: 'UserLogin', inputValue: "1"},
							{boxLabel: 'Tidak', name: 'UserLogin', inputValue: "0"}
						]
					},{
						name: 'Password',
						fieldLabel:"Password",
						inputType :"password"
					},{
						data:{},
						xtype : "component",
						tpl : '<div style="text-align:right;font-size:8pt"><i>Kosongkan utk password lama</i></div>',
					}]
				}]
			}]
		});
		me.winAddEdit = Ext.create("Ext.Window",{
			modal : true,
			border : false,
			closable : false,
			autoWidth : true,
			autoHeight : true,
			resizable : false,
			closeAction : "hide",
			items : [me.fmAddEdit],
			buttons : [{
				text : "Save",
				scope : me,
				handler : me.onSave
			},{
				text : "Cancel",
				scope : me,
				handler : me.onCancel
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
		m.fmAddEdit.getForm().setValues({Act:'edit'});
		m.fmAddEdit.mode="edit";
		m.fmAddEdit.down("tabpanel").getComponent(0)
			.getComponent("NIK").setDisabled(true);
		m.winAddEdit.setTitle("Ubah Data Karyawan");
		m.winAddEdit.show();
	},
	onAdd : function(){
		var m=this;
		if (m.winAddEdit==null)m.crtWinAddEdit();
		m.fmAddEdit.getForm().setValues({Act:'new'});
		m.fmAddEdit.mode="add";
		m.fmAddEdit.down("tabpanel").getComponent(0)
			.getComponent("NIK").setDisabled(false);
		m.winAddEdit.setTitle("Tambah Data Karyawan");
		m.winAddEdit.show();
	},
	onSave : function(){
		var m=this;
		m.fmAddEdit.getForm().submit({
			scope : m,
			params:(m.fmAddEdit.mode==="edit")
				?{NIK:m.fmAddEdit.down("tabpanel").getComponent(0).getComponent("NIK").getValue()}:{},
			success: function(a,b){
				if(b.result.msg)Ext.Msg.alert("Info",b.result.msg);
				m.onRefresh(!(m.fmAddEdit.mode==="edit"));
				m.fmAddEdit.getForm().reset();
				m.winAddEdit.close();
			},
			failure : function(a,b){
				Ext.Msg.alert("Error",b.result.msg);
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
				url : "controller/karyawan/delete",
				params: {NIK:rec.data.NIK},
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
	},
	onCari:function(){
		var me=this;
		if(!me.winCari){
			me.winCari = Ext.create("Ext.Window",{
				modal : true,
				title:"Pencarian",
				closable : false,
				autoWidth : true,
				autoHeight : true,
				resizable : false,
				closeAction : "hide",
				defaults: {bodyStyle: "background-color : #DFE8F6"},
				items : [
					Ext.create("Ext.form.Panel", {
						border: false,
						defaults: {
							margin: 3,
							labelWidth: 120,
							labelSeparator:"",
							msgTarget : "side",
							width : 300,
							xtype : "textfield",
							emptyText:"Masukan Pencarian"
						},
						layout: "fit",
						items:[{
							fieldLabel : "NIK",
							maxLength:6,
							listeners:{
								scope:me,
								change:function(a){me.store.staticParams["NIK"]=a.getValue();}
							}
						},{
							fieldLabel : "Nama Lengkap",
							listeners:{
								scope:me,
								change:function(a){me.store.staticParams["Nama"]=a.getValue();}
							}
						},{
							xtype: 'radiogroup',
							fieldLabel: 'Jenis Kelamin',
							columns:1,
							value:"-",
							items: [
								{boxLabel: 'Laki-laki', name: 'Jenkel', inputValue: "L"},
								{boxLabel: 'Perempuan', name: 'Jenkel', inputValue: "P"},
								{boxLabel: 'Semua', 	name: 'Jenkel', inputValue: "-"}
							],
							listeners:{
								scope:me,
								change:function(a,b,c){
									if(Ext.typeOf(b["Jenkel"])=="string")
										Ext.apply(me.store.staticParams,a.getValue());
								}
							}
						},{
							fieldLabel : "Alamat",
							listeners:{
								scope:me,
								change:function(a){me.store.staticParams["Alamat"]=a.getValue();}
							}
						},{
							fieldLabel : "Telepon",
							listeners:{
								scope:me,
								change:function(a){me.store.staticParams["Telp"]=a.getValue();}
							}						
						},{
							xtype:"combo",
							fieldLabel:"Cabang",
							queryMode:"local",
							forceSelection:true,
							emptyText: "-Pilih Cabang-",
							displayField:'value',
							valueField:'key',
							listeners : {
								scope:me,
								focus:function(a){a.expand();},
								change:function(a){me.store.staticParams["ID_Cabang"]=a.getValue();}
							},
							store:me.storeCabang
						},{
							xtype: 'radiogroup',
							fieldLabel: 'Pimpinan',
							value:"-",
							columns:1,
							items: [
								{boxLabel: 'Pimpinan', name: 'Pimpinan', inputValue: "P"},
								{boxLabel: 'Karyawan', name: 'Pimpinan', inputValue: "K"},
								{boxLabel: 'Semua',name: 'Pimpinan', inputValue: "-"}
							],
							listeners:{
								scope:me,
								change:function(a,b,c){
									if(Ext.typeOf(b["Pimpinan"])=="string")
										Ext.apply(me.store.staticParams,a.getValue());
								}
							}
						}]
					})
				],
				buttons : [{
					text : "Cari",
					scope : me,
					handler:function(){
						me.winCari.hide();
						me.onRefresh(true);
					}
				},{
					text : "Tutup",
					scope : me,
					handler : function(){
						me.winCari.close();
					}
				}]
			});
		}
		me.winCari.show();
	}
});