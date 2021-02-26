<input type="hidden" id="ctx" value="${request.contextPath}">

<script src="${request.contextPath}/assets/global/plugins/jquery.min.js" type="text/javascript"></script>

<!-- jquery-easyui -->
<script src="${request.contextPath}/js/lib/jquery.easyui.min.js"></script>
<script src="${request.contextPath}/js/lib/recorder/recorder.js"></script>
<!-- echart -->
<script src="${request.contextPath}/js/lib/echarts/echarts.js"></script>

<script src="${request.contextPath}/assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>

<script src="${request.contextPath}/assets/global/plugins/select2/select2.min.js" type="text/javascript" ></script>
<script src="${request.contextPath}/assets/global/plugins/datatables/media/js/jquery.dataTables.js" type="text/javascript" ></script>
<script src="${request.contextPath}/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js" type="text/javascript" ></script>
<script src="${request.contextPath}/assets/global/plugins/bootstrap-toastr/toastr.js" type="text/javascript" ></script>
<script src="${request.contextPath}/assets/global/plugins/jquery.pulsate.min.js" type="text/javascript" ></script>


<script src="${request.contextPath}/assets/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/admin/layout/scripts/layout.js" type="text/javascript"></script>

<script src="${request.contextPath}/assets/admin/layout/scripts/quick-sidebar.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/admin/layout/scripts/demo.js" type="text/javascript"></script>

<script src="${request.contextPath}/js/frame/navigation.js"></script>
<script src="${request.contextPath}/js/frame/modal.js"></script>
<script src="${request.contextPath}/js/utils/DateUtils.js"></script>
<script src="${request.contextPath}/js/frame/form.js"></script>
<script src="${request.contextPath}/js/frame/list.js"></script>
<script src="${request.contextPath}/js/frame/chat.js"></script>
<script src="${request.contextPath}/js/frame/menu.js"></script>
<script src="${request.contextPath}/js/frame/context.js"></script>
<script src="${request.contextPath}/js/frame/uuid.js"></script>

<script src="${request.contextPath}/js/frame/pluginSettings.js"></script>
<script src="${request.contextPath}/js/widget/grid/datatable.js"></script>

<script src="${request.contextPath}/assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>

<script src="${request.contextPath}/assets/global/plugins/fuelux/js/spinner.js" type="text/javascript" ></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js" type="text/javascript" ></script>
<script src="${request.contextPath}/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js" type="text/javascript" ></script>
<!-- tree grid -->
<script src="${request.contextPath}/assets/global/plugins/jquery-treegrid/jquery.treegrid.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-treegrid/jquery.treegrid.bootstrap3.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-treegrid/extension/jquery.treegrid.extension.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/global/plugins/bootstrap-table/js/bootstrap-table.js"></script>
<script src="${request.contextPath}/assets/global/plugins/bootstrap-table/extensions/treegrid/js/bootstrap-table-treegrid.js"></script>

<#-- form validate-->
<script type="text/javascript" src="${request.contextPath}/assets/global/plugins/jquery-validation/js/jquery.validate.js"></script>
<script type="text/javascript" src="${request.contextPath}/assets/global/plugins/jquery-validation/js/localization/messages_zh.js"></script>

<#-- file upload-->
<script src="${request.contextPath}/assets/global/plugins/jquery-file-upload/js/vendor/jquery.ui.widget.js"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-file-upload/js/vendor/tmpl.min.js"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-file-upload/js/vendor/load-image.min.js"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-file-upload/js/vendor/canvas-to-blob.min.js"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-file-upload/blueimp-gallery/jquery.blueimp-gallery.min.js"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-file-upload/js/jquery.iframe-transport.js"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-file-upload/js/jquery.fileupload.js"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-process.js"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-image.js"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-audio.js"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-video.js"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-validate.js"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-file-upload/js/jquery.fileupload-ui.js"></script>

<script src="${request.contextPath}/assets/admin/pages/scripts/form-fileupload.js"></script>

<#-- 温度计 -->
<script type="text/javascript" src="${request.contextPath}/js/lib/jquery.tempgauge.js"></script>

<script>
    var ctx = $("#ctx")[0].value;
    var global = {};
    $(document).ready(function() {
        PluginSettings.toastrInit();
        var withoutFrame = ${(withoutFrame!false)?c};
        if(!withoutFrame) {
            Metronic.init();
            Layout.init();
            Demo.init();
            $.getJSON(ctx + "/menu/usermenu",function(json) {
                frame.Navigation.init({
                    id:"page-sider",
                    relTabId:'content-tab',
                    dataArray:json
                });
            });
        }
        //禁掉右键事件
        $(document).bind("contextmenu",function () {
            return false;
        });
    });
    /**
     * 动态加载JS
     * @param {string} url 脚本地址
     * @param {function} callback  回调函数
     */
    function dynamicLoadJs(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        if(typeof(callback)=='function'){
            script.onload = script.onreadystatechange = function () {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete"){
                    callback();
                    script.onload = script.onreadystatechange = null;
                }
            };
        }
        head.appendChild(script);
    }
    /**
     * 动态加载CSS
     * @param {string} url 样式地址
     */
    function dynamicLoadCss(url) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.type='text/css';
        link.rel = 'stylesheet';
        link.href = url;
        head.appendChild(link);
    }
</script>