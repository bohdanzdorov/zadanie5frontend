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
            <BackButton/>
            <iframe
                src="http://localhost:8000/api/documentation"
                title="API Docs"
                style={{
                    border: 'none',
                    marginTop: '2vh',
                    width: '100%',
                    height: '93vh',
                }}
            />
        </div>
    );
}
