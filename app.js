/* APP
 * Name: LucidChart
 * version 0.5.6
 * Author: Mark Scott Lavin 
 * License: MIT
 * For Changelog see README.txt
 */

/*( function () { */

/****** DECLARE GLOBAL OBJECTS AND VARIABLES ******/

// Top-level Initialization Vars
//var container = document.getElementById('visualizationContainer');
var scene = new THREE.Scene();
var sceneChildren = {};	
var renderer;
var dollyCam;
var camera;

var lastRender = 0;
var enterVRButton;
var animationDisplay;

// App Defaults

var globalAppSettings = {
	heightCapNearInfinity: true,
	heightCap: 9999
}

var utils = {
	entity: { 
		parentEntity: function( name ) {

			var parentObj = new THREE.Object3D();
			parentObj.name = name;
			scene.add( parentObj );
			return parentObj;
		}
	}	
};

function deleteChart( name ){
	scene.remove( scene.getObjectByName( name ) );
	debug.master && debug.sceneChildren && console.log( 'deleteChart(): ', name , ' removed from scene' );
}

// lucidChart Entity Initialization
var chartSettings = {
	data: {},
	math: {},
	color: {}
};

/****** RUN CODE ******/
document.addEventListener( "DOMContentLoaded", init );

/****** FUNCTION DECLARATIONS ******/

// Initialize the scene: Invoke initialization.
function init() {
	
	/* Initialize the scene framework */
	cameras();
	initRenderer();
	
	initEnterVRButton();
	initVRControls();	
	initVREffect();
	getHMD();			
	initDesktopControls();
	initWindowResizeHandling();	

	UI( 'browser' );		
	
	lights();
	axes( 300 , true );	
	materials();
	
	/* Initialize the settings of the lucidChart object */
	lucidChart.init();
	
	/* Initialize the UI */
//	UI( 'browser' );	
	
	/* Initialize the event listeners */
	initEventListeners();
	
	// GEOMETRIES
	entities();
	
}

function updateBrowswerUI() {
		
		UI.browser.update.inputs.textAndNum();
		UI.browser.update.inputs.camPos();
	
	}
	
// Request animation frame loop function

function animate( timestamp ) {

	var delta = Math.min( timestamp - lastRender, 500 );
	lastRender = timestamp;

	if( enterVRButton.isPresenting() ){
		vrControls.update();
		renderer.render( scene, camera );
		vrEffect.render( scene, camera );
	} else {
		renderer.render( scene,camera );
		updateBrowswerUI();
	}
	animationDisplay.requestAnimationFrame( animate );
	
}

/****** Event Listeners ******/

function initEventListeners() {
	UI.browser.events();	
};

/* VR */

function initEnterVRButton(){
	
    var options = {
        color: 'black',
        background: false,
        corners: 'square'
    };

    enterVRButton = new webvrui.EnterVRButton(renderer.domElement, options)
            .on("enter", function(){
                console.log("enter VR")
            })
            .on("exit", function(){
                console.log("exit VR");
                camera.quaternion.set(0,0,0,1);
                camera.position.set(0,vrControls.userHeight,0);
            })
            .on("error", function(error){
                document.getElementById("learn-more").style.display = "inline";
                console.error(error)
            })
            .on("hide", function(){
                document.getElementById("ui").style.display = "none";
                // On iOS there is no button to close fullscreen mode, so we need to provide one
                if(enterVRButton.state == webvrui.State.PRESENTING_FULLSCREEN) document.getElementById("exitVR").style.display = "initial";
            })
            .on("show", function(){
                document.getElementById("ui").style.display = "inherit";
                document.getElementById("exitVR").style.display = "none";
            });


    // Add button to the #enterVRButton element
    document.getElementById("enterVRButton").appendChild(enterVRButton.domElement);

    // Append the canvas element created by the renderer to document body element.
    document.getElementById("visualizationContainer").appendChild(renderer.domElement);
	
}

function initVRControls(){

    vrControls = new THREE.VRControls( camera );
    vrControls.standing = true;
    camera.position.y = vrControls.userHeight;

}	

function initVREffect(){

    // Create VR Effect rendering in stereoscopic mode
    vrEffect = new THREE.VREffect(renderer);
    vrEffect.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
}

function getHMD(){
	
	enterVRButton.getVRDisplay()
			.then( function( display ) {
			
				animationDisplay = display;
				display.requestAnimationFrame(animate);
				
			})
			.catch( function(){
			
				// ...and if there is no display available, fallback to window
				animationDisplay = window;
				window.requestAnimationFrame(animate);
				
			});

}

function initDesktopControls() {
	
	// Create the Mouse-Based Controls - Hold down left mouse button and move around the window...
//	var container = document.body;
	var controls;

	sceneChildren.desktopControls = new THREE.OrbitControls ( camera , document.getElementById('visualizationContainer') );
	controls = sceneChildren.desktopControls;
	
	controls.target.set(
	camera.position.x + 0.15,
	vrControls.userHeight,
	camera.position.z 
	
	);  
	
}
	
function initWindowResizeHandling(){

    // Hande canvas resizing
    window.addEventListener('resize', onResize, true);
    window.addEventListener('vrdisplaypresentchange', onResize, true);

    function onResize(e) {
        vrEffect.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }	
}

/* END VR */

/****** INITIALIZE THE SCENE FRAMEWORK *******/

function cameras(){
	
	dollyCam = new THREE.PerspectiveCamera();
	
	scene.add( dollyCam );
	
	camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 1000 );
	
	camera.position.init = function( camera ){
					camera.position.set( 0, 15, -5 );
					camera.lookAt(new THREE.Vector3( 0, 15, 0 ));
					camera.up = new THREE.Vector3( 0,1,0 );
					debug.master && debug.cameras && console.log ('Camera Position Initialized: ' , camera.position );
			}
			
	camera.position.update = function( camera ){
					
					var newCamPos = {
						x: UI.browser.inputs.camPos.x.val(),
						y: UI.browser.inputs.camPos.y.val(),
						z: UI.browser.inputs.camPos.z.val(),
					};
					
					debug.master && debug.cameras && console.log ('New Camera Position: ' , newCamPos );
					
					camera.position.set( newCamPos.x, newCamPos.y, newCamPos.z );
					
					debug.master && debug.cameras && console.log ('Camera Position Updated: ' , camera.position );
			}

	dollyCam.add( camera ); 			

}

