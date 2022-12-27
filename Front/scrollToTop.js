const toTopButton = document.getElementById('btn-back-to-top');
$(toTopButton).on('click', ()=>backToTop());

export function scrollFunction() {
    if (
        document.body.scrollTop > 20 || document.documentElement.scrollTop > 20
    ) {
        toTopButton.style.display = "block";
    } else {
        toTopButton.style.display = "none"
    }
}

export function backToTop () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}