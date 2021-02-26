/**
 * Leaflet.draw assumes that you have already included the Leaflet library.
 */
L.drawVersion = '0.4.2';
/**
 * @class L.Draw
 * @aka Draw
 *
 *
 * To add the draw toolbar set the option drawControl: true in the map options.
 *
 * @example
 * ```js
 *      var map = L.map('map', {drawControl: true}).setView([51.505, -0.09], 13);
 *
 *      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 *          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 *      }).addTo(map);
 * ```
 *
 * ### Adding the edit toolbar
 * To use the edit toolbar you must initialise the Leaflet.draw control and manually add it to the map.
 *
 * ```js
 *      var map = L.map('map').setView([51.505, -0.09], 13);
 *
 *      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 *          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 *      }).addTo(map);
 *
 *      // FeatureGroup is to store editable layers
 *      var drawnItems = new L.FeatureGroup();
 *      map.addLayer(drawnItems);
 *
 *      var drawControl = new L.Control.Draw({
 *          edit: {
 *              featureGroup: drawnItems
 *          }
 *      });
 *      map.addControl(drawControl);
 * ```
 *
 * The key here is the featureGroup option. This tells the plugin which FeatureGroup contains the layers that
 * should be editable. The featureGroup can contain 0 or more features with geometry types Point, LineString, and Polygon.
 * Leaflet.draw does not work with multigeometry features such as MultiPoint, MultiLineString, MultiPolygon,
 * or GeometryCollection. If you need to add multigeometry features to the draw plugin, convert them to a
 * FeatureCollection of non-multigeometries (Points, LineStrings, or Polygons).
 */
L.Draw = {};

/**
 * @class L.drawLocal
 * @aka L.drawLocal
 *
 * The core toolbar class of the API — it is used to create the toolbar ui
 *
 * @example
 * ```js
 *      var modifiedDraw = L.drawLocal.extend({
 *          draw: {
 *              toolbar: {
 *                  buttons: {
 *                      polygon: 'Draw an awesome polygon'
 *                  }
 *              }
 *          }
 *      });
 * ```
 *
 * The default state for the control is the draw toolbar just below the zoom control.
 *  This will allow map users to draw vectors and markers.
 *  **Please note the edit toolbar is not enabled by default.**
 */
L.drawLocal = {
	// format: {
	// 	numeric: {
	// 		delimiters: {
	// 			thousands: ',',
	// 			decimal: '.'
	// 		}
	// 	}
	// },
	draw: {
		toolbar: {
			// #TODO: this should be reorganized where actions are nested in actions
			// ex: actions.undo  or actions.cancel
			actions: {
				title: 'Cancel drawing',
				text: 'Cancel'
			},
			finish: {
				title: 'Finish drawing',
				text: 'Finish'
			},
			undo: {
				title: 'Delete last point drawn',
				text: 'Delete last point'
			},
			buttons: {
				polyline: 'Draw a polyline',
				polygon: 'Draw a polygon',
				rectangle: 'Draw a rectangle',
				circle: 'Draw a circle',
				marker: 'Draw a marker'
			}
		},
		handlers: {
			circle: {
				tooltip: {
					start: 'Click and drag to draw circle.'
				},
				radius: 'Radius'
			},
			marker: {
				tooltip: {
					start: 'Click map to place marker.'
				}
			},
			polygon: {
				tooltip: {
					start: 'Click to start drawing shape.',
					cont: 'Click to continue drawing shape.',
					end: 'Click first point to close this shape.'
				}
			},
			polyline: {
				error: '<strong>Error:</strong> shape edges cannot cross!',
				tooltip: {
					start: 'Click to start drawing line.',
					cont: 'Click to continue drawing line.',
					end: 'Click last point to finish line.'
				}
			},
			rectangle: {
				tooltip: {
					start: 'Click and drag to draw rectangle.'
				}
			},
			simpleshape: {
				tooltip: {
					end: 'Release mouse to finish drawing.'
				}
			}
		}
	},
	edit: {
		toolbar: {
			actions: {
				save: {
					title: 'Save changes.',
					text: 'Save'
				},
				cancel: {
					title: 'Cancel editing, discards all changes.',
					text: 'Cancel'
				},
				clearAll:{
					title: 'clear all layers.',
					text: 'Clear All'
				}
			},
			buttons: {
				edit: 'Edit layers.',
				editDisabled: 'No layers to edit.',
				remove: 'Delete layers.',
				removeDisabled: 'No layers to delete.'
			}
		},
		handlers: {
			edit: {
				tooltip: {
					text: 'Drag handles, or marker to edit feature.',
					subtext: 'Click cancel to undo changes.'
				}
			},
			remove: {
				tooltip: {
					text: 'Click on a feature to remove'
				}
			}
		}
	}
};

