var reg = document.getElementById( 'calcRegister' );

function addCharFromBtnToInputVal( btn, input ){
	input.value = input.value + btn.innerHTML;
}

function addBtnOperationToInputVal( btn, input ){
	if ( btn.innerHTML === "()" ){
	/*	if ( reg.value.includes( "(" ) ){
			input.value = input.value + " ) ";				
		}
		else {
			input.value = input.value + " ( ";						
		} */
		var paren = " ( ";
		
		for ( var x = input.value.length - 1; x > -1; x-- ){
			if ( input.value[ x ] === "(" ){
				paren = " ) ";
				break;
			}
			else if ( input.value[ x ] === ")" ){
				paren = " ( ";
				break;
			}
		}
		
		input.value = input.value + paren;			
	}
	else if ( btn.innerHTML === "*" || btn.innerHTML === "+" || btn.innerHTML === "-" || btn.innerHTML === "/" || btn.innerHTML === "^" ) {
		input.value = input.value + " " + btn.innerHTML + " ";	
	}
	
	else if ( btn.innerHTML === "sin" || btn.innerHTML === "cos" || btn.innerHTML === "tan" || btn.innerHTML === "log" ){
		input.value = input.value + " " + btn.innerHTML + "( ";			
	}
}

function initCalcSimpleBtns( type ){
	var btns = document.getElementsByClassName( type )
	 
	for ( var n = 0; n < btns.length; n++ ){
		btns[ n ].addEventListener( "click", function(){ 
			addCharFromBtnToInputVal( this, reg ); 
		});
	}
}

function initCalcComplexBtns( type ){
	var btns = document.getElementsByClassName( type )
	 
	for ( var n = 0; n < btns.length; n++ ){
		btns[ n ].addEventListener( "click", function(){ 
			addBtnOperationToInputVal( this, reg ); 
		});
	}
}

initCalcSimpleBtns( "numerical" );
initCalcSimpleBtns( "var" );
initCalcComplexBtns( "operation" );
initCalcComplexBtns( "adv-operation" );





/*
document.getElementById( 'num1' ).addEventListener( "click", function(){ 
	addCharFromBtnToInputVal( this, reg ); 
	} );
document.getElementById( 'num2', reg );
document.getElementById( 'num3', reg );*/