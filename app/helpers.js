define([
    'underscore',
    'jquery',
    'jqgrid'

], function(_, $, Grid) {

    var Helpers = {};

    Helpers.getDefaultGridOptions = function(url, fields) {

        var colNames = [];
        var colModel = [];
        for (var field in fields) {
            var fieldDesc = fields[field];
            colNames.push(_.isUndefined(fieldDesc.name)? field : fieldDesc.name);
            colModel.push({
                name: field,
                index:field,
                jsonmap:field
            });
        }

        var options = {
          //  url:url,
            datatype:'json',
            mtype:'GET',
            colNames:colNames,
            colModel:colModel,
            jsonReader:{
                repeatitems:false,
                id:"id",
                root:function (obj) {
                    return obj;
                },
                page:function (obj) {
                    return 1;
                },
                total:function (obj) {
                    return 1;
                },
                records:function (obj) {
                    return obj.length;
                }
            },
            width: 570,
            rowNum:10,
            rowList:[10, 20, 30],
            sortname:'name',
            sortorder:'desc',
            viewrecords:false

        };

        return options;
    };

    Helpers.showGrid = function(grid_container_id, url, fields, opts) {
        var grid_options = this.getDefaultGridOptions(url, fields);

        if (!_.isUndefined(opts)) {
            grid_options = $.extend(grid_options, opts);
        }

        $(grid_container_id).jqGrid("GridUnload");
        $(grid_container_id).jqGrid(grid_options);
    };

    Helpers.setGridData = function(grid_container_id, data) {
        $(grid_container_id).jqGrid('clearGridData', {});
        $(grid_container_id).jqGrid('setGridParam', {data: data}).trigger('reloadGrid');
    };

    Helpers.getSelectedRowData = function (grid_container_id) {
        var rowId = $(grid_container_id).jqGrid('getGridParam', 'selrow');
        if (rowId !== null) {
           return $(grid_container_id).jqGrid('getRowData', rowId);
        }

        return null;
    };

    Helpers.renderModel = function(container_id, model) {
        for (var attr in model.attributes) {
            var selector = [container_id, " input[field='", attr, "']"].join('');
            $(selector).val(model.get(attr));
        }
    };

    Helpers.handleInputChanges = function(event, model) {
        var field = $(event.target).attr("field");
        if (!_.isUndefined(field) && model.has(field)) {
            model.set(field, $(event.target).val());
        }
    };

    Helpers.preventTabChangeFocus = function(textarea_id) {
        $(textarea_id).keydown(function(objEvent) {
            if (objEvent.keyCode == 9) {  //tab pressed
                var identHolder = "    ";
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + identHolder + this.value.substring(endPos,this.value.length);
                this.focus();
                this.selectionStart = startPos + identHolder.length;
                this.selectionEnd = startPos + identHolder.length;
                this.scrollTop = scrollTop;

                objEvent.preventDefault(); // stops its action
            }
        });

    };


    return Helpers;
});