L.drawLocal = {
		// format: {
		// 	numeric: {
		// 		delimiters: {
		// 			thousands: ',',
		// 			decimal: '.'
		// 		}
		// 	}
		// },
		draw: {
			toolbar: {
				// #TODO: this should be reorganized where actions are nested in actions
				// ex: actions.undo  or actions.cancel
				actions: {
					title: '取消绘制',
					text: '取消'
				},
				finish: {
					title: '完成绘制',
					text: '完成'
				},
				undo: {
					title: '删除尾绘制点',
					text: '删除尾绘制点'
				},
				buttons: {
					polyline: '绘制折线',
					polygon: '绘制多边形',
					rectangle: '绘制矩形',
					circle: '绘制圆形',
					marker: '绘制地标'
				}
			},
			handlers: {
				circle: {
					tooltip: {
						start: '点击并拖拽以绘制圆形.'
					},
					radius: 'Radius'
				},
				semicircle: {
					tooltip: {
						start: '点击确定圆心点.',
						cont: '再次点击确定初始角度和半径',
						end: '拖动确定结束角度，点击完成绘制.'
					}
				},				
				ellipse: {
					tooltip: {
						start: '点击确定椭圆中心.',
						cont: '再次点击确定椭圆长轴方向',
						end: '拖动确定椭圆半径，点击结束绘制.'
					}
				},
				marker: {
					tooltip: {
						start: '点击以放置地标.'
					}
				},
				polygon: {
					tooltip: {
						start: '点击开始绘制多边形.',
						cont: '点击继续绘制多边形.',
						end: '点击首绘制点以完成绘制.'
					}
				},
				curve: {
					tooltip: {
						start: '点击开始绘制曲线.',
						cont: '点击继续绘制曲线.',
						curve:'点击确定曲线最高点位置.',
						end: '点击尾绘制点以完成绘制.'
					}
				},
				polyline: {
					error: '<strong>错误:</strong> 图形边界不能重叠!',
					tooltip: {
						start: '点击开始绘制折线.',
						cont: '点击继续绘制折线.',
						end: '点击尾绘制点以完成绘制.'
					}
				},
				rectangle: {
					tooltip: {
						start: '点击并拖拽以绘制矩形.'
					}
				},
				simpleshape: {
					tooltip: {
						end: '释放鼠标以完成放置.'
					}
				}
			}
		},
		edit: {
			toolbar: {
				actions: {
					save: {
						title: '保存修改.',
						text: '保存'
					},
					cancel: {
						title: '取消编辑，放弃所有修改.',
						text: '取消'
					},
					clearAll:{
						title: '清除所有标绘.',
						text: '清除所有'
					}
				},
				buttons: {
					edit: '编辑标绘',
					editDisabled: '没有可编辑标绘.',
					remove: '删除标绘.',
					removeDisabled: '没有可删除标绘.'
				}
			},
			handlers: {
				edit: {
					tooltip: {
						text: '拖拽标绘以编辑.',
					}
				},
				remove: {
					tooltip: {
						text: '点击标绘以删除'
					}
				}
			}
		}
	};
