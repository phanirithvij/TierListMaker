function stringToHash(string) {
    let hash = 0;

    if (string.length === 0) {
        return hash;
    }

    for (let i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return hash;
}

function getElemProperty(el, prop) {
    return window.getComputedStyle(el).getPropertyValue(prop);
}

function elementWidth(el) {
    return parseInt(getElemProperty(el, 'width').replace('px', ''));
}

function elementHeight(el) {
    return parseInt(getElemProperty(el, 'height').replace('px', ''));
}

function toArray(array_like) {
    return Array.prototype.slice.call(array_like);
}

function loadImageAndAddToDOM(file, stretch, cb) {
    let isVideo = file.type.startsWith('video/');
    let isAudio = file.type.startsWith('audio/');
    let isImage = file.type.startsWith('image/');
    let media = document.createElement(isVideo ? 'video' : (isAudio ? 'audio':'img'));
    if (isVideo) {
        media.loop = true;
        media.autoplay = true;
        media.muted = true;
    } else if (isAudio) {
        media.controls = true;
    }
    // https://stackoverflow.com/a/4459419
    media.src = URL.createObjectURL(file);
    media.height = 128;
    if (stretch)
        media.width = 128;
    let mediaId = stringToHash(media.src);
    if (isImage) {
        media.draggable = false;
        let div = document.createElement('div');
        div.appendChild(media);
        div.style.display = 'inline-flex';
        media = div;
    }
    media.style.verticalAlign = 'middle';
    media.setAttribute('id', mediaId);
    media.setAttribute('draggable', 'true');

    media.addEventListener('click', (ev) => {
        ev.target.parentElement.removeChild(ev.target);
    });
    media.addEventListener('dragstart', (ev) => {
        ev.dataTransfer.setData('text/plain', ev.target.id);
    });

    cb(media);
}

function preventDefault(ev) {
    ev.preventDefault();
    ev.stopPropagation();
}