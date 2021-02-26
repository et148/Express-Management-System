/**
 * Created by Charle on 2018-02-09.
 * 基础列表管理
 */

(function () {

    //属性
    var BaseDataTable = function(element,options) {
        this.tid = options.tid;
        this.initTableOptions = options.initTableOptions;
        this.oTable = {};
        this.form = {};

        //添加
        this.addItemId = options.addItemId;
        this.addOptions = options.addOptions;
        $(this.addItemId).click($.proxy(this.addItem, this));

        //编辑
        this.editItemId = options.editItemId;
        this.editOptions = options.editOptions;
        $(this.editItemId).click($.proxy(this.editItem, this));

        //删除
        this.deleteUrl = options.deleteUrl;
        this.deleteItemId = options.deleteItemId;
        $(this.deleteItemId).click($.proxy(this.deleteItem, this));

        //搜索
        this.searchId = options.searchId;
        $(this.searchId).click($.proxy(this.searchList, this));

        //表单
        this.formId = options.formId;
        this.addFormOptions = options.addFormOptions;
        this.editFormOptions = options.editFormOptions;

        //其它操作
        this.bindOtherEvents(options.tools);

        //初始化
        this.initTable();
    }

    //方法
    BaseDataTable.prototype = {
        constructor: BaseDataTable,
        initTable:function () {
            this.oTable = widget.grid.datatable.init(this.tid, this.initTableOptions);
        },
        addItem:function (e) {
            frame.Modal.init(this.addOptions).show();
            this.form = frame.Form.init(this.addFormOptions);
            this.form.initForm($(this.formId));
        },
        editItem:function (e) {
            var cks = widget.grid.datatable.getCheckedIds(this.tid);
            if (cks && cks.length != 1) {
                frame.Modal.init({type: 'warning', text: "请选择单条记录"}).show();
            } else {
                frame.Modal.init(this.editOptions).show();
                this.form = frame.Form.init(this.editFormOptions);
                this.form.initForm($(this.formId));
            }
        },
        deleteItem:function (e) {
            widget.grid.datatable.doDelete(this.tid, this.deleteUrl);
        },
        searchList:function (e) {
            this.oTable.fnPageChange('first');
        },
        bindOtherEvents:function (tools) {
            if(!tools) return;
            for(var m in tools){
                var tool = tools[m];
                $(this.tid).on(tool.event,tool.selector,tool.eventHandler);
            }
        },
        getForm:function () {
            return this.form;
        }
    };

    $.fn.BaseDataTable = function (option,val) {
        this.each(function(){
            var $this = $(this);
            var data = $this.data('baseDataTable');
            if(!data){
                $this.data('baseDataTable', (data = new BaseDataTable(this, $.extend({}, $.fn.BaseDataTable.defaults,option))));
            }else{

            }
        });
    };

    $.fn.BaseDataTable.defaults = {
    };

    $.fn.BaseDataTable.Constructor = BaseDataTable;

})();