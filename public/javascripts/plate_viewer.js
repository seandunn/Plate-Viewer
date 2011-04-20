// *** PLATE VIEWER CODE ***
$(window).load(function() {
  
  // Control Buttons
  $(".ui-buttonset").buttonset();
  
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
    
    detailsTemplate: _.template($('#details-template').html()),
    
    initialize: function() {
      _.bind(this, 'render');
      this.el = $('#well_' + this.model.get('map'));
      this.model.view = this;
      this.setUpDetails();
      this.setUpToolTip();
    },
    
    render: function() {
    this.removeColours();
    this.setValue(this.model.get('map'));
    this.el.addClass('unknown-value');
    },
    
    removeColours: function() {
      this.el.removeClass('red').
              removeClass('orange').
              removeClass('green').
              removeClass('unknown-value');
    },
    
    setUpToolTip: function() {
      this.el.attr('title',
        'Sample: ' + this.model.get('sample_name') +
        '<br/>Map: ' + this.model.get('map'));
    },
    
    setUpDetails: function() {
      debugger;
      $('#container').add(
        this.detailsTemplate({
                  map: this.model.get('map'),
          sample_name: this.model.get('sample_name')
        })
      );
    },
    
    setValue: function(value) {
      this.el.html((value ? value : "?"));
    },
    
    showConcentration: function() {
      var conc = this.model.get('concentration');
      
      this.removeColours();
      
      if      (conc === null) { this.el.addClass('unknown-value'); }
      else if (conc < 50.0)   { this.el.addClass('red');    }
      else if (conc < 60.0)   { this.el.addClass('orange'); }
      else if (conc > 60.0)   { this.el.addClass('green');  }
      else                    { this.el.addClass('unknown-value'); }
      
      this.setValue(conc);
    },
    
    showGelQc: function() {
     var gelPass = this.model.get('gel_pass');
     this.removeColours();
     
     if      (gelPass === null)      { this.el.addClass('unknown-value'); }
     else if (gelPass == 'Fail')     { this.el.addClass("red"); }
     else if (gelPass == 'Degraded') { this.el.addClass('orange'); }
     else if (gelPass == 'OK')       { this.el.addClass("green"); }
     else                            { this.el.addClass('unknown-value'); }
     
     this.setValue(gelPass);
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
  

  window.PlateControlView = Backbone.View.extend({
    el: $('#plate-control'),
    
    events: {
      "click #showLocation": "showLocations",
      "click #showConcentration": "showConcentrations",
      "click #showGelQc": "showGelQc"
    },
    
    initialize: function() {
      _.bind(this, "render");
      this.initializeWellViews();
      this.showLocations();
    },
    
    initializeWellViews: function() {
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
    },
    
    showGelQc: function() {
     this.render(
       function(well) { well.view.showGelQc(); }
     ); 
    }
  });
  

  window.current_plate    = new Plate(plate_json);
  window.plateControlView = new PlateControlView({model: window.current_plate});
  $('.well').tooltip({
  
   // use the built-in fadeIn/fadeOut effect
    effect: "fade",
    opacity: 1,
    delay: 0,
    predelay: 800
  
  });
  
  $(".well[rel]").overlay();

  
});
