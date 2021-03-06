define([

  "helpers",
  "backbone",
  "plugins/backbone.marionette"

], function (Helpers, Backbone, Marionette) {

  var view = Marionette.ItemView.extend({
    template:"general",

    initialize:function (attributes) {
      debug("Initialize view general");
      this.model = attributes.model;

      var view = this;
      this.model.on('change', function () {
        view.render();
      });
    },


    onShow:function () {
      $("#confirmation_code").text(Helpers.generateCode());
      $("#clone_name").val(this.model.get("name") + "_clone_" + (new Date().getTime()));
    },

    events:{

      'click #renew_access_token_btn':'renewAccessToken',
      'click #save_application_description_btn':'onSaveApplicationDescriptionBtn',
      'click #delete_application_btn':'onDeleteApplicationBtn',
      'click #clone_application_btn':'onCloneApplicationBtn'

    },

    renewAccessToken:function () {
      var that = this;
      this.model.renewAccessToken();
    },

    onSaveApplicationDescriptionBtn:function () {

      this.model.set("description", $("#application_description").val());
      this.model.put(function (err, model) {
        debug("Description save result");
      });
    },

    onDeleteApplicationBtn:function () {
      debug("removing application!!");
      if ($("#confirmation_code").text() == $("#delete_application_confirmation_code").val()) {
        this.model.remove(function (err, result) {
          debug("application remove result", err, result);
          Backbone.history.navigate("/", {trigger:true});
        });

      }
    },

    onCloneApplicationBtn:function () {
      debug("cloning application");
      var opts = {
        name:$("#clone_name").val(),
        clone_instances:$("#clone_instances_flag").is(":checked")
      };

      debug("cloning opts: ", opts);
      this.model.clone(opts, function (err, result) {
        debug("result of cloning application: ", err, result);
        if (err === null) {
          debug("go to new application");
          Backbone.history.navigate('app/' + result.id + '/general', {trigger: true});
        } else if (result.status == 409) {
          $("#cloning_error").text("Application with name: \"" + opts.name + "\" already exists");
        }
      });
    }
  });


  return view;
});