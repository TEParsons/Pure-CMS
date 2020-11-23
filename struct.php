<?php
	function fullScanDir($target) {
		$input = scandir( $target );
		$output = array();
		foreach( $input as $file ) {
			if ( $file == "." || $file == ".." ) {
				continue;
			} elseif ( is_dir($file) ) {
				$output[$file] = fullScanDir($file);
			} else {
				$output[] = $file;
			}
		}
		return $output;
	}

	echo json_encode(fullScanDir($_SERVER['DOCUMENT_ROOT']));

?>