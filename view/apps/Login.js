Ext.define("App.Login",{
	extend: 'Ext.util.Observable',
	fmLogin : null,
	winLogin : null,
	winLogout : null,
	title : "Login",
	textSubmit : "Login",
	constructor: function(){
		this.callParent();
		if(!Ext.isEmpty(Ext.get("sk").getValue()))
			this.loadMain();
		else 
			this.init();
		return;
	},
	init: function(){
		this.createLoginForm();
		App.Utils.removeLoading();
	},
	createLoginForm : function(){
		this.fmLogin = Ext.create('Ext.form.Panel', {
			bodyPadding: 5,
			border : true,
			defaultType: 'textfield',
			url : "controller/auth/dologin",
			bodyStyle : "background-color : #DFE8F6",
			//height : 165,
			defaults : {
				labelWidth : 100,
				labelSeparator : "",
				msgTarget : "side",
				allowBlank: false,
				listeners: {
					scope :this,
					specialkey: function(a,e){
						if (e.getKey() == e.ENTER) this.doLogin();
					}
				}
			},
			items: [{
				fieldLabel: 'NIK',
				name: 'nik',
				itemId : "nik"
			},{
				fieldLabel: 'Password',
				name: 'password',
				inputType : "password",
				itemId : "password"
			}]
		});
		
		this.winLogin = Ext.create("Ext.Window",{
			title : this.title,
			autoShow : true,
			autoWidth: true,
			border : true,
			closable : false,
			resizable : false,
			layout : "fit",
			title: this.title,
			bodyStyle : 'padding:5px;',
			items : [this.fmLogin],
			buttons :[{
				scope : this,
				handler : this.doLogin,
				text : this.textSubmit
			}]
		});
	},
	doLogin : function(){
		this.fmLogin.getForm().submit({
			scope : this,
			success : this.onSuccess,
			failure : this.onFailure,
		});
	},
	logout : function(){
		this.winLogout =Ext.Msg.show({
			title:'Anda Yakin ?',
			msg: 'Akan keluar dan menutup sesi ini ?',
			buttons: Ext.Msg.OKCANCEL,
			scope : this,
			fn: this.doLogout,
			icon: Ext.window.MessageBox.QUESTION
		});
	},
	doLogout : function(a){
		if (a == "ok"){
			Ext.Ajax.request({
				url : "controller/auth/dologout",
				scope : this,
				success : function(a,b){
					App.Utils.showLoading("Closing session");
					Ext.Function.defer(function(){
						window.location.reload(true);
					},2000,this);
				}
			});
		}else{
			this.winLogout.hide();
		}
	},
	loadMain : function() {
		App.Utils.showLoading("Loading Main Application");
		if (!App.isDevel())Ext.Loader.setConfig({extention:"php"});
		Ext.Function.defer(function(){
			if(!Ext.isEmpty(this.winLogin))this.winLogin.destroy();
			//console.info("masuk");
			App.Main = Ext.create("App.Main");
		},1000,this);
	},
	onSuccess : function(a,b){
		if (b.result.login)this.loadMain();
		else this.onFailure(null,b);
	},
	onFailure : function(a,b){
		if (b.result){
			Ext.each(b.result.errorMsg, function(c){
				this.fmLogin.getComponent(c.inp).markInvalid(c.reason);
			},this);
		}
	}
});