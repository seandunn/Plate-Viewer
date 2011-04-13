// *** PLATE VIEWER CODE ***
$(function() {
  
  // ========
  // = Well =
  // ========
  window.Well = Backbone.Model.extend({
    name: "well",
    
    initialize: function(args) {
      this.maybeUnwrap(args);
    }
  });

  window.WellList = Backbone.Collection.extend({
    model: Well
  });



  window.WellView = Backbone.View.extend({
    
    initialize: function() {
      _.bind(this, 'render');
      this.el = $('#well_' + this.model.get('map'));
      this.model.view = this;
      
    },
    
    render: function() {
      $(this.el).html(this.model.get('concentration'));
    }
    
  });
  
  // =========
  // = Plate =
  // =========
  window.Plate = Backbone.Model.extend({
    name: "plate",
    
    loadWells: function() {
      var wells = new window.WellList;
      wells.refresh(this.get('wells'));
      this.wells = wells;
    },

    initialize: function(args) {
      this.maybeUnwrap(args);
      this.loadWells();
    }
  });
  
  window.PlateView = Backbone.View.extend({
    el: $('table.plate'),
    
    events: {
      "click #conc": "showConcentrations"
    },
    
    addModeButtons: function() {
      $(this.el).append(
        '<input type="submit" value="Concentration" id= "conc" class="button concentration" name="show-concentration" />'
      );
    },
    
    initialize: function() {
      _.bind(this, "render");
      this.refreshWells();
    },
    
    refreshWell: function(well) {
      var view = new WellView({model: well});
      this.$(view.el).html(well.get('map'));
    },
    
    refreshWells: function() {
      this.model.wells.each(this.refreshWell);
    },
    
    render: function() {
      $(this.el).html(this.template(this.model.get('concentration')));
    },
    
    showConcentrations: function() {
      // Do something...
      // $('div.well').html('!?*#/!');
    }
  });
  
  window.current_plate = new Plate(plate_json);
  window.plateview     = new PlateView({model: window.current_plate});
  
  var all_maps = "";
  window.current_plate.wells.each(function(map_value){
    all_maps + map_value;
  });
  
  // alert(all_maps.length);
});
