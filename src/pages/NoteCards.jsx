import { fakeData as notes } from "../assets/fakeData.js";
import Card from "../cards/TemplateCard.jsx"
 
const NotesPage = () => {
    return (
        <div>
            {notes.map((note) => (
                <Card key={note.id} widget={note} />
            ))}
        </div>
    );
};

export default NotesPage