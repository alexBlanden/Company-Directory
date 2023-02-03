export function createAlert (elementID, message, type) {
    const alertPlaceholder = document.getElementById(elementID);
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissable d-flex justify-content-between align-items-baseline" role="alert">`,
        `<span class="fs-6">${message}</span>`,
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

        alertPlaceholder.append(wrapper)
}