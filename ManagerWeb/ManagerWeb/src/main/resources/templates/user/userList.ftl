<div id="userList"></div>
<div id="userAddModal"></div>
<script src="${request.contextPath}/js/widget/grid/BaseDataTable.js" type="text/javascript"></script>
<script type="text/javascript">

    /*
    * 初始化相关参数
    * */
    var userOptions = {
        tid: "#userBaseInfo",
        addTid: "#userAddModal",
        editItemId: "#userEdit",
        addItemId: "#userAdd",
        deleteItemId: "#userDelete",
        searchId: "#searchUser",
        formId: "#userAddForm",
        searchUrl: ctx + "/user/searchUserList",
        deleteUrl: ctx + "/user/deleteUser",
        updateUrl: ctx + "/user/saveOrUpdateUser",
        queryUrl: ctx + "/user/getUser"
    };

    frame.List.init({
        id: "userList",
        type: "light",
        tableId: userOptions.tid.substr(1),
        columns: ["姓名", "电话", "地址","角色"],
        operations: [
//            {text: "新增", iconCls: "fa fa-pencil", id: "userAdd"},
            {
                id: "", text: "操作", iconCls: "fa fa-cogs", subs: [
                {text: "编辑", iconCls: "fa fa-pencil", id: "userEdit"},
                {text: "删除", iconCls: "fa fa-trash-o", id: "userDelete"}
            ]
            }],
        searchButton: {id: userOptions.searchId.substr(1), text: "查询"},
        searchFields: [{id: "name", text: "账号"}]
    });

    userOptions.initTableOptions = {
        "sAjaxSource": userOptions.searchUrl,
        "aoColumns": [{
            "mData": "id",
            "mRender": function (data, type, full) {
                checkbox = '<input type="checkbox" sid="' + data + '" class="checkboxes"/>';
                return checkbox;
            }
        },
            {"mData": "name"},
            {"mData": "phoneNumber"},
            {"mData": "address"},
            {"mData": "roleName"}
        ],
        "fnServerParams": function (aoData) {
            aoData.push({"name": "name", "value": $("#name").val()})
        }
    };

    /*
    * 表单基本信息
    * */
    var commonOptions = {
        titleText: "用户信息",
        fields: [
            {id: 'id', label: 'id', icon: 'fa-user', type: 'hidden'},
            {id: 'name', lcol: 2, col: 4, label: '姓名', required: true, maxlength: 20, type: 'text', horizontal: true},
            {id: 'phoneNumber', lcol: 2, col: 4, label: '电话', type: 'text', maxlength: 12, horizontal: true},
            {id: 'address', lcol: 2, col: 4, label: '地址', maxlength: 50, horizontal: true, type: 'text'},
            {id: 'roleCode', lcol: 2, col: 4, label: '角色', required: true, type: 'drop',url:'${request.contextPath}'+"/dictCode/getEnumByCategory?category=RoleEnum",maxlength: 50, horizontal: true}
        ]
    };

    /*
    * 添加表单
    * */
    var addFormOptions = {
        color: "green",
        subTitleText: "新增",
        submitUrl: userOptions.updateUrl,
        submitCallback: function () {
            widget.grid.datatable.refresh(userOptions.tid);
            $(userOptions.addTid).remove();
        }
    };

    $.extend(addFormOptions, commonOptions);

    /*
    * 添加表单
    * */
    var editFormOptions = {
        color: "red",
        subTitleText: "编辑",
        submitUrl: userOptions.updateUrl,
        submitCallback: function () {
            widget.grid.datatable.refresh(userOptions.tid);
            $(userOptions.addTid).remove();
        }
    };

    $.extend(editFormOptions, commonOptions);

    userOptions.addOptions = {
        id: userOptions.addTid.substr(1),
        showTitle: false,
        showTail: false,
        html: "<div id='userAddForm'></div>"
    };

    userOptions.editOptions = {
        id: userOptions.addTid.substr(1),
        showTitle: false,
        showTail: false,
        html: "<div id='userAddForm'></div>",
        onOpen: $.proxy(function () {
            if ($(userOptions.tid).data('baseDataTable').getForm()) {
                var cks = widget.grid.datatable.getCheckedIds(userOptions.tid);
                frame.Form.loadData($(userOptions.tid).data('baseDataTable').getForm(), userOptions.queryUrl, "id=" + cks.ids, function (response) {
                    if (response && response.isOk) {
                        $(userOptions.tid).data('baseDataTable').getForm().setData(response.jsonData);
                    }
                })
            }
        }, userOptions)
    };

    userOptions.addFormOptions = addFormOptions;
    userOptions.editFormOptions = editFormOptions;
    $(userOptions.tid).BaseDataTable(userOptions);
</script>