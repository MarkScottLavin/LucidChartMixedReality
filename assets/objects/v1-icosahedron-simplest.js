var rColor0 = .50;
var gColor0 = .85;
var bColor0 = 1.0;

var rColor1 = .35;
var gColor1 = .70;
var bColor1 = .85;

var rColor2 = .20;
var gColor2 = .55;
var bColor2 = .70;

var alphaVal = 1.0;

var geoVertices = [
 0,		0.525731,		0.850651,	rColor0, gColor0, bColor0, alphaVal,		
 -0.850651,		0,		0.525731,		rColor0, gColor0, bColor0, alphaVal,
 0,		-0.525731,		0.850651,		rColor1, gColor1, bColor1, alphaVal,
 0.525731,		0.850651,		0,		rColor2, gColor2, bColor2, alphaVal,
 0.850651,		0,		-0.525731,		rColor0, gColor0, bColor0, alphaVal,
 0,		0.525731,		-0.850651,		rColor1, gColor1, bColor1, alphaVal,
 0.850651,		0,		0.525731,		rColor2, gColor2, bColor2, alphaVal,
 0,		0.525731,		0.850651,		rColor0, gColor0, bColor0, alphaVal,
 0,		-0.525731,		0.850651,		rColor1, gColor1, bColor1, alphaVal,
 0.850651,		0,		0.525731,		rColor2, gColor2, bColor2, alphaVal,
 0,		-0.525731,		0.850651,		rColor0, gColor0, bColor0, alphaVal,
 0.525731,		-0.850651,		0,		rColor1, gColor1, bColor1, alphaVal,
 -0.525731,		-0.850651,		0,		rColor2, gColor2, bColor2, alphaVal,
 0,		-0.525731,		-0.850651,		rColor0, gColor0, bColor0, alphaVal,
 0.525731,		-0.850651,		0,		rColor1, gColor1, bColor1, alphaVal,
 0,		-0.525731,		-0.850651,		rColor2, gColor2, bColor2, alphaVal,
 -0.850651,		0,		-0.525731,		rColor0, gColor0, bColor0, alphaVal,
 0,		0.525731,		-0.850651,		rColor1, gColor1, bColor1, alphaVal,
 0.850651,		0,		-0.525731,rColor2, gColor2, bColor2, alphaVal,
 0.525731,		-0.850651,		0,		rColor0, gColor0, bColor0, alphaVal,
 0,		-0.525731,		-0.850651,rColor1, gColor1, bColor1, alphaVal,
 0.525731,		0.850651,		0,rColor2, gColor2, bColor2, alphaVal,
 0,		0.525731,		0.850651,		rColor0, gColor0, bColor0, alphaVal,
 0.850651,		0,		0.525731,		rColor1, gColor1, bColor1, alphaVal,
 0,		-0.525731,		0.850651,		rColor2, gColor2, bColor2, alphaVal,
 -0.850651,		0,		0.525731,		rColor0, gColor0, bColor0, alphaVal,
 -0.525731,		-0.850651,		0,		rColor1, gColor1, bColor1, alphaVal,
 -0.525731,		0.850651,		0,		rColor2, gColor2, bColor2, alphaVal,
 -0.850651,		0,		-0.525731,		rColor0, gColor0, bColor0, alphaVal,
 -0.850651,		0,		0.525731,		rColor1, gColor1, bColor1, alphaVal,
 0,		0.525731,		0.850651,		rColor2, gColor2, bColor2, alphaVal,
 0.525731,		0.850651,		0,		rColor0, gColor0, bColor0, alphaVal,
 -0.525731,		0.850651,		0,		rColor1, gColor2, bColor2, alphaVal,
 0,		-0.525731,		0.850651,		rColor0, gColor0, bColor0, alphaVal,
 -0.525731,		-0.850651,		0,		rColor1, gColor1, bColor1, alphaVal,
 0.525731,		-0.850651,		0,		rColor2, gColor2, bColor2, alphaVal,
 0.850651,		0,		-0.525731,		rColor0, gColor0, bColor0, alphaVal,
 0,		 -0.525731,		-0.850651,		rColor1, gColor1, bColor1, alphaVal,
 0,		0.525731,		-0.850651,		rColor2, gColor2, bColor2, alphaVal,
 -0.525731,		0.850651,		0,rColor0, gColor0, bColor0, alphaVal,
 0,		0.525731,		-0.850651,rColor1, gColor1, bColor1, alphaVal,
 -0.850651,		0,		-0.525731,rColor2, gColor2, bColor2, alphaVal,
 0.850651,		0,		0.525731,rColor0, gColor0, bColor0, alphaVal,
 0.525731,		-0.850651,		0,		rColor1, gColor1, bColor1, alphaVal,
 0.850651,		0,		-0.525731,		rColor2, gColor2, bColor2, alphaVal,
 0,		0.525731,		0.850651,rColor0, gColor0, bColor0, alphaVal,
 -0.525731,		0.850651,		0,		rColor1, gColor1, bColor1, alphaVal,
 -0.850651,		0,		0.525731,		rColor2, gColor2, bColor2, alphaVal,
 0.525731,		0.850651,		0,		rColor0, gColor0, bColor0, alphaVal,
 0,		0.525731,		-0.850651,rColor1, gColor1, bColor1, alphaVal,
 -0.525731,		0.850651,		0,		rColor2, gColor2, bColor2, alphaVal,
 0.525731,		0.850651,		0,		rColor0, gColor0, bColor0, alphaVal,
 0.850651,		0,		0.525731,rColor1, gColor1, bColor1, alphaVal,
 0.850651,		0,		-0.525731,		rColor2, gColor2, bColor2, alphaVal,
 -0.850651,		0,		-0.525731,		rColor0, gColor0, bColor0, alphaVal,
 -0.525731,		-0.850651,		0,		rColor1, gColor1, bColor1, alphaVal,
 -0.850651,		0,		0.525731,		rColor2, gColor2, bColor2, alphaVal,
 -0.850651,		0,		-0.525731,		rColor0, gColor0, bColor0, alphaVal,
 0,		-0.525731,		-0.850651,		rColor1, gColor1, bColor1, alphaVal,
 -0.525731,		-0.850651,		0,		rColor2, gColor2, bColor2, alphaVal,
			];


