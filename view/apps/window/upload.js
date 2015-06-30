Ext.define("App.window.upload",{
	extend:"Ext.util.Observable",
	mainContent:null,
	currentDbf:null,
	timestamp:0,
	tplInfo:new Ext.XTemplate(
		'<tpl for=".">',
			'<p>{#} - {.}</p>',
		'</tpl>'
	),
	constructor : function(c){
		this.callParent([c]);
		this.initComponent();
	},
	initComponent: function(){
		var me=this,
			filterType="";
		
		if(App.Priv.type<=1)filterType='*.dbf;*.DBF;';
		else filterType='BIO*.dbf;BIO*.DBF;';

		me.createPanelValidasi();
		me.uploaderSWF=Ext.create("Ext.panel.SWFUploadPanel",{
			flashUrl:"js/static/swfupload.swf",
			uploadUrl:"controller/upload/doupload",
			fileQueueLimit:100,
			fileSizeLimit: 300,
			fileTypes: filterType,
			fileTypesDesc : "DBF",
			btnConfig : {
				addText:"Tambah",
				addIconCls:"icon-add",
				removeText:"Hapus",
				removeIconCls:"icon-delete",
				uploadText:"Upload",
				uploadIconCls:"icon-upload-start",
				cancelText:"Batal Upload",
				cancelIconCls:"icon-upload-stop",
			},

			//string config
			strings: {
				textReady: 'Ready to upload',
				textRemove: 'Apakah anda yakin ?',
				textRemoveSure: 'Anda akan membatalkan proses upload file terpilih?',
				textError: 'Error',
				textUploading: 'Sedang mengpload file: {0} ({1} dari {2})',
				headerFilename: 'Nama File',
				headerSize: 'Ukuran',
				headerStatus: 'Status',
				errorQueueExceeded: 'File yang terpilih melampui batas maksimal antrian.<br>Maksimal antrian {0} file.',
				errorSizeExceeded: 'Ukuran file yang terpilih melampui batas maksimal ukuran.<br>Maksimal ukuran file {0}.',
				errorZeroByteFile: 'Ukuran file yang terpilih 0 byte.',
				errorInvalidFiletype: 'Format file terpilih salah.'
			},

			//panel config (inherit from gridpanel)
			width:450,
			height:200,
			listeners:{scope:me,
				allUploadsComplete:me.onCompleteBackground
			}
		});
		me.winUpload = Ext.create("Ext.Window",{
			autoWidth : true,
			autoHeight : true,
			//closable : false,
			resizable : false,
			layout:"fit",
			border : false,
			closeAction : "hide",
			title:"uploader",
			modal : true,
			items : [me.uploaderSWF]
		});
	},
	createProgress:function(){
		var me=this;
		me.pgr=Ext.create('Ext.ProgressBar', {
			animate:true,
			width : 200
		});
		me.progress=Ext.create("Ext.Window",{
			autoWidth : true,
			autoHeight : true,
			closable : false,
			resizable : false,
			layout:"fit",
			border : false,
			closeAction : "hide",
			title:"Sedang memvalidasi..",
			modal : true,
			items : [me.pgr]
		});
	},
	createPanelValidasi:function(){
		var me=this,te={xtype:"textfield",allowBlank:true};
		me.gridSekSalah=Ext.create("Ext.grid.Panel",{
			title:"Data Sekolah Belum Valid",
			forceFit:true,
			border:false,
			autoWidth:true,
			autoScroll:true,
			layout:"fit",
			height:(me.mainContent.getHeight()/2),
			store:Ext.create("Ext.data.Store",{
				fields:["namafile"],
				proxy: {
					type: 'ajax',sortParam:null,
					url : 'controller/upload/getseksalah',
					reader: {type: 'json',root: 'data'}
				},
				sorters: [{
					property : 'namafile',
					direction: 'ASC'
				}],
				listeners:{
					scope:me,
					load:function(a,b,c){
						if (c && b.length==0){
							var msg=(me.gridSekBenar.store.getCount())
							?"Data valid telah di simpan di server"
							:"Data TIDAK valid tidak di simpan di server.<br>Harap segera perbaiki offline";
							Ext.Msg.alert("Info",msg,function(){
								App.Main.contentMenu.setLoading(false);
								if (App.Priv.type<=1)App.Main.home();
								else App.Main.homeprop();
								App.window.upload.cleanUp();
								me.clearAll();
							});
						}
					}
				}
			}),
			columns: [{flex:1, header: 'Nama File', dataIndex:'namafile'}],
			bbar:[{
				text:"Hapus Semua",
				iconCls:"icon-delete",
				scope:me,
				handler:function(){					
					var m=this;
					Ext.Msg.show({
						title:_text("areYouSure"),
						msg: "Anda akan menggagalkan validasi semua sekolah yang tidak valid.<br>Tekan OK untuk melanjutkan",
						buttons: Ext.Msg.OKCANCEL,
						scope : this,
						fn: function(a){
							if(a=="ok")this.onDeleteAll();
						},
						icon: Ext.window.MessageBox.QUESTION
					});
				}
			}],
			listeners:{
				scope:me,
				selectionchange:me.onItemSelChange
			}
		});
		me.gridSekBenar=Ext.create("Ext.grid.Panel",{
			title:"Data Sekolah Yang Valid <br>(masuk database)",
			forceFit:true,
			border:false,
			autoWidth:true,
			autoScroll:true,
			style:"border-top: solid 1px #99BCE8",
			layout:"fit",
			height:(me.mainContent.getHeight()/2)-28,
			store:Ext.create("Ext.data.Store",{
				fields:["namafile"],
				proxy: {
					type: 'ajax',
					sortParam:null,
					url : 'controller/upload/getsekbenar',
					reader: {type: 'json',root: 'data'}
				},
				sorters: [{
					property : 'namafile',
					direction: 'ASC'
				}]
			}),
			columns: [{flex:1, header: 'Nama File', dataIndex:'namafile'}],
			dockedItems:[{xtype:"toolbar",dock:"bottom",items:["&nbsp;"]}]
		});
		Ext.define('model-siswa-validasi',{
			extend: 'Ext.data.Model',
			fields:[
			  {name: 'recno', mapping: 'recno'},
			  {name: 'KD_PROP', mapping: 'KD_PROP'},
			  {name: 'KD_RAYON', mapping: 'KD_RAYON'},
			  {name: 'KD_SEK', mapping: 'KD_SEK'},
			  {name: 'PARALEL', mapping: 'PARALEL'},
			  {name: 'ABSEN', mapping: 'ABSEN'},
			  {name: 'NISN', mapping: 'NISN'},
			  {name: 'NOPES', mapping: 'NOPES'},
			  {name: 'NO_INDUK', mapping: 'NO_INDUK'},
			  {name: 'NM_PES', mapping: 'NM_PES'},
			  {name: 'NM_PES_USUL', mapping: 'NM_PES_USUL'},
			  {name: 'TMP_LHR', mapping: 'TMP_LHR'},
			  {name: 'TGL_LHR', mapping: 'TGL_LHR'},
			  {name: 'TGL_LONG', mapping: 'TGL_LONG'},
			  {name: 'SEX', mapping: 'SEX'},
			  {name: 'NM_ORTU', mapping: 'NM_ORTU'},
			  {name: 'ALAMAT_1', mapping: 'ALAMAT_1'},
			  {name: 'ALAMAT_2', mapping: 'ALAMAT_2'},
			  {name: 'KD_POS', mapping: 'KD_POS'},
			  {name: 'KET', mapping: 'KET'  },
			  {name: 'KD_PES', mapping: 'KD_PES'},
			  {name: 'KD_PESLAMA', mapping: 'KD_PESLAMA'},
			  {name: 'KURIKULUM', mapping: 'KURIKULUM'},
			  {name: 'KD_AGAMA', mapping: 'KD_AGAMA'},
			  {name: 'KD_KERJA1', mapping: 'KD_KERJA1'},
			  {name: 'KD_KERJA2', mapping: 'KD_KERJA2'},
			  {name: 'KD_HOBI', mapping: 'KD_HOBI'},
			  {name: 'KD_CITA', mapping: 'KD_CITA'},
			  {name: 'KD_DIDIK1', mapping: 'KD_DIDIK1'},
			  {name: 'KD_DIDIK2', mapping: 'KD_DIDIK2'},
			  {name: 'KD_GAJI', mapping: 'KD_GAJI'},
			  {name: 'KD_GAB', mapping: 'KD_GAB'},
			  {name: 'KD_JARAK', mapping: 'KD_JARAK'},
			  {name: 'KD_TRANS', mapping: 'KD_TRANS'},
			  {name: 'JM_SAUDARA', mapping: 'JM_SAUDARA' },
			  {name: 'KD_ENTRI', mapping: 'KD_ENTRI'},
			  {name: 'KOTAKU', mapping: 'KOTAKU'}
			],
			isUpdated : function(){
				var m=this.modified,f;
				for (f in m) {
					if (m.hasOwnProperty(f)) return true;
				}
				return false;
			}
		});
		me.storeEditor=Ext.create("Ext.data.AyodyaStore",{
			model: 'model-siswa-validasi',
			proxy: {
				type: 'ajax',sortParam:null,
				url : 'controller/upload/geterror',
				reader: {type: 'json',root: 'data'}
			},
			listeners:{
				scope:this,
				load:function(){
					this.gridEditor.setHeight(this.gridEditor.getHeight());
				}
			}
		});
		me.gridEditor=Ext.create("Ext.grid.Panel",{
			border:false,
			region:"center",
			autoScroll:true,
			split:true,
			height:300,
			store:me.storeEditor,
			selType: 'rowmodel',
			plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
			columns:[
				Ext.create('Ext.grid.RowNumberer'),
				{header: "Paralel", dataIndex: 'PARALEL', width : 80,editor:te},
				{header: "Absen", dataIndex: 'ABSEN', width : 80,editor:te},
				{header: "NISN", dataIndex: 'NISN', width : 100,editor:te},
				{header: "No Induk", dataIndex:'NO_INDUK', width : 80,editor:te},
				{header: "Nama", dataIndex: 'NM_PES', width : 300,editor:te},
				{header:'Tempat Lahir', dataIndex: 'TMP_LHR', width:200, editor:te},
				{header:'Tanggal Lahir (ddmmyy)', sortable:false, width:200, dataIndex: 'TGL_LHR', editor:{
					xtype:"datefield",
					format:"dmy",
					allowBlank:false
				},renderer:function(v){
					return (Ext.typeOf(v)=="date")?Ext.util.Format.date(v,"dmy"):v;
				}},
				{header: "Nama Ortu", dataIndex: 'NM_ORTU', width : 300,editor:te},
				{header:'Jenis Kelamin', width:100, dataIndex: 'SEX', editor:
					{xtype:"combo",store:App.Store.Sex,displayField:"value",valueField:"key"},
					renderer:function(v){return App.Utils.comboRender(v,App.Store.Sex,"key","value");}
				},
				{header:'Alamat 1', sortable:false, width:300, dataIndex: 'ALAMAT_1', editor:{xtype:"textarea"}},
				{header:'Alamat 2', sortable:false, width:300, dataIndex: 'ALAMAT_2', editor:{xtype:"textarea"}},
				{header:'Kurikulum', width:100, dataIndex: 'KURIKULUM', editor:
					{xtype:"combo",store:App.Store.Kurikulum,displayField:"value",valueField:"key"},
					renderer:function(v){return App.Utils.comboRender(v,App.Store.Kurikulum,"key","value");}
				},
				{header:'Agama', width:100, dataIndex: 'KD_AGAMA', editor:
					{xtype:"combo",store:App.Store.Agama,displayField:"value",valueField:"key"},
					renderer:function(v){return App.Utils.comboRender(v,App.Store.Agama,"key","value");}
				},
				{header:'Cita cita', sortable:false, width:200, dataIndex: 'KD_CITA', editor:
					{xtype:"combo",store:App.Store.Cita,displayField:"value",valueField:"key"},
					renderer:function(v){
						return App.Utils.comboRender(v,App.Store.Cita,"key","value");
				}},
				{header:'Hobi', sortable:false, width:100, dataIndex: 'KD_HOBI', editor:
					{xtype:"combo",store:App.Store.Hobi,displayField:"value",valueField:"key"},
					renderer:function(v){
						return App.Utils.comboRender(v,App.Store.Hobi,"key","value");
				}},
				{header:'Jarak Rumah', sortable:false, width:150, dataIndex: 'KD_JARAK', editor:
					{xtype:"combo",store:App.Store.Jarak,displayField:"value",valueField:"key"},
					renderer:function(v){
						return App.Utils.comboRender(v,App.Store.Jarak,"key","value");
				}},
				{header:'Transportasi', sortable:false, width:150, dataIndex: 'KD_TRANS', editor:
					{xtype:"combo",store:App.Store.Trans,displayField:"value",valueField:"key"},
					renderer:function(v){
						return App.Utils.comboRender(v,App.Store.Trans,"key","value");
				}},
				{header:'Pekerjaan Ayah', sortable:false, width:200, dataIndex: 'KD_KERJA1', editor:
					{xtype:"combo",store:App.Store.Pekerjaan,displayField:"value",valueField:"key"},
					renderer:function(v){
						return App.Utils.comboRender(v,App.Store.Pekerjaan,"key","value");
				}},
				{header:'Pekerjaan Ibu', sortable:false, width:200, dataIndex: 'KD_KERJA2', editor:
					{xtype:"combo",store:App.Store.Pekerjaan,displayField:"value",valueField:"key"},
					renderer:function(v){
						return App.Utils.comboRender(v,App.Store.Pekerjaan,"key","value");
				}},
				{header:'Pendidikan Ayah', sortable:false, width:200, dataIndex: 'KD_DIDIK1', editor:
					{xtype:"combo",store:App.Store.Pendidikan,displayField:"value",valueField:"key"},
					renderer:function(v){
						return App.Utils.comboRender(v,App.Store.Pendidikan,"key","value");
				}},
				{header:'Pendidikan Ibu', sortable:false, width:200, dataIndex: 'KD_DIDIK2', editor:
					{xtype:"combo",store:App.Store.Pendidikan,displayField:"value",valueField:"key"},
					renderer:function(v){
						return App.Utils.comboRender(v,App.Store.Pendidikan,"key","value");
				}},
				{header:'Gaji Ortu', sortable:false, width:200, dataIndex: 'KD_GAJI', editor:
					{xtype:"combo",store:App.Store.Gaji,displayField:"value",valueField:"key"},
					renderer:function(v){
						return App.Utils.comboRender(v,App.Store.Gaji,"key","value");
				}}
			],
			dockedItems:[{
				xtype:"toolbar",
				dock:"top",
				itemId:"button",
				items:[{
					text:_text("save"),
					scope:this,
					itemId:"btn-save",
					disabled:true,
					iconCls:"icon-save",
					handler:this.onSave
				},"-",{
					text:"Batalkan sekolah ini",
					disabled:true,
					itemId:"btn-cancel",
					scope:this,
					handler:this.onCancel,
					iconCls:"icon-delete"
				}]
			}],	
			viewConfig : {
				listeners : {
					scope : this,
					itemupdate : this.onUpdate
				}
			}
		});
		me.panelInfo=Ext.create("Ext.panel.Panel",{
			region:"south",
			border:false,
			split:true,
			autoScroll:true,
			height:(me.mainContent.getHeight()-300),
			dockedItems:[{
				xtype:"toolbar",
				dock:"bottom",
				items:["<h1>Data yang tidak diperbaiki tidak akan tersimpan ke server</h1>"]
			}]
		});
		me.panelValidasi=Ext.create("Ext.panel.Panel",{
			title:"Validasi Data",
			itemId:"validasi-content",
			layout:"border",
			//border:false,
			items:[{
				region:"west",
				split:true,
				border:false,
				style:"border-right: solid 1px #99BCE8",
				frame:false,
				width:200,
				items:[me.gridSekSalah,me.gridSekBenar]
			},{
				frame:false,
				region:"center",
				layout:"border",
				items:[me.gridEditor,me.panelInfo]
			}]
		});
		me.mainContent.add(me.panelValidasi);
	},
	show:function(){
		this.winUpload.show();
	},
	onComplete:function(a){
		var er=a.store.getCount();
		ei=(er>0)
			?"<br>Terdapat "+er+" file gagal upload. anda harus mengulanginya setelah validasi"+"<br>"
			:"";
		Ext.Msg.show({
			title:'Lakukan validasi?',
			msg:'<b>YES</b> untuk melakukan validasi.'+ei+'<br>'+
			 '<b>NO</b> untuk tidak memvalidasi, file terupload akan di hapus kembali.<br>',
			buttons: Ext.Msg.YESNO,
			closable:false,
			scope:App.window.upload,
			fn: function(a){this.doValidasi(a);},
			icon: Ext.window.MessageBox.QUESTION
		});
	},
	onCompleteBackground:function(a){
		var me=this;
		if (me.progress==null)me.createProgress();
		me.pgr.wait({
			animate:true,
			text:"Memvalidasi"
		});
		me.winUpload.hide();
		me.progress.show();
		Ext.Ajax.request({
			url:"controller/upload/uploaddone"
		});
		Ext.Function.defer(function(){
			me.getInfo();
		},2000,me);
	},
	doValidasi:function(a){
		var me=this;
		if (a=="yes"){
			if (me.progress==null){
				me.createProgress();
			}
			me.winUpload.hide();
			me.pgr.updateText("Memulai");
			me.progress.show();
			Ext.Ajax.request({
				url:"controller/upload/runvalidasi",
				scope:me,
				success:function(a){
					Ext.Function.defer(function(){
						this.getInfo();
					},2000,this);
				},failure:function(){
					Ext.Function.defer(function(){
						this.getInfo();
					},2000,this);
				}
			});
		}else{
			Ext.Ajax.request({
				url:"controller/upload/cvalidasi",
				scope:me,
				callback:function(){this.winUpload.hide();}
			});
		}
	},
	onDeleteAll:function(){
		var me=this;
		Ext.Ajax.request({
			url:"controller/upload/deleteall",
			scope:me,
			success:function(a){
			  Ext.Msg.alert("Peringatan","Semua data yang tidak valid telah terhapus.<br>Harap segera melakukan perbaikan data",function(){
				App.Main.contentMenu.setLoading(false);
				if (App.Priv.type<=1)App.Main.home();
				else App.Main.homeprop();
				App.window.upload.cleanUp();
				me.clearAll();
			  });
			}
		});
	},
	onItemSelChange:function(a,b){
		var me=this;
		if(b.length){
			me.currentDbf=b[0].get("namafile");
			me.reloadEditor();
		}
		me.setBtn("btn-cancel",b.length);
	},
	reloadEditor:function(){
		this.gridEditor.store.load({
			params:{file:this.currentDbf},
			scope:this,
			callback:function(a,b,c){
				var me=this;
				if (c && a.length>0){
					Ext.each(a,function(d){d.phantom=false;});
					me.reloadPanelInfo();
				}else{
					me.gridSekBenar.store.load();
					me.gridSekSalah.store.load();
				}
			}
		});
	},
	reloadPanelInfo:function(){
		this.panelInfo.update("");
		Ext.Ajax.request({
			url:"controller/upload/getdetail",
			method:"GET",
			params:{file:this.currentDbf},
			scope:this,
			success:function(a){
				var res=Ext.decode(a.responseText);
				this.tplInfo.overwrite(this.panelInfo.body, res.data);
			}
		});
	},
	onSave:function(){
		var me=this,
			dtaPost=[],
			data=me.storeEditor.getUpdatedRecords();
		
		Ext.each(data,function(c){
			var upd=c.getChanges();
			if (!Ext.isEmpty(upd["TGL_LHR"])){
				upd["TGL_LHR"]=Ext.util.Format.date(upd["TGL_LHR"],"dmy");
			}
			Ext.apply(upd ,{recno:c.get("recno")});
			dtaPost.push(upd);
		},me);

		Ext.Ajax.request({
			url: 'controller/upload/save',
			params:{
				file:me.currentDbf,
				data:Ext.encode(dtaPost)
			},
			scope:me,
			success: function(a,b){
				this.reloadEditor();
				this.reloadPanelInfo();
			},
			failure:function(){
				App.Utils.handleError();
			}
		});
	},
	cleanUp:function(){
		var m=this;
		m.gridSekBenar.store.removeAll();
		m.gridSekSalah.store.removeAll();
		m.gridEditor.store.removeAll();
		m.panelInfo.update("");
	},
	onCancel:function(){
		if(!this.currentDbf)return false;
		Ext.Ajax.request({
			url:"controller/upload/cancelone",
			params:{file:this.currentDbf},
			scope:this,
			success:function(a){
				var me=this,data=Ext.decode(a.responseText);
				me.gridEditor.store.removeAll();
				me.panelInfo.update("");
				me.gridSekSalah.store.load();
				me.setBtn("btn-cancel",false);
			}
		});
	},
	setBtn:function(n,e){
		this.gridEditor.getDockedComponent('button').getComponent(n).setDisabled(!e);
	},
	onUpdate:function(a){
		this.setBtn("btn-save",a.isUpdated()||this.storeEditor.getUpdatedRecords().length);
	},
	getInfo:function(){
		Ext.Ajax.request({
			url:"controller/upload/getinfo",
			scope:this,
			callback:function(a,b,c){
				var me=this,res=Ext.decode(c.responseText);
				if (!res.done){
					//if (res.msg)me.pgr.updateText(res.msg);
					Ext.Function.defer(function(){
						me.getInfo();
					},2000,me);
				}else {
					if (res.fail.length){
						Ext.Msg.alert("Peringatan","File sekolah untuk "+res.fail.join(", ")+" tidak ditemukan. <br><br>Mohon upload terlebih dahulu file sekolahnya, atau hubungi admin diatas anda",function(){
							me.pgr.reset();
							Ext.Function.defer(function(){
								this.progress.hide();
							},2000,me);
							me.gridSekBenar.store.load();
							me.gridSekSalah.store.load();
							me.mainContent.ownerCt.getComponent("content-Menu").setLoading({useMsg:false});
							me.mainContent.getLayout().setActiveItem("validasi-content");						
						},me);
					}
					me.pgr.reset();
					Ext.Function.defer(function(){
						this.progress.hide();
					},1000,me);
					me.gridSekBenar.store.load();
					me.gridSekSalah.store.load();
					me.mainContent.ownerCt.getComponent("content-Menu").setLoading({useMsg:false});
					me.mainContent.getLayout().setActiveItem("validasi-content");
				}
			}
		});
	},
	clearAll:function(){
		Ext.Ajax.request({url:"controller/upload/clearall"});
	}
});