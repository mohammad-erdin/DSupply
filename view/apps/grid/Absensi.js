Ext.define("App.grid.Absensi",{
	mainId:null,
	winAddEdit:null,
	firstLoad:true,
	autoSet:true,
	title:"Absensi",
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
	}
});