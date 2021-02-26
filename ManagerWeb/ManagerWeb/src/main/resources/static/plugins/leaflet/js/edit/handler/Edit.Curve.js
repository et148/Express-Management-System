L.Edit = L.Edit || {};

/**
 * @class L.Edit.Curveline
 * @aka L.Edit.Curve
 * @aka Edit.Curve
 */
L.Edit.Curve = L.Handler.extend({
	options: {},

	// @method initialize(): void
	initialize: function (curve, options) {
		var path= curve.getPath();
		this.path =path;
		var curveLL=[];
		var vertexLL=[];
		var flag=true;
		for(var k in path){
			if(path[k] instanceof Array){
				if(flag){
					vertexLL.push(new L.latLng(path[k]));
				}else{
					curveLL.push(new L.latLng(path[k]));
				}
				flag=!flag;
			}
		}
		this._curveLL=curveLL;
		this._vertexLL=vertexLL;
		this._curve = curve;
		L.setOptions(this, options);

		this._curve.on('revert-edited', this._updateLatLngs, this);
	},

	_eachVertexHandler: function (callback) {
		for (var i = 0; i < this._verticesHandlers.length; i++) {
			callback(this._verticesHandlers[i]);
		}
	},

	// @method addHooks(): void
	// Add listener hooks to this handler
	addHooks: function () {
		this._initHandlers();
		this._eachVertexHandler(function (handler) {
			handler.addHooks();
		});
	},

	// @method removeHooks(): void
	// Remove listener hooks from this handler
	removeHooks: function () {
		this._eachVertexHandler(function (handler) {
			handler.removeHooks();
		});
	},

	// @method updateMarkers(): void
	// Fire an update for each vertex handler
	updateMarkers: function () {
		this._eachVertexHandler(function (handler) {
			handler.updateMarkers();
		});
	},

	_initHandlers: function () {
		this._verticesHandlers = [];
		this._verticesHandlers.push(new L.Edit.CurveVerticesEdit(this._curve, this._vertexLL, this._curveLL, this.options));
	},

	_updateLatLngs: function (e) {
//		this.latlngs = [e.layer._latlngs];
//		if (e.layer._holes) {
//			this.latlngs = this.latlngs.concat(e.layer._holes);
//		}
	}

});

/**
 * @class L.Edit.CurveVerticesEdit
 * @aka Edit.CurveVerticesEdit
 */
