// UI Initialization
var UI = function( device /* In the browser, or in mixedReality? */ ) {  
	
	UI.sharedStates = {
			thresholdColorsBound: true,
		};
	UI.log = function() {
				console.log( 'UI.', device, '(): ', UI[device] );
		};
	UI.browser = function() {
		
		var self = UI.browser;
			
		// DATA STATES
		
		self.inputs = {
			data: {
				typeSelect: {	
					input: $('input[name="dataType"]'),
					equation: $('#dataTypeEquation'),
					random: $('#dataTypeRandomHeight')
					},	
				equation: {
					select: $('#equationSelect'),
					text: $('#equationTextBox')
					},
				random: {
					height: {
						min: $('#randomMinHeight'),
						max: $('#randomMaxHeight')	
					}
				},
				range: {
					start: {
						x: $('#xRangeStart'),
						z: $('#zRangeStart')
					},
					end: {
						x: $('#xRangeEnd'),
						z: $('#zRangeEnd')
					}
				},
				count: { 
					x: $('#xCount'),
					z: $('#zCount')
				},
			},
			color: {					
				modeSelect: { 
					input: $('input[name="colorMode"]'),
					random: $('#colorModeRandom'),
					byHeight: $('#colorModeByHeight'),
					mono: $('#colorModeMonoChrome'),
					},
				countRawVal: $('#choosePaletteDepth'),
				mono: $('#monoColor'),
				top: $('#topColor'),
				bottom: $('#bottomColor'),
				gradientSelect: { 
					input: $('input[name="gradientType"]'), 
					twoTone: $('#gradientTwoTone'),
					grayScale: $('#gradientGrayScale'),
					rainbow: $('#gradientRainbow')
					},
				thresh: {
					isOn: {
						input: $('input[name="hasMinMaxColorThreshold"]')
					},
					min: $('#minColorHeight'),
					max: $('#maxColorHeight'),
					colorAbove: $('#colorAboveThreshold'),
					colorBelow: $('#colorBelowThreshold'),
					topAndBottomBound: {
						isTrue: null,
						bind: function() {
							UI.browser.inputs.color.top.change( function() { dispatchLoggedEvent( UI.browser.events.boundTopColorChange );} );		
							UI.browser.inputs.color.bottom.change ( function() { dispatchLoggedEvent( UI.browser.events.boundBottomColorChange ); } );
							
							UI.browser.inputs.color.thresh.colorAbove.click( function( e ) { UI.browser.inputs.color.thresh.topAndBottomBound.confirmUnbind( e ); } );
							UI.browser.inputs.color.thresh.colorBelow.click( function( e ) { UI.browser.inputs.color.thresh.topAndBottomBound.confirmUnbind( e ); } );
						},
						listen: function() {
							addEventListener( 'boundTopColorChange' , UI.browser.inputs.color.thresh.topAndBottomBound.aboveThresh );
							addEventListener( 'boundBottomColorChange' , UI.browser.inputs.color.thresh.colorBelow );
							UI.browser.inputs.color.thresh.topAndBottomBound.isTrue = true;
						},
						unListen: function() {
							removeEventListener( 'boundTopColorChange' , UI.browser.inputs.color.thresh.topAndBottomBound.aboveThresh );
							removeEventListener( 'boundBottomColorChange' , UI.browser.inputs.color.thresh.colorBelow );
							UI.browser.inputs.color.thresh.topAndBottomBound.isTrue = false;
						},
						confirmUnbind: function( e ) {
							if ( UI.sharedStates.thresholdColorsBound ) {
								if (confirm('Changing the Below Min or Above Max colors manually will unbind them from the Top and Bottom Color settings. Proceed?') === true) {
									UI.browser.inputs.color.thresh.topAndBottomBound.unListen();
									UI.sharedStates.thresholdColorsBound = false;
									} 
								else { 
									e.preventDefault();
									} 
							}
							return UI.sharedStates.thresholdColorsBound;
						}						
					}
				}
			},	
			appearanceOptions: {
				barThicknessRawVal: $('#barThickness')
			},
		
			camPos: {
				x: $('#xCamPos'),
				y: $('#yCamPos'),
				z: $('#zCamPos')
			},
			
			updateBtn: document.getElementById('updateBtn')	
		};	
		
		self.fieldsets = {
			data: {
				typeSelect: $('#dataTypeSelect'),
				equationOptions: $('#dataEquationOptions'),
				randomOptions: $('#dataRandomOptions'),
				rangeOptions: $('#dataRange'),
			}, 
			color: {
				modeSelect: $('#colorModeSelect'),
				palette: $('#colorPalette'),
				colorPickers: $('#colorPickers'),
				monoColorPicker: $('#monoColorPicker'),
				byHeightColorPickers: $('#byHeightColorPickers'),
				gradientSelect: $('#colorGradientSelect'),
				heightThresh: $('#colorHeightThresh'),
				threshSettings: $('#threshSettings')
				},
			appearanceOptions: $('#appearanceOptions'),
			campos: $('#cameraPositions'),
		};

		self.setCheckedVal = function( name, selectedValue ) {
		$('input[name="' + name+ '"][value="' + selectedValue + '"]').prop('checked', true);
		};

		self.update = {
			inputs: {
				textAndNum: function() { 

					// Min & Max Height
					self.inputs.data.random.height.min.attr('value',chartSettings.math.minUserSetHeight);
					self.inputs.data.random.height.max.attr('value',chartSettings.math.maxUserSetHeight);
					
					// range.start.x & range.start.z
					self.inputs.data.range.start.x.attr('value', chartSettings.data.range.start.x);
					self.inputs.data.range.start.z.attr('value', chartSettings.data.range.start.z);
					
					
					// range.start.x & range.start.z
					self.inputs.data.range.end.x.attr('value', chartSettings.data.range.end.x);
					self.inputs.data.range.end.z.attr('value', chartSettings.data.range.end.z);
					
					// xCount & zCount
					self.inputs.data.count.x.attr('value', chartSettings.data.count.x());
					self.inputs.data.count.z.attr('value', chartSettings.data.count.z());

					// COLOR
					// min & max height threshold
					self.inputs.color.thresh.min.attr('value', chartSettings.color.thresh.min );
					self.inputs.color.thresh.max.attr('value', chartSettings.color.thresh.max );	
					
				},
				
				slider: function() {
					
					self.inputs.color.countRawVal.val( chartSettings.color.countRawVal );
					
					self.inputs.appearanceOptions.barThicknessRawVal.val( chartSettings.appearanceOptions.barThicknessRawVal );
					
				},

				camPos: function() {
					
			//		var camera = sceneChildren.cameras.perspCamera;
					
					self.inputs.camPos.x.attr('value', camera.position.x);
					self.inputs.camPos.y.attr('value', camera.position.y);
					self.inputs.camPos.z.attr('value', camera.position.z);		
				},

				selectAndText: function() { 
					
					self.inputs.data.equation.select.val( chartSettings.math.demoEquation );

					self.inputs.data.equation.text.html( 'y = ' + lucidChart.math.func.preset.dict( chartSettings.math ).display() || 'null' );

				},

				radioAndCheck: function() { // Formerly "Static"
					
					// DATA
					self.setCheckedVal( 'dataType' , chartSettings.math.dataType );

					// Color Mode
					self.setCheckedVal( 'colorMode' , chartSettings.color.mode );
					
					// Gradient Type
					self.setCheckedVal( 'gradientType' , chartSettings.color.gradientType );
					
					// hasMinMaxColorThreshold
					self.setCheckedVal( 'hasMinMaxColorThreshold' , chartSettings.color.thresh.isOn );
					
				},

				colorPicker: function() { // Formerly "static" 
					
					self.inputs.color.mono.val( '#' + sceneChildren.materials.hexFromChannels ( sceneChildren.materials.channelDecToHex ( chartSettings.color.monoColor.r ), sceneChildren.materials.channelDecToHex ( chartSettings.color.monoColor.g ), sceneChildren.materials.channelDecToHex (chartSettings.color.monoColor.b ) ) );
					// Top Color
					self.inputs.color.top.val( '#' + sceneChildren.materials.hexFromChannels ( sceneChildren.materials.channelDecToHex ( chartSettings.color.twoToneStops.top.r ), sceneChildren.materials.channelDecToHex ( chartSettings.color.twoToneStops.top.g ), sceneChildren.materials.channelDecToHex (chartSettings.color.twoToneStops.top.b ) ) );
					// Bottom Color
					self.inputs.color.bottom.val( '#' + sceneChildren.materials.hexFromChannels ( sceneChildren.materials.channelDecToHex ( chartSettings.color.twoToneStops.bottom.r ), sceneChildren.materials.channelDecToHex ( chartSettings.color.twoToneStops.bottom.g ), sceneChildren.materials.channelDecToHex (chartSettings.color.twoToneStops.bottom.b ) ) );
					// colorAboveThreshold
					self.inputs.color.thresh.colorAbove.val( '#' + sceneChildren.materials.hexFromChannels ( sceneChildren.materials.channelDecToHex ( chartSettings.color.thresh.colorAbove.r ), sceneChildren.materials.channelDecToHex ( chartSettings.color.thresh.colorAbove.g ), sceneChildren.materials.channelDecToHex (chartSettings.color.thresh.colorAbove.b ) ) );
					// colorBelowThreshold
					self.inputs.color.thresh.colorBelow.val( '#' + sceneChildren.materials.hexFromChannels ( sceneChildren.materials.channelDecToHex ( chartSettings.color.thresh.colorBelow.r ), sceneChildren.materials.channelDecToHex ( chartSettings.color.thresh.colorBelow.g ), sceneChildren.materials.channelDecToHex (chartSettings.color.thresh.colorBelow.b ) ) );

				},
				
				data: {
					dynamicCounts: {
						x: function() { 
								self.inputs.data.count.x.attr ( 'value' , chartSettings.data.count.x()); 
							},
						z: function() {
								self.inputs.data.count.z.attr ( 'value' , chartSettings.data.count.z());
							}
						}
					},
				
				currentStates: function(){
						// Get the initial datatype
						var dataTypeRandom = self.inputs.data.typeSelect.random.is(':checked');
						var dataTypeEquation = self.inputs.data.typeSelect.equation.is(':checked');
						
						// Get the initial colormode
						var colorModeRandom = self.inputs.color.modeSelect.random.is(':checked');
						var colorModeByHeight = self.inputs.color.modeSelect.byHeight.is(':checked');
						var colorModeMono = self.inputs.color.modeSelect.mono.is(':checked');
						
						// Get the initial gradientType
						var gradientTypeTwoTone = self.inputs.color.gradientSelect.twoTone.is(':checked');
						var gradientTypeRainbow = self.inputs.color.gradientSelect.rainbow.is(':checked');
						
						// Get the initial hasThresholds state
						var hasThresholds = self.inputs.color.thresh.isOn.input.is(':checked');
						
						// Conditionally show or hide based on states:
						
						if (dataTypeRandom) {
							self.fieldsets.data.randomOptions.show();
							self.fieldsets.data.equationOptions.hide();
							self.fieldsets.color.heightThresh.hide();		
						}
						
						if (dataTypeEquation) {
							self.fieldsets.data.randomOptions.hide();
							self.fieldsets.data.equationOptions.show();
							
							if (colorModeRandom || colorModeMono){
								self.fieldsets.color.heightThresh.hide();
								}
							else if (colorModeByHeight) {
								self.fieldsets.color.heightThresh.show();
							}
						}
						
						if (colorModeRandom) {
							self.fieldsets.color.gradientSelect.show();
							self.fieldsets.color.palette.show();
							self.fieldsets.color.monoColorPicker.hide();	
							self.fieldsets.color.heightThresh.hide();
							
							if (gradientTypeTwoTone) {
								self.fieldsets.color.byHeightColorPickers.show();
								}
							else if (gradientTypeRainbow) {
								self.fieldsets.color.byHeightColorPickers.hide();						
								}
						}
						
						if (colorModeByHeight) {
							self.fieldsets.color.gradientSelect.show();
							self.fieldsets.color.palette.show();
							self.fieldsets.color.monoColorPicker.hide();	
							self.fieldsets.color.heightThresh.show();
							
							if (gradientTypeTwoTone) {
								self.fieldsets.color.byHeightColorPickers.show();
								}
							else if (gradientTypeRainbow) {
								self.fieldsets.color.byHeightColorPickers.hide();						
								}
						}
						
						if (colorModeMono) {
							self.fieldsets.color.monoColorPicker.show();
							self.fieldsets.color.byHeightColorPickers.hide();
							self.fieldsets.color.gradientSelect.hide();
							self.fieldsets.color.palette.hide();
							self.fieldsets.color.heightThresh.hide();							
						}
						
						var hasThresholdsVisible = self.inputs.color.thresh.isOn.input.is(':visible');						
						
						if (hasThresholds && hasThresholdsVisible) {
							self.fieldsets.color.threshSettings.show();
						}
						else {
							self.fieldsets.color.threshSettings.hide();
						}
					},
				},				

		};

		self.events = function(){
	
			// Update button events
			
			self.inputs.updateBtn.onclick = function() {
				
				debug.master && debug.UI.browser && console.log ( 'Update button Clicked' );
				
				lucidChart.update();
		//		var camera = sceneChildren.cameras.perspCamera;
		//		sceneChildren.cameras.position.update( camera );
				camera.position.update;
				
			};
			
			// Demo Equation Select change events
			self.inputs.data.equation.select.on( 'change', function () {
				
				chartSettings.math.dataType = 'equation';
				chartSettings.math.demoEquation = document.getElementById('equationSelect').value;
				// Pass the top & bottom colors here too...
				self.update.inputs.selectAndText();
				self.update.inputs.radioAndCheck();
					} 
				);

			// What UI.browser elements Have child fieldsets that show/hide when they're checked or unchecked?
			
			self.inputs.data.typeSelect.input.change(
				function() {
					
					chartSettings.math.dataType = this.value;
					
					if (this.value === 'randomHeight') {
						
						chartSettings.math.demoEquation = this.value;
						
						self.fieldsets.data.randomOptions.fadeIn( 1000 );
						self.fieldsets.data.randomOptions.css( {"background-color": "#fff"} );
						self.fieldsets.data.equationOptions.css( {"background-color": "#ddd"} );
						self.fieldsets.data.equationOptions.fadeOut( 1000 );
						
						// Hide the 'Height Thresh' fieldset
						self.fieldsets.color.heightThresh.css({"background-color":"#ddd"});
						self.fieldsets.color.heightThresh.fadeOut( 1000 );										
					}
					else if (this.value === 'equation') {
						
						if (chartSettings.math.demoEquation !== "randomHeight") {
							self.inputs.data.equation.select.val( chartSettings.math.demoEquation );
						}
						else { 
							chartSettings.math.demoEquation = "Wave";
							self.inputs.data.equation.select.val( chartSettings.math.demoEquation );
						}
						
						self.fieldsets.data.equationOptions.fadeIn( 1000 );
						self.fieldsets.data.equationOptions.css( {"background-color": "#fff"} );
						self.fieldsets.data.randomOptions.css( {"background-color": "#ddd"} );
						self.fieldsets.data.randomOptions.fadeOut( 1000 );
						
						// Conditionally show the 'Height Thresh' fieldset
						var modeByHeight = self.inputs.color.modeSelect.byHeight.is(':checked');
						var gradientTwoTone = self.inputs.color.gradientSelect.twoTone.is(':checked');
						var gradientRainbow = self.inputs.color.gradientSelect.rainbow.is(':checked');
						var gradientGrayScale = self.inputs.color.gradientSelect.grayScale.is(':checked');
						
						if ( modeByHeight && ( gradientTwoTone || gradientRainbow || gradientGrayScale )) {
							self.fieldsets.color.heightThresh.fadeIn( 1000 );										
							self.fieldsets.color.heightThresh.css({"background-color":"#fff"});

							if(self.inputs.color.thresh.isOn.input.is(':checked')){
								self.fieldsets.color.threshSettings.fadeIn( 1000 );										
								self.fieldsets.color.threshSettings.css({"background-color":"#fff"});
							}
							
						}
						else {										
							self.fieldsets.color.heightThresh.css({"background-color":"#ddd"});
							self.fieldsets.color.heightThresh.fadeOut( 1000 );							
						}
					}
					
				self.inputs.data.equation.text.html( 'y = ' + lucidChart.math.func.preset.dict( chartSettings.math ).display() || 'null' );
				
				}
			);	
			
			self.inputs.data.range.start.x.change( self.update.inputs.data.dynamicCounts.x() );
			self.inputs.data.range.start.z.change( self.update.inputs.data.dynamicCounts.z() );
			self.inputs.data.range.end.x.change( self.update.inputs.data.dynamicCounts.x() );
			self.inputs.data.range.end.z.change( self.update.inputs.data.dynamicCounts.z() );
				
			
			self.inputs.color.modeSelect.input.change( function(){
				if (this.value === 'randomColor') {
					
					self.fieldsets.color.gradientSelect.fadeIn( 1000 );
					self.fieldsets.color.gradientSelect.css( {"background-color": "#fff"} );
					self.fieldsets.color.palette.fadeIn( 1000 );
					self.fieldsets.color.palette.css( {"background-color": "#fff"} );
					self.fieldsets.color.monoColorPicker.css( {"background-color": "#ddd"} );
					self.fieldsets.color.monoColorPicker.fadeOut( 1000 );	
					self.fieldsets.color.heightThresh.css( {"background-color": '#ddd'} );
					self.fieldsets.color.heightThresh.fadeOut( 1000 );
					
					if ( self.inputs.color.gradientSelect.twoTone.is(':checked')) {
						self.fieldsets.color.byHeightColorPickers.fadeIn( 1000 );
						self.fieldsets.color.byHeightColorPickers.css( {"background-color": "#fff"} );
						}
					else if ( self.inputs.color.gradientSelect.rainbow.is(':checked')) {
						self.fieldsets.color.byHeightColorPickers.css( {"background-color": "#ddd"} );						
						self.fieldsets.color.byHeightColorPickers.fadeOut( 1000 ); 
						}
				}
				
				else if (this.value === 'colorByHeight') {
					
					self.fieldsets.color.gradientSelect.fadeIn( 1000 );
					self.fieldsets.color.gradientSelect.css( {"background-color": "#fff"} );
					self.fieldsets.color.palette.fadeIn( 1000 );
					self.fieldsets.color.palette.css( {"background-color": "#fff"} );
					self.fieldsets.color.monoColorPicker.css( {"background-color": "#ddd"} );
					self.fieldsets.color.monoColorPicker.fadeOut( 1000 );	
					
					if (self.inputs.data.typeSelect.random.is(':checked')) {
						self.fieldsets.color.heightThresh.fadeOut( 1000 );						
						self.fieldsets.color.heightThresh.css( {"background-color": '#ddd'} );
						}
					
					else {
						self.fieldsets.color.heightThresh.css( {"background-color": '#fff'} );
						self.fieldsets.color.heightThresh.fadeIn( 1000 );
	
						if(self.inputs.color.thresh.isOn.input.is(':checked')){
							self.fieldsets.color.threshSettings.fadeIn( 1000 );										
							self.fieldsets.color.threshSettings.css({"background-color":"#fff"});
							}
						}
					
					if ( self.inputs.color.gradientSelect.twoTone.is(':checked')) {
						self.fieldsets.color.byHeightColorPickers.fadeIn( 1000 );
						self.fieldsets.color.byHeightColorPickers.css( {"background-color": "#fff"} );
						}
					else if ( self.inputs.color.gradientSelect.rainbow.is(':checked')) {
						self.fieldsets.color.byHeightColorPickers.css( {"background-color": "#ddd"} );						
						self.fieldsets.color.byHeightColorPickers.fadeOut( 1000 ); 
						}
				}
				
				else if (this.value === 'monochrome') {
					self.fieldsets.color.monoColorPicker.fadeIn( 1000 );
					self.fieldsets.color.monoColorPicker.css( {"background-color": "#fff"} );
					
					self.fieldsets.color.byHeightColorPickers.css( {"background-color": "#ddd"} );
					self.fieldsets.color.byHeightColorPickers.fadeOut( 1000 );
					
					self.fieldsets.color.gradientSelect.css( {"background-color": "#ddd"} );
					self.fieldsets.color.gradientSelect.fadeOut( 1000 );
					
					self.fieldsets.color.palette.css( {"background-color": '#ddd'} );
					self.fieldsets.color.palette.fadeOut( 1000 );
					
					self.fieldsets.color.heightThresh.css( {"background-color": '#ddd'} );
					self.fieldsets.color.heightThresh.fadeOut( 1000 );
				}
			}
			);
			
			self.inputs.color.gradientSelect.input.change( function() {
				
				// hide the monochrome colorpicker
				self.fieldsets.color.monoColorPicker.css( {"background-color": "#ddd"} );
				self.fieldsets.color.monoColorPicker.fadeOut( 1000 );
				
				// conditionally show the 'has threshold' checkbox	
				if ( self.inputs.data.typeSelect.random.is(':checked') || self.inputs.color.modeSelect.random.is(':checked') || self.inputs.color.modeSelect.mono.is(':checked')) {
					self.fieldsets.color.heightThresh.fadeOut( 1000 );
					self.fieldsets.color.heightThresh.css( {"background-color": '#ddd'} );		
				}
				else if ( self.inputs.color.modeSelect.byHeight.is(':checked')) {
					self.fieldsets.color.heightThresh.css( {"background-color": '#fff'} );
					self.fieldsets.color.heightThresh.fadeIn( 1000 );	

					if(self.inputs.color.thresh.isOn.input.is(':checked')){
						self.fieldsets.color.threshSettings.fadeIn( 1000 );										
						self.fieldsets.color.threshSettings.css({"background-color":"#fff"});
					}					
				}
				
				
				if (this.value === 'twoTone'){
					
					// change the activeColorStops value;
					chartSettings.color.palette.activeColorStops = chartSettings.color.twoToneStops;
					
					// show the top/bottom colorpicker						
					self.fieldsets.color.byHeightColorPickers.fadeIn( 1000 );
					self.fieldsets.color.byHeightColorPickers.css( {"background-color": "#fff"} );
				}
				
				else if (this.value === 'rainbow') {

					// change the activeColorStops value;				
					chartSettings.color.palette.activeColorStops = chartSettings.color.rainbowStops;
					
					// hide the top/bottom colorpickers
					self.fieldsets.color.byHeightColorPickers.css( {"background-color": "#ddd"} );						
					self.fieldsets.color.byHeightColorPickers.fadeOut( 1000 ); 
				}
				
				else if (this.value === 'grayScale') {

					// change the activeColorStops value;				
					chartSettings.color.palette.activeColorStops = chartSettings.color.grayScaleStops;
					
					// hide the top/bottom colorpickers
					self.fieldsets.color.byHeightColorPickers.css( {"background-color": "#ddd"} );						
					self.fieldsets.color.byHeightColorPickers.fadeOut( 1000 ); 
				}
			
				// check if the threshold above/below colors are are still bound.					
				if ( UI.browser.inputs.color.thresh.topAndBottomBound.isTrue ) {						
					// if they are still bound, change the above & below thresh colors.	
					chartSettings.color.thresh.setColorsAboveAndBelow();
					// and update the UI.
					self.update.inputs.colorPicker();
				}
			}
			);
			
			self.inputs.data.random.height.min.bind( 'propertychange change keyup input paste' , function(e){
				chartSettings.math.minUserSetHeight = parseInt(self.inputs.data.random.height.min.val());
				self.inputs.data.equation.text.html( 'y = ' + lucidChart.math.func.preset.dict( chartSettings.math ).display() || 'null' ); 
				});  // Noting use of 'bind' works here where 'on' doesn't.
			self.inputs.data.random.height.max.bind( 'propertychange change keyup input paste' , function(e){ 
				chartSettings.math.maxUserSetHeight = parseInt(self.inputs.data.random.height.max.val());
				self.inputs.data.equation.text.html( 'y = ' + lucidChart.math.func.preset.dict( chartSettings.math ).display() || 'null' ); 
				});
			
			self.inputs.color.thresh.isOn.input.change( function(){
				
				if (this.checked) {
					self.fieldsets.color.threshSettings.fadeIn( 1000 );
					self.fieldsets.color.threshSettings.css({"background-color":"#fff"});
				}
				
				else {
					self.fieldsets.color.threshSettings.css({"background-color":"#ddd"});
					self.fieldsets.color.threshSettings.fadeOut( 1000 );										
				}
			});
			
			//GradientSelect
			//Set Min/Max Threshold (Checkbox)
			
				
			// Set Up Events to initialize two possible states for colorAboveThreshold and colorBelowThreshold: 
				//1) If the Top Color changes then the Color Above Threshold changes to match it too.
				//2) We'll always dispatch the event, but if the listener is turned off, no change will happen. 
			self.events.boundTopColorChange = new CustomEvent( 'boundTopColorChange' );
			self.events.boundBottomColorChange = new CustomEvent( 'boundBottomColorChange' );

			UI.browser.inputs.color.thresh.topAndBottomBound.bind();
			UI.browser.inputs.color.thresh.topAndBottomBound.listen();
			
		};
	};
		

	UI.mixedReality = function(){};
	
	// Call the UI for the appropriate device
	UI[device]();
	
};
