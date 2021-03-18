define(['dojo/_base/declare', 'jimu/BaseWidget', "esri/tasks/QueryTask", "esri/tasks/query", 'dojo/_base/lang', "esri/SpatialReference", "esri/graphic", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color"], function (declare, BaseWidget, QueryTask, Query, lang, SpatialReference, Graphic, SimpleFillSymbol, SimpleMarkerSymbol, SimpleLineSymbol, Color) {
      //To create a widget, you need to derive from BaseWidget.
      return declare([BaseWidget], {

            // Custom widget code goes here

            baseClass: 'parroquias',
            // this property is set by the framework when widget is loaded.
            name: 'Parroquias',
            // add additional properties here

            //methods to communication with app container:
            postCreate: function postCreate() {
                  this.inherited(arguments);
                  console.log('Parroquias::postCreate');
            },

            startup: function startup() {
                  this.inherited(arguments);
                  console.log('Parroquias::startup');
            },

            onOpen: function onOpen() {
                  console.log('Parroquias::onOpen');
            },

            cargaConcellos: function cargaConcellos() {
                  console.log("cargaConcellos");

                  var codigoProvincia = this.selectProvincias.value;

                  if (codigoProvincia == -1) return;

                  this.selectConcellos.innerHTML = "";

                  var queryTask = new QueryTask(this.config.servicioConcellos);

                  var query = new Query();
                  query.returnGeometry = false;
                  query.outFields = ["CODCONC", "CONCELLO"];
                  query.orderByFields = ["CONCELLO"];
                  query.where = "CODPROV = " + codigoProvincia;

                  queryTask.execute(query, lang.hitch(this, function (results) {
                        console.log(results);

                        var opt = document.createElement("option");

                        opt.value = -1;

                        opt.text = "Seleccione concello";

                        this.selectConcellos.add(opt);

                        for (var i = 0; i < results.features.length; i++) {

                              opt = document.createElement("option");

                              opt.value = results.features[i].attributes.CODCONC;

                              opt.text = results.features[i].attributes.CONCELLO;

                              this.selectConcellos.add(opt);
                        }
                  }));
            },

            cargaParroquias: function cargaParroquias() {
                  console.log("cargaParroquias", this.selectConcellos);

                  var codigoConcello = this.selectConcellos.value;

                  console.log(this.selectConcellos.value);

                  if (codigoConcello == -1) return;

                  this.selectParroquias.innerHTML = "";

                  var queryTask1 = new QueryTask(this.config.servicioParroquias);

                  var query1 = new Query();
                  query1.returnGeometry = false;
                  query1.outFields = ["CODPARRO", "PARROQUIA"];
                  query1.orderByFields = ["PARROQUIA"];
                  query1.where = "CODCONC = " + codigoConcello;

                  queryTask1.execute(query1, lang.hitch(this, function (results) {
                        console.log("Entro");

                        var opt1 = document.createElement("option");

                        opt1.value = -1;

                        opt1.text = "Seleccione parroquia";

                        this.selectParroquias.add(opt1);

                        for (var i = 0; i < results.features.length; i++) {

                              opt1 = document.createElement("option");

                              opt1.value = results.features[i].attributes.CODPARRO;

                              opt1.text = results.features[i].attributes.PARROQUIA;

                              this.selectParroquias.add(opt1);
                        }
                  }));
            },

            zoomConcello: function zoomConcello() {

                  var codigoConcello = this.selectConcellos.value;

                  if (codigoConcello == -1) return;

                  var queryTask2 = new QueryTask(this.config.servicioConcellos);

                  var query2 = new Query();
                  query2.returnGeometry = true;
                  query2.outFields = ["CODCONC", "CONCELLO"];
                  query2.orderByFields = ["CONCELLO"];
                  query2.where = "CODCONC = " + codigoConcello;
                  query2.outSpatialReference = new SpatialReference(102100);

                  queryTask2.execute(query2, lang.hitch(this, function (results) {

                        if (results.features.length > 0) {

                              var geom = results.features[0].geometry;

                              this.map.graphics.clear();

                              this.map.graphics.add(new Graphic(geom, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([37, 40, 80]), 2), new Color([173, 216, 230, 0.25]))));

                              this.map.setExtent(geom.getExtent(), true);
                        }
                  }));
            },

            zoomParroquia: function zoomParroquia() {

                  var codigoParroquia = this.selectParroquias.value;

                  if (codigoParroquia == -1) return;

                  var queryTask3 = new QueryTask(this.config.servicioParroquias);

                  var query3 = new Query();
                  query3.returnGeometry = true;
                  query3.outFields = ["CODPARRO", "PARROQUIA"];
                  query3.orderByFields = ["PARROQUIA"];
                  query3.where = "CODPARRO = " + codigoParroquia;
                  query3.outSpatialReference = new SpatialReference(102100);

                  queryTask3.execute(query3, lang.hitch(this, function (results) {

                        if (results.features.length > 0) {

                              var geom = results.features[0].geometry;

                              this.map.graphics.clear();

                              var graficoParroquia = new Graphic(geom, new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CROSS, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([185, 147, 90]), 2), new Color([185, 147, 90, 0.25])));

                              this.map.graphics.add(graficoParroquia);

                              this.map.setExtent(geom.getExtent(), true);
                        }
                  }));
            },

            onClose: function onClose() {
                  console.log('Parroquias::onClose');
            },

            resize: function resize() {
                  console.log('Parroquias::resize');
            }

      });
});
//# sourceMappingURL=Widget.js.map
