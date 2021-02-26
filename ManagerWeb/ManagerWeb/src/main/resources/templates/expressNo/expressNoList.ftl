<div id="expressNoList"></div>
<div id="expressNoAddModal"></div>
<div id="showPicModal"></div>
<script src="${request.contextPath}/js/widget/grid/BaseDataTable.js" type="text/javascript"></script>
<script type="text/javascript">
    /*
    * 初始化相关参数
    * */
    var expressNoOptions = {
        tid: "#expressNoBaseInfo",
        addTid: "#expressNoAddModal",
        editItemId: "#expressNoEdit",
        addItemId: "#expressNoAdd",
        deleteItemId: "#expressNoDelete",
        searchId: "#searchExpressNo",
        formId: "#expressNoAddForm",
        searchUrl: ctx + "/expressNo/searchExpressList",
        deleteUrl: ctx + "/expressNo/deleteExpressNo",
        updateUrl: ctx + "/expressNo/saveOrUpdateExpressNo",
        queryUrl: ctx + "/expressNo/getExpressNo"
    };

    frame.List.init({
        id: "expressNoList",
        type: "light",
        tableId: expressNoOptions.tid.substr(1),
        columns: ["编号", "收货人", "快递员", "二维码"],
        operations: [
            {text: "新增", iconCls: "fa fa-pencil", id: "expressNoAdd"},
            {
                id: "", text: "操作", iconCls: "fa fa-cogs", subs: [
                {text: "编辑", iconCls: "fa fa-pencil", id: "expressNoEdit"},
                {text: "删除", iconCls: "fa fa-trash-o", id: "expressNoDelete"}
            ]
            }],
        searchButton: {id: expressNoOptions.searchId.substr(1), text: "查询"},
        searchFields: [{id: "num", text: "编号"}]
    });

    expressNoOptions.initTableOptions = {
        "sAjaxSource": expressNoOptions.searchUrl,
        "aoColumns": [{
            "mData": "id",
            "mRender": function (data, type, full) {
                checkbox = '<input type="checkbox" sid="' + data + '" class="checkboxes"/>';
                return checkbox;
            }
        },
            {"mData": "num"},
            {"mData": "buyerName"},
            {"mData": "messagerName"},
            {
                "mData": "id",
                "mRender": function (data, type, full) {
                    var btns = '';
                    btns += '<a href="#" class="expressQRCode" tid=' + data + ' data-toggle="tooltip" title="查看二维码">';
                    btns += '<i class="fa fa-history"></i>';
                    btns += '</a>&nbsp';
                    return btns;
                }
            }
        ],
        "fnServerParams": function (aoData) {
            aoData.push({"name": "num", "value": $("#num").val()})
        }
    };

    /*
    * 表单基本信息
    * */
    var commonOptions = {
        titleText: "快递单号信息",
        fields: [
            {id: 'id', label: 'id', icon: 'fa-user', type: 'hidden'},
            {id: 'num', lcol: 2, col: 4, label: '编号', required: true, maxlength: 50, type: 'text', horizontal: true},
            {
                id: 'messager',
                lcol: 2,
                col: 4,
                label: '快递员',
                required: true,
                type: 'drop',
                url: '${request.contextPath}' + "/user/getUserListByRoleCode?roleCode=messager",
                horizontal: true
            },
            {
                id: 'buyer',
                lcol: 2,
                col: 4,
                label: '收货人',
                type: 'drop',
                required: true,
                url: '${request.contextPath}' + "/user/getUserListByRoleCode?roleCode=buyer",
                maxlength: 50,
                horizontal: true
            }
        ]
    };

    /*
    * 添加表单
    * */
    var addFormOptions = {
        color: "green",
        subTitleText: "新增",
        submitUrl: expressNoOptions.updateUrl,
        submitCallback: function () {
            widget.grid.datatable.refresh(expressNoOptions.tid);
            $(expressNoOptions.addTid).remove();
        }
    };

    $.extend(addFormOptions, commonOptions);

    /*
    * 添加表单
    * */
    var editFormOptions = {
        color: "red",
        subTitleText: "编辑",
        submitUrl: expressNoOptions.updateUrl,
        submitCallback: function () {
            widget.grid.datatable.refresh(expressNoOptions.tid);
            $(expressNoOptions.addTid).remove();
        }
    };

    $.extend(editFormOptions, commonOptions);

    expressNoOptions.addOptions = {
        id: expressNoOptions.addTid.substr(1),
        showTitle: false,
        showTail: false,
        html: "<div id='expressNoAddForm'></div>"
    };

    expressNoOptions.editOptions = {
        id: expressNoOptions.addTid.substr(1),
        showTitle: false,
        showTail: false,
        html: "<div id='expressNoAddForm'></div>",
        onOpen: $.proxy(function () {
            if ($(expressNoOptions.tid).data('baseDataTable').getForm()) {
                var cks = widget.grid.datatable.getCheckedIds(expressNoOptions.tid);
                frame.Form.loadData($(expressNoOptions.tid).data('baseDataTable').getForm(), expressNoOptions.queryUrl, "id=" + cks.ids, function (response) {
                    if (response && response.isOk) {
                        $(expressNoOptions.tid).data('baseDataTable').getForm().setData(response.jsonData);
                    }
                })
            }
        }, expressNoOptions)
    };

    expressNoOptions.addFormOptions = addFormOptions;
    expressNoOptions.editFormOptions = editFormOptions;

    $(expressNoOptions.tid).BaseDataTable(expressNoOptions);

    // 查看计划编辑历史

    $(expressNoOptions.tid).on('click', '.expressQRCode', function (e) {
        var expressNoId = $(e.currentTarget).attr('tid');
        $.ajax({
            url: ctx + "/generateQRCode",
            type: "POST",
            data: {expressNoId: expressNoId},
            success: function (response) {
                if (response && response.isOk == true) {
                    console.info(response);
                    var picPath = '${request.contextPath}' + response.jsonData;
                    var divObj = $("#showPicModal");
                    divObj.html(''
                            + '<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">'
                            + '<div class="modal-dialog modal-lg">'
                            + '<div class="modal-content">'
                            + '<div class="modal-header ">'
                            + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>'
                            + '<h2 class="modal-title">二维码</h2>'
                            + '<div class="modal-body" style="padding:5px">'
                                +'<div class="row">'
                                +'<div class="col-md-12 text-center">'
                                +'<div class="portlet box">'
                                +'<div class="portlet-title">'
                                +'</div>'
                                +'<div class="portlet-body">'
                                    +'<img src="'+picPath+'" style="widows:300px;height: 300px;"></img>'
                                +'</div>'
                                +'</div>'
                                +'</div>'
                                +'</div>'
                            + '</div>'
                            + '</div>'
                            + '</div>'
                            + '</div>');
                    var modalObj=$(divObj.children());
                    modalObj.modal("show");
                } else {
                    toastr.info("查看失败！");
                }
            }
        })
    });
</script>