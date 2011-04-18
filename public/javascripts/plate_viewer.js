// *** PLATE VIEWER CODE ***
$(function() {
  
  // Button
  $("#button").button();
  $("#radioset").buttonset();
  
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
      this.el.html(this.model.get('map'));
    },
    
    showConcentration: function() {
      this.el.html(this.model.get('concentration'));
    }
    
  });
  
  // =========
  // = Plate =
  // =========
  window.Plate = Backbone.Model.extend({
    name: "plate",
    
    initialize: function(args) {
      this.maybeUnwrap(args);
      this.loadWells();
    },

    loadWells: function() {
      var wells = new window.WellList;
      wells.refresh(this.get('wells'));
      this.wells = wells;
    }

  });
  

  window.PlateView = Backbone.View.extend({
    el: $('table.plate'),
    
    events: {
      "click": "showConcentrations"
    },
    
    addModeButtons: function() {
      $(this.el).append(
        '<input type="submit" value="Concentration" id= "conc" class="button concentration" name="show-concentration" />'
      );
    },
    
    initialize: function() {
      _.bind(this, "render");
      this.initializeWells();
      this.showLocations();
    },
    
    initializeWells: function() {
      this.model.wells.each(this.makeWellView);
    },
    
    makeWellView: function(well) {
      well.view = new WellView({model: well});
    },
    
    render: function(showFunction) {
      this.model.wells.each(showFunction);
    },
    
    showLocations: function() {
      this.render(
        function(well) { well.view.render(); }
      );
    },
    
    showConcentrations: function() {
      this.render(
        function(well) { well.view.showConcentration(); }
      );
    }
  });
  

  window.current_plate = new Plate(plate_json);
  window.plateview     = new PlateView({model: window.current_plate});

  
});
