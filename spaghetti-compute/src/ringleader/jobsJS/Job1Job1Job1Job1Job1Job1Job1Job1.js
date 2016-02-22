function run(workUnit) { // workUnit is always a raw string
	console.log("Prefix: " + workUnit); // For debugging
	var ctr = 0;
	var sha = new jsSHA("SHA-1", "TEXT");
	while(sha.getHash("HEX").indexOf("00000") != 0) {
		ctr++;
		sha = new jsSHA("SHA-1", "TEXT");
		sha.update(workUnit);
		sha.update(ctr + "");
    }
    return workUnit + ctr;
}