Ext.apply(Ext.Loader,{
	getPath : function(h){
		var j = "", 
		k = this.config.paths, 
		x = this.config.extention, 
		i = this.getPrefix(h); 
		if (i.length > 0) { 
			if (i === h) { return k[i] } j = k[i]; 
			h = h.substring(i.length + 1) 
		} 
		if (j.length > 0) { j += "/" } 
		return j.replace(/\/\.\//g, "/") + h.replace(/\./g, "/") + "." + (x || "js");
	}
});

Ext.apply(Ext.core.Element.prototype, {
	puff : function(obj){
		 var m = this,
			 beforeAnim;
        obj = Ext.applyIf(obj || {}, {
            duration: 500,
			easing : "easeOut"
        });

        beforeAnim = function() {
            m.clearOpacity();
            m.show();
            var b = m.getBox();
            this.to = {
                width: b.width * 2,
                height: b.height * 2,
                x: b.x - (b.width / 2),
                y: b.y - (b.height /2),
                opacity: 0,
                fontSize: '200%'
            };
		};
        m.animate({
            duration: obj.duration,
            easing: obj.easing,
            listeners: {
                beforeanimate: {fn: beforeAnim}
            }
        });
        return m;
	},
	unPuff : function(obj){
		 var m = this,
            beforeAnim;
        obj = Ext.applyIf(obj || {}, {
            duration: 500,
			easing : "easeOut"
        });
        beforeAnim = function() {
            m.clearOpacity();
            m.show();
            var b = m.getBox();
            this.to = {
                width: b.width / 2,
                height: b.height / 2,
                x: b.x + (b.width / 4),
                y: b.y + (b.height /4),
                opacity: 1,
                fontSize: '200%'
            };
		};
        m.animate({
            duration: obj.duration,
			to : this.to,
            easing: obj.easing,
            listeners: {
                beforeanimate: {fn: beforeAnim}
            }
        });
        return m;
	}
});

Ext.apply(Ext.form.field.VTypes, {
    numberLeadZero:  function(v) {
        return /[\d]/.test(v);
    },
    numberLeadZeroText: 'Must be a numeric',
    numberLeadZeroMask: /[\d]/i
});

Ext.apply(Ext.form.field.VTypes, {
    username:  function(v){return /[\w\d\-]/.test(v);},
    usernameText: 'Username tidak valid',
    usernameMask: /[\w\d\-]/i
});

Ext.override(Ext.toolbar.Paging, {
	 onLoad : function(){
        var me = this,
            pageData,
            currPage,
            pageCount,
            afterText;
            
        if (!me.rendered) {
            return;
        }

        pageData = me.getPageData();
		pageData.total=me.store.getCount();
        currPage = pageData.currentPage;
        pageCount = pageData.pageCount;
        afterText = Ext.String.format(me.afterPageText, (isNaN(pageCount) || pageData.total===0) ? 1 : pageCount);

        me.child('#afterTextItem').setText(afterText);
        me.child('#inputItem').setValue(currPage);
        me.child('#inputItem').setDisabled(pageData.total === 0);
        me.child('#first').setDisabled(currPage === 1);
        me.child('#prev').setDisabled(currPage === 1);
        me.child('#next').setDisabled(currPage === pageCount || pageData.total === 0);
        me.child('#last').setDisabled(currPage === pageCount|| pageData.total === 0);
        me.child('#refresh').setDisabled(pageData.total === 0);
        me.updateInfo();
        me.fireEvent('change', me, pageData);
    }
});

Ext.override(Ext.panel.Table, {
	scrollByDeltaX: function(deltaX) {
		var hs = this.getHorizontalScroller();
		if (hs){hs.scrollByDeltaX(deltaX);}
	},	
    showVerticalScroller: function() {
        var me = this;

        me.setHeaderReserveOffset(true);
        if (me.verticalScroller && me.verticalScroller.ownerCt !== me) {
			if (me.verticalScroller.scrollEl) {
				me.verticalScroller.mun(me.verticalScroller.scrollEl, 'scroll', me.verticalScroller.onElScroll, me.verticalScroller);
				me.verticalScroller.mon(me.verticalScroller.scrollEl, 'scroll', me.verticalScroller.onElScroll, me.verticalScroller);
			}
            me.addDocked(me.verticalScroller);
            me.addCls(me.verticalScrollerPresentCls);
            me.fireEvent('scrollershow', me.verticalScroller, 'vertical');
        }
    }
});


Ext.override(Ext.selection.RowModel, {
	lastId:null,
    onEditorTab: function(ep, e) {
        var me = this,
            view = me.view,
            record = ep.getActiveRecord(),
            header = ep.getActiveColumn(),
            position = view.getPosition(record, header),
            direction = e.shiftKey ? 'left' : 'right',
            newPosition = view.walkCells(position, direction, e, false),
			newId=newPosition.row;
			grid=view.up('gridpanel');
		
		if (me.lastId!=newId && me.lastId!=null){
			deltaX = me.lastId<newId? -Infinity : Infinity;
			header=grid.headerCt.getHeaderAtIndex(newPosition.column);
			if(header){
				while(!header.getEditor()){
					newPosition= view.walkCells(newPosition,direction, e, false);
					header=grid.headerCt.getHeaderAtIndex(newPosition.column);
				}
			}
		}else{
			deltaX = ep.context.column.width * (direction== 'right' ? 1 : -1);
		}
		grid.scrollByDeltaX(deltaX);
		me.lastId=newPosition.row;
		Ext.defer(function(){
			if (newPosition)ep.startEditByPosition(newPosition);
			else ep.completeEdit();
		}, 100);	
    }
});

Ext.override(Ext.menu.Menu,{
	doConstrain: function () {
		var g = this,
			h = g.el.getY(),
			i, e, b, j = h,
			k, d, a, c;
		e = g.getHeight();
		delete g.height;
		g.setSize();
		if (g.floating) {
			d = Ext.fly(g.el.dom.parentNode);
			a = d.getScroll().top;
			c = d.getViewSize().height;
			k = h - a;
			i = g.maxHeight ? g.maxHeight : c - k;
			if (e > c) {
				i = c;
				j = h - k
			} else {
				if (i < e) {
					j = h - (e - i);
					i = e
				}
			}
		} else {i = g.getHeight()}
		if (g.maxHeight) {i = Math.min(g.maxHeight, i)}
		if (e > i && i > 0) {
			g.layout.autoSize = false;
			g.setHeight(i);
			if (g.showSeparator) {
				g.iconSepEl.setHeight(g.layout.getRenderTarget().dom.scrollHeight)
			}
		}
		b = g.getConstrainVector(g.el.dom.parentNode);
		if (b) {g.setPosition(g.getPosition()[0] + b[0])}
		g.el.setY(j)
	}
});

Ext.override(Ext.form.RadioGroup,{
	setValue:function(val){
		var me=this;
		me.eachBox(function(a){
			a.setValue((a.inputValue == val));
		});
	}
});


Ext.define("Ext.ux.ContentMenu",{
    extend : "Ext.panel.Panel",
    alias : "widget.contentmenu",
    tpl : new Ext.XTemplate(
    '<tpl for=".">',
		'<li style="margin: 3px 3px 3px 3px;" class="',
			'<tpl if="disabled">x-item-disabled </tpl>',
			'<tpl if="hidden">x-hidden </tpl>',
		'">',
			'<img src="',
			Ext.BLANK_IMAGE_URL,
			'" class="{iconCls}" style="height:16px;margin-bottom:2px;margin-right:7px;vertical-align:middle;width:16px;"/>',
			'<a id="{id}" href="#" style="color:#3764A0;font-size:11px;text-decoration:none;">{text}</a>',
		'</li>',
    '</tpl>'
    ),
    initComponent : function(){
        var c=this;
        c.data = c.items;
        delete c.items;
		c.actions={}
		Ext.each(c.data,function(f){
			if(Ext.isFunction(f.handler) && !f.disabled)
			c.actions[f.id]=f.handler
		},this);
		this.callParent();
    },
	afterRender : function(){
		var m=this;
		m.callParent();
		b=m.body;
		b.on('mousedown', this.doAction, this, {
			delegate : 'a',
			preventDefault : true,
			stopEvent:true
		});
	},
	doAction : function(a,b){
		if (!Ext.isEmpty(this.actions[b.id]))
		this.actions[b.id]();
	}
});

Ext.define("Ext.data.AyodyaStore",{
    extend : "Ext.data.Store",
	keys:{},
	staticParams:{},
    constructor:function(c){
        this.callParent([c]);
    },
    loadPage:function(page){
		var me = this,
			o={};
		//if (Ext.isEmpty(me.first()))return;
		//var	sk=me.first().raw.key,ek=me.last().raw.key;
		//o["startkey"]=(Ext.typeOf(sk)==="array")?sk.join():sk;
		//o["endkey"]=(Ext.typeOf(ek)==="array")?ek.join():ek;

		if (page < me.currentPage && (me.currentPage-page)==1)o["type"]="prev";
		else if(page > me.currentPage && (page-me.currentPage)==1)o["type"]="next";
		else if(page == me.currentPage)o["type"]="reload";
		else o["type"]="skip";

		Ext.apply(o,me.staticParams);

        me.currentPage = page;
        me.read({
            page: page,
            start: (page - 1) * me.pageSize,
            limit: me.pageSize,
            addRecords: !me.clearOnPageLoad,
			params:o
        });
    }
});