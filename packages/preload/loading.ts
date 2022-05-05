/* eslint-disable @typescript-eslint/explicit-function-return-type */

export function useLoading() {
    const styleContent = `
    :root {
        --blue: #007bff;
        --indigo: #6610f2;
        --purple: #6f42c1;
        --pink: #e83e8c;
        --red: #dc3545;
        --orange: #fd7e14;
        --yellow: #ffc107;
        --green: #28a745;
        --teal: #20c997;
        --cyan: #17a2b8;
        --white: #fff;
        --gray: #6c757d;
        --gray-dark: #343a40;
        --primary: #007bff;
        --secondary: #6c757d;
        --success: #28a745;
        --info: #17a2b8;
        --warning: #ffc107;
        --danger: #dc3545;
        --light: #f8f9fa;
        --dark: #343a40;
        --breakpoint-xs: 0;
        --breakpoint-sm: 576px;
        --breakpoint-md: 768px;
        --breakpoint-lg: 992px;
        --breakpoint-xl: 1200px;
        --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas,
          "Liberation Mono", "Courier New", monospace;
      }
      #section-preloader {
        position: fixed;
        width: 100%;
        height: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        background: #ffffff;
        z-index: 99999999;
      }
      
      #section-preloader .boxes {
        --size: 32px;
        --duration: 800ms;
        height: calc(var(--size) * 2);
        width: calc(var(--size) * 3);
        position: relative;
        -webkit-transform-style: preserve-3d;
        transform-style: preserve-3d;
        -webkit-transform-origin: 50% 50%;
        transform-origin: 50% 50%;
        margin-top: calc(var(--size) * 1.5 * -1);
        -webkit-transform: rotateX(60deg) rotateZ(45deg) rotateY(0deg) translateZ(0px);
        transform: rotateX(60deg) rotateZ(45deg) rotateY(0deg) translateZ(0px);
      }
      #section-preloader p {
        margin-left: 25px;
        color: #0a2351;
      }
      p {
        font-family: "Poppins-Regular";
        font-size: 18px;
        font-weight: 300;
        line-height: 26px;
        color: #0a2351;
      }
      #section-preloader .boxes .box:nth-child(1) {
        -webkit-transform: translate(100%, 0);
        transform: translate(100%, 0);
        -webkit-animation: box1 var(--duration) linear infinite;
        animation: box1 var(--duration) linear infinite;
      }
      #section-preloader .boxes .box:nth-child(2) {
        -webkit-transform: translate(0, 100%);
        transform: translate(0, 100%);
        -webkit-animation: box2 var(--duration) linear infinite;
        animation: box2 var(--duration) linear infinite;
      }
      #section-preloader .boxes .box:nth-child(3) {
        -webkit-transform: translate(100%, 100%);
        transform: translate(100%, 100%);
        -webkit-animation: box3 var(--duration) linear infinite;
        animation: box3 var(--duration) linear infinite;
      }
      #section-preloader .boxes .box:nth-child(4) {
        -webkit-transform: translate(200%, 0);
        transform: translate(200%, 0);
        -webkit-animation: box4 var(--duration) linear infinite;
        animation: box4 var(--duration) linear infinite;
      }
      #section-preloader .boxes .box {
        width: var(--size);
        height: var(--size);
        top: 0;
        left: 0;
        position: absolute;
        -webkit-transform-style: preserve-3d;
        transform-style: preserve-3d;
      }
      #section-preloader .boxes .box > div:nth-child(1) {
        --top: 0;
        --left: 0;
      }
      #section-preloader .boxes .box > div:nth-child(2) {
        --background: #0a2351;
        --right: 0;
        --rotateY: 90deg;
      }
      #section-preloader .boxes .box > div:nth-child(3) {
        --background: #2559c9;
        --rotateX: -90deg;
      }
      #section-preloader .boxes .box > div:nth-child(4) {
        --background: #dbe3f4;
        --top: 0;
        --left: 0;
        --translateZ: calc(var(--size) * 3 * -1);
      }
      #section-preloader .boxes .box > div {
        --background: #417bfa;
        --top: auto;
        --right: auto;
        --bottom: auto;
        --left: auto;
        --translateZ: calc(var(--size) / 2);
        --rotateY: 0deg;
        --rotateX: 0deg;
        position: absolute;
        width: 100%;
        height: 100%;
        background: var(--background);
        top: var(--top);
        right: var(--right);
        bottom: var(--bottom);
        left: var(--left);
        -webkit-transform: rotateY(var(--rotateY)) rotateX(var(--rotateX))
          translateZ(var(--translateZ));
        transform: rotateY(var(--rotateY)) rotateX(var(--rotateX))
          translateZ(var(--translateZ));
      }
      @keyframes box1 {
        0%,
        50% {
          -webkit-transform: translate(100%, 0);
          transform: translate(100%, 0);
        }
      
        100% {
          -webkit-transform: translate(200%, 0);
          transform: translate(200%, 0);
        }
      }
      @keyframes box2 {
        0% {
          -webkit-transform: translate(0, 100%);
          transform: translate(0, 100%);
        }
        50% {
          -webkit-transform: translate(0, 0);
          transform: translate(0, 0);
        }
        100% {
          -webkit-transform: translate(100%, 0);
          transform: translate(100%, 0);
        }
      }
      @keyframes box3 {
        0%,
        50% {
          -webkit-transform: translate(100%, 100%);
          transform: translate(100%, 100%);
        }
        100% {
          -webkit-transform: translate(0, 100%);
          transform: translate(0, 100%);
        }
      }
      @keyframes box4 {
        0% {
          -webkit-transform: translate(200%, 0);
          transform: translate(200%, 0);
        }
        50% {
          -webkit-transform: translate(200%, 100%);
          transform: translate(200%, 100%);
        }
        100% {
          -webkit-transform: translate(100%, 100%);
          transform: translate(100%, 100%);
        }
      }
            
    `;
    const oStyle = document.createElement('style');
    const oDiv = document.createElement('div');

    oStyle.id = 'app-loading-style';
    oStyle.innerHTML = styleContent;
    oDiv.id = 'section-preloader';
    const boxes = document.createElement('div');
    boxes.classList.add('boxes');
    boxes.id = 'boxes';
    oDiv.appendChild(boxes);
    const box1 = document.createElement('div');
    box1.classList.add('box');
    box1.appendChild(document.createElement('div'));
    box1.appendChild(document.createElement('div'));
    box1.appendChild(document.createElement('div'));
    box1.appendChild(document.createElement('div'));
    const box2 = document.createElement('div');
    box2.classList.add('box');
    box2.appendChild(document.createElement('div'));
    box2.appendChild(document.createElement('div'));
    box2.appendChild(document.createElement('div'));
    box2.appendChild(document.createElement('div'));
    const box3 = document.createElement('div');
    box3.classList.add('box');
    box3.appendChild(document.createElement('div'));
    box3.appendChild(document.createElement('div'));
    box3.appendChild(document.createElement('div'));
    box3.appendChild(document.createElement('div'));
    const box4 = document.createElement('div');
    box4.classList.add('box');
    box4.appendChild(document.createElement('div'));
    box4.appendChild(document.createElement('div'));
    box4.appendChild(document.createElement('div'));
    box4.appendChild(document.createElement('div'));
    boxes.appendChild(box1);
    boxes.appendChild(box2);
    boxes.appendChild(box3);
    boxes.appendChild(box4);
    const loading = document.createElement('p');
    loading.innerHTML = 'Loading...';
    oDiv.appendChild(loading);

    return {
        appendLoading() {
            document.head.appendChild(oStyle);
            document.body.appendChild(oDiv);
        },
        removeLoading() {
            document.head.removeChild(oStyle);
            document.body.removeChild(oDiv);
        },
    };
}
