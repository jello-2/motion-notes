export const setNewOffset = (card, mouseMoveDir = { x: 0, y: 0 }) => {
    if (card) {
        const offsetLeft = card.offsetLeft - mouseMoveDir.x;
        const offsetTop = card.offsetTop - mouseMoveDir.y;
    
        return {
            x: offsetLeft < 0 ? 0 : offsetLeft, //change for side margins when impl sidebar
            y: offsetTop < 0 ? 0 : offsetTop,
        };
    }
};

export function autoGrow(textAreaRef) {
    const { current } = textAreaRef;
    current.style.height = "auto"; // Reset the height
    current.style.height = gridsnap(textAreaRef.current.scrollHeight,20) + "px"
}


export function gridsnap(pos,gridsize){
    return Math.round(pos/gridsize) * gridsize
}
export const setZIndex = (selectedCard) => {
    selectedCard.style.zIndex = 49;
 
    Array.from(document.getElementsByClassName("card")).forEach((card) => {
        if (card !== selectedCard) {
            card.style.zIndex = selectedCard.style.zIndex - 1;
        }
    });
};