function initRenderer() {
	
	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setClearColor( 0xffffff, 1 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.setAttribute( 'id' , 'renderSpace' );
	renderer.domElement.setAttribute( 'class' , 'threeWebGLRenderer' );
	
	document.getElementById('visualizationContainer').appendChild( renderer.domElement );
	
}

function lights() {
	
	sceneChildren.lights = {
		
		pureWhiteLight: new THREE.PointLight(0xffffff, 7, 1000),
		pureWhiteLight2: new THREE.PointLight(0xffffff, 7, 1000),
	};

	sceneChildren.lights.pureWhiteLight.position.set(500,500,500);
	sceneChildren.lights.pureWhiteLight2.position.set(-500,500,-500);

	scene.add(sceneChildren.lights.pureWhiteLight);
	scene.add(sceneChildren.lights.pureWhiteLight2);
	
	debug.master && debug.lights && console.log ( 'lights(): ', sceneChildren.lights );
}

/* AXES HANDLING */

function axes( extents , rulers ) {
	// Setup the Axes
	
	sceneChildren.axes = {
		x: new THREE.Geometry(),
		y: new THREE.Geometry(),
		z: new THREE.Geometry(),
		color: {
			x: 0x880000,
			y: 0x008800,
			z: 0x000088
		},
		lineWidth: 1,
		material: {
				x: new THREE.LineBasicMaterial ({ 
					color: 0x880000,  
					linewidth: 1 }),
				y: new THREE.LineBasicMaterial ({ 
					color: 0x008800,  
					linewidth: 1 }),
				z: new THREE.LineBasicMaterial ({ 
					color: 0x000088,  
					linewidth: 1 })
		},
		rulers: function( axis, extents , spacing ) {
			
			var rulerPoints;
			
			sceneChildren.axes.rulers[axis] = new THREE.BufferGeometry();
			
			var positions = new Float32Array( extents * 2 * 3 ); 
			
			for ( var i = 0; i < positions.length; i += 3 ) {	
					
					var currAxPos = -extents + i/3;
					
					if ( axis === 'x' ) {
						positions[i] = currAxPos;
						positions[i + 1] = 0;
						positions[1 + 2] = 0;
					}
					
					if ( axis === 'y' ) {
						positions[i] = 0;
						positions[i + 1] = currAxPos;
						positions[i + 2] = 0;
					}
					
					if ( axis === 'z' ) { 
						positions[i] = 0;
						positions[i + 1] = 0;
						positions[i + 2] = currAxPos;
					}
				}
				
			sceneChildren.axes.rulers[axis].addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
			sceneChildren.axes.rulers[axis].computeBoundingSphere();
			
			var rulerPointMaterial = new THREE.PointsMaterial( { size: 0.1, color: sceneChildren.axes.color[axis] } );
			
			rulerPoints = new THREE.Points( sceneChildren.axes.rulers[axis], rulerPointMaterial );
			scene.add( rulerPoints );
		},
		draw: function( axis ) {
			
			sceneChildren.axes.x.vertices.push(
				new THREE.Vector3( -extents, 0, 0 ),
				new THREE.Vector3( extents, 0, 0 )
			);
			
			sceneChildren.axes.y.vertices.push(
				new THREE.Vector3( 0, -extents, 0 ),
				new THREE.Vector3( 0, extents, 0 )
			);
			
			sceneChildren.axes.z.vertices.push(
				new THREE.Vector3( 0, 0, -extents ),
				new THREE.Vector3( 0, 0, extents )
			);
			
			// Draw the Axes with their Materials

			var xAxis = new THREE.Line( sceneChildren.axes.x, sceneChildren.axes.material.x );
			var yAxis = new THREE.Line( sceneChildren.axes.y, sceneChildren.axes.material.y );
			var zAxis = new THREE.Line( sceneChildren.axes.z, sceneChildren.axes.material.z );
			
			scene.add( xAxis );
			scene.add( yAxis );
			scene.add( zAxis );
			
			if (rulers === true ) {
				sceneChildren.axes.rulers( 'x' , extents, 1 );
				sceneChildren.axes.rulers( 'y' , extents, 1 );
				sceneChildren.axes.rulers( 'z' , extents, 1 );
			}			
		}
	};
	
	sceneChildren.axes.draw();
	
	debug.master && debug.axes && console.log ( 'axes(): ', sceneChildren.axes );  
}

/******* COLOR & MATERIALS HANDLING */

function materials() {
	
	sceneChildren.materials = {
		hexRGBName: function( r, g, b, a = 1, type ) {			
			var hexRGB = sceneChildren.materials.hexFromChannels ( sceneChildren.materials.channelDecToHex(r).toString(16) , sceneChildren.materials.channelDecToHex(g).toString(16) , sceneChildren.materials.channelDecToHex(b).toString(16) ) + '_alpha' + a + '_' + type;
			return hexRGB;
		},
		hexToDec( hexInputString ) {	
			var hexString;
			var colorAsDec = {};
			
			hexString = hexInputString.replace( '#' , '' );
			hexString = hexString.replace( '0x' , '' );
			
			var rHex = hexString.substring(0,2);
			var gHex = hexString.substring(2,4);
			var bHex = hexString.substring(4,6);
			
			colorAsDec.r = parseInt( rHex , 16 );
			colorAsDec.g = parseInt( gHex , 16 );
			colorAsDec.b = parseInt( bHex , 16 );
			
			return colorAsDec; 
		},
		hexFromChannels: function( r, g, b ) {
			
			var hex = r + g + b;
			return hex;
		},
		channelDecToHex: function( channelDecVal ) {
			
			var hex;
			channelDecVal > 0 ? hex = channelDecVal.toString(16) : hex = '00'.toString(16) ; 
			return hex;
		},
		ground: new THREE.MeshBasicMaterial( {color: 0xdddddd, side: THREE.DoubleSide, transparent: true, opacity: 0.5} ),
		line: {
				dashed:{
						red: new THREE.LineDashedMaterial ({ color: 0xff0000, dashSize: 0.1, gapSize: 0.1,	linewidth: 3 }),
						blue: new THREE.LineDashedMaterial ({ color: 0x0000ff, dashSize: 0.1, gapSize: 0.1, linewidth: 3 }), 
						green: new THREE.LineDashedMaterial ({ color: 0x00ff00, dashSize: 0.1, gapSize: 0.1, linewidth: 3 }),
				}
		},
		solid: {
			specularColor: function( channelDecVal, diff = 127 ) {	
					var specColor = channelDecVal - diff;
					specColor > 0 ? specColor : specColor = 0;
					return specColor;				
			},
			phong: {
				load: function( r, g, b, a ) {	
					var hexRGB = sceneChildren.materials.hexRGBName( r, g, b, a, 'phong' );
					// Check whether the material already exists. If it does, load it; if not create it.
					var loadMtl = sceneChildren.materials[hexRGB] || sceneChildren.materials.solid.phong.init( r, g, b, a );
					return loadMtl;
				},
				init: function( r, g, b, a ) {

					var mtlColor = new THREE.Color('rgb(' + r + ',' + g + ',' + b + ')');
					var mtlSpecColor = new THREE.Color(
						'rgb(' + 
						sceneChildren.materials.solid.specularColor( r , 127 ) + 
						',' + 
						sceneChildren.materials.solid.specularColor( g , 127 ) + 
						',' + 
						sceneChildren.materials.solid.specularColor( b , 127 ) + 
						')');
					var hexRGB = sceneChildren.materials.hexRGBName( r, g, b, a, 'phong' );
						
					sceneChildren.materials[hexRGB] = new THREE.MeshPhongMaterial (
						{
							color: mtlColor,
							specular: mtlSpecColor,
							shininess: 20,
							shading: THREE.FlatShading,
							name: hexRGB 
							} ); 

					debug.master && debug.materials && console.log ( 'Dynamic Material Loaded' , sceneChildren.materials[hexRGB] );
					return sceneChildren.materials[hexRGB];
				}
			}
		},
		fromColor: function( color, pickBy ){
			
			var pickedColor = color.palette.colorArray[pickBy];
			var material = sceneChildren.materials.solid.phong.load( pickedColor.r, pickedColor.g , pickedColor.b );
			
			return material;
			
		}
	};
		
	debug.master && debug.materials && console.log ( 'materials(): ' , sceneChildren.materials );
}


/******* ENTITIES (GEOMETRY THAT APPEARS IN THE SCENE) HANDLING *******/

var entities = function(){
	
	sceneChildren.geometries = {
		constant: {
			ground: function( xSize = 2000 , zSize = 2000 , heightOffset = -0.001, opacity = 0.5 ) { 
				
				var groundBuffer = new THREE.PlaneBufferGeometry( xSize, zSize, 1 );
				var groundMesh = new THREE.Mesh( groundBuffer , sceneChildren.materials.ground );
				
				groundMesh.rotation.x = Math.PI / 2;
				groundMesh.position.y = heightOffset;
				
				scene.add( groundMesh );
			}
		},
		dynamic: {
			loadedFromExternal: {
				bufferGeoms: {},
				mutated: {}
			}
		}
	};
	
	//	Render the Ground
	sceneChildren.geometries.constant.ground();

	// Generate the chart	
	lucidChart({ func: chartSettings.math.heightFunc, chartSettings: chartSettings, name: 'chart1' });
}

/****** CREATE THE LUCIDCHART ENTITY ******/

/*
 * lucidChart()
 *
 * parameters:
 *
 * func: 	Mathematical function to render
 * chartSettings: settings object
 * name:	Name of the chart
 * position:	global position of the chart
 * quaternion: 	quaternion that'll get applied to rotation
 *
 */

var lucidChart = function( parameters ) {	

	var chartSettings = parameters.chartSettings;
	var position = parameters.position || { x: 0, y: 0, z: 0 };
	var quaternion = parameters.quaternion || new THREE.Quaternion();

	lucidChart.chartName = parameters.name || "chart1";

	lucidChart.pivot = new THREE.Object3D();
	lucidChart.pivot.name = lucidChart.chartName;
	
	if ( parameters.scale ){	
		lucidChart.pivot.scale.set( parameters.scale.x , parameters.scale.y, parameters.scale.z );
	}
	
	if ( parameters.position ){
		lucidChart.pivot.position.set( position.x, position.y, position.z );
	}
	
	if ( parameters.quaternion ){
		lucidChart.pivot.rotation.setFromQuaternion( parameters.quaternion );
	}
	
	scene.add( lucidChart.pivot );

	lucidChart.func = parameters.func( chartSettings.math );	
	
	lucidChart.type = {	
		bar: function( x, z, yHeight, thickness = 0.5 ){
			sceneChildren.geometries.dynamic.chart[x][z] = new chartBar({ x: x, z: z, yHeight: yHeight, thickness: thickness, parent: lucidChart.pivot, sides: 48, material: chartSettings.color.func( chartSettings, yHeight ) });
		}
	};	
	
	lucidChart.height = {
		generated: {
			getMinAndMax: function( yHeight, math ){
				if ( math.generatedHeight.max === null && math.generatedHeight.min === null ) {
					math.generatedHeight.max = yHeight;
					math.generatedHeight.min = yHeight;
				}	
				else {
					yHeight > math.generatedHeight.max ? math.generatedHeight.max = yHeight : false;
					yHeight < math.generatedHeight.min ? math.generatedHeight.min = yHeight : false;
				}
				return math.generatedHeight;
			},
			reset: function(){
				// Dynamic vars that capture max and min y value generated by the heightFunc;
				chartSettings.math.generatedHeight = {
					min: null,
					max: null
				};
			}
		}
	};
	
	lucidChart.data = {
		mode: {
			update: function() {
				chartSettings.math.dataType = document.querySelector('input[name = "dataType"]:checked').value;   // Get the value of the selected radio button.
				lucidChart.data.mode.renderBy();
			},
			renderBy: function() {
		
				if ( chartSettings.math.dataType === 'randomHeight') {
					
					chartSettings.math.heightFunc = lucidChart.math.func.preset.dict;   // The Math Function dictionary;
					chartSettings.math.demoEquation = 'randomHeight';			// The randomHeight function;
				}
				
				if ( chartSettings.math.dataType === 'equation') {
					
					chartSettings.math.heightFunc = lucidChart.math.func.preset.dict;   // The math Function dictionary;
					chartSettings.math.demoEquation = UI.browser.inputs.data.equation.select.val() || this.demoEquation;	// If using one of the demo equations, the equation select sets which one to use.
				}
			} 
		},
		count: {
			x: chartSettings.data.count.x() || 20, // Default = 20;
			z: chartSettings.data.count.z() || 20  // Default = 20;
		},
		range: {
			start: {
				x: chartSettings.data.range.start.x || 0, // Default = 0 - start at origin
				z: chartSettings.data.range.start.z || 0  // Default = 0 - start at origin
			}	
		}
	};

	
	lucidChart.color = {
		mode: {
			set: function( colorMode ) {
	
				// Choose the colorization function based on UI Selection
				if (colorMode === 'randomColor') { chartSettings.color.func = lucidChart.colorFunc.random; chartSettings.color.hasColorZones = false; }
				if (colorMode === 'colorByHeight') { chartSettings.color.func = lucidChart.colorFunc.byHeight; chartSettings.color.hasColorZones = true; }
				if (colorMode === 'monochrome') { chartSettings.color.func = lucidChart.colorFunc.monoChrome; chartSettings.color.hasColorZones = false; }
			},
			update: function() {	
				chartSettings.color.mode = document.querySelector('input[name = "colorMode"]:checked').value;   // Get the value of the selected radio button.
				lucidChart.color.mode.set( chartSettings.color.mode );	
			}
		},
		gradientType:{
			update: function() {
				chartSettings.color.gradientType = document.querySelector('input[name = "gradientType"]:checked').value;   // Get the value of the selected radio button.	
			}
		},
		materialSides: chartSettings.color.materialSides || THREE.DoubleSide, // Double-sided faces as default	
		heightZones: {
			set: function( chartSettings ) {
				
				/* logic from currentStates (refactor later to avoid repeat) */
				var dataTypeRandom = UI.browser.inputs.data.typeSelect.random.is(':checked');
				var dataTypeEquation = UI.browser.inputs.data.typeSelect.equation.is(':checked');
				
				// Get the initial hasThresholds state
				var hasThresholds = UI.browser.inputs.color.thresh.isOn.input.is(':checked');				
								
				var maxThresh, minThresh;
				
				if ( dataTypeRandom ) {
					maxThresh = chartSettings.math.maxUserSetHeight;
					minThresh = chartSettings.math.minUserSetHeight;
				}
				
				if ( dataTypeEquation ) {
					if ( hasThresholds 	&& ( chartSettings.color.thresh.max || chartSettings.color.thresh.max === 0 ) && ( chartSettings.color.thresh.min || chartSettings.color.thresh.min === 0 )){
						maxThresh = chartSettings.color.thresh.max;
						minThresh = chartSettings.color.thresh.min;
					}
					else if ( ( chartSettings.math.generatedHeight.max || chartSettings.math.generatedHeight.max === 0 ) && ( chartSettings.math.generatedHeight.min || chartSettings.math.generatedHeight.min === 0 )){
						maxThresh = chartSettings.math.generatedHeight.max;
						minThresh = chartSettings.math.generatedHeight.min;
					}
					else if (( chartSettings.math.maxThreshDefault || chartSettings.math.maxThreshDefault === 0 ) && ( chartSettings.math.minThreshDefault || chartSettings.math.minThreshDefault === 0 )){
						maxThresh = chartSettings.math.maxThreshDefault;
						minThresh = chartSettings.math.minThreshDefault;
					}
					else {
						maxThresh = 0;
						minThresh = 0;
					}
				}
				
								
				var totalColorizeRange = maxThresh - minThresh;
					
				// Update the color.heightZones object
				chartSettings.color.heightZones.totalColorizeRange = totalColorizeRange;
				chartSettings.color.heightZones.count = chartSettings.color.count || 1;   // Set the number of heightZones to colorCount and set a default value if colorCount isn't provided.
				chartSettings.color.heightZones.size = ( totalColorizeRange / chartSettings.color.count );  // size of each zone
				chartSettings.color.heightZones.zone = [];
			 
				// define the heightZones
			
				for ( i = 0; i < chartSettings.color.heightZones.count; i++ ) {

					chartSettings.color.heightZones.zone[ i ] = {};
					chartSettings.color.heightZones.zone[ i ].min = ( i * chartSettings.color.heightZones.size ) + minThresh; 
					
					chartSettings.color.heightZones.zone[ i ].max = ( ( i + 1 ) * chartSettings.color.heightZones.size ) + minThresh; 
					
					}
				
				debug.master && debug.lucidChart && console.log( 'lucidChart.color.heightZones.set(): ' ,  chartSettings.color.heightZones );
			},
			clear: function( chartSettings ) {		
				chartSettings.color.heightZones = {
					totalColorizeRange: null,
					count: null,
					size: null,  // size of each zone
					zone: []
				};
				
				debug.master && debug.lucidChart && console.log( 'lucidChart.color.heightZones.set(): ' , chartSettings.color.heightZones );
			}
		},
		minMaxThresh:{
			checkFor: function(){
				
				document.getElementById('hasMinMaxColorThreshold').checked ? chartSettings.color.thresh.isOn = true : chartSettings.color.thresh.isOn = false;
			},
			setVia: {
				UI: function(){
			
					if (chartSettings.color.thresh.isOn === true) {
							chartSettings.color.thresh.min = parseInt(UI.browser.inputs.color.thresh.min.val()) || 0;
							chartSettings.color.thresh.max = parseInt(UI.browser.inputs.color.thresh.max.val()) || 0;
							UI.browser.inputs.color.thresh.min.val( chartSettings.color.thresh.min );
							UI.browser.inputs.color.thresh.max.val( chartSettings.color.thresh.max );
					}
					
					else { lucidChart.color.minMaxThresh.reset(); }
				},
				integration: function( chartSettings ){
				
					if ( ( chartSettings.color.thresh.max || chartSettings.color.thresh.max === 0 ) && ( chartSettings.color.thresh.min  || chartSettings.color.thresh.min === 0 )){
						lucidChart.color.minMaxThresh.setVia.integration.max = chartSettings.color.thresh.max;
						lucidChart.color.minMaxThresh.setVia.integration.min = chartSettings.color.thresh.min;
					}
					else if (( chartSettings.math.generatedHeight.max || chartSettings.math.generatedHeight.max === 0 ) && ( chartSettings.math.generatedHeight.min || chartSettings.math.generatedHeight.max === 0 )) {
						lucidChart.color.minMaxThresh.setVia.integration.max = chartSettings.math.generatedHeight.max;
						lucidChart.color.minMaxThresh.setVia.integration.min = chartSettings.math.generatedHeight.min;
					}
					else if ((  chartSettings.math.randomMaxHeight || chartSettings.math.randomMaxHeight === 0 ) && ( chartSettings.math.randomMinHeight || chartSettings.math.randomMinHeight === 0 )) {
						lucidChart.color.minMaxThresh.setVia.integration.max = chartSettings.math.randomMaxHeight;
						lucidChart.color.minMaxThresh.setVia.integration.min = chartSettings.math.randomMinHeight;
					}
					else if (( chartSettings.math.maxThreshDefault || chartSettings.math.maxThreshDefault === 0 ) && ( chartSettings.math.maxThreshDefault || chartSettings.math.maxThreshDefault === 0 )) {
						lucidChart.color.minMaxThresh.setVia.integration.max = chartSettings.math.maxThreshDefault;  	
						lucidChart.color.minMaxThresh.setVia.integration.min = chartSettings.math.maxThreshDefault;						
					}
					else {
						lucidChart.color.minMaxThresh.setVia.integration.max = 0;
						lucidChart.color.minMaxThresh.setVia.integration.min = 0;
					}
				
				},
			}, 
			reset: function(){

					chartSettings.color.thresh.min = undefined;
					chartSettings.color.thresh.max = undefined;
					UI.browser.inputs.color.thresh.min.val( '' );
					UI.browser.inputs.color.thresh.max.val( '' );
			
			},
			colorOutside: function( chartSettings, yHeight ) {
		
				var x = chartSettings.math.xIterator;
				var z = chartSettings.math.zIterator;
				
				var mtl,				
					colorAboveThreshold,
					colorBelowThreshold;
					
				if ( chartSettings.color.thresh.isOn ){
					
					colorAboveThreshold = chartSettings.color.thresh.colorAbove;
					colorBelowThreshold = chartSettings.color.thresh.colorBelow;
					
					} 
					
				else {
						
					colorAboveThreshold = chartSettings.color.twoToneStops.top;
					colorBelowThreshold = chartSettings.color.twoToneStops.bottom;
						
					}
			
				yHeight >= lucidChart.color.minMaxThresh.setVia.integration.max ? mtl = sceneChildren.materials.solid.phong.load ( colorAboveThreshold.r , colorAboveThreshold.g , colorAboveThreshold.b ) : false;
				yHeight <= lucidChart.color.minMaxThresh.setVia.integration.max ? mtl = sceneChildren.materials.solid.phong.load ( colorBelowThreshold.r , colorBelowThreshold.g , colorBelowThreshold.b ) : false;
				
				debug.master && debug.colorLib && console.log ( 'Chart Element ( x ', x, ', z', z, ') y = ', yHeight ,' . Out of Range. Assigned Material = ', mtl );
				return mtl;
			}			
		}
	};
	
	sceneChildren.geometries.dynamic.chart = [];   // Set up the chart object 
	
	var yHeight;
	
	for ( x = lucidChart.data.range.start.x; x < (lucidChart.data.count.x + lucidChart.data.range.start.x); x++) {

		chartSettings.math.xIterator = x;	

		for (z = lucidChart.data.range.start.z; z < (lucidChart.data.count.z + lucidChart.data.range.start.z); z++ ) {
			
			chartSettings.math.zIterator = z;		

			yHeight = lucidChart.func.computed( x, z );
			
			// Making sure yHeight isn't an imaginary number before we do anything else. 
			if (!isNaN(yHeight)) {			
				
				// account for the render cap for handling infinities.
				if ( globalAppSettings.heightCapNearInfinity ){
					yHeight = heightCap( yHeight, chartSettings.math );  // if render capping is true for elements approaching infinite height, set the cap.
				}
				lucidChart.generatedHeight = lucidChart.height.generated.getMinAndMax( yHeight, chartSettings.math );		// Get the max and min y values generate by the heightFunc thus far.			
				
			}
	}
	}
	
	// lucidChart.color.heightZones.set( chartSettings );
	lucidChart.color.minMaxThresh.setVia.integration( chartSettings );
	chartSettings.color.hasColorZones === true ? lucidChart.color.heightZones.set( chartSettings ) : false;
	
	for (x = lucidChart.data.range.start.x; x < (lucidChart.data.count.x + lucidChart.data.range.start.x); x++) {
		
		sceneChildren.geometries.dynamic.chart[x] = [];
		
		chartSettings.math.xIterator = x;
		
		for (z = lucidChart.data.range.start.z; z < ( lucidChart.data.count.z + lucidChart.data.range.start.z); z++ ) {
			
			chartSettings.math.zIterator = z;
			
			yHeight = lucidChart.func.computed( x, z );
			
			// Making sure that yHeight isn't an imaginary number before continuing.
			if (!isNaN(yHeight)) { 
			
				// apply the height-render cap for infinities.
				if ( globalAppSettings.heightCapNearInfinity ){
					yHeight = heightCap( yHeight, chartSettings.math );
				}
				
				lucidChart.type.bar( x, z, yHeight, chartSettings.appearanceOptions.barThickness );
			}
		
		}
	}
	
	// For Debugging of the Chart;
	debug.master && debug.lucidChart && console.log ( 'lucidChart(): Max Height: ', chartSettings.math.generatedHeight.max, ' Min Height: ' , chartSettings.math.generatedHeight.min );
	debug.master && debug.lucidChart && console.log ( 'lucidChart(): Rendered Chart: ' , sceneChildren.geometries.dynamic.chart );
};

function chartBar( parameters ) {
	
	if ( !parameters ){ parameters = {}; }
	
	this.name = 'lucidChartx' + ( parameters.x || '0' ) + 'z' + ( parameters.z || '0' );
	this.isChartBar = true; 
	
	this.yHeight = parameters.yHeight || 1;
	this.thickness = parameters.thickness || 0.5;
	this.sides = parameters.sides || 4;
	this.parent = parameters.parent || scene;
	
	// Create the Pivot Object
	this.pivot = new THREE.Object3D();
	
	this.pivot.position.set( parameters.x || 0, 0, parameters.z || 0 );
	
	if ( parameters.quaternion ){
		this.pivot.rotation.setFromQuaternion( parameters.quaternion )
	}
	this.parent.add( this.pivot );
	
	// Create the Bar 
	this.barGeom = polygonExtrude( this.sides, ( ( this.thickness / 2 ) * Math.pow( 2, 0.5 ) ), this.yHeight );  
	this.bar = new THREE.Mesh( this.barGeom );
	this.bar.rotateY( THREE.Math.degToRad( 360 / this.sides ) );	
	this.bar.rotateX( THREE.Math.degToRad( -90 ) );		
	
	this.bar.material = parameters.material || new THREE.MeshPhongMaterial ({ color: 0x777777 }); 
	this.bar.material.side = lucidChart.color.materialSides;
	this.bar.castShadows = true;
	this.bar.receiveShadows = true;

//	this.bar.position.set( 0, this.yHeight / 2, 0 );
	
	this.pivot.add( this.bar );	
}

function polygonExtrude( sides, radius, height ){
	
	sides = sides !== undefined ? Math.max( 3, sides ) : 6;
	
	var shape = new THREE.Shape();
	
	var vertex;

	for ( var s = 0; s <= sides; s ++ ) {

		var side = s / sides * ( Math.PI * 2 );
		
		vertex = new THREE.Vector2();
		
		vertex.x = radius * Math.cos( side );
		vertex.z = radius * Math.sin( side );
		
		if ( s === 0 ){ shape.moveTo( vertex.x, vertex.z ) }
		else { shape.lineTo( vertex.x, vertex.z ); }
	}
	
	var extrudeSettings = {
		steps: 1,
		amount: height,
		bevelEnabled: false, 
	};	
	
	var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
	geometry.isExtrudeGeometry = true;
	
	return geometry;
}

function heightCap( height, cap = 9999 ){
	
	height >= cap  ?  height = cap : false;
	height <= -cap ?  height = -cap : false;
	
	return height;
	
}






// Values passed for lucidChart creation and render on app load.
lucidChart.init = function() {
	
	chartSettings.data = {

			range: {
				start: {
					x: -20,
					z: -20
				},
				end: {
					x: 20,
					z: 20
				}
			},
			count: {
				x: function(){ 					
					return chartSettings.data.range.end.x - chartSettings.data.range.start.x;
				},
				z: function(){
					return chartSettings.data.range.end.z - chartSettings.data.range.start.z;
				}
			}
			};
						
	chartSettings.math = {
			dataType: 'equation',
			heightFunc: lucidChart.math.func.preset.dict,
			demoEquation: "Wave",						// If using one of the demo equations, this sets which to use.
			minUserSetHeight: -5,
			maxUserSetHeight: 5,
			heightRoot: 2,
			exponent: 0.3,
			xIterator: 0, // 							Initialize Passable var for within the loop
			zIterator: 0, // 							Initialize Passable var for within the loop
			generatedHeight: {							// Generated Height will hold maxima and minima later. We're just initializing now.
				min: null,
				max: null
				}
			};
			
	chartSettings.color = {
			mode: 'randomColor',
			func: lucidChart.colorFunc.random,
			countRawVal: 1,
			getCount: function(){
				
				if ( chartSettings.color.countRawVal === 1 ){
					chartSettings.color.count = 11; }
				else if ( chartSettings.color.countRawVal === 2 ){
					chartSettings.color.count = 44; }
				else if ( chartSettings.color.countRawVal === 3 ){
					chartSettings.color.count = 121; }
				else {chartSettings.color.count = 11; }
			},
			monoColor: { 
				r: 255,
				g: 255, 
				b: 255
				},
			twoToneStops: colorLib.stops.preset.twoTone(),
			rainbowStops: colorLib.stops.preset.rainbow(),
			grayScaleStops: colorLib.stops.preset.grayScale(),
			gradientType: 'twoTone',
			palette: { 
				//We'll fill this empty object with values using the colorLib.generate function below.
				activeColorStops: chartSettings.color.twoToneStops
			},
			thresh: {
				isOn: true,
				min: -5,
				max: 5,
				defaultMin: 0,
				defaultMax: 0,
				topAndBottomBound: {
					isTrue: true
				},
				setColorsAboveAndBelow: function(){
					chartSettings.color.thresh.colorBelow = colorLib.stops.get.first( chartSettings.color.palette.activeColorStops );
					chartSettings.color.thresh.colorAbove = colorLib.stops.get.last( chartSettings.color.palette.activeColorStops );
				} 
			},
			materialSides: THREE.DoubleSide, // Which way to have the normals face?
			hasColorZones: false,
			heightZones: {
				size: null,
				totalColorizeRange: null,
				count: null,
				zone: []
			}
	};

	// Get the color count from the raw slider input
	chartSettings.color.getCount();
	
	// Generate the library of colors we'll use based on the present defaults above.
	colorLib.generate( chartSettings ); 
	
	chartSettings.color.thresh.setColorsAboveAndBelow();
	
	chartSettings.appearanceOptions = {
		barThicknessRawVal: 2,
		getBarThickness: function(){
			
			chartSettings.appearanceOptions.barThickness = chartSettings.appearanceOptions.barThicknessRawVal * 0.25; 
		}
	};
	
	chartSettings.appearanceOptions.getBarThickness();
	
	if ( UI.browser ){
		UI.browser.update.inputs.slider();
		UI.browser.update.inputs.radioAndCheck();
		UI.browser.update.inputs.selectAndText();
		UI.browser.update.inputs.colorPicker();
		UI.browser.update.inputs.currentStates();
	}
	
};

// Values collected and passed on user clicking the Update button.
lucidChart.update = function() {
	
	chartSettings.data.range.start.x = parseInt(UI.browser.inputs.data.range.start.x.val()) || 0;
	chartSettings.data.range.start.z = parseInt(UI.browser.inputs.data.range.start.z.val()) || 0; 
	chartSettings.data.range.end.x = parseInt(UI.browser.inputs.data.range.end.x.val()) || 0;
	chartSettings.data.range.end.z = parseInt(UI.browser.inputs.data.range.end.z.val()) || 0; 
	chartSettings.data.count.x();
	chartSettings.data.count.z();

	lucidChart.data.mode.update();    // Set dynamically interrelated variables.
	
	chartSettings.math.minUserSetHeight = parseInt(UI.browser.inputs.data.random.height.min.val()) || 0;
	chartSettings.math.maxUserSetHeight = parseInt(UI.browser.inputs.data.random.height.max.val()) || 0;
	chartSettings.math.heightRoot = 2;
	chartSettings.math.exponent = 0.3;
	chartSettings.math.xIterator = 0; 								// Initialize Passable var for within the loop
	chartSettings.math.zIterator = 0; 								// Initialize Passable var for within the loop
	
	lucidChart.height.generated.reset();												// Reset the GeneratedHeight Values
	
	lucidChart.color.mode.update();    											// Set dynamically interrelated variables.		
	
	chartSettings.color.countRawVal = parseInt(UI.browser.inputs.color.countRawVal.val()) || 1;	
	chartSettings.color.getCount();
	chartSettings.color.monoColor = sceneChildren.materials.hexToDec ( UI.browser.inputs.color.mono.val() );
	chartSettings.color.twoToneStops.top = sceneChildren.materials.hexToDec ( UI.browser.inputs.color.top.val() );
	chartSettings.color.twoToneStops.bottom = sceneChildren.materials.hexToDec ( UI.browser.inputs.color.bottom.val() );
	
	lucidChart.color.gradientType.update();
	chartSettings.color.thresh.isOn = UI.browser.inputs.color.thresh.isOn.input.is(':checked');
	chartSettings.color.thresh.colorAbove = sceneChildren.materials.hexToDec ( UI.browser.inputs.color.thresh.colorAbove.val() );
	chartSettings.color.thresh.colorBelow = sceneChildren.materials.hexToDec ( UI.browser.inputs.color.thresh.colorBelow.val() );

	lucidChart.color.minMaxThresh.setVia.UI();	// assign the color thresholds from the browserUI or set them as undefined depending on whether hasMinMaxColorThreshold is checked.
	
	chartSettings.color.materialSides = THREE.DoubleSide; // Which way to have the normals face?

	colorLib.generate( chartSettings );
	
	chartSettings.appearanceOptions.barThicknessRawVal = parseInt(UI.browser.inputs.appearanceOptions.barThicknessRawVal.val()) || 2;
	chartSettings.appearanceOptions.getBarThickness();
	
	debug.master && debug.lucidChart && console.log ( 'chartSettings after lucidChart.update(): ', chartSettings );
	
	deleteChart( 'chart1' );
	
	lucidChart({ func: chartSettings.math.heightFunc, chartSettings: chartSettings, name: 'chart1' });
	
	UI.browser.update.inputs.textAndNum();
	UI.browser.update.inputs.slider();
	UI.browser.update.inputs.camPos();
	UI.browser.update.inputs.radioAndCheck();
	UI.browser.update.inputs.selectAndText();
	UI.browser.update.inputs.colorPicker();
};

function lucidChartFromInput( mathString ){

	var func = function( math ){ 
	
		var usr = {
			computed: function( x, z ){ 
				return evalMathArr( getInnermostParenContent( getMathFromString( mathString ) ) ) 
			},
			display: function() { return mathString; }
		}
		
		return usr;
		
	}
	
	lucidChart({ func: func, chartSettings: chartSettings, name: 'userChart' });
}

lucidChart.math = {
	func: {
		preset: { 
			dict: function( math ) {
		
				var selectorString = math.demoEquation || "AsymptoticCrash1";
				
				/* Dictionary of preset functions for generating lucidChart y (height) values and related utilities */					
				var dictionary = {
					"basicQuadratic"   : { 
						computed: 	function( x, z ) { return (Math.pow( x , 2 ) + z ); },
						display: 	function() { return 'x<sup>2</sup> + z'; }			
					},
					"Qbert" : { 
						computed: 	function( x, z ) { return (Math.pow( x , 1.05 )) - (Math.pow( z , 1.05 )); },
						display:	function() { return 'x<sup>1.05</sup> - z<sup>1.05</sup>'; }
					},
					"Precipitous" : {
						computed: 	function( x, z ) { return (Math.pow( x , 0.85 )) - (Math.pow((x * z), ( 0.1 * x ))) + (Math.pow ( z , 1.15 )); },
						display: 	function() { return 'x<sup>0.85</sup> - ( x * z )<sup>( 0.1 * x )</sup> + z<sup>1.15</sup>'; }
					},
					"Rocketing" 		: {						
						computed: 	function( x, z ) { return (Math.pow( x - z , (0.1 * ( x - z)))); },
						display: 	function() { return '( x - z )<sup>( 0.1 * ( x - z ))</sup>'; }
					},
					"Wave" 				: {
						computed: 	function( x, z ) { return (Math.pow( x + z , (0.05 * ( x - z)))); },
						display: 	function() { return '( x + z )<sup>(0.05 * ( x - z ))</sup>'; }
					},
					"Steppe" 			: {
						computed:	function( x, z ) { return (Math.pow( x , (1/x) ) + Math.pow( z , (1/z) )); },
						display:	function(){ return 'x<sup>( 1 / x )</sup> + z<sup>( 1 / z )</sup>'; }
					},
					"Rockslide" 		: {
						computed: 	function( x, z ) { return (Math.pow( x , z/x ) + Math.pow( z , x/z )); },
						display:	function() { return 'x<sup>( z / x )</sup> + z<sup>( x / z )</sup>'; }
					},
					"Waterfall" 		: {
						computed: 	function( x, z ) { return (Math.pow( x , z/x ) + Math.pow( z , 0.3 )); },
						display:	function() { return 'x<sup>( z / x)</sup> + z<sup>0.3</sup>'; }
					},
					"AsymptoticCrash1" 	: {
						computed: 	function( x, z ) { return ( x / z ); },
						display:	function() { return 'x / z'; }
					},
					"GatesAndWalls" 	: {
						computed: 	function( x, z ) { return (Math.pow( x , ( z / 10 )) + Math.pow( z , ( x / 10 ))); },
						display:	function() { return 'x<sup>( z / 10 )</sup> + z<sup>( x / 10 )</sup>'; }
					},
					"AsymptoticCrash2" 	: {
						computed: 	function( x, z ) { return ( (x + ( z / 2 )) / ( z + ( x / 2 )) ); },
						display:	function() { return '( x + ( z / 2 )) / ( z + ( x / 2 ))'; }
					},
					"SineTest"  		: { 
						computed: 	function( x, z ) { return ( Math.sin( x ) + Math.sin( z ) ); },
						display: 	function() { return 'Sin( x ) + Sin( z )'; }			
					},
					"SineTest2"  		: { 
						computed: 	function( x, z ) { return ( z * Math.sin( x ) ); },
						display: 	function() { return 'z Sin( x )'; }			
					},					
					"LogTest"  		: { 
						computed: 	function( x, z ) { return ( Math.log( x ) + Math.log( z ) ); },
						display: 	function() { return 'Log( x ) + Log( z )'; }			
					},
					"LogTest2"  	: { 
						computed: 	function( x, z ) { return ( Math.pow( x, ( Math.log( z ) / 100 ) ) + Math.pow( z, 1/Math.log( x ) ) ); },
						display: 	function() { return 'x ^ ( Log( z ) / 100 ) + z ^ ( 1 / Log( x ) )'; }			
					},					
					"randomHeight"	  	: {
						computed:	function(){ var min = math.minUserSetHeight || 0; // Default 0
												var max = math.maxUserSetHeight || 0; // Default 0 
												var range = max - min;
												return min + range * Math.random();
										},
						display:	function(){ return 'Random: Min cell height = ' + math.minUserSetHeight + ', Max = ' + math.maxUserSetHeight; }
					},
					"minPlusExponent"  : {
						computed: 	function( x, z ) {  var min = math.minUserSetHeight || 0;  // Default 0
														var base = z || 0;  // Default 1
														var exponent = math.exponent || 2;  // Default 2
														var exp = Math.pow( base, exponent );
														return exp || min || 1 ; // return either the product, or if undefined min. If min is also undefined, return 1.
										},
						display:	function() { return 'z<sup>' + math.exponent + '</sup> OR ' + math.minUserSetHeight + ' OR ' + 0 ; 
						}
					}
				};
				
				return dictionary[ selectorString ];			
			},
			parse: function( math ) {
		
				var entire = math.heightFunc( math ).toString();
				var startIndex = '{';
				var lastIndex = ';';
				var removeReturn = 'return ';
				
				var body = entire.substring(entire.indexOf( startIndex ) + 1, entire.lastIndexOf( lastIndex ));
				body = body.replace( removeReturn, '' );   // Remove the return part of the function
				
				return body;	
			}
		}
	}
};

/****** END DYNAMIC DATATYPE HANDLING ******/

/****** DYNAMIC MATERIAL ASSIGNMENT FUNCTIONS ******/

// Color Mode Handling

lucidChart.colorFunc = {
	random: function( chartSettings) {
		var cCount = chartSettings.color.count || 11; // Default 12 Colors
		var rndColorIndex = Math.floor(Math.random() * cCount ); // Pick how many Colors in the Scheme;
		var material = sceneChildren.materials.fromColor( chartSettings.color, rndColorIndex );

		return material;
	},
	byHeight: function( chartSettings, yHeight ) {
		var y = yHeight || 6;
		var x = chartSettings.math.xIterator;
		var z = chartSettings.math.zIterator;
			
		var material;
		
		for ( j = 0; j < chartSettings.color.heightZones.count; j++ ) {
				
			if ( y >= chartSettings.color.heightZones.zone[j].min && y <= chartSettings.color.heightZones.zone[j].max )  { 
				material = sceneChildren.materials.fromColor( chartSettings.color, j );
				debug.master && debug.lucidChart && console.log ('Chart Element ( x ', x, ', z', z, ') y = ', yHeight ,' . In zone ', j , '(min: ', chartSettings.color.heightZones.zone[j].min,', max: ', chartSettings.color.heightZones.zone[j].max,'). Assigned Material = ', material );
				break;
				}
			else debug.master && debug.lucidChart && console.log ('Chart Element ( x ', x, ', z', z, ') y = ', yHeight ,' . Not in zone ', j , '(min: ', chartSettings.color.heightZones.zone[j].min,', max: ', chartSettings.color.heightZones.zone[j].max,'). Trying next zone' );
			
			}
		
		// If no color is assigned, assign the highest zone color if y > maxThresh or the lowest zone color if y < minThresh
		!(material) ? material = lucidChart.color.minMaxThresh.colorOutside( chartSettings, y ) : material = material; 
		
		return material; 		
	},
	monoChrome: function() {
		var material = sceneChildren.materials.solid.phong.load ( chartSettings.color.monoColor.r , chartSettings.color.monoColor.g , chartSettings.color.monoColor.b );	
		return material;		
	}
};

/****** END LUCID CHART ENTITY CREATE ******/


/****** DYNAMIC COLOR LIBRARY GENERATION & PRELOAD ******/

colorLib = {
	
	generate: function( chartSettings ) {
	
		var colorCount = chartSettings.color.count;
		var colorStops = chartSettings.color[chartSettings.color.gradientType + 'Stops'];
		var stopsCount = colorLib.stops.get.count( colorStops );   // # color stops.	If stops = "red, orange, yellow, green", then 4.
		var octaveCount = stopsCount -1;										  // # color stops, minus the last. If 4 stops, then 3.
		var colorsPerOctave = Math.floor( colorCount / octaveCount );			  // # colors in each octave. If 14 colors and 3 octaves, then 4 (14/3 = 4.67) -> Math.floor(4.67) = 4
		var modulo = colorCount % octaveCount;									  // # left over after all octaves have been subtracted. If 14 colors and 3 octaves then 2 ( 14 = 12-2 -> 12/3...)
		var colorCountAfterEachStop;											  // 
		
		chartSettings.color.palette.activeColorStops = colorStops;
		
		if ( chartSettings.color.gradientType === 'twoTone' || chartSettings.color.gradientType === 'grayScale') {
			colorCountAfterEachStop = colorCount - 1 ;	
		} 
		
		if ( chartSettings.color.gradientType === 'rainbow') {
			colorCountAfterEachStop = colorsPerOctave - 1 || 1 ;  // May need to fix this default later.
		}
			
		chartSettings.color.palette.stopsCount = stopsCount;
		chartSettings.color.palette.colorCountAfterEachStop = colorCountAfterEachStop;
		chartSettings.color.palette.octaveCount = octaveCount;
		chartSettings.color.palette.colorsPerOctave = colorsPerOctave;
		chartSettings.color.palette.modulo = modulo;
		
		chartSettings.color.palette.colorArray = colorLib.asArray.populate( chartSettings );
		
		debug.master && debug.colorLib && console.log ('colorLib.generate(): ',  chartSettings.color );
	},
	stops: {
		preset: {
			rainbow: function(){

				var rainbowStops = {
					red: 		{	r: 255,		g: 0, 		b: 0 	},
					orange: 	{	r: 255, 	g: 128, 	b: 0 	},
					yellow: 	{	r: 255,		g: 255,		b: 0 	},
					yellowGreen:{	r: 128,		g: 255,		b: 0 	},
					green:		{	r: 0,		g: 255,		b: 0 	},
					greenBlue:	{	r: 0,		g: 255,		b: 128 	},
					cyan:		{	r: 0,		g: 255,		b: 255	},
					blueGreen:	{	r: 0,		g: 128,		b: 255	},
					blue:		{	r: 0,		g: 0,		b: 255	},
					indigo:		{	r: 128,		g: 0,		b: 255	},
					purple:		{	r: 255,		g: 0,		b: 255	},
					violet:		{	r: 255,		g: 0,		b: 128	}
				};
	
				return rainbowStops;				
			},
			grayScale: function() {
				
				var grayScale = {
					black: 		{	r: 0,		g: 0,		b: 0 	},
					white:		{	r: 255,		g: 255,		b: 255	}
				};
				
				return grayScale;
			},
			twoTone: function() {
				
				var twoToneStops = {
					bottom: 	{	r: 0,		g: 128,		b: 255 	},
					top: 		{	r: 255,		g: 255,		b: 128	} 
				};
				
				return twoToneStops;
				
			}
		},
		get: {
			count: function( obj ) {
				var size = 0, key;
					for ( key in obj ) {
						if (obj.hasOwnProperty(key)) size++;
					}
				return size;		
			},
			first: function( stopSetObj ){
				
				var firstStop = stopSetObj[Object.keys(stopSetObj)[0]]; 
				
				debug.master && debug.colorLib && console.log( 'lucidChart.color.stops.get.first(): ', firstStop );
				
				return firstStop;
				
			},
			last: function( stopSetObj ){
				
				var lastStop = stopSetObj[Object.keys(stopSetObj)[Object.keys(stopSetObj).length - 1]];
				
				debug.master && debug.colorLib && console.log( 'lucidChart.color.stops.get.last(): ', lastStop );
				
				return lastStop;
				
			},
			deltas: function( obj, i ) {
				obj[i].delta = {};
				
				// Calculate the difference values;
				obj[i].delta.r = obj[i].r[0] - obj[i-1].r[0];
				obj[i].delta.g = obj[i].g[0] - obj[i-1].g[0];
				obj[i].delta.b = obj[i].b[0] - obj[i-1].b[0];
			},	
		},
		colorsBetweenEach: {
			get: {
				count: function( obj, colorCountAfterEachStop, i ) {
					
					debug.master && debug.colorLib && console.log ( 'colorLib.stops.colorsBetweenEach.get.count: Object Imported: ', obj );
	
					obj[i].interval = {};
					
					// Calculated the color step size between two stops
					obj[i].interval.r = obj[i].delta.r / colorCountAfterEachStop;
					obj[i].interval.g = obj[i].delta.g / colorCountAfterEachStop;
					obj[i].interval.b = obj[i].delta.b / colorCountAfterEachStop;

					debug.master && debug.colorLib && console.log ( 'colorLib.stops.colorsBetweenEach.get.count: Object Transformed: ', obj );
				}
			},
			calc: function( obj, colorCountAfterEachStop, i ) {					
				let h = i-1;
				
				debug.master && debug.colorLib && console.log ( 'colorLib.stops.colorsBetweenEach.calc: Array imported: ', obj );
				
				for ( c = 1 ; c < /* colorCountAfterEachStop */ chartSettings.color.palette.colorsPerOctave ; c++ ) {			

					obj[h].r[c] = parseInt(Math.round( obj[h].r[c-1] + obj[i].interval.r ));
					obj[h].g[c] = parseInt(Math.round( obj[h].g[c-1] + obj[i].interval.g ));
					obj[h].b[c] = parseInt(Math.round( obj[h].b[c-1] + obj[i].interval.b ));
					
					// Make sure generated colors are within the 0-255 range.
					obj[h].r[c] >= 255 ? obj[h].r[c] = 255 : false;
					obj[h].g[c] >= 255 ? obj[h].g[c] = 255 : false;
					obj[h].b[c] >= 255 ? obj[h].b[c] = 255 : false;		

					obj[h].r[c] < 0 ? obj[h].r[c] = 0 : false;
					obj[h].g[c] < 0 ? obj[h].g[c] = 0 : false;
					obj[h].b[c] < 0 ? obj[h].b[c] = 0 : false;
					
				}
				
				debug.master && debug.colorLib && console.log ( 'colorLib.stops.colorsBetweenEach.calc: Array Transformed: ', obj );
			}
		}
	},
	asArray: {
		populate: function( obj ) {

			var stopsArray = [];
			let i = 0;
			var key;

			for ( key in obj.color.palette.activeColorStops ) {
				
				if (obj.color.palette.activeColorStops.hasOwnProperty(key)) {
					
					stopsArray[i] = {};
					stopsArray[i].r = [];
					stopsArray[i].g = [];
					stopsArray[i].b = [];
				
					stopsArray[i].r[0] = obj.color.palette.activeColorStops[key].r;
					stopsArray[i].g[0] = obj.color.palette.activeColorStops[key].g;
					stopsArray[i].b[0] = obj.color.palette.activeColorStops[key].b;
					
					// Make sure none of the color values are over 255.
					
					stopsArray[i].r[0] >= 255 ? stopsArray[i].r[0] = 255 : false;
					stopsArray[i].g[0] >= 255 ? stopsArray[i].g[0] = 255 : false;
					stopsArray[i].b[0] >= 255 ? stopsArray[i].b[0] = 255 : false;
					
					if (i > 0) {
						colorLib.stops.get.deltas( stopsArray, i );  // Color changes from one stop to the next.
						colorLib.stops.colorsBetweenEach.get.count( stopsArray, obj.color.palette.colorCountAfterEachStop, i );
						colorLib.stops.colorsBetweenEach.calc( stopsArray , obj.color.palette.colorCountAfterEachStop, i );
					}
					
					i++;
				}
			}
			
			var flattenedArray = colorLib.asArray.flatten( stopsArray, obj.color.palette.colorCountAfterEachStop );
			
			debug.master && debug.colorLib && console.log ( 'colorLib.asArray.populate(): ', flattenedArray );
			
			return flattenedArray;
		},
		flatten: function( obj, colorCountAfterEachStop ) {

			var stopsCount = obj.length;
			var asArrayLength = ((( stopsCount - 1 ) * colorCountAfterEachStop ) + 1); 
			var flatArray = [];
			var counter = 0;
			
			for ( a = 0; a < stopsCount; a++ ) {
				
				for (b = 0; b < obj[a].r.length ; b++ ){
					
					flatArray[counter] = {};
					
					flatArray[counter].r = obj[a].r[b];
					flatArray[counter].g = obj[a].g[b];
					flatArray[counter].b = obj[a].b[b];
					counter++
				};
				
			};

			debug.master && debug.colorLib && console.log ( 'colorLib.asArray.flatten(): ', flatArray );
			
			return flatArray;
		}
	}

	
};

/****** END DYNAMIC COLOR LIBRARY GENERATION & PRELOAD ******/

/****** UTILITIES FOR GENERAL EVENT HANDLING ******/

function dispatchLoggedEvent( e ) {

	debug.master && debug.events && console.log ( 'About to dispatch ' , e );
	dispatchEvent( e );
	debug.master && debug.events && console.log ( 'Just dispatched ' , e );
		
}

/****** END UTILITIES FOR GENERAL EVENT HANDLING ******/
/*
})();  */