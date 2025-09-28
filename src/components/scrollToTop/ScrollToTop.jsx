import React, { useEffect, useState } from "react";
import "./scroll-to-top.css";

const ScrollToTop = () => {
    const [scrollValue, setScrollValue] = useState(0);

    const calcScrollValue = () => {
        const scrollProgress = document.querySelector(".progress");
        const pos = document.documentElement.scrollTop;
        const calcHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
        const scrollValue = Math.round((pos * 100) / calcHeight);

        setScrollValue(scrollValue);

        if (pos > 200) {
            scrollProgress.classList.add("active");
        } else {
            scrollProgress.classList.remove("active");
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", calcScrollValue);
        window.addEventListener("load", calcScrollValue);

        return () => {
            window.removeEventListener("scroll", calcScrollValue);
            window.removeEventListener("load", calcScrollValue);
        };
    }, []);

    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div
            className="progress"
            onClick={handleClick}
            style={{
                background: `conic-gradient(rgb(184, 217, 124)
 ${scrollValue}%, white  ${scrollValue}%)`,
            }}
        >
            <i className="uil uil-angle-double-up progress-value"></i>
        </div>
    );
};

export default ScrollToTop;