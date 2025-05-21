import BackButton from "../Components/BackButton.jsx";

export default function SwaggerPage() {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0,
            overflow: 'hidden'
        }}>
            <BackButton />
            <iframe
                src="http://localhost:8000/api/documentation"
                title="API Docs"
                width="100%"
                height="100%"
                style={{
                    border: 'none',
                    margin: "5% 0 0 0",
                    padding: 0,
                }}
            />
        </div>
    );
}
