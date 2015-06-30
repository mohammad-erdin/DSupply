Ext.define("Ext.panel.SWFUploadPanel",{
    extend : "Ext.grid.Panel",
    alias : "widget.swfupload",

	filePostName:"Filedata",
	fileSizeLimit:200,//200 MB
	fileUploadLimit:0,//limit upload file. note uploadLimit: different with queueLimit
	fileQueueLimit:0,//limit queue file. note uploadLimit: different with queueLimit
	enableDelKey:false,
	editable:false,
	confirmDelete:true,
    
	btnConfig : {},
	strings : {},
	preStrings: {
        //textProgressbar: 'Uploading',
        textReady: 'Ready to upload',
        textRemove: 'Are you sure?',
        textRemoveSure: 'You will remove selected file(s). Continue ?',
        textError: 'Error',
        textUploading: 'Uploading file: {0} ({1} of {2})',
        headerFilename: 'Filename',
        headerSize: 'Size',
        headerStatus: 'Status',
        status: {
            0: 'Queued',
            1: 'Uploading...',
            2: 'Completed',
            3: 'Error',
            4: 'Cancelled'
        },
        errorQueueExceeded: 'The selected file(s) exceed(s) the maximum number of {0} queued files.',
		/* currently is no use. i don't know what this suppose to...
        errorQueueSlots_0: 'There is no slot left',
        errorQueueSlots_1: 'There is only one slot left',
        errorQueueSlots_2: 'There are only {0} slots left',
		*/ 
        errorSizeExceeded: 'The selected files size exceeds the allowed limit of {0}.',
        errorZeroByteFile: 'Zero byte file selected.',
        errorInvalidFiletype: 'Invalid filetype selected.',
        errorFileNotFound: 'File not found 404.',
        errorSecurityError: 'Security Error. Not allowed to post to different url.'
    },
	//private
	uploadCancelled:false,
	uploadRunning:false,

	initComponent : function(){
        var me=this;
		me.addEvents(
			'swfUploadLoaded',
			'fileQueued',
			'startUpload',
			'fileUploadError',
			'fileUploadSuccess',
			'fileUploadComplete',
			'allUploadsComplete',
			'removeFile'
		);
		me.strings=Ext.apply(me.preStrings,me.strings);

		Ext.define('fileupload-model', {
			extend: 'Ext.data.Model',
			fields: [
				{name: 'name'},
				{name: 'size'},
				{name: 'id'},
				{name: 'status'}
			]
		});
		me.store=Ext.create('Ext.data.Store', {
			model: 'fileupload-model',
			proxy: {
				type: 'memory',
				reader: 'json'
			}
		});
		
		me.progressBar=Ext.create('Ext.ProgressBar', {
			animate:true,
			text:me.strings.textReady,
			width : (me.width || me.getWidth())-6
		});
		me.columns = [{
			id:'name',
			flex:1,
			header: me.strings.headerFilename, 
			dataIndex: 'name'
		},{
			id:'size', 
			header: me.strings.headerSize, 
			width: 80, 
			dataIndex: 'size', 
			renderer: me.formatBytes
		},{
			id:'status', 
			header: me.strings.headerStatus, 
			flex:1,
			dataIndex: 'status', 
			renderer: me.formatStatus
		}];
		me.dockedItems=[{
			xtype : "toolbar",
			dock:"top",
			itemId: 'toptoolbar',
			items:me.createTopTB()
		},{
			xtype : "toolbar",
			dock:"bottom",
			itemId: 'progressbar',
			items:me.progressBar
		}];
		
		me.viewConfig={
			stripeRows:true,
			multiSelect:true,
			listeners:{
				scope:me,
				itemkeydown:(me.enableDelKey)?me.onKeyDelete:Ext.emptyFn
			}
		}
		me.selModel=Ext.create('Ext.selection.RowModel',{mode:"multi"});
		me.callParent();
		me.on("selectionchange",function(a,b){
			//var dis=(me.editable)?!(b.length>0):me.uploadRunning;
			var dis=(me.editable)?!(b.length>0):!(b.length>0)||me.uploadRunning;
			me.getComponent("toptoolbar")
			.getComponent("btn-delete").setDisabled(dis);
		},this);
    },		
	createTopTB:function(){
		var me=this,tbar=[];
		tbar.push({
			text:me.btnConfig.addText||"Add",
			itemId:"btn-add",
			iconCls:me.btnConfig.addIconCls||"",
			listeners: {
				scope: this,
				render: function(){
					this.initSWFUpload();
				}
			}
		});
		tbar.push("-");
		tbar.push({
			text:me.btnConfig.removeText||"Remove",
			itemId:"btn-delete",
			disabled:true,
			iconCls:me.btnConfig.removeIconCls||"",
			scope:this,
			handler:function(){
				var me=this;
				if (me.confirmDelete){
					Ext.MessageBox.confirm(me.strings.textRemove,me.strings.textRemoveSure, function(e) {
						if (e == 'yes')this.onDelete();
					}, me);
				}else me.onDelete();
			}
		});
		tbar.push("->");
		tbar.push({
			text:me.btnConfig.uploadText||"Upload",
			itemId:"btn-upload",
			scope:this,
			handler:function(){
				this.suo.startUpload();
			},
			iconCls:me.btnConfig.uploadIconCls||""
		});
		tbar.push({
			text:me.btnConfig.cancelText||"Cancel",
			itemId:"btn-cancel",
			hidden:true,
			iconCls:me.btnConfig.cancelIconCls||"",
			scope:this,
			handler:function(){
				this.stopUpload();
			}
		});

		return tbar;
	},
	initSWFUpload:function(){
		var suoID = Ext.id(),
			settings={},
			me=this,
			btn=me.getComponent("toptoolbar")
				.getComponent("btn-add"),
			em = btn.el.child('em');
		em.setStyle({
			position: 'relative',
			display: 'block'
		});
		em.createChild({
			tag: 'div',
			id: suoID
		});

		settings = {
			flash_url : me.flashUrl || "http://demo.swfupload.org/v220/swfupload/swfupload.swf",
			upload_url: me.uploadUrl || "upload.php",
			//requeue_on_error :true,
			post_params: {"PHPSESSID" : me.sessionId || Ext.util.Cookies.get("PHPSESSID")},
			
			file_post_name: me.filePostName,
			file_size_limit : me.fileSizeLimit+""+" MB",
			file_types : me.fileTypes|| "*.*",
			file_types_description : me.fileTypesDesc||"All Files",
			file_upload_limit : me.fileUploadLimit,
			file_queue_limit : me.fileQueueLimit,
			
			debug: me.debug || false,
			debug_handler:me.debug ?me.debugHandler : Ext.emptyFn,

			button_placeholder_id: suoID,
			button_width: Ext.isEmpty(btn.iconCls)?em.getWidth():btn.getWidth()+10,
			button_height: btn.getHeight()-2,
			button_cursor: SWFUpload.CURSOR.HAND,
			button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
			button_action : me.singleSelect ? SWFUpload.BUTTON_ACTION.SELECT_FILE:SWFUpload.BUTTON_ACTION.SELECT_FILES,
			
			file_queued_handler: Ext.bind(me.fileQueue,me),
			file_queue_error_handler : Ext.bind(me.fileQueueError,me),
			file_dialog_complete_handler : Ext.bind(me.completeDialog,me),
			upload_start_handler : Ext.bind(me.uploadStart,me),
			upload_progress_handler : Ext.bind(me.uploadProgress,me),
			upload_error_handler : Ext.bind(me.uploadError,me),
			upload_success_handler : Ext.bind(me.uploadSuccess,me),
			upload_complete_handler : Ext.bind(me.uploadComplete,me)//,
			//queue_complete_handler : Ext.bind(me.uploadComplete,me)
		};
		this.suo = new SWFUpload(settings);
		
		Ext.get(this.suo.movieName).setStyle({
			position: 'absolute',top: 0,left: 0			
		});
	},
	formatStatus: function(status) {
		if (Ext.typeOf(status)=="string"){
			return status;
		}
		return this.strings.status[status];
	},
	formatBytes: function(size) {
		if (!size) {
			size = 0;
		}
		var suffix = ["B", "KB", "MB", "GB"];
		var result = size;
		size = parseInt(size, 10);
		result = size + " " + suffix[0];
		var loop = 0;
		while (size / 1024 > 1) {
			size = size / 1024;
			loop++;
		}
		result = Math.round(size) + " " + suffix[loop];

		return result;

		if(isNaN(bytes)) {
			return ('');
		}

		var unit, val;

		if(bytes < 999) {
			unit = 'B';
			val = (!bytes && this.progressRequestCount >= 1) ? '~' : bytes;
		} else if(bytes < 999999) {
			unit = 'kB';
			val = Math.round(bytes/1000);
		} else if(bytes < 999999999) {
			unit = 'MB';
			val = Math.round(bytes/100000) / 10;
		} else if(bytes < 999999999999) {
			unit = 'GB';
			val = Math.round(bytes/100000000) / 10;
		} else {
			unit = 'TB';
			val = Math.round(bytes/100000000000) / 10;
		}
		return (val + ' ' + unit);
	},
	debugHandler: function(line){
		console.log(line);
	},
	completeDialog:function(){
		var me=this,
			btn=me.getComponent("toptoolbar")
			  .getComponent("btn-add");
		//to hide ugly button when dialog closed
		btn.doComponentLayout(btn.getWidth(),btn.getHeight());
	},
	fileQueue: function(file) {
		if(this.debug) console.info('FILE QUEUE');
		
		file.status = 0;
		var r=Ext.ModelManager.create(file, 'fileupload-model');
		r.id = file.id;
		this.store.add(r);
		
		this.fireEvent('fileQueued', this, file);
	},
	uploadStart: function(file){
		var me=this;
		me.uploadCancelled = false;
		me.uploadRunning=true;
		if(me.debug) console.info('UPLOAD START');

		if (!me.editable){
			Ext.get(me.suo.movieName).hide();
		}
		me.updateTBBtn();
		me.fireEvent('uploadStart', me, file);
		return true;
	},
	uploadSuccess: function(file, response) {
		var me=this,
			data = Ext.decode(response); 
		if(me.debug) console.info('UPLOAD SUCCESS');
		if (data.success) {
			me.store.remove(me.store.getById(file.id));
		} else {
			//me.store.getById(file.id).set('status', 3);
			me.store.getById(file.id).set('status', data.msg);
			me.store.getById(file.id).commit();
			/*
			if (data.msg) {
				Ext.MessageBox.alert(me.strings.textError, data.msg);
			}
			*/
		}
		me.fireEvent('fileUploadSuccess', me, file, data);
	},
	uploadComplete: function(file) {
		var me=this;
		if(me.debug) console.info('UPLOAD COMPLETE');
		
		if(me.suo.getStats().files_queued && !me.uploadCancelled) {
			me.suo.startUpload();
		} else {
			me.uploadRunning=false;
			me.fireEvent('fileUploadComplete', me, file);
			me.allUploadsComplete();
		}
	},
	uploadProgress: function(file, bytes_completed, bytes_total) {
		var me=this;
		if(me.debug) console.info('UPLOAD PROGRESS');
		
		me.store.getById(file.id).set('status', 1);
		me.store.getById(file.id).commit();
		me.progressBar.updateProgress(bytes_completed/bytes_total,
			Ext.String.format(me.strings.textUploading, file.name, me.formatBytes(bytes_completed), me.formatBytes(bytes_total))
		,true);
		me.fireEvent('uploadProgress', me, file, bytes_completed, bytes_total);
	},
	fileQueueError: function(file, code, message) {
		var me=this;
		if(me.debug) console.info('FILE QUEUE ERROR');

		switch (code) {
			case -100:Ext.MessageBox.alert(me.strings.textError, Ext.String.format(me.strings.errorQueueExceeded, me.fileQueueLimit));break;
			case -110:Ext.MessageBox.alert(me.strings.textError, Ext.String.format(me.strings.errorSizeExceeded, me.formatBytes(me.fileSizeLimit * 1024)));break;
			case -120:Ext.MessageBox.alert(me.strings.textError, me.strings.errorZeroByteFile);break;
			case -130:Ext.MessageBox.alert(me.strings.textError, me.strings.errorInvalidFiletype);break;
		}
		
		this.fireEvent('fileQueueError', this, file, code);
	},	
	uploadError: function(file, error, code) {
		var me=this;
		if(me.debug) console.info('UPLOAD ERROR');
		switch (error) {
			case -200:Ext.MessageBox.alert(me.strings.textError, me.strings.errorFileNotFound);break;
			case -230:Ext.MessageBox.alert(me.strings.textError, me.strings.errorSecurityError);break;
			case -290:
				this.store.getById(file.id).set('status', 4);
				this.store.getById(file.id).commit();
			break;
		}
		this.fireEvent('fileUploadError', this, file, error, code);
	},
	onKeyDelete: function(a,b,c,d,e) {
		var me=this,
		selRecords=this.getSelectionModel().getSelection();	
		if (e.getKey()!=e.DELETE)return false;
		e.stopEvent();
		if (me.confirmDelete){
			Ext.MessageBox.confirm(me.strings.textRemove,me.strings.textRemoveSure, function(e) {
				if (e == 'yes'){
					Ext.each(selRecords,function(sel){
						this.removeFile(sel);
					},this);
				}
			}, me);
		}else {
			Ext.each(selRecords,function(sel){
				this.removeFile(sel);
			},this);
		}
	},
	onDelete: function() {
		var me=this;
			selRecords=me.getSelectionModel().getSelection();
		Ext.each(selRecords,function(sel){
			this.removeFile(sel);
		},this);
	},
	removeFile:function(rec) {
		var me=this;
		if(this.debug) console.info('REMOVE FILES');
		this.suo.cancelUpload(rec.get("id"));
		this.store.remove(rec);
		this.fireEvent('removeFile', this);
	},
	allUploadsComplete: function() {
		var me=this,
			swfObj=Ext.get(me.suo.movieName);		
		if (!swfObj.isVisible())swfObj.show();
		me.updateTBBtn();
		me.progressBar.reset();
		me.progressBar.updateText(me.strings.textReady);

		me.fireEvent('allUploadsComplete',me);
	},
	stopUpload: function(file) {
		var me=this;
		if(me.debug) console.info('STOP UPLOAD');
		me.uploadCancelled = true;
		me.uploadRunning=false;
		me.store.each(function(){
			if (this.data.status == 1) {
				this.set("status", 0);
				this.commit();
			}
		});
		me.doComponentLayout();
	},
	updateTBBtn:function(){
		var me=this;
		me.getComponent("toptoolbar")
		.getComponent("btn-add")
		.setDisabled((!me.editable && me.uploadRunning));
		me.getComponent("toptoolbar")
		.getComponent("btn-delete")
		.setDisabled((me.editable)?!(me.getSelectionModel().getSelection().length>0):true);
		
		me.getComponent("toptoolbar")
		.getComponent("btn-upload").setVisible(!me.uploadRunning);
		me.getComponent("toptoolbar")
		.getComponent("btn-cancel").setVisible(me.uploadRunning);
	}
});