const 
    userMode = sessionStorage.getItem('userMode'),
    htmlTag = document.getElementsByTagName('html')[0]
if (!!userMode && ['light','dark'].includes(userMode)) {
    htmlTag.style.backgroundColor = userMode === 'dark' ? 'black' : 'white'
} else {
    const systemDark = sessionStorage.getItem('systemDark')
    if (!!systemDark) htmlTag.style.backgroundColor = systemDark==='true' ? 'black' : 'white'
    else htmlTag.style.backgroundColor = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'black' : 'white'
}

htmlTag.style.setProperty('--viewport-height','visualViewport' in window ? `${window.visualViewport.height}px` : '100vh')