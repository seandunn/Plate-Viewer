// *** PLATE VIEWER CODE ***
$(window).load(function() {
  
  // Control Buttons
  $(".ui-buttonset").buttonset();
  
  // ========
  // = Aliquot =
  // ========
  window.Aliquot = Backbone.Model.extend({
    name: "aliquot",
    
    initialize: function(args) {
      this.maybeUnwrap(args);
    }
  });

  window.AliquotList = Backbone.Collection.extend({
    model: Aliquot
  });



  window.AliquotView = Backbone.View.extend({
    
    detailsTemplate: _.template($('#details-template').html()),
    
    initialize: function() {
      _.bind(this, 'render');
      this.createAliqlot();
      this.model.view = this;
      this.setUpDetails();
      this.setUpToolTip();
    },
    
    createAliqlot: function() {
      var newAliquot = document.createElement('div');
      $('#well_' + this.model.get('map')).html(newAliquot);
      
      $(newAliquot).attr('id','aliquot_' + this.model.get('map'));
      $(newAliquot).addClass('aliquot');
      $(newAliquot).attr('rel','#details_'  + this.model.get('map'));
      this.el = $(newAliquot);
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
      $('#main-content').append(
        this.detailsTemplate({
                      map: this.model.get('map'),
              sample_name: this.model.get('sample_name'),
           current_volume: this.model.get('current_volumen'),
            concentration: this.model.get('concentration'),
            picked_volume: this.model.get('picked_volume'),
            buffer_volume: this.model.get('buffer_volume'),
         requested_volume: this.model.get('requested_volume'),
                pico_pass: this.model.get('pico_pass'),
                 gel_pass: this.model.get('gel_pass'),
               created_at: this.model.get('created_at'),
               updated_at: this.model.get('updated_at'),
                     uuid: this.model.get('uuid')
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
      this.loadAliquots();
    },

    loadAliquots: function() {
      var aliquots = new window.AliquotList;
      aliquots.refresh(this.get('aliquots'));
      this.aliquots = aliquots;
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
      this.initializeAliquotViews();
      this.showLocations();
    },
    
    initializeAliquotViews: function() {
      this.model.aliquots.each(this.makeAliquotView);
    },
    
    makeAliquotView: function(aliquot) {
      aliquot.view = new AliquotView({model: aliquot});
    },
    
    render: function(showFunction) {
      this.model.aliquots.each(showFunction);
    },
    
    showLocations: function() {
      this.render(
        function(aliquot) { aliquot.view.render(); }
      );
    },
    
    showConcentrations: function() {
      this.render(
        function(aliquot) { aliquot.view.showConcentration(); }
      );
    },
    
    showGelQc: function() {
     this.render(
       function(aliquot) { aliquot.view.showGelQc(); }
     ); 
    }
  });
  

  window.current_plate    = new Plate(plate_json);
  window.plateControlView = new PlateControlView({model: window.current_plate});
  $('.aliquot').tooltip({
    
     // use the built-in fadeIn/fadeOut effect
      effect: "slide",
      opacity: 1,
      delay: 0,
      predelay: 500
    
    }).dynamic({ bottom: { direction: 'down', bounce: true } });
  
  $(".aliquot[rel]").overlay();

  
});
