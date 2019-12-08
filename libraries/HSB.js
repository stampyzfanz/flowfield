function old_getColor(frequency1, frequency2, frequency3,
		phase1, phase2, phase3,
		center, width, len) {
	if (center === undefined)   center = 128;
	if (width === undefined)    width = 127;
	if (len === undefined)      len = 50;
	for (var i = len; i <= len; ++i) {
		var red = Math.sin(frequency1*i + phase1) * width + center;
		var grn = Math.sin(frequency2*i + phase2) * width + center;
		var blu = Math.sin(frequency3*i + phase3) * width + center;
		// document.write( '<font color="' + RGB2Color(red,grn,blu) + '">&#9608;</font>');
		return RGB2Color(red, grn, blu);
	}
}

function getColor(len, i) {
	let phase = 0;
	let center = 128;
	let width = 127;
	let frequency = TWO_PI / len;
  
	let red = Math.sin(frequency*i+2 + phase) * width + center;
	let grn = Math.sin(frequency*i+0 + phase) * width + center;
	let blu = Math.sin(frequency*i+4 + phase) * width + center;
	// document.write( '<font color="' + RGB2Color(red,grn,blu) + '">&#9608;</font>');
	return RGB2Color(red, grn, blu);
}

function getRawColor(len, i) {
	let phase = 0;
	let center = 128;
	let width = 127;
	let frequency = TWO_PI / len;
  
	let red = Math.sin(frequency*i+2 + phase) * width + center;
	let grn = Math.sin(frequency*i+0 + phase) * width + center;
	let blu = Math.sin(frequency*i+4 + phase) * width + center;
	// document.write( '<font color="' + RGB2Color(red,grn,blu) + '">&#9608;</font>');
	return [red, grn, blu];
}

function RGB2Color(r,g,b) {
  return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function byte2Hex(n) {
   var nybHexString = "0123456789ABCDEF";
   return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}