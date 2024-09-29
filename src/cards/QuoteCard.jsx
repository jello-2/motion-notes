import { useEffect, useState } from "react";

const QuoteCard = () => {
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");

    // Fetch quote function
    const fetchQuote = async () => {
        try {
            const response = await fetch("https://api.quotable.io/random");
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const data = await response.json();
            setQuote(data.content); // Quote text
            setAuthor(data.author); // Author name

            console.log(data);
            console.log("Fetched quote!");
        } catch (error) {
            console.error("Error fetching quote:", error);
        }
    };

    // Initial fetch when component mounts
    useEffect(() => {
        fetchQuote();
    }, []);

    return (
        <div className="card-body">
            <blockquote>
                &ldquo;{quote}&rdquo;
            </blockquote>
            <footer style={{ fontStyle: 'italic' }}>
                - {author}
                {/* Add button to refetch quote */}
                <button 
                onClick={fetchQuote}
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '14px'
                }}
            >
                    +
                </button>
            </footer>
        </div>
    );
};

export default QuoteCard;