var geoFaces = [
				
 0,	1,	2,	  
 3,	4,	5,	  
 6,	7,	8,	  
 9,	10,	11,	  
 12,13,	14,	  
 15,16,	17,	  
 18,19,	20,	  
 21,22,	23,	  
 24,25,	26,	  
 27,28,	29,	  
 30,31,	32,	  
 33,34,	35,	  
 36,37,	38,	  
 39,40,	41,	 
 42,43,	44,	  
 45,46,	47,	  
 48,49,	50,	  
 51,52,	53,	  
 54,55,	56,	  
 57,58,	59		
			];
			
var geoNormals = [
 -0.356822,		0 ,0.934172 ,-0.356822 ,0 ,0.934172 ,-0.356822 ,0 ,0.934172 ,0.57735 ,0.57735 ,-0.57735 ,0.57735 ,0.57735 ,-0.57735 ,0.57735 ,0.57735 ,-0.57735 ,0.356822 ,0 ,0.934172 ,0.356822 ,0 ,0.934172 ,0.356822 ,0 ,0.934172 ,0.57735 ,-0.57735 ,0.57735 ,0.57735 ,-0.57735 ,0.57735 ,0.57735 ,-0.57735 ,0.57735 ,0 ,-0.934172 ,-0.356822 ,0 ,-0.934172 ,-0.356822 ,0 ,-0.934172 ,-0.356822 ,-0.356822 ,0 ,-0.934172 ,-0.356822 ,0 ,-0.934172 ,-0.356822 ,0 ,-0.934172 ,0.57735 ,-0.57735 ,-0.57735 ,0.57735 ,-0.57735 ,-0.57735 ,0.57735 ,-0.57735 ,-0.57735 ,0.57735 ,0.57735 ,0.57735 ,0.57735 ,0.57735 ,0.57735 ,0.57735 ,0.57735 ,0.57735 ,-0.57735 ,-0.57735 ,0.57735 ,-0.57735 ,-0.57735 ,0.57735 ,-0.57735 ,-0.57735 ,0.57735 ,-0.934172 ,0.356822 ,0 ,-0.934172 ,0.356822 ,0 ,-0.934172 ,0.356822 ,0 ,0 ,0.934172 ,0.356822 ,0 ,0.934172 ,0.356822 ,0 ,0.934172 ,0.356822 ,0 ,-0.934172 ,0.356822 ,0 ,-0.934172 ,0.356822 ,0 ,-0.934172 ,0.356822 ,0.356822 ,0 ,-0.934172 ,0.356822 ,0 ,-0.934172 ,0.356822 ,0 ,-0.934172 ,-0.57735 ,0.57735 ,-0.57735 ,-0.57735 ,0.57735 ,-0.57735 ,-0.57735 ,0.57735 ,-0.57735 ,0.934172 ,-0.356822 ,0 ,0.934172 ,-0.356822 ,0 ,0.934172 ,-0.356822 ,0 ,-0.57735 ,0.57735 ,0.57735 ,-0.57735 ,0.57735 ,0.57735 ,-0.57735 ,0.57735 ,0.57735 ,0 ,0.934172 ,-0.356822 ,0 ,0.934172 ,-0.356822 ,0 ,0.934172 ,-0.356822 ,0.934172 ,0.356822 ,0 ,0.934172 ,0.356822 ,0 ,0.934172 ,0.356822 ,0 ,-0.934172 ,-0.356822 ,0 ,-0.934172 ,-0.356822 ,0 ,-0.934172 ,-0.356822 ,0 ,-0.57735 ,-0.57735 ,-0.57735 ,-0.57735 ,-0.57735 ,-0.57735 ,-0.57735 ,-0.57735 ,-0.57735 			];

