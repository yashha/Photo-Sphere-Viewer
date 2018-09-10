var PSV = null;
var imageData = null;
var panoData = {
  full_width: 0,
  full_height: 0,
  cropped_width: 0,
  cropped_height: 0,
  cropped_x: 0,
  cropped_y: 0
};

$(document).on('change', ':file', function() {
  var label = $(this).val().replace(/\\/g, '/').replace(/.*\//, '');
  $(this).parents('.input-group').find(':text').val(label);
});

$('#file').on('change', function() {
  var file = this.files[0];
  if (file) {
    loadPanorama(file);
  }
});

$('#playground-form').on('change', '[type=number]', function() {
  panoData[this.id] = this.value;

  if (this.id === 'full_width') {
    panoData['full_height'] = Math.round(this.value / 2);
  }
  if (this.id === 'full_height') {
    panoData['full_width'] = this.value * 2;
  }

  updateOutput();
  loadPsv();
});

$('#playground-form').on('click', '[data-psv-center]', function() {
  switch ($(this).data('psvCenter')) {
    case 'x':
      panoData['cropped_x'] = Math.round((panoData['full_width'] - panoData['cropped_width']) / 2);
      break;
    case 'y':
      panoData['cropped_y'] = Math.round((panoData['full_height'] - panoData['cropped_height']) / 2);
      break;
  }

  updateOutput();
  loadPsv();
});

function loadPanorama(file) {
  var reader = new FileReader();

  reader.onload = function(event) {
    imageData = event.target.result;

    var image = new Image();

    image.onload = function() {
      computePanoData(image.width, image.height);
      updateOutput();
      loadPsv();
    };

    image.src = imageData;
  };

  reader.readAsDataURL(file);
}

function computePanoData(width, height) {
  var full_width = Math.max(width, height * 2);
  var full_height = Math.round(full_width / 2);
  var cropped_x = Math.round((full_width - width) / 2);
  var cropped_y = Math.round((full_height - height) / 2);

  panoData = {
    full_width: full_width,
    full_height: full_height,
    cropped_width: width,
    cropped_height: height,
    cropped_x: cropped_x,
    cropped_y: cropped_y
  };
}

function loadPsv() {
  if (PSV) {
    PSV.destroy();
  }

  PSV = new PhotoSphereViewer({
    panorama: imageData,
    container: 'photosphere',
    loading_img: rootURL + '/assets/photosphere-logo.gif',
    time_anim: false,
    pano_data: panoData,
    navbar: ['zoom', 'fullscreen'],
    default_fov: 70,
    size: {
      height: 500
    }
  });
}

function updateOutput() {
  Object.keys(panoData).forEach(function(prop) {
    $('#' + prop).val(panoData[prop]);
  });

  $('#output').text(
    '<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>\n' +
    '<x:xmpmeta xmlns:x="adobe:ns:meta/">\n' +
    '  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n' +
    '    <rdf:Description rdf:about="" xmlns:GPano="http://ns.google.com/photos/1.0/panorama/">\n' +
    '      <GPano:ProjectionType>equirectangular</GPano:ProjectionType>\n' +
    '      <GPano:CroppedAreaLeftPixels>' + panoData.cropped_x + '</GPano:CroppedAreaLeftPixels>\n' +
    '      <GPano:CroppedAreaTopPixels>' + panoData.cropped_y + '</GPano:CroppedAreaTopPixels>\n' +
    '      <GPano:CroppedAreaImageWidthPixels>' + panoData.cropped_width + '</GPano:CroppedAreaImageWidthPixels>\n' +
    '      <GPano:CroppedAreaImageHeightPixels>' + panoData.cropped_height + '</GPano:CroppedAreaImageHeightPixels>\n' +
    '      <GPano:FullPanoWidthPixels>' + panoData.full_width + '</GPano:FullPanoWidthPixels>\n' +
    '      <GPano:FullPanoHeightPixels>' + panoData.full_height + '</GPano:FullPanoHeightPixels>\n' +
    '    </rdf:Description>\n' +
    '  </rdf:RDF>\n' +
    '</x:xmpmeta>\n' +
    '<?xpacket end="r"?>'
  );
}