L.Edit.CurveVerticesEdit = L.Handler.extend({
	options: {
		icon: new L.DivIcon({
			iconSize: new L.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon'
		}),
		touchIcon: new L.DivIcon({
			iconSize: new L.Point(20, 20),
			className: 'leaflet-div-icon leaflet-editing-icon leaflet-touch-icon'
		}),
		drawError: {
			color: '#b00b00',
			timeout: 1000
		}


	},

	// @method intialize(): void
	initialize: function (curve, vertexLL, curveLL, options) {
		// if touch, switch to touch icon
		if (L.Browser.touch) {
			this.options.icon = this.options.touchIcon;
		}
		this._curve = curve;

		if (options && options.drawError) {
			options.drawError = L.Util.extend({}, this.options.drawError, options.drawError);
		}

		this._vertexLL = vertexLL;
		this._curveLL = curveLL;
		L.setOptions(this, options);
	},

	// @method addHooks(): void
	// Add listener hooks to this handler.
	addHooks: function () {
		var curve = this._curve;


		curve.setStyle(curve.options.editing);

		if (this._curve._map) {

			this._map = this._curve._map; // Set map

			if (!this._markerGroup) {
				this._initMarkers();
			}
			this._curve._map.addLayer(this._markerGroup);
		}
	},

	// @method removeHooks(): void
	// Remove listener hooks from this handler.
	removeHooks: function () {
		var curve = this._curve;

		curve.setStyle(curve.options.original);

		if (curve._map) {
			curve._map.removeLayer(this._markerGroup);
			delete this._markerGroup;
			delete this._markers;
		}
	},

	// @method updateMarkers(): void
	// Clear markers and update their location
	updateMarkers: function () {
		this._markerGroup.clearLayers();
		this._initMarkers();
	},

	_initMarkers: function () {
		if (!this._markerGroup) {
			this._markerGroup = new L.LayerGroup();
		}
		this._markers = [];
		var i, j, len, marker;
		var index0=0;
		var index1=1;
		for (i = 0, len = this._vertexLL.length; i < len; i++) {
			marker = this._createMarker(this._vertexLL[i], index0);
			index0+=2;
			marker.on('click', this._onMarkerClick, this);
			this._markers.push(marker);
		}
		for (i = 0, len = this._curveLL.length; i < len; i++) {
			marker = this._createMarker(this._curveLL[i], index1);
			index1+=2;
			marker.on('click', this._onMarkerClick, this);
			this._markers.push(marker);
		}
	},

	_createMarker: function (latlng, index) {
		// Extending L.Marker in TouchEvents.js to include touch.
		var marker = new L.Marker.Touch(latlng, {
			draggable: true,
			icon: this.options.icon
		});

		marker._origLatLng = latlng;
		marker._index = index;

		marker
			.on('dragstart', this._onMarkerDragStart, this)
			.on('drag', this._onMarkerDrag, this)
			.on('dragend', this._fireEdit, this)
			.on('touchmove', this._onTouchMove, this)
			.on('touchend', this._fireEdit, this)
			.on('MSPointerMove', this._onTouchMove, this)
			.on('MSPointerUp', this._fireEdit, this);

		this._markerGroup.addLayer(marker);

		return marker;
	},

	_onMarkerDragStart: function () {
		this._curve.fire('editstart');
	},

	_removeMarker: function (marker) {},

	_fireEdit: function () {
		this._curve.edited = true;
		this._curve.fire('edit');
		this._curve._map.fire(L.Draw.Event.EDITVERTEX, { layers: this._markerGroup, curve: this._curve });
	},

	_onMarkerDrag: function (e) {
		var marker = e.target;
		var curve = this._curve;
		L.extend(marker._origLatLng, marker._latlng);
		
		var path=this._curve.getPath();
		var index=0;
		for(var k in path){
			if(path[k] instanceof Array){
				if(marker._index==index){
					path[k]=[marker._latlng.lat,marker._latlng.lng];
					break;
				}
				index++;
			}
		}
		this._curve.setPath(path);
		//以下一段是用来重新显示tooltip
			this._curve.closeTooltip();
			this._curve.openTooltip();
		//结束
		this._curve.fire('editdrag');
	},

	_onMarkerClick: function (e) {},

	_onTouchMove: function (e) {
		var layerPoint = this._map.mouseEventToLayerPoint(e.originalEvent.touches[0]),
			latlng = this._map.layerPointToLatLng(layerPoint),
			marker = e.target;

		L.extend(marker._origLatLng, latlng);

		var path=this._curve.getPath();
		var index=0;
		for(var k in path){
			if(path[k] instanceof Array){
				if(marker._index==index){
					path[k]=[latlng.lat,latlng.lng];
					break;
				}
				index++;
			}
		}
		this._curve.setPath(path);
		this.updateMarkers();
	}
});

L.Curve.addInitHook(function () {

	// Check to see if handler has already been initialized. This is to support versions of Leaflet that still have L.Handler.PolyEdit
	if (this.editing) {
		return;
	}

	if (L.Edit.Curve) {

		this.editing = new L.Edit.Curve(this, this.options.poly);

		if (this.options.editable) {
			this.editing.enable();
		}
	}

	this.on('add', function () {
		if (this.editing && this.editing.enabled()) {
			this.editing.addHooks();
		}
	});

	this.on('remove', function () {
		if (this.editing && this.editing.enabled()) {
			this.editing.removeHooks();
		}
	});
});
