const NoteCard = ({ note }) => {
    let position = JSON.parse(note.position);
    const colors = JSON.parse(note.colors);
    const body = JSON.parse(note.body);
    useEffect(() => {
        autoGrow(textAreaRef);
    }, []);
     
    function autoGrow(textAreaRef) {
        const { current } = textAreaRef;
        current.style.height = "auto"; // Reset the height
        current.style.height = current.scrollHeight + "px"; // Set the new height
    }
    return (
        <div
            className="card"
            style={{
                backgroundColor: colors.colorBody,
            }}
        >
             <div className="card-body">
        <textarea
            style={{ color: colors.colorText }}
            defaultValue={body}
            onInput={() => {
                autoGrow(textAreaRef);
           }}
           
        ></textarea>
        </div>
        </div>
    );
};