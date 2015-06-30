Ext.define("App.grid.Monitoring",{
	mainId:null,
	firstLoad:true,
	autoSet:true,
	title:"Monitoring",
	extend:"Ext.util.Observable",
	minimalWarning:5,
	constructor : function(c){
		this.callParent([c]);
		this.initComponent();
	},
	initComponent: function(){
		var me=this;
		me.store=Ext.create('Ext.data.AyodyaStore', {
			autoLoad: true,
			fields:['ID_Cabang','Nama_Cabang','ID_Jenis','Nama_Bahan','Satuan_Bahan','plus','min'],
			proxy: {
				type:'ajax',
				sortParam:null,
				url :'controller/monitoring/getall',
				reader:{type:'json',root:'rows',totalProperty:"total_rows"}
			},
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
		    viewConfig:{ 
		        getRowClass: function(rec) { 
		            return (rec.get("plus")-rec.get("min")) <= me.minimalWarning ?'red-grid':''; 
		        } 
		    },
			columns: [
				{header:'ID_Cabang', dataIndex:'ID_Cabang',hidden:true},
				{header:'Nama Cabang',dataIndex:'Nama_Cabang',width:200},
				{header:'ID_Jenis', dataIndex:'ID_Jenis',hidden:true},
				{header:'Nama Bahan', dataIndex:'Nama_Bahan'},
				{header:'Masuk',dataIndex:'plus',width:100, align:'right'},
				{header:'Terpakai',dataIndex:'min',width:100, align:'right'},
				{header:'Tersisa',width:100,align:'right',renderer:function(und,tdcls,rec){
					return rec.get("plus")-rec.get("min");
				}},
				{header:'',flex:1}
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
				"activate":function(){
					if (!this.firstLoad)this.onRefresh(true);
					this.firstLoad=false;
				}
			}
		});
	},
	createTopToolbar:function(){
		var me =this;
		var tbar=["Angka batas warning",{
			width:60,
			xtype:'numberfield',
			value:me.minimalWarning,
			listeners:{change:function(el,v){me.minimalWarning=v;}}
		},{
			scope:this,
			text:"Refresh",
			iconCls:'icon-refresh',
			handler:function(){me.onRefresh(true);}
		}];
		return tbar;
	},
	onRefresh:function(forceLoad){
		var me=this;
		if (forceLoad)me.store.loadPage(1);
		else this.Main.getDockedComponent('pagingtoolbar').doRefresh();
	}
});