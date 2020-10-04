const { text } = require("express");

const socket = io('/');
const vedioGrid = document.getElementById('vedio-grid');
const myVedio = document.createElement('vedio');
myVedio.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: 443    // we need to change the to work on production otherwise if u are on local set it to 3030
});

let myVedioStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVedioStream = stream;
    addVedioStream(myVedio, stream);

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    });

    peer.on('call', function (call) {
        call.answer(stream);
        const vedio = document.createElement('vedio');
        call.on('stream', userVedioStream => {
            addVedioStream(vedio, userVedioStream);
        })
    })

    let text = $('input');


    $('html').keydown((e) => {

        if (e.which === 13 && text.val().length !== 0) {
            socket.emit('message', text.val());
            text.val('');
        }

    })

    socket.on('createMessage', (message) => {
        $('ul').append(`<li class="message"><b>user</b></br>${message}</li>`);
        scrollToBottom();
    })
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

const scrollToBottom = ()=> {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop('scrollHeight'));
}



const connectToNewUser = (userId, stream) => {
    //console.log("New User Connected", userId);
    const call = peer.call(userId, stream);
    const vedio = document.createElement('vedio');
    call.on('stream', userVedioStream => {
        addVedioStream(vedio, userVedioStream);
    })
}


const addVedioStream = (vedio, stream) => {
    vedio.srcObject = stream;
    vedio.addEventListener('loadedmetadata', () => {
        vedio.play();
    })
    vedioGrid.append(vedio);
}

//mute our audio
const muteUnmute = () => {
    const enabled = myVedioStream.getAudioTrack()[0].enabled;
    if(enabled){
        myVedioStream.getAudioTrack()[0].enabled = false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myVedioStream.getAudioTrack()[0].enabled = true;
    }
}


const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>`
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>`
    document.querySelector('.main__mute_button').innerHTML = html;
}


const playStop = () => {
    const enabled = myVedioStream.getVedioTrack()[0].enabled;
    if(enabled){
        myVedioStream.getVedioTrack()[0].enabled = false;
        setPlayButton();
    }
    else{
        setStopButton();
        myVedioStream.getVedioTrack()[0].enabled = true;
    }
}

const setStopButton = () => {
    const html = `
    <i class="fas fa-vedio"></i>
    <span>Stop Vedio</span>`
    document.querySelector('.main__vedio_button').innerHTML = html;
}

const setPlayButton = () => {
    const html = `
    <i class="stop fas fa-vedio-slash"></i>
    <span>Play Vedio</span>`
    document.querySelector('.main__vedio_button').innerHTML = html;
}


