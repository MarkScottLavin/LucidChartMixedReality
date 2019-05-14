/* relevant charCodes */

var mathChars = [

".","0","1","2","3","4","5","6","7","8","9","X","x","Y","y","Z","z"," ","(",")","*","+","-","/","^"

]

/* code from qodo.co.uk */
 
function allowChars( input, e, allowedCharSet ) {

	var key;
	var keyCode;
	
    if ( !e ){ var e = window.event; }
    if ( e.key ){ key = e.key; }
	if ( e.keyCode ){ keyCode = e.keyCode; }
	else { keyCode = e.which; }
	
	
	console.log( key );
	
    // if they pressed Esc remove focus from the input
    if ( keyCode === 27 ) { input.blur(); return false; }
	
    // ignore if these keys are pressed:

		// 8,  backspace
		// 9,  tab
		// 36, home
		// 37, left arrow
		// 38, up arrow
		// 39, right arrow
		// 40, down arrow	
		
		// key for ' = 39

    if ( !e.ctrlKey && keyCode!=8 && keyCode!=9 && keyCode!=36 && keyCode!=37 && keyCode!=38 && ( keyCode!=39 || ( keyCode=== 39 && key === 39 )) && keyCode !=40 ){
		
		/* Otherwise return true */
		if ( allowedCharSet.includes( key )){ 
			return true; 
		}
		else {
			e.preventDefault();
			return false; 
		}
    }
}

function allowMathChars( e ){
	
	allowChars( this, e, mathChars );	
	
}

document.getElementById( 'eqInput' ).addEventListener( 'keypress', allowMathChars, false );


function getStringAsCharArr( string ){
	
	var strArr = [];
	
	for ( var c = 0; c < string.length; c++ ){
		strArr.push( string.charAt( c ) );		
	}
	
	return strArr;

}

function isNumerical( character ){
	if ( character === "0" || character === "1" || character === "2" || character === "3" || character === "4" || character === "5" || character === "6" || character === "7" || character === "8" || character === "9" ){ return true; } 
}

function isNumericalInStr( character, string ){
	if ( isNumerical( character ) || isDecimalPointInStr( character, string ) ){ return true; }
}

function hasNumbers( string ){
	if ( string.includes( "0" ) || string.includes( "1" ) || string.includes( "2" ) || string.includes( "3" ) || string.includes( "4" ) || string.includes( "5" ) || string.includes( "6" ) || string.includes( "7" ) || string.includes( "8" ) || string.includes( "9" )  ){ return true; } 
}

function isNumericString( string ){
	numerical = true;
	for ( x = 0; x < string.length; x++ ){
		if ( !isNumericalInStr( string[ x ], string ) ){
			numerical = false;
			break;
		}
	}
	return numerical;
}

function hasParens( string ){
	if ( string.includes( "(" ) || string.includes( ")" ) ){ return true; } 	
}

function hasExponents( string ){
	if ( string.includes( "^" ) ){ return true; }
}

function isExponent( character ){
	if ( character === "^" ){ return true; }
}

function isOperator( character ){
	if ( character === "+" || character === "-" || character === "*" || character === "/" ){ return true; }
}

function hasOperators( string ){
	if ( string.includes( "+" ) || string.includes( "-" ) || string.includes( "*" ) || string.includes( "/" ) ){ return true; }
}

function hasDecimals( string ){
	var hasDec;
	for ( var x = 0; x < string.length; x++ ){
		if ( isDecimalPointInStr ( string[ x ], string ) ){
			hasDec = true;
			break;
		}
	}
	return hasDec;
}

function isVar( character ){
	if ( character === "x" || character === "y" || character === "z" || character === "X" || character === "Y" || character === "Z" ){ return true; }
}

function hasVars( string ){	
	if ( string.includes( "x" ) || string.includes( "y" ) || string.includes( "z" ) || string.includes( "X" ) || string.includes( "Y" ) || string.includes( "Z" ) ){ return true; }
}

function stripSpaces( string ){	return string.replace( /\s/g, ''); }

function isMultiplication( string ){
	
	string = stripSpaces( string );
	
	// Implicit
	if ( isExpressionEnd( string[ 0 ], string ) && ( isExpressionStart( string[ 1 ], string ) ) ){ 
		return true; 
	}
	
	// Asterisk
	if ( string.includes( "*" ) ){
		if ( isExpressionEnd( string[ 0 ], string ) && ( string[ 1 ] === "*" ) && ( isExpressionStart( string[ 2 ], string ) ) ){
			return true;
		}
	}
}

function isExpressionStart( character, string ){
	if ( string.includes( character ) ){
		if ( string.length === 1 && ( isNumerical( character ) || isVar( character ) ) ){ 
			return true; 
		} 
		else if ( string.length > 1 ){
			if ( isVar( character ) || character === "(" ){
				return true;
			}
			
			else if ( isNumericalInStr( character, string ) && ( string.indexOf( character ) === 0 || ( string[ string.indexOf( character ) - 1 ] && !isNumericalInStr( string[ string.indexOf( character ) - 1 ],  string ) ) ) ){
				return true;
			}
		}
	}
}

