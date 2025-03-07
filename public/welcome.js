document.getElementById('box1').addEventListener('mouseover', () => {
    document.querySelectorAll('.text').forEach(e => {
        e.classList.add('active');
    });
    document.querySelectorAll('.restroom').forEach(e => {
        e.classList.add('active');
    });
});

document.getElementById('box1').addEventListener('mouseout', () => {
    document.querySelectorAll('.text').forEach(e => {
        e.classList.remove('active');
    });
    document.querySelectorAll('.restroom').forEach(e => {
        e.classList.remove('active');
    });
});


document.getElementById('box2').addEventListener('mouseover', () => {
    document.querySelectorAll('.text1').forEach(e => {
        e.classList.add('active');
    });
    document.querySelectorAll('.hygiene').forEach(e => {
        e.classList.add('active');
    });
});

document.getElementById('box2').addEventListener('mouseout', () => {
    document.querySelectorAll('.text1').forEach(e => {
        e.classList.remove('active');
    });
    document.querySelectorAll('.hygiene').forEach(e => {
        e.classList.remove('active');
    });
});

document.getElementById('box3').addEventListener('mouseover', () => {
    document.querySelectorAll('.text2').forEach(e => {
        e.classList.add('active');
    });
    document.querySelectorAll('.review').forEach(e => {
        e.classList.add('active');
    });
});

document.getElementById('box3').addEventListener('mouseout', () => {
    document.querySelectorAll('.text2').forEach(e => {
        e.classList.remove('active');
    });
    document.querySelectorAll('.review').forEach(e => {
        e.classList.remove('active');
    });
});