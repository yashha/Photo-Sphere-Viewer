var PSV = null;
var imageData = null;
var panoData = {
  fullWidth    : 0,
  fullHeight   : 0,
  croppedWidth : 0,
  croppedHeight: 0,
  croppedX     : 0,
  croppedY     : 0
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

  if (this.id === 'fullWidth') {
    panoData['fullHeight'] = Math.round(this.value / 2);
  }
  if (this.id === 'fullHeight') {
    panoData['fullWidth'] = this.value * 2;
  }

  updateOutput();
  loadPsv();
});

$('#playground-form').on('click', '[data-psv-center]', function() {
  switch ($(this).data('psvCenter')) {
    case 'x':
      panoData['croppedX'] = Math.round((panoData['fullWidth'] - panoData['croppedWidth']) / 2);
      break;
    case 'y':
      panoData['croppedY'] = Math.round((panoData['fullHeight'] - panoData['croppedHeight']) / 2);
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
  var fullWidth = Math.max(width, height * 2);
  var fullHeight = Math.round(fullWidth / 2);
  var croppedX = Math.round((fullWidth - width) / 2);
  var croppedY = Math.round((fullHeight - height) / 2);

  panoData = {
    fullWidth    : fullWidth,
    fullHeight   : fullHeight,
    croppedWidth : width,
    croppedHeight: height,
    croppedX     : croppedX,
    croppedY     : croppedY
  };
}

function loadPsv() {
  if (PSV) {
    PSV.destroy();
  }

  PSV = new PhotoSphereViewer({
    panorama         : imageData,
    container        : 'photosphere',
    loadingImg       : rootURL + '/assets/photosphere-logo.gif',
    autorotateStartup: false,
    panoData         : panoData,
    navbar           : ['zoom', 'fullscreen'],
    defaultFov       : 70,
    size             : {
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
    '      <GPano:CroppedAreaLeftPixels>' + panoData.croppedX + '</GPano:CroppedAreaLeftPixels>\n' +
    '      <GPano:CroppedAreaTopPixels>' + panoData.croppedY + '</GPano:CroppedAreaTopPixels>\n' +
    '      <GPano:CroppedAreaImageWidthPixels>' + panoData.croppedWidth + '</GPano:CroppedAreaImageWidthPixels>\n' +
    '      <GPano:CroppedAreaImageHeightPixels>' + panoData.croppedHeight + '</GPano:CroppedAreaImageHeightPixels>\n' +
    '      <GPano:FullPanoWidthPixels>' + panoData.fullWidth + '</GPano:FullPanoWidthPixels>\n' +
    '      <GPano:FullPanoHeightPixels>' + panoData.fullHeight + '</GPano:FullPanoHeightPixels>\n' +
    '    </rdf:Description>\n' +
    '  </rdf:RDF>\n' +
    '</x:xmpmeta>\n' +
    '<?xpacket end="r"?>'
  );
}
