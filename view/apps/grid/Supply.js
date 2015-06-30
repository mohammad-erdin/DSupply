Ext.define("App.grid.Supply",{
	mainId:null,
	firstLoad:true,
	autoSet:true,
	title:"Supply",
	extend:"Ext.util.Observable",
	constructor : function(c){
		this.callParent([c]);
		this.initComponent();
	},
	initComponent: function(){
		var me=this;
		me.store=Ext.create('Ext.data.AyodyaStore', {
			autoLoad: true,
			fields:['ID_Supply','Tgl_entry','Status','NIK','Nama','Nama_Cabang'],
			proxy: {
				type: 'ajax',
				sortParam:null,
				url : 'controller/supply/getall',
				reader: {
					type: 'json',
					root: 'rows',
					totalProperty:"total_rows"
				}
			},
			staticParams:{DateStart:"",DateEnd:"",Status:"",NIK:"",ID_Cabang:""},
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
		me.storeJenis=Ext.create("Ext.data.Store",{
			fields:["key","value"],
			proxy:{
				type:'ajax',
				url:'controller/bahan/getref',
				reader:{type:'json',root:'rows'}
			},
			autoLoad:true
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
		me.storeKaryawan=Ext.create("Ext.data.Store",{
			fields:["key","value"],
			proxy:{
				type:'ajax',
				url:'controller/karyawan/getref',
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
				{header: 'ID_Supply', dataIndex:'ID_Supply',hidden:true},
				{header: 'Tanggal Entry',dataIndex:'Tgl_entry',width:200},
				{header: 'Status',dataIndex:'Status',width:100,renderer:function(v){
					return App.Utils.comboRender(v,App.Store.StatusSupply,"key","value");
				}},
				{header: 'Karyawan Entry',dataIndex:'Nama',width:200},
				{header: 'Cabang',dataIndex:'Nama_Cabang',width:300},
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
					this.setBtn("btn-detail",a.getCount());
					this.setBtn("btn-edit",a.getCount());
					this.setBtn("btn-delete",a.getCount());
				},
				//"itemdblclick":me.onEdit,
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
			text:"Supply In/Out",
			scope:this,
			itemId:"btn-in",
			iconCls:"icon-sr",
			handler:this.onSupply
		},{
			text:"Detail",
			scope:this,
			disabled:true,
			itemId:"btn-detail",
			iconCls:"icon-sr",
			handler:this.onDetail
		},'-',{
			text : "Hapus",
			scope : this,
			disabled : true,
			itemId : "btn-delete",
			iconCls : "icon-delete",
			handler : this.onDelete
		},'->',{
			text :"Pencarian",
			scope :this,
			itemId:'cari',
			iconCls:'icon-refresh',
			handler:this.onCari
		},{
			text:'Clear',
			scope:this,
			iconCls:'icon-auto-refresh',
			handler:function(){
				this.store.staticParams={};
				this.onRefresh(true)
			}
		}];
		return tbar;
	},		
	crtWinAddEdit : function(){
		var me=this;
		me.cellPlugin=Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		me.gridDetail=Ext.create("Ext.grid.Panel",{
			height:200,
			store:Ext.create('Ext.data.Store', {
				fields:['ID_Jenis','Jumlah']
			}),
			columns: [
				{
					header: 'Nama Bahan',dataIndex:'ID_Jenis',flex:1,
					renderer:function(v){return App.Utils.comboRender(v,me.storeJenis,"key","value");},
					editor:{
						xtype:"combo",
						displayField:"value",
						valueField:"key",
						store:me.storeJenis,
						listeners:{
							focus:function(a){a.expand();}
						}
					}
				},
				{header: 'Jumlah',dataIndex:'Jumlah',editor:{
					xtype:"numberfield",
					minValue: 0
				}}
			],
			selType: 'rowmodel',
			plugins: [me.cellPlugin],
			dockedItems:[{
				dock:'top',
				xtype:'toolbar',
				itemId:'toptoolbar',
				items:[{
					text:"Tambah Bahan",
					scope:me,
					iconCls:"icon-add",
					handler:function(){
						me.gridDetail.store.add({ID_Jenis:"",Jumlah:0});
					}
				},{
					text:"Hapus Bahan",
					scope:me,
					iconCls:"icon-delete",
					handler:function(){
						var s=me.gridDetail.getSelectionModel().getSelection();
						if(s.length)me.gridDetail.store.remove(s[0],false);
					}
				}]
			}]
		});
		me.fmAddEdit = Ext.create("Ext.form.Panel", {
			url: "controller/supply/save",
			layout: "fit",
			bodyStyle: "background-color : #DFE8F6",
			autoHeight:true,
			defaults: {
				margin: 3,
				labelWidth: 120,
				labelSeparator:"",
				msgTarget : "side",
				width : 300,
				xtype : "textfield"
			},
			items : [{
				xtype:"combo",
				fieldLabel:"Cabang",
				name:"ID_Cabang",
				queryMode:"local",
				forceSelection:true,
				emptyText: "-Pilih Cabang-",
				displayField:'value',
				allowBlank:false,
				valueField:'key',
				listeners : {focus:function(a){a.expand();}},
				store:me.storeCabang
			},{
				xtype:"combo",
				itemId:'fm_status',
				fieldLabel:"Status",
				name:"Status",
				allowBlank:false,
				store:App.Store.StatusSupply,
				queryMode:"local",
				forceSelection:true,
				displayField:'value',
				valueField:'key',
				listeners : {focus:function(a){a.expand();}}
			},me.gridDetail]
		});
		me.winAddEdit = Ext.create("Ext.Window",{
			modal : true,
			border : false,
			closable : false,
			autoWidth : true,
			autoHeight : true,
			resizable : false,
			closeAction : "hide",
			title:"Supply",
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
	onSupply:function(){
		var me=this;
		if(!me.winAddEdit)me.crtWinAddEdit();
		me.winAddEdit.show();
	},
	onDetail:function(){
		var me=this;
		me.gridDetail2=Ext.create("Ext.grid.Panel",{
			height:200,
			width:300,
			store:Ext.create('Ext.data.Store', {
				fields:['ID_Jenis','Jumlah'],
				proxy: {
					type: 'ajax',
					sortParam:null,
					url : 'controller/supply/getdetail',
					reader: {
						type: 'json',
						root: 'rows',
						totalProperty:"total_rows"
					}
				}
			}),
			columns: [
				{
					header: 'Nama Bahan',dataIndex:'ID_Jenis',flex:1,
					renderer:function(v){return App.Utils.comboRender(v,me.storeJenis,"key","value");}
				},
				{header: 'Jumlah',dataIndex:'Jumlah'}
			]
		});
		me.winDetail = Ext.create("Ext.Window",{
			modal : true,
			border : false,
			closable : false,
			autoWidth : true,
			autoHeight : true,
			resizable : false,
			closeAction : "hide",
			title:"Supply Detail",
			items : [me.gridDetail2],
			buttons : [{
				text : "Tutup",
				scope : me,
				handler : function(){
					me.winDetail.close();
				}
			}]
		});
		me.winDetail.show();
	
		var rec = me.Main.getSelectionModel().getSelection()[0];
		me.gridDetail2.store.load({params:{ID_Supply:rec.data.ID_Supply}});
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
	onSave : function(){
		var m=this,
			data=[];
		m.gridDetail.store.each(function(r){
			if(r.data.ID_Jenis!="")data.push(r.data);
		});
		m.fmAddEdit.getForm().submit({
			scope : m,
			params:{detail:Ext.encode(data)},
			success: function(){
				m.onRefresh(true);
				m.fmAddEdit.getForm().reset();
				m.gridDetail.store.removeAll();
				m.winAddEdit.close();
			},
			failure : function(a,b){
			}
		});
	},
	onCancel : function(){
		this.winAddEdit.close();
		this.fmAddEdit.getForm().reset();
		this.gridDetail.store.removeAll();
	},
	doDelete : function(a){
		var m=this,
		rec = m.Main.getSelectionModel().getSelection()[0];
		if (a == "ok"){
			Ext.Ajax.request({
				scope:m,
				method: "POST",
				url : "controller/supply/delete",
				params: {ID_Supply:rec.data.ID_Supply},
				success:function(a){
					a=Ext.decode(a.responseText);
					if (!a.success)Ext.Msg.alert("Error",a.msg);
					else m.onRefresh();
				}
			});
		}else m.delAlert.close();
	},
	onDelete : function(){
		var msg,m=this,
		rec = m.Main.getSelectionModel().getSelection()[0];
		msg = "<b>"+rec.data.Tgl_entry+"</b> oleh "+rec.data.Nama;
		m.delAlert=Ext.Msg.show({
			title:'Apakah anda yakin?',
			msg: 'Anda akan menghapus data '+msg+' ?',
			buttons: Ext.Msg.OKCANCEL,
			scope : this,
			fn: this.doDelete,
			icon: Ext.window.MessageBox.QUESTION
		});
	},
	onCari : function(){
		var me=this;
		if (!me.winCari) {
			me.winCari = Ext.create("Ext.Window",{
				modal : true,
				title : "Pencarian",
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
							width : 300,
							labelWidth: 120,
							labelSeparator:"",
							msgTarget : "side",
						},
						layout: "fit",
						items:[{
					        xtype: 'datefield',
					        anchor: '100%',
					        fieldLabel: 'Mulai Tanggal',
					        name: 'DateStart',
					        format:'Y-m-d',
					        value: new Date(),
					        maxValue: new Date()
					    }, {
					        xtype: 'datefield',
					        anchor: '100%',
					        format:'Y-m-d',
					        fieldLabel: 'Sampai Tanggal',
					        name: 'DateEnd',
					        value: new Date()
					    },{
							xtype: 'radiogroup',
							fieldLabel: 'Status',
							name: 'Status',
							columns:1,
							value:"-",
							items:[
								{boxLabel: 'Masuk', name: 'Status', inputValue: "In"},
								{boxLabel: 'Terpakai', name: 'Status', inputValue: "Out"},
								{boxLabel: 'Semua', name: 'Status', inputValue: "-"}
							]
						},{
							xtype:"combo",
							fieldLabel:"NIK",
							queryMode:"local",
							forceSelection:true,
							emptyText: "-Pilih Karyawan-",
							displayField:'value',
							valueField:'key',
							name:"NIK",
							listeners : {focus:function(a){a.expand();}},
							store:me.storeKaryawan
						},{
							xtype:"combo",
							fieldLabel:"Cabang",
							queryMode:"local",
							name:"ID_Cabang",
							forceSelection:true,
							emptyText: "-Pilih Cabang-",
							displayField:'value',
							valueField:'key',
							listeners : {focus:function(a){a.expand();}},
							store:me.storeCabang
						}]
					})
				],
				buttons : [{
					text : "Cari",
					scope : me,
					handler:function(){
						me.winCari.hide();
						me.store.staticParams = me.winCari.getComponent(0).getValues();
						me.onRefresh(true);
					}
				},{
					text : "Batal",
					scope : me,
					handler : function(){
						me.winCari.hide();
					}
				}]
			});
		};
		me.winCari.show();
	}
});