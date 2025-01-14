function debounce(fn, t){
    let timer = null;
    return function(...args){
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...args);
        }, t);
    }
}

function throttle(fn,t){
    let startTime = 0;
    let timer = null;
    return function(...aargs){
        if(!startTime){
            fn(...args);
            startTime = Date.now();
        }else {
            if(Date.now() < startTime + t){
                clearTimeout(timer);
                timer = setTimeout(()=>{
                    fn(...args);
                }, startTime+t - Date.now());
            }else{
                fn(...args);
                startTime = Date.now();
            }
        }
    }
}