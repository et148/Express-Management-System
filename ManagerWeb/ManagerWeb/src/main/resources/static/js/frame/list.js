var frame=frame||{};
var $=jQuery;
frame.List = function() {
    var List=function(params){
        var self=this;
        var _html=params.html;
        var _options=params.options;
        var _tableObj=params.tableObj;
        var _divObj=params.divObj;
        this.getOptions=function(){
            return _options;
        }
        this.getHtml=function(){
            return _html;
        }
        this.getTableObj=function(){
            return _tableObj;
        }
        this.getDivObj=function(){
            return _divObj;
        }
        this.getSelectedIds=function() {
            if(this.getTableObj().fnSettings){
                return this.getTableObj().fnSettings().oInit.seletedIds;
            }
        }
    };
    return {
        init: function(options){
            options=options||{};
            return frame.List.initList(options);
        },
        initList: function(options){
            if (!$) {
                return;
            }
            if(!options.id){
                console.info("div id not specified");
                return;
            }
            options.actions=options.actions||[];
            var divObj=$("#"+options.id);
            if(!divObj){
                console.info("div obj with given id '"+options.id +"' not found");
                return;
            }
            divObj.html("");
            options.columns=options.columns||[];
            var listHtml=this.setContent(divObj,options);
            var tableObj=this.initTable(divObj,options);
            var listObj= new List({options:options,html:listHtml,tableObj:tableObj,divObj:divObj});
            this.setListeners(divObj,tableObj,options);
            return listObj;
        },
        setListeners:function(divObj,tableObj,options){
            if(!tableObj || typeof(options.selectedIds) == 'undefined') return;
            divObj.on("click",".checkboxes,.group-checkable",function(e){
                var _ids = tableObj.fnSettings().oInit.seletedIds ? tableObj.fnSettings().oInit.seletedIds.split(",") : [];
                var className = e.target.className;
                var checked = e.target.checked
                var tb = $("#"+options.tableId).dataTable();
                if(checked) {
                    var cks = $("#"+options.tableId+" .checkboxes:checked");
                    cks.each(function() {
                        var id = $(this).attr("sid");
                        if(_ids.indexOf(id) == -1) {
                            _ids.push($(this).attr("sid"))
                        }
                    });
                } else {
                    var cancelIds = [];
                    if(className == 'checkboxes'){
                        cancelIds.push($(e.currentTarget).attr("sid"));
                    } else if(className == 'group-checkable'){ // 全部取消
                        tb.fnGetData().each(function() {
                            cancelIds.push($(this).attr("sid"));
                        });
                    }
                    if(cancelIds.length > 0) {
                        var tempIds = [];
                        for(var i = 0; i < _ids.length; i++){
                            var isCanceled = false;
                            for(var j = 0; j < cancelIds.length; j++) {
                                if(_ids[i] == cancelIds[j]){
                                    isCanceled = true;
                                    break;
                                }
                            }
                            if(isCanceled == false){
                                tempIds.push(_ids[i]);
                            }
                        }
                        _ids = tempIds;
                    }
                }
                tableObj.fnSettings().oInit.seletedIds = _ids.join(",");
            });
        },
        setContent: function(divObj,options){
            switch(options.mode){
                case "base":
                    //基础表格，带有搜索，增删改查按钮，带有分页
                    this.setContentForBase(divObj,options);
                    break;
                case "tree":
                    //树形表格，与基础表格基本一致，数据按树形结构显示，不带分页功能
                    this.setContentForTree(divObj,options);
                    break;
                case "lite":
                    //简易风格表格，只有新增按钮，其他删改功能集成入每一行数据，不分页，可直接在表格上编辑数据
                    this.setContentForLite(divObj,options);
                    break;
                default:
                    this.setContentForBase(divObj,options);
                    break;
            }
        },
        initTable:function(divObj,options){
            switch(options.mode){
                case "base":
                    //基础表格，带有搜索，增删改查按钮，带有分页
                    return this.initTableForBase(divObj,options);
                    break;
                case "tree":
                    //树形表格，与基础表格基本一致，数据按树形结构显示，不带分页功能
                    return this.initTableForTree(divObj,options);
                    break;
                case "lite":
                    //简易风格表格，只有新增按钮，其他删改功能集成入每一行数据，不分页，可直接在表格上编辑数据
                    return this.initTableForLite(divObj,options);
                    break;
                default:
                    return this.initTableForBase(divObj,options);
                    break;
            }
        },
        setContentForBase:function(divObj,options){
            var handlerMap={};
            var searchButtonStr='';
            var searchFieldsStr='';
            var searchButton=options.searchButton;
            var searchFields=options.searchFields;
            if(searchButton&&searchFields&&(searchFields.length>0)){
                for(var i in searchFields){
                    searchFieldsStr+=('<input type="text" style="height:25px;" class="form-control" id="'+searchFields[i].id+'" placeholder="'+searchFields[i].text+'">');
                }
                searchButtonStr='<button id="'+searchButton.id+'" class="btn btn-default btn-xs"><i class="fa fa-search"></i>'+searchButton.text+'</button>'
            }
            var columnsStr='';
            var columns=options.columns||[];
            for(var i in columns){
                columnsStr+=('<th>'+(columns[i].text||columns[i])+'</th>');
            }
            var operationsStr='';
            var operations=options.operations||[];
            for(var i in operations){
                if(operations[i].handler){
                    handlerMap[operations[i].id]=operations[i].handler;
                }
                var subs=operations[i].subs;
                if(subs&&(subs.length>0)){
                    var subsStr='';
                    for(var j in subs){
                        if(subs[j].handler){
                            handlerMap[subs[j].id]=subs[j].handler;
                        }
                        if(subs[j].type=='divider'){
                            subsStr+=('<li class="divider"></li>');
                        }else{
                            subsStr+=('<li><a id="'+subs[j].id+'" '+subs[j].attr+'><i class="'+subs[j].iconCls+'"></i>'+subs[j].text+'</a></li>');
                        }
                    }
                    operationsStr+=(''
                        +'<a id="'+operations[i].id+'" class="btn btn-default btn-xs" href="#" data-toggle="dropdown">'
                        +'<i class="'+operations[i].iconCls+'"></i>'+operations[i].text+' <i class="fa fa-angle-down"></i></a>'
                        +'<ul class="dropdown-menu pull-right">'
                        +subsStr
                        +'</ul>'
                    );
                }else{
                    operationsStr+=('<a id="'+operations[i].id+'" class="btn btn-default btn-xs"><i class="'+operations[i].iconCls+'"></i>'+operations[i].text+' </a>');
                }
            }
            var portletStyle=options.type||"box grey-cascade";
            var html= ''
                +'<div class="portlet '+portletStyle+'" style="margin:0px !important;padding:0px !important;">'
                +'<div class="portlet-title" style="margin:0px !important;padding:0px !important;min-height:0px !important;">'
                +'<div style="padding-left:5px !important;padding-right:5px !important;" class="caption">'+(options.title||"")+'</div>'
                +'<div class="bar form-inline" style="margin:0px !important;padding:1px !important;padding-top:5px !important;padding-left:1px !important;">'
                +searchFieldsStr
                +'</div>'
                +'<div class="actions" style="margin:0px;padding:0px;padding-top:5px;padding-bottom:1px;">'
                +'<div class="btn-group">'
                +searchButtonStr
                +operationsStr
                +'</div>'
                +'</div>'
                +'</div>'
                +'<div class="portlet-body" style="margin:0px;padding:0px;">'
                +'<table class="table table-striped table-bordered table-hover table-condensed flip-content" id="'+(options.tableId||"")+'">'
                +'<thead>'
                +'<tr>'
                + (options.checked == false ? '' :
                    ('<th class="table-checkbox">'
                    +(options.displayCheckedAll == false ? '' : '<input type="checkbox" class="group-checkable" data-set="#'+options.tableId+' .checkboxes"/>')
                    +'</th>'))
                +columnsStr
                +'</tr>'
                +'</thead>'
                +'</table>'
                +'</div>'
                +'</div>';
            divObj.html(html);
            for(var key in handlerMap){
                divObj.find("#"+key).click(handlerMap[key]);
            }
            return html;
        },
        setContentForLite:function(divObj,options){
            var columnsStr='';
            var columns=options.columns||[];
            for(var i in columns){
                columnsStr+=('<th>'+columns[i].text+'</th>');
            }
            columnsStr+=('<th>操作</th>');
            var operationsStr='';
            operationsStr+=('<a id="add" class="btn btn-default btn-xs"><i class="fa fa-plus"></i>'+"新增"+' </a>');

            var portletStyle=options.type||"box grey-cascade";
            var html= ''
                +'<div class="portlet '+portletStyle+'" style="margin:0px !important;padding:0px !important;">'
                +'<div class="portlet-title" style="margin:0px !important;padding:0px !important;min-height:0px !important;">'
                +'<div class="actions" style="margin:0px;padding:0px;padding-top:5px;padding-bottom:1px;">'
                +'<div class="btn-group">'
                +operationsStr
                +'</div>'
                +'</div>'
                +'</div>'
                +'<div class="portlet-body" style="margin:0px;padding:0px;">'
                +'<table class="table table-striped table-bordered table-hover table-condensed flip-content" id="'+(options.tableId||"")+'">'
                +'<thead>'
                +'<tr>'
                +columnsStr
                +'</tr>'
                +'</thead>'
                +'</table>'
                +'</div>'
                +'</div>';
            divObj.html(html);
            return html;
        },
        setContentForTree:function(divObj,options){
            var searchButtonStr='';
            var searchFieldsStr='';
            var searchButton=options.searchButton;
            var searchFields=options.searchFields;
            if(searchButton&&searchFields&&(searchFields.length>0)){
                for(var i in searchFields){
                    searchFieldsStr+=('<input type="text" style="height:25px;" class="form-control" id="'+searchFields[i].id+'" placeholder="'+searchFields[i].text+'">');
                }
                searchButtonStr='<button id="'+searchButton.id+'" class="btn btn-default btn-xs"><i class="fa fa-search"></i>'+searchButton.text+'</button>'
            }
            var columnsStr='';
            var columns=options.columns||[];
            for(var i in columns){
                columnsStr+=('<th>'+columns[i]+'</th>');
            }
            var operationsStr='';
            var operations=options.operations||[];
            for(var i in operations){
                var subs=operations[i].subs;
                if(subs&&(subs.length>0)){
                    var subsStr='';
                    for(var j in subs){
                        if(subs[j].type=='divider'){
                            subsStr+=('<li class="divider"></li>');
                        }else{
                            subsStr+=('<li><a id="'+subs[j].id+'" '+subs[j].attr+'><i class="'+subs[j].iconCls+'"></i>'+subs[j].text+'</a></li>');
                        }
                    }
                    operationsStr+=(''
                        +'<a id="'+operations[i].id+'" class="btn btn-default btn-xs" href="#" data-toggle="dropdown">'
                        +'<i class="'+operations[i].iconCls+'"></i>'+operations[i].text+' <i class="fa fa-angle-down"></i></a>'
                        +'<ul class="dropdown-menu pull-right">'
                        +subsStr
                        +'</ul>'
                    );
                }else{
                    operationsStr+=('<a id="'+operations[i].id+'" class="btn btn-default btn-xs"><i class="'+operations[i].iconCls+'"></i>'+operations[i].text+' </a>');
                }
            }
            var portletStyle=options.type||"box grey-cascade";
            var html= ''
                +'<div class="portlet '+portletStyle+'" style="margin:0px !important;padding:0px !important;">'
                +'<div class="portlet-title" style="margin:0px !important;padding:0px !important;min-height:0px !important;">'
                +'<div class="bar form-inline" style="margin:0px !important;padding:1px !important;padding-top:5px !important;padding-left:1px !important;">'
                +searchFieldsStr
                +'</div>'
                +'<div class="actions" style="margin:0px;padding:0px;padding-top:5px;padding-bottom:1px;">'
                +'<div class="btn-group">'
                +searchButtonStr
                +operationsStr
                +'</div>'
                +'</div>'
                +'</div>'
                +'<div class="portlet-body" style="margin:0px;padding:0px;">'
                +'<table id="'+(options.tableId||"")+'">'
                +'</table>'
                +'</div>'
                +'</div>';
            divObj.html(html);
            return html;
        },
        initTableForBase:function(divObj,options){
            if(options.autoTable!=true){
                return;
            }
            var aoColumns = [];
            if(options.checkColumn) {
                aoColumns.push(options.checkColumn);
            } else {
                var checkCallback=options.checkCallback||function( data, type, full, opt ){
                        var seletedIds = opt.settings.oInit.seletedIds ? opt.settings.oInit.seletedIds.split(',') : [];
                        if(seletedIds.indexOf(data) != -1) {
                            return '<input type="checkbox" sid="'+data+'" checked class="checkboxes"/>';
                        } else {
                            return '<input type="checkbox" sid="'+data+'" class="checkboxes"/>';
                        }
                    }
                aoColumns.push({
                    "mData": "id",
                    "mRender": checkCallback
                });
            }
            for(var i in options.columns){
                aoColumns.push({
                    "mData": options.columns[i].key,
                    "mRender":options.columns[i].formatter
                });
            }
            var tableConfigs={
                "sAjaxSource": options.dataUrl,
                "seletedIds" : options.selectedIds,
                "aoColumns": aoColumns,
                "bInfo": typeof(options.isComplex) == 'undefined' ? true : options.isComplex,//页脚信息,添加 共n条结果
                "bLengthChange": typeof(options.isComplex) == 'undefined' ? true : options.isComplex,
                "fnServerParams": function ( aoData ) {
                    for(var key in options.ajaxParams){
                        aoData.push({"name":key,"value":options.ajaxParams[key]});
                    }
                    for(var i in options.searchFields){
                        aoData.push({"name":options.searchFields[i].key?options.searchFields[i].key:options.searchFields[i].id,"value":$("#"+options.searchFields[i].id).val()});
                    }
                }
            }
            for(var i in options.tableConfigs){
                tableConfigs[i]=options.tableConfigs[i];
            }
            var table = widget.grid.datatable.init("#"+options.tableId,tableConfigs);
            if(options.searchButton){
                if(options.searchButton.handler){
                    divObj.find("#"+options.searchButton.id).click(options.searchButton.handler);
                }else{
                    divObj.find("#"+options.searchButton.id).click(function(){
                        table.fnPageChange( 'first' );
                    });
                }
            }
            for(var i in options.columns){
                if(options.columns[i].events){
                    for(var key in options.columns[i].events){
                        var strArray=key.split(" ");
                        divObj.on(strArray[0],strArray[1],options.columns[i].events[key]);
                    }
                }
            }
            return table;
        },
        initTableForTree:function(divObj,options){
            var table=divObj.find("#"+options.tableId);
            var cols=(options.checkbox==true?[{field: 'ck',checkbox: true}]:[]);
            for(var i in options.columns){
                cols.push({
                    field:options.columns[i].key,
                    title:options.columns[i].text,
                    events:options.columns[i].events,
                    formatter:options.columns[i].formatter
                })
            }
            var sEcho = 1;
            var curRow;
            table.bootstrapTable({
                url: options.dataUrl,
                responseHandler: function(res) {
                    return res||{
                            "total": res.length,//总页数
                            "rows": res   //数据
                        };
                },
                locale:"zh-cn",
                striped: true,
                sidePagination: "server",
                smartDisplay: false,
                search:!true,
                showPaginationDetail:false,
                showRefresh:!true,
                pagination:!true,
                checkboxHeader:false,
                onCheck:options.onCheck,
                onUncheck:options.onUncheck,
                queryParams : function() {
                    var param = {
                    }
                    for(var key in options.ajaxParams){
                        param[key]=options.ajaxParams[key];
                    }
                    for(var i in options.searchFields){
                        var searchId=options.searchFields[i]["id"];
                        param[searchId]=$("input[id="+searchId+"]").val();
                    }
                    return param;
                },
                idField: 'id',
                parentIdField: 'parentId',
                columns: cols,
                onClickRow: function (row, $element) {
                    curRow = row;
                },
                treeShowField: options.treeField||'category',
                onLoadSuccess: function(data) {
                    table.treegrid({
                        treeColumn: 1,
                        onChange: function() {
                            table.bootstrapTable('resetWidth');
                        }
                    });
                }
            });
            for(var i in options.operations){
                if(options.operations[i].handler){
                    divObj.find("#"+options.operations[i].id).click(options.operations[i].handler);
                }
            }
            if(options.searchButton){
                if(options.searchButton.handler){
                    divObj.find("#"+options.searchButton.id).click(options.searchButton.handler);
                }else{
                    divObj.find("#"+options.searchButton.id).click(function(){
                        table.fnPageChange( 'first' );
                    });
                }
            }
            return table;
        },
        initTableForLite:function(divObj,options){
            var isEditing=false;
            var editingRow;
            var isNew=true;
            var aoColumns=[];
            for(var i in options.columns){
                aoColumns.push({
                    "mData": options.columns[i].key
                });
            }
            aoColumns.push({
                "sWidth":"100px",
                "mData": "id",
                "mRender" : function ( data, type, full ) {
                    btns = '';
                    btns+='<a href="#" id="edit" tid='+data+' data-toggle="tooltip" title="编辑">';
                    btns+='<i class="fa fa-wrench"></i>';
                    btns+='</a>&nbsp';

                    btns+='<a href="#" id="delete" tid='+data+' data-toggle="tooltip" title="删除">';
                    btns+='<i class="fa fa-trash-o"></i>';
                    btns+='</a>&nbsp';

                    return btns;
                }
            });
            var table = widget.grid.datatable.init("#"+options.tableId,{
                ajax: {
                    url: options.dataUrl,
                    type: 'POST',
                    // 传给服务器的数据，可以添加我们自己的查询参数
                    data: function (param) {
                        for(var key in options.ajaxParams){
                            param[key]= options.ajaxParams[key];
                        }
                        return param;
                    },
                    //用于处理服务器端返回的数据。 dataSrc是DataTable特有的
                    dataSrc: function (res) {
                        return res;
                    }
                },
                bLengthChange:false,
                bPaginate:false,
                bInfo:false,
                bSort:false,
                bFilter:false,
                bServerSide:false,
                "aoColumns": aoColumns
            });
            var resetRow=function(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                for(var i in options.columns){
                    oTable.fnUpdate(aData[options.columns[i].key], nRow, i, false);
                }
                $("td[style]",nRow).css("background-color","");
                oTable.fnDraw();
            };
            var editRow=function(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);
                for(var i in options.columns){
                    jqTds[i].innerHTML = options.columns[i].editHtml
                }
                for(var key in aData){
                    $(nRow).find("input[name="+key+"]").val(aData[key]);
                }
                var btns = '';
                btns+='<a href="#" id="save" data-toggle="tooltip" title="保存">';
                btns+='<i class="fa fa-save"></i>';
                btns+='</a>&nbsp';
                btns+='<a href="#" id="cancel" data-toggle="tooltip" title="取消">';
                btns+='<i class="fa fa-reply"></i>';
                btns+='</a>&nbsp';
                jqTds[jqTds.length-1].innerHTML = btns
            };
            divObj.on("click","#add",function(e){
                if(isEditing==false){
                    var aiNew = table.fnAddData({id:'',model:''});
                    var nRow = table.fnGetNodes(aiNew[0]);
                    editRow(table,nRow);
                    isEditing=true;
                    isNew=true;
                }
            });
            divObj.on("click","#edit",function(e){
                if(isEditing==false){
                    var nRow = $(this).parents('tr')[0];
                    editRow(table,nRow);
                    isEditing=true;
                    isNew=false;
                }
            });
            divObj.on("click","#cancel",function(e){
                if(isEditing==true){
                    if(isNew==true){
                        var nRow = $(this).parents('tr')[0];
                        table.fnDeleteRow(nRow);
                        isEditing=false;
                    }else{
                        var nRow = $(this).parents('tr')[0];
                        resetRow(table,nRow);
                        isEditing=false;
                    }
                }
            });
            divObj.on("click","#delete",function(e){
                if(isEditing==false){
                    var nRow = $(this).parents('tr')[0];
                    var aData = table.fnGetData(nRow);
                    var params={ids:aData.id};
                    for(var key in options.ajaxParams){
                        params[key]= options.ajaxParams[key];
                    }
                    $.getJSON(options.deleteUrl,params,function(retMsg) {
                        if(retMsg.isOk) {
                            table.DataTable().ajax.reload();
                            toastr.info("操作成功！");
                        } else {
                            frame.Modal.init({type:'error',text:retMsg.message}).show();
                        }
                    });
                }
            });
            divObj.on("click","#save",function(e){
                if(isEditing==true){
                    var nRow = $(this).parents('tr')[0];
                    var aData = table.fnGetData(nRow);
                    var params={};
                    for(var key in aData){
                        params[key]=aData[key];
                    }
                    for(var key in options.ajaxParams){
                        params[key]= options.ajaxParams[key];
                    }
                    for(var i in options.columns){
                        var key=options.columns[i].key;
                        params[key]=$(nRow).find("input[name="+key+"]").val();
                    }
                    $.getJSON(options.saveUrl,params,function(retMsg) {
                        if(retMsg.isOk) {
                            table.DataTable().ajax.reload();
                            isEditing=false;
                            toastr.info("操作成功！");
                        } else {
                            frame.Modal.init({type:'error',text:retMsg.message}).show();
                        }
                    });
                }
            });
            return table;
        }
    };
}();