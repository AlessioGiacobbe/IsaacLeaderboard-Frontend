
export const container = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 1,
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};


export const containerform = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.2,
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

export const item = {
    initial:{ y: 10, opacity: 0 },
    hidden: { y: 10, opacity: 0 },
    exit:   { y: 10, opacity: 0 },
    animate: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring' }},
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring' }
    }
};