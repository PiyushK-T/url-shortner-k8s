document.addEventListener('DOMContentLoaded', ()=>{
    const links = document.querySelectorAll('.menu-link[data-view]');
    const views = document.querySelectorAll('.dashboard-view');
    
    links.forEach(link =>{
        link.addEventListener('click', (e)=> {
            e.preventDefault();
            const view = link.getAttribute('data-view');

            links.forEach(l => l.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(`view-${view}`).classList.add('active');
        });
    });
});