function isExpressionEnd( character, string ){
	if ( string.includes( character ) ){
		if ( string.length === 1 && ( isNumerical( character ) || isVar( character ) ) ){ 
			return true; 
		} 
		else if ( string.length > 1 ){
			if ( isVar( character ) || character === ")" ){
				return true;
			}
			
			
			else if ( isNumericalInStr( character, string ) && ( ( string.indexOf( character ) === string.length - 1 ) || ( string[ string.indexOf( character ) + 1 ] && !isNumericalInStr( string[ string.indexOf( character ) + 1 ],  string ) ) ) ){
				return true;
			}		
		}
	}
}

function isDecimalPointInStr( character, string ){
	if ( string ){
		var nextChar = string[ ( string.indexOf( character ) + 1 ) ];
		if ( character === "." && string && nextChar && isNumerical( nextChar ) ){
			return true;
		}
	}
}

function isNumericStringStart( character, string ){
	if ( string && isNumericalInStr( character, string ) ){
		if ( string.indexOf( character ) === 0 || !isNumericalInStr( string[ string.indexOf( character ) - 1 ], string ) ){
			return true;
		}
	}
}

function isNumericStringEnd( character, string ){
	if ( string && isNumericalInStr( character, string ) ){
		if ( string.indexOf( character ) === ( string.length - 1 ) || !isNumericalInStr ( string[ string.indexOf( character ) + 1 ], string ) ){
			return true;
		}
	}
}

function getNumericalStringsInStr( string ){
	
	numbers = [];
	
	if ( hasNumbers( string ) ){
		
		var exploded = getStringAsCharArr( string );
		var numStr;
				
		for ( var x = 0; x < exploded.length; x++ ){
			if ( isNumericalInStr ( exploded[ x ], string ) ){			
				if ( exploded[ x - 1 ] && isNumericalInStr( exploded[ x - 1 ], string ) ){
					numStr += exploded[ x ];
				}
				else if ( isNumericalInStr( exploded[ x ], string ) ){ 
					numStr = exploded[ x ];
				}
			}
			
			// if there's a numString && there's a prior character that wasn't numerical
			if ( numStr && !isNumericalInStr( exploded[ x ], string ) && exploded[ x - 1 ] && isNumericalInStr( exploded[ x - 1 ], string ) ){
				numbers.push( numStr );
			}
			// Or if we're at the end of the string and the prior character was numerical 
			else if ( ( x === exploded.length - 1 ) && isNumericalInStr( exploded[ x - 1 ], string ) ){
				numbers.push( numStr );				
			}
			else if ( numStr.length = 1 && ( x === exploded.length - 1 ) ){
				numbers.push( numStr );				
			}
		}
	}
	
	return numbers;
	
}

function parseFloatArray( numStrArr ){

	var numArr = [];

	numStrArr.forEach( function( number ){ numArr.push( parseFloat( number ) ); } );
	
	return numArr;
	
}

function removeExtraDecimalPts( numStr ){

	var indexFirst;
	var tempStr;

	for ( var x = 0; x < numStr.length; x++ ){
		if ( numStr[ x ] === "." ){
			indexFirst = x;
			break;
		}
	}
	
	if ( numStr[ indexFirst + 1 ] ){
		tempStr = numStr.slice( indexFirst + 1, numStr.length )
		tempStr = tempStr.replace( /\./g, '' );
		numStr = numStr.slice( 0, indexFirst + 1 ) + tempStr;
	}		

	
	return numStr;
}

function add( a, b ){ return a + b; }
function sub( a, b ){ return a - b; }
function multiply( a, b ){ return a * b; }
function divide( a, b ){ return a / b; }
function exponent( a, b ){ return Math.pow( a, b ); }
function sin( a ){ return Math.sin( a ); }
function cos( a ){ return Math.cos( a ); }
function tan( a ){ return Math.tan( a ); }  

