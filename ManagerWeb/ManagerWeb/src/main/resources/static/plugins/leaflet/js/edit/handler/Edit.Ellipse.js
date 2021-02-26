L.Edit = L.Edit || {};
/**
 * @class L.Edit.Ellipse
 * @aka Edit.Ellipse
 * @inherits L.Edit.SimpleShape
 */
L.Edit.Ellipse = L.Edit.SimpleShape.extend({
	_createMoveMarker: function () {
		var center = this._shape.getLatLng();

		this._moveMarker = this._createMarker(center, this.options.moveIcon);
	},

	_createResizeMarker: function () {
//		var center = this._shape.getLatLng(),
//			resizemarkerPoint = this._getResizeMarkerPoint(center);
//
		this._resizeMarkers = [];
//		this._resizeMarkers.push(this._createMarker(resizemarkerPoint, this.options.resizeIcon));
	},

	_getResizeMarkerPoint: function (latlng) {
//		// From L.shape.getBounds()
//		var delta = this._shape._radius * Math.cos(Math.PI / 4),
//			point = this._map.project(latlng);
//		return this._map.unproject([point.x + delta, point.y - delta]);
	},

	_move: function (latlng) {
		var resizemarkerPoint = this._getResizeMarkerPoint(latlng);

		// Move the resize marker
		//this._resizeMarkers[0].setLatLng(resizemarkerPoint);

		// Move the circle
		this._shape.setLatLng(latlng);

		this._map.fire(L.Draw.Event.EDITMOVE, { layer: this._shape });
	},

	_resize: function (latlng) {
//		var moveLatLng = this._moveMarker.getLatLng(),
//			radius = moveLatLng.distanceTo(latlng);
//
//		this._shape.setRadius(radius);
//
//		this._map.fire(L.Draw.Event.EDITRESIZE, { layer: this._shape });
	}
});

L.Ellipse.addInitHook(function () {
	if (L.Edit.Ellipse) {
		this.editing = new L.Edit.Ellipse(this);

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