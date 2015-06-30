Ext.define("App.Utils",{
	extend : Object,
	removeLoading: function(){
		var loading = Ext.get('loading');
		var mask = Ext.get('loading-mask');

		loading.puff({duration: 500}).animate({callback: function(){
			mask.slideOut('b',{duration : 500, listeners: {
				afteranimate: function(){ loading.hide();return true}
			}});
		}});
	},
	showLoading: function(t){
		var loading = Ext.get('loading');
		var mask = Ext.get('loading-mask');
		if(!mask.isVisible()){
			mask.slideIn("b",{duration:500}).animate({callback:function(){
				loading.unPuff({duration:500});
			}});
		}
		Ext.get('loading-msg').update((t||"Loading").substr(0,26) +"...");
		return true;
	},
	handleError : function(){
		Ext.Msg.show({
			title:'Error',
			msg: 'Click OK to Reload.',
			buttons: Ext.Msg.OK,
			closable : false,
			fn : function(){
				window.location=""
			}
		});
	},
	ifArrToString:function(data,delimeter){
		switch(Ext.typeOf(data)){
			case "array":
				return data.join(delimeter);
			break;
			default:
				return data;
			break;
		}
	},
	comboRender:function(a,b,c,d){
		var returnValue=a;
		//b.cleafFilter(false);
		var idx = b.findBy(function(record) {
			if(record.get(c) == a) {
				returnValue = record.get(d);
				return true;
			}
		});
		return returnValue;
	}
});