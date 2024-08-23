// src/components/AnimatedPage.jsx
import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useLocation } from "react-router-dom";

const pageVariants = {
    initial: { opacity: 0, x: -100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 100 },
};

const pageTransition = {
    duration: 0.5,
    type: "tween",
};

const PageLoadAnimation = ({ children }) => {
    const location = useLocation();
    const controls = useAnimation();

    React.useEffect(() => {
        controls.start("in");
    }, [location.pathname]);

    return (
        <motion.div
            key={location.key}
            initial="initial"
            animate={controls}
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            {children}
        </motion.div>
    );
};

export default PageLoadAnimation;