function getMathFromString( string ){
		
	// Here we'll separate four types of objects out in the string: 
	// Numbers, vars, operations, advanced operations. 
	var parsed = []; 
	
	string = stripSpaces( string );
	
	for( let x = 0; x < string.length; x++ ){
		
		if ( isNumericalInStr( string[ x ], string )){
			let num = string[ x ];
			for ( var b = x + 1; b < string.length; b++ ){
				if ( isNumericalInStr( string[ b ], string ) ){
					num = num + string[ b ];
				}
				else { break; }
			}
			x += ( num.length - 1 );
			parsed.push( parseFloat( removeExtraDecimalPts( num ) ) );
		}
		
		else if ( isVar( string[ x ] ) ){
			if ( string[ x - 1 ] ){
				if ( isNumericalInStr( string[ x - 1 ], string ) || string[ x - 1 ] === ")" || isVar( string[ x -1 ]) ){
					parsed.push( multiply );
				}
			}
			parsed.push( window[ string[ x ] ] );
		} 
		
		else if ( isOperator( string[ x ] ) ){
			if ( string[ x ] === "+" ){
				parsed.push( add );
			}
			if ( string[ x ] === "-" ){
				parsed.push( sub );
			}			
			if ( string[ x ] === "*" ){
				parsed.push( multiply );
			}
			if ( string[ x ] === "/" ){
				parsed.push( divide ); 
			}
		}
		
		else if ( string[ x ] === "s" ){
			if ( string[ x - 1 ] ){
				if ( isNumericalInStr( string[ x - 1 ], string ) || string[ x - 1 ] === ")" || isVar( string[ x -1 ]) ){
					parsed.push( multiply );
				}
			}				
			if ( string[ x + 1 ] === "i" && string[ x + 2 ] === "n" ){
				parsed.push( Math.sin );
				x += 2;
			}
		}
		
		else if ( string[ x ] === "c" ){
			if ( string[ x - 1 ] ){
				if ( isNumericalInStr( string[ x - 1 ], string ) || string[ x - 1 ] === ")" || isVar( string[ x -1 ]) ){
					parsed.push( multiply );
				}
			}
			if ( string[ x + 1 ] === "o" && string[ x + 2 ] === "s" ){
				parsed.push( Math.cos );
				x += 2;
			}
		}
		
		else if ( string[ x ] === "t" ){
			if ( string[ x - 1 ] ){
				if ( isNumericalInStr( string[ x - 1 ], string ) || string[ x - 1 ] === ")" || isVar( string[ x -1 ]) ){
					parsed.push( multiply );
				}
			}
			if ( string[ x + 1 ] === "a" && string[ x + 2 ] === "n" ){
				parsed.push( Math.tan );
				x += 2;
			}
		}
		
		else if ( isExponent( string[ x ] ) ){
			parsed.push( exponent );
		}
		
		else if ( string[ x ] === "(" ){
			
			if ( string[ x - 1 ] ){
				if ( isNumericalInStr( string[ x - 1 ], string ) || string[ x - 1 ] === ")" || isVar( string[ x -1 ]) ){
					parsed.push( multiply );
				}
				parsed.push( "(" );
			}			
		}
		
		else if ( string[ x ] === ")" ){
			parsed.push( ")" );
		}
	}
	
	return parsed;

}


function eval( mathArr ){
	if ( mathArr.length === 3 && mathArr[ 1 ] instanceof Function ){
		return mathArr[ 1 ]( mathArr[ 0 ], mathArr[ 2 ] );
	}
}


function evalMathArr( mathArr ){
	
	var evaluated;

	for ( var m = 0; m < mathArr.length; m++ ){
		if ( mathArr[ m ] === exponent ){
			evaluated = eval( mathArr.slice( m - 1, m + 2 ) );
			mathArr.splice( m - 1, 3 );
			mathArr.splice( m - 1, 0, evaluated );
			m = m - 2;
		}
	}
	
	for ( var m = 0; m < mathArr.length; m++ ){
		if ( mathArr[ m ] === multiply ){
			evaluated = eval( mathArr.slice( m - 1, m + 2 ));
			mathArr.splice( m - 1, 3 );
			mathArr.splice( m - 1, 0, evaluated );
			m = m - 2;			
		}
	}
	
	for ( var m = 0; m < mathArr.length; m++ ){
		if ( mathArr[ m ] === divide ){
			evaluated = eval( mathArr.slice( m - 1, m + 2 ));
			mathArr.splice( m - 1, 3 );
			mathArr.splice( m - 1, 0, evaluated );
			m = m - 2;				
		}
	}

	for ( var m = 0; m < mathArr.length; m++ ){
		if ( mathArr[ m ] === add ){
			evaluated = eval( mathArr.slice( m - 1, m + 2 ));
			mathArr.splice( m - 1, 3 );
			mathArr.splice( m - 1, 0, evaluated );
			m = m - 2;				
		}
	}	
	
	for ( var m = 0; m < mathArr.length; m++ ){
		if ( mathArr[ m ] === subtract ){
			evaluated = eval( mathArr.slice( m - 1, m + 2 ));
			mathArr.splice( m - 1, 3 );
			mathArr.splice( m - 1, 0, eval );
			m = m - 2;				
		}
	}

	return mathArr[ 0 ];
	
}

function getInnermostParenIndices( mathArr ){
	
	if ( mathArr.includes( "(" ) && mathArr.includes( ")" ) ){
		
		var startIndex, endIndex; 
		
		for ( var x = 0; x < mathArr.length; x++ ){
			if ( mathArr[ x ] === "(" && !mathArr.slice( x + 1, mathArr.lastIndex ).includes( "(" ) ){
				startIndex = x;
			}
			if ( startIndex && mathArr[ x ] === ")" ){
				endIndex = x;
				break;
			}
		}

		return [ startIndex, endIndex ];
	}
	
}

function getInnermostParenContent( mathArr ){
	
	var indices = getInnermostParenIndices( mathArr );
	var include = mathArr.slice( indices[ 0 ] + 1, indices[ 1 ] );
	
	return include;
	
}



