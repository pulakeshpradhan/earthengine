document$.subscribe(({ body }) => {
    mermaid.initialize({
        startOnLoad: false,
        theme: document.body.getAttribute('data-md-color-scheme') === 'slate' ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit'
    });

    mermaid.run({
        nodes: body.querySelectorAll('.mermaid')
    });
});
