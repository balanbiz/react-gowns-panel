<?php 

	$total = count($_FILES);
	// $arrayOfNamesWebp = array();
	$arrayOfAll = array();
	$stateId = substr(preg_replace('/[^0-9]/', '', array_keys($_FILES)[0]), 0, -1);

	for( $i=0 ; $i < $total ; $i++ ) {
		$arrayOfPair = [
			'nowebp' => '',
			'webp' => '',
			/* 'width' => '',
			'height' => '' */
		];

		$fileName = preg_replace('/\s+/', '_', $_FILES["{$stateId}image{$i}"]["name"]);
		$source_img = $_FILES["{$stateId}image{$i}"]["tmp_name"];
		$fileExt = explode("/", $_FILES["{$stateId}image{$i}"]["type"])[1];
		$withoutExt = strtolower(preg_replace('/\\.[^.\\s]{3,4}$/', '', $fileName));
		$destination_img = "../assets/{$stateId}/" . $withoutExt . '.' . $fileExt;
		$destination_webp = "../assets/{$stateId}/" . $withoutExt . '.webp';

		if ($i == 0 && !is_dir("../assets/{$stateId}")) {
				mkdir("../assets/{$stateId}", 0777, true);
		}

		/* [$width_orig, $height_orig] =  */compress($source_img, $destination_img, 90, 'usual');
		compress($source_img, $destination_webp, 90, 'webp');
		

		// move_uploaded_file($_FILES["{$stateId}image{$i}"]["tmp_name"], "../assets/{$stateId}/" . $fileName);
		
		// array_push('usual', $arrayOfPair, "./assets/{$stateId}/" . $withoutExt . '.' . $fileExt);
		// array_push('webp', $arrayOfPair, "./assets/{$stateId}/" . $withoutExt . '.webp');
		$arrayOfPair['nowebp'] ="./assets/{$stateId}/" . $withoutExt . '.' . $fileExt;
		$arrayOfPair['webp'] = "./assets/{$stateId}/" . $withoutExt . '.webp';
		// $arrayOfPair['width'] = $width_orig;
		// $arrayOfPair['height'] = $height_orig;
		array_push($arrayOfAll, $arrayOfPair);

	}

	echo json_encode($arrayOfAll);


	function compress($source, $destination, $quality, $type) {

		$width = 550;
		$height = 920;
		$info = getimagesize($source);
		// echo json_encode($info);
		list($width_orig, $height_orig) = getimagesize($source);
		// list($width, $height) = getimagesize($source);

		$ratio_orig = $width_orig/$height_orig;

		if ($width/$height > $ratio_orig) {
			$width = intval( $height*$ratio_orig);
		} else {
			$height = intval($width/$ratio_orig);
		}
		$image_p = imagecreatetruecolor($width, $height);

		if ($info['mime'] == 'image/jpeg') 
			$image = imagecreatefromjpeg($source);
		elseif ($info['mime'] == 'image/gif') 
			$image = imagecreatefromgif($source);
		elseif ($info['mime'] == 'image/png') 
			$image = imagecreatefrompng($source);
		elseif ($info['mime'] == 'image/webp')
			$image = imagecreatefromwebp($source);
		
		imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);
		// imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width, $height);

		if ($type === 'usual') {
			imagejpeg($image_p, $destination, $quality);
		} elseif($type === 'webp') {
			imagewebp($image_p, $destination, $quality);
		}

		imagedestroy($image_p);
		/* return [$width_orig, $height_orig]; */